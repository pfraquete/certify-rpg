"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { Campaign } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users, CheckCircle, Pause, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const loadCampaigns = async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar campanhas");
        console.error(error);
      } else {
        setCampaigns(data || []);
      }
      setLoading(false);
    };

    loadCampaigns();
  }, [user, supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;

    const { error } = await supabase.from("campaigns").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir campanha");
    } else {
      toast.success("Campanha excluída com sucesso");
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "Ativa",
      completed: "Concluída",
      paused: "Pausada",
    };
    return labels[status] || status;
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
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Organize seus projetos e aventuras de RPG
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Campanhas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma campanha ainda
            </h3>
            <p className="text-neutral-500 text-center mb-6">
              Crie sua primeira campanha para organizar seus certificados e conteúdo
            </p>
            <Button asChild>
              <Link href="/dashboard/campaigns/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Campanha
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">
                      {campaign.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">
                      {campaign.system || "Sistema não definido"}
                    </CardDescription>
                  </div>
                  {getStatusIcon(campaign.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaign.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Status:</span>
                    <span>{getStatusLabel(campaign.status)}</span>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(campaign.id)}
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
