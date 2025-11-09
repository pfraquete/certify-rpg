import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToStream } from "@react-pdf/renderer";
import { CertificateTemplate } from "@/lib/pdf/certificate-template";
import { FantasyTemplate } from "@/lib/pdf/templates/fantasy-template";
import { ModernTemplate } from "@/lib/pdf/templates/modern-template";
import { use } from "react";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch certificate with campaign info
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select(
        `
        *,
        campaigns (
          name
        )
      `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Fetch user profile for issuer name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    // Prepare template data
    const templateData = {
      recipientName: certificate.player_name,
      title: certificate.achievement,
      description: certificate.description || certificate.title,
      campaign: certificate.campaigns?.name,
      issuedDate: new Date(certificate.created_at).toLocaleDateString("pt-BR"),
      issuerName: profile?.full_name || "Mestre de Jogo",
    };

    // Select template based on certificate template field
    let pdfDocument;
    switch (certificate.template) {
      case "fantasy":
        pdfDocument = FantasyTemplate(templateData);
        break;
      case "modern":
        pdfDocument = ModernTemplate(templateData);
        break;
      case "classic":
      default:
        pdfDocument = CertificateTemplate(templateData);
        break;
    }

    // Render to stream
    const stream = await renderToStream(pdfDocument);

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    // Return PDF as download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificado-${certificate.player_name.replace(/\s+/g, "-").toLowerCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
