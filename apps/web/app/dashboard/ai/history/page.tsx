"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { AIGeneration } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Trash2, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AIHistoryPage() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<AIGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<AIGeneration | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const loadGenerations = async () => {
      const { data, error } = await supabase
        .from("ai_generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar histórico");
        console.error(error);
      } else {
        setGenerations(data || []);
      }
      setLoading(false);
    };

    loadGenerations();
  }, [user, supabase]);

  const handleToggleFavorite = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("ai_generations")
      .update({ is_favorite: !currentValue })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar favorito");
    } else {
      setGenerations(
        generations.map((g) =>
          g.id === id ? { ...g, is_favorite: !currentValue } : g
        )
      );
      toast.success(
        !currentValue ? "Adicionado aos favoritos" : "Removido dos favoritos"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta geração?")) return;

    const { error } = await supabase.from("ai_generations").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir geração");
    } else {
      toast.success("Geração excluída com sucesso");
      setGenerations(generations.filter((g) => g.id !== id));
      if (selectedGeneration?.id === id) {
        setSelectedGeneration(null);
      }
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      npc: "NPC",
      item: "Item Mágico",
      location: "Localização",
      story: "História",
      quest: "Quest",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      npc: "bg-blue-500",
      item: "bg-purple-500",
      location: "bg-green-500",
      story: "bg-yellow-500",
      quest: "bg-red-500",
    };
    return colors[type] || "bg-neutral-500";
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
      <div>
        <Link
          href="/dashboard/ai"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para IA
        </Link>
        <h1 className="text-3xl font-bold">Histórico de Gerações</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Todo o conteúdo gerado com IA
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {["npc", "item", "location", "story", "quest"].map((type) => (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {getTypeLabel(type)}
              </CardTitle>
              <div className={`h-3 w-3 rounded-full ${getTypeColor(type)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {generations.filter((g) => g.type === type).length}
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {generations.filter((g) => g.is_favorite).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generations List */}
      {generations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma geração ainda
            </h3>
            <p className="text-neutral-500 text-center mb-6">
              Use o gerador de IA para criar conteúdo
            </p>
            <Button asChild>
              <Link href="/dashboard/ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Conteúdo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* List */}
          <Card className="lg:col-span-1 max-h-[800px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Todas as Gerações</CardTitle>
              <CardDescription>
                {generations.length} itens gerados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generations.map((generation) => (
                  <div
                    key={generation.id}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedGeneration?.id === generation.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                    onClick={() => setSelectedGeneration(generation)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`h-2 w-2 rounded-full ${getTypeColor(
                            generation.type
                          )}`}
                        />
                        <p className="font-medium">
                          {getTypeLabel(generation.type)}
                        </p>
                        {generation.is_favorite && (
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(generation.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {generation.cost_credits} créditos • {generation.model}
                      </p>
                    </div>
                    <Eye className="h-4 w-4 text-neutral-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detail */}
          <Card className="lg:col-span-1 max-h-[800px] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {selectedGeneration
                  ? getTypeLabel(selectedGeneration.type)
                  : "Selecione uma geração"}
              </CardTitle>
              {selectedGeneration && (
                <CardDescription>
                  Criado{" "}
                  {formatDistanceToNow(
                    new Date(selectedGeneration.created_at),
                    {
                      addSuffix: true,
                      locale: ptBR,
                    }
                  )}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedGeneration ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleFavorite(
                          selectedGeneration.id,
                          selectedGeneration.is_favorite
                        )
                      }
                    >
                      <Star
                        className={`h-4 w-4 mr-1 ${
                          selectedGeneration.is_favorite
                            ? "fill-yellow-500 text-yellow-500"
                            : ""
                        }`}
                      />
                      {selectedGeneration.is_favorite
                        ? "Favorito"
                        : "Favoritar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(selectedGeneration.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Conteúdo:</h4>
                    <pre className="whitespace-pre-wrap bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg overflow-auto text-xs">
                      {JSON.stringify(selectedGeneration.content, null, 2)}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-neutral-500">
                        Créditos Usados
                      </p>
                      <p className="text-lg font-bold">
                        {selectedGeneration.cost_credits}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-500">
                        Tokens
                      </p>
                      <p className="text-lg font-bold">
                        {selectedGeneration.tokens_used || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-700" />
                  <p>Selecione uma geração para ver os detalhes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
