"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { Campaign, Certificate, AIGeneration } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [aiGenerations, setAiGenerations] = useState<AIGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const [campaignResult, certsResult, aiResult] = await Promise.all([
        supabase
          .from("campaigns")
          .select("*")
          .eq("id", resolvedParams.id)
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("certificates")
          .select("*")
          .eq("campaign_id", resolvedParams.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("ai_generations")
          .select("*")
          .eq("campaign_id", resolvedParams.id)
          .order("created_at", { ascending: false }),
      ]);

      if (campaignResult.error) {
        toast.error("Campanha não encontrada");
        router.push("/dashboard/campaigns");
        return;
      }

      setCampaign(campaignResult.data);
      setCertificates(certsResult.data || []);
      setAiGenerations(aiResult.data || []);
      setLoading(false);
    };

    loadData();
  }, [user, resolvedParams.id, supabase, router]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) {
      toast.error("Erro ao excluir campanha");
    } else {
      toast.success("Campanha excluída com sucesso");
      router.push("/dashboard/campaigns");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            {campaign.system && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-1">
                {campaign.system}
              </p>
            )}
            {campaign.description && (
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                {campaign.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificados
            </CardTitle>
            <FileText className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-neutral-500 mt-1">
              nesta campanha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gerações de IA
            </CardTitle>
            <Sparkles className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiGenerations.length}</div>
            <p className="text-xs text-neutral-500 mt-1">
              conteúdos gerados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Certificados</CardTitle>
          <CardDescription>
            Certificados associados a esta campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Nenhum certificado nesta campanha
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.slice(0, 5).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div>
                    <p className="font-medium">{cert.title}</p>
                    <p className="text-sm text-neutral-500">
                      {cert.player_name}
                    </p>
                  </div>
                  <FileText className="h-4 w-4 text-neutral-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Generations */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Gerado por IA</CardTitle>
          <CardDescription>
            NPCs, itens e histórias desta campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {aiGenerations.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Nenhum conteúdo gerado ainda
            </div>
          ) : (
            <div className="space-y-3">
              {aiGenerations.slice(0, 5).map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div>
                    <p className="font-medium capitalize">{gen.type}</p>
                    <p className="text-sm text-neutral-500">
                      {gen.cost_credits} créditos
                    </p>
                  </div>
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
