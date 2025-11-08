"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/lib/hooks/use-credits";
import { CREDIT_PACKAGES, TIER_BENEFITS } from "@/lib/credits";
import { Coins, TrendingUp, History, Crown, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CreditsPage() {
  const { credits, tier, loading, transactions } = useCredits();

  const tierInfo = TIER_BENEFITS[tier as keyof typeof TIER_BENEFITS] || TIER_BENEFITS.bronze;

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
        <h1 className="text-3xl font-bold">Créditos</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Gerencie seus créditos e adquira mais para criar certificados e usar a IA
        </p>
      </div>

      {/* Current Balance */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Coins className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{credits}</div>
            <p className="text-xs text-neutral-500 mt-1">créditos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier Atual</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">{tierInfo.name}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {tierInfo.discount}% de desconto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bônus Mensal</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{tierInfo.monthlyBonus}</div>
            <p className="text-xs text-neutral-500 mt-1">créditos grátis/mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefícios do Tier {tierInfo.name}</CardTitle>
          <CardDescription>
            Vantagens do seu nível atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tierInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Comprar Créditos</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <Card key={index} className="relative">
              {pkg.bonus > 0 && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  +{pkg.bonus} bônus
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-center text-3xl">
                  {pkg.credits + pkg.bonus}
                </CardTitle>
                <CardDescription className="text-center">
                  créditos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">R$ {pkg.price.toFixed(2)}</p>
                  {pkg.bonus > 0 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {pkg.credits} + {pkg.bonus} de bônus
                    </p>
                  )}
                </div>
                <Button className="w-full" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Suas últimas movimentações de créditos
              </CardDescription>
            </div>
            <History className="h-5 w-5 text-neutral-500" />
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Nenhuma transação ainda
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-neutral-500">
                      {formatDistanceToNow(new Date(transaction.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-lg font-bold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </div>
                    <Coins className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
