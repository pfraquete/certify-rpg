"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const campaignSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  system: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "paused"]).default("active"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export default function NewCampaignPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      system: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: CampaignFormData) => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("campaigns").insert({
        user_id: user.id,
        name: data.name,
        system: data.system || null,
        description: data.description || null,
        status: data.status,
      });

      if (error) throw error;

      toast.success("Campanha criada com sucesso!");
      router.push("/dashboard/campaigns");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar campanha", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
        <h1 className="text-3xl font-bold">Nova Campanha</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Crie uma campanha para organizar seus certificados e conteúdo
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Campanha</CardTitle>
          <CardDescription>
            Preencha os dados da sua campanha de RPG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit}>
            <FormField>
              <Label htmlFor="name" required>
                Nome da Campanha
              </Label>
              <Input
                id="name"
                placeholder="A Maldição de Strahd"
                error={form.formState.errors.name?.message}
                {...form.register("name")}
              />
            </FormField>

            <FormField>
              <Label htmlFor="system">Sistema de RPG</Label>
              <Input
                id="system"
                placeholder="D&D 5e, Pathfinder, Tormenta..."
                error={form.formState.errors.system?.message}
                {...form.register("system")}
              />
            </FormField>

            <FormField>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva sua campanha, o enredo, os jogadores..."
                {...form.register("description")}
              />
            </FormField>

            <FormField>
              <Label htmlFor="status" required>
                Status
              </Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("status")}
              >
                <option value="active">Ativa</option>
                <option value="paused">Pausada</option>
                <option value="completed">Concluída</option>
              </select>
            </FormField>

            <div className="flex gap-4 pt-4">
              <Button type="submit" loading={loading} className="flex-1">
                Criar Campanha
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
