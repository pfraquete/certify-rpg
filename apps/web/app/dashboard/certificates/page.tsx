"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { Certificate } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const loadCertificates = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar certificados");
        console.error(error);
      } else {
        setCertificates(data || []);
      }
      setLoading(false);
    };

    loadCertificates();
  }, [user, supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este certificado?")) return;

    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir certificado");
    } else {
      toast.success("Certificado excluído com sucesso");
      setCertificates(certificates.filter((c) => c.id !== id));
    }
  };

  const handleDownloadPDF = async (id: string, playerName: string) => {
    try {
      toast.loading("Gerando PDF...");

      const response = await fetch(`/api/certificates/${id}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-${playerName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.dismiss();
      toast.error("Erro ao baixar PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificados</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Gerencie seus certificados de campanhas de RPG
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/certificates/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Certificado
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Certificados
            </CardTitle>
            <FileText className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificados Públicos
            </CardTitle>
            <Share2 className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter((c) => c.is_public).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificados Privados
            </CardTitle>
            <FileText className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter((c) => !c.is_public).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum certificado ainda
            </h3>
            <p className="text-neutral-500 text-center mb-6">
              Crie seu primeiro certificado para suas campanhas de RPG
            </p>
            <Button asChild>
              <Link href="/dashboard/certificates/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Certificado
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{certificate.title}</CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">
                      {certificate.player_name}
                    </CardDescription>
                  </div>
                  {certificate.is_public && (
                    <Share2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {certificate.achievement}
                  </p>
                  {certificate.character_name && (
                    <p className="text-sm">
                      <span className="font-semibold">Personagem:</span>{" "}
                      {certificate.character_name}
                    </p>
                  )}
                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleDownloadPDF(certificate.id, certificate.player_name)
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(certificate.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
