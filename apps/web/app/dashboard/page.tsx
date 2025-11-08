"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useCredits } from "@/lib/hooks/use-credits";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, CreditCard, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { credits, tier } = useCredits();
  const [stats, setStats] = useState({
    certificates: 0,
    aiGenerations: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      const [certificatesResult, aiGenResult] = await Promise.all([
        supabase
          .from("certificates")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("ai_generations")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      setStats({
        certificates: certificatesResult.count || 0,
        aiGenerations: aiGenResult.count || 0,
      });
      setLoading(false);
    };

    loadStats();
  }, [user, supabase]);

  const statCards = [
    {
      title: "Certificados",
      value: loading ? "..." : stats.certificates.toString(),
      description: "Certificados criados",
      icon: FileText,
      href: "/dashboard/certificates",
    },
    {
      title: "IA Gerações",
      value: loading ? "..." : stats.aiGenerations.toString(),
      description: "Conteúdos gerados",
      icon: Sparkles,
      href: "/dashboard/ai",
    },
    {
      title: "Créditos",
      value: loading ? "..." : credits.toString(),
      description: "Créditos disponíveis",
      icon: CreditCard,
      href: "/dashboard/credits",
    },
    {
      title: "Tier",
      value: loading ? "..." : tier.charAt(0).toUpperCase() + tier.slice(1),
      description: "Seu nível atual",
      icon: TrendingUp,
      href: "/dashboard/credits",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Bem-vindo de volta, {user?.user_metadata?.full_name || "Aventureiro"}! 🎲
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Aqui está um resumo da sua jornada no CertifyRPG
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {stat.description}
                </p>
                <Link href={stat.href} className="mt-3 block">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Ver detalhes →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>🎨 Criar Certificado</CardTitle>
            <CardDescription>
              Gere certificados personalizados para suas campanhas de RPG
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/certificates/new">
                <FileText className="mr-2 h-4 w-4" />
                Novo Certificado
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✨ Gerador de IA</CardTitle>
            <CardDescription>
              Use IA para criar NPCs, itens e histórias incríveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Explorar IA
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Suas últimas ações no CertifyRPG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-neutral-500">
            <p>Nenhuma atividade ainda</p>
            <p className="text-sm mt-2">
              Comece criando seu primeiro certificado ou gerando conteúdo com IA
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
