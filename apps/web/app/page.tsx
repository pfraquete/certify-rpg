import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, CreditCard, Users, Zap, Shield } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: "Certificados Personalizados",
      description: "Crie certificados únicos para suas campanhas de RPG com templates profissionais",
    },
    {
      icon: Sparkles,
      title: "Gerador de IA",
      description: "Use GPT-4 e DALL-E 3 para criar NPCs, itens e histórias envolventes",
    },
    {
      icon: CreditCard,
      title: "Sistema de Créditos",
      description: "Sistema flexível de créditos com tiers e gamificação",
    },
    {
      icon: Users,
      title: "Gestão de Campanhas",
      description: "Organize seus projetos e campanhas em um só lugar",
    },
    {
      icon: Zap,
      title: "Rápido e Eficiente",
      description: "Interface moderna e responsiva para uma experiência fluida",
    },
    {
      icon: Shield,
      title: "Seguro e Confiável",
      description: "Seus dados protegidos com autenticação segura e backup automático",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="text-xl font-bold">CertifyRPG</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Começar Grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Certificados e IA
            </span>
            <br />
            <span className="text-neutral-900 dark:text-neutral-100">
              para suas Campanhas de RPG
            </span>
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Plataforma completa para mestres e jogadores criarem certificados personalizados,
            gerarem conteúdo com IA e gerenciarem suas campanhas de RPG
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/register">
                Começar Agora - É Grátis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/login">
                Já tenho conta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Tudo que você precisa para levar suas campanhas ao próximo nível
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-none">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de mestres e jogadores que já estão usando o CertifyRPG
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/register">
                Criar Conta Grátis
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-neutral-600 dark:text-neutral-400">
            <p className="text-xl font-semibold mb-2">🎲 CertifyRPG</p>
            <p>Feito com ❤️ para a comunidade de RPG</p>
            <p className="mt-4 text-sm">© 2024 CertifyRPG. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
