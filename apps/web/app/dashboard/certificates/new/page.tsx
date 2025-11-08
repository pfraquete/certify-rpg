"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { useCredits } from "@/lib/hooks/use-credits";
import { CREDIT_COSTS } from "@/lib/credits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Coins } from "lucide-react";
import Link from "next/link";

const certificateSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
  playerName: z.string().min(2, "O nome do jogador deve ter no mínimo 2 caracteres"),
  characterName: z.string().optional(),
  achievement: z.string().min(10, "A conquista deve ter no mínimo 10 caracteres"),
  description: z.string().optional(),
  template: z.string().default("classic"),
  isPublic: z.boolean().default(false),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export default function NewCertificatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { credits, refresh: refreshCredits } = useCredits();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      playerName: "",
      characterName: "",
      achievement: "",
      description: "",
      template: "classic",
      isPublic: false,
    },
  });

  const onSubmit = async (data: CertificateFormData) => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    // Check credits
    if (credits < CREDIT_COSTS.CERTIFICATE) {
      toast.error("Créditos insuficientes", {
        description: `Você precisa de ${CREDIT_COSTS.CERTIFICATE} créditos para criar um certificado`,
      });
      return;
    }

    setLoading(true);

    try {
      // Create certificate
      const { data: certificate, error: certError } = await supabase
        .from("certificates")
        .insert({
          user_id: user.id,
          title: data.title,
          player_name: data.playerName,
          character_name: data.characterName || null,
          achievement: data.achievement,
          description: data.description || null,
          template: data.template,
          is_public: data.isPublic,
        })
        .select()
        .single();

      if (certError) throw certError;

      // Deduct credits
      const { error: creditError } = await supabase.rpc("update_user_credits", {
        p_user_id: user.id,
        p_amount: -CREDIT_COSTS.CERTIFICATE,
        p_type: "certificate",
        p_description: `Criação de certificado: ${data.title}`,
        p_reference_id: certificate.id,
      });

      if (creditError) throw creditError;

      await refreshCredits();

      toast.success("Certificado criado com sucesso!", {
        description: `${CREDIT_COSTS.CERTIFICATE} créditos foram debitados`,
      });

      router.push("/dashboard/certificates");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar certificado", {
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
          href="/dashboard/certificates"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
        <h1 className="text-3xl font-bold">Novo Certificado</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Crie um certificado personalizado para sua campanha de RPG
        </p>
      </div>

      {/* Cost Warning */}
      <Card className="border-yellow-500 dark:border-yellow-700">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="font-semibold">
                Custo: {CREDIT_COSTS.CERTIFICATE} créditos
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Saldo atual: {credits} créditos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Certificado</CardTitle>
          <CardDescription>
            Preencha os dados para gerar seu certificado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit}>
            <FormField>
              <Label htmlFor="title" required>
                Título do Certificado
              </Label>
              <Input
                id="title"
                placeholder="Conclusão da Campanha Maldição de Strahd"
                error={form.formState.errors.title?.message}
                {...form.register("title")}
              />
            </FormField>

            <FormField>
              <Label htmlFor="playerName" required>
                Nome do Jogador
              </Label>
              <Input
                id="playerName"
                placeholder="João Silva"
                error={form.formState.errors.playerName?.message}
                {...form.register("playerName")}
              />
            </FormField>

            <FormField>
              <Label htmlFor="characterName">Nome do Personagem</Label>
              <Input
                id="characterName"
                placeholder="Aragorn, o Ranger"
                error={form.formState.errors.characterName?.message}
                {...form.register("characterName")}
              />
            </FormField>

            <FormField>
              <Label htmlFor="achievement" required>
                Conquista / Realização
              </Label>
              <textarea
                id="achievement"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Completou com sucesso a campanha Maldição de Strahd, derrotando o vampiro e libertando Barovia..."
                {...form.register("achievement")}
              />
              {form.formState.errors.achievement && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {form.formState.errors.achievement.message}
                </p>
              )}
            </FormField>

            <FormField>
              <Label htmlFor="description">Descrição Adicional</Label>
              <textarea
                id="description"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Observações ou detalhes adicionais..."
                {...form.register("description")}
              />
            </FormField>

            <FormField>
              <div className="flex items-center gap-2">
                <input
                  id="isPublic"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  {...form.register("isPublic")}
                />
                <Label htmlFor="isPublic" className="font-normal cursor-pointer">
                  Tornar certificado público
                </Label>
              </div>
            </FormField>

            <div className="flex gap-4 pt-4">
              <Button type="submit" loading={loading} className="flex-1">
                Criar Certificado ({CREDIT_COSTS.CERTIFICATE} créditos)
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
