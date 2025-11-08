"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { useCredits } from "@/lib/hooks/use-credits";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { User, CreditCard, Shield, Key } from "lucide-react";
import { TIER_BENEFITS } from "@/lib/credits";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { credits, tier } = useCredits();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const supabase = createClient();

  const tierInfo = TIER_BENEFITS[tier as keyof typeof TIER_BENEFITS] || TIER_BENEFITS.bronze;

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };

    loadProfile();
  }, [user, supabase]);

  const handleAvatarUpload = async (url: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);

      if (error) throw error;

      setAvatarUrl(url);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar avatar");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Gerencie suas preferências e informações da conta
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5" />
            <CardTitle>Perfil</CardTitle>
          </div>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Foto de Perfil</Label>
            <div className="mt-2">
              {user && (
                <ImageUpload
                  bucket="avatars"
                  userId={user.id}
                  currentImageUrl={avatarUrl}
                  onUploadComplete={handleAvatarUpload}
                  maxSizeMB={5}
                  label="Escolher Foto"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-neutral-100 dark:bg-neutral-900"
            />
            <p className="text-xs text-neutral-500 mt-1">
              O email não pode ser alterado
            </p>
          </div>

          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <Button onClick={handleUpdateProfile} loading={loading}>
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Status da Conta</CardTitle>
          </div>
          <CardDescription>
            Informações sobre seu plano e benefícios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Tier Atual</p>
              <p className="text-2xl font-bold capitalize">{tierInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Créditos</p>
              <p className="text-2xl font-bold">{credits}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-500 mb-2">
              Benefícios do Tier {tierInfo.name}
            </p>
            <ul className="space-y-2">
              {tierInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="font-medium">Bônus Mensal</p>
              <p className="text-sm text-neutral-500">
                +{tierInfo.monthlyBonus} créditos grátis todo mês
              </p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {tierInfo.discount}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <CardTitle>Segurança</CardTitle>
          </div>
          <CardDescription>
            Gerencie a segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div>
              <p className="font-medium">Senha</p>
              <p className="text-sm text-neutral-500">
                Altere sua senha de acesso
              </p>
            </div>
            <Button variant="outline" disabled>
              Alterar Senha
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div>
              <p className="font-medium">Autenticação de Dois Fatores</p>
              <p className="text-sm text-neutral-500">
                Adicione uma camada extra de segurança
              </p>
            </div>
            <Button variant="outline" disabled>
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Key (Future) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5" />
            <CardTitle>Chave API</CardTitle>
          </div>
          <CardDescription>
            Use o CertifyRPG programaticamente (em breve)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div>
              <p className="font-medium text-neutral-400">
                Em Desenvolvimento
              </p>
              <p className="text-sm text-neutral-500">
                API pública em breve
              </p>
            </div>
            <Button variant="outline" disabled>
              Gerar Chave
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis da conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900">
            <div>
              <p className="font-medium">Sair da Conta</p>
              <p className="text-sm text-neutral-500">
                Desconectar de todos os dispositivos
              </p>
            </div>
            <Button variant="outline" onClick={() => signOut()}>
              Sair
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900">
            <div>
              <p className="font-medium text-red-600">Excluir Conta</p>
              <p className="text-sm text-neutral-500">
                Apagar permanentemente sua conta e dados
              </p>
            </div>
            <Button variant="destructive" disabled>
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
