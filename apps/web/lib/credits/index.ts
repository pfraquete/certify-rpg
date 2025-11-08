import { createClient } from "@/lib/supabase/server";
import { CreditTransactionType } from "@/lib/types";

// Custos em créditos
export const CREDIT_COSTS = {
  CERTIFICATE: 5,
  AI_GENERATION: {
    npc: 10,
    item: 8,
    location: 12,
    story: 15,
    quest: 20,
  },
  AI_IMAGE: 25,
} as const;

// Recompensas de créditos
export const CREDIT_REWARDS = {
  WELCOME_BONUS: 100,
  REFERRAL: 50,
  DAILY_LOGIN: 5,
  FIRST_CERTIFICATE: 10,
  FIRST_AI_GENERATION: 10,
} as const;

// Pacotes de compra de créditos
export const CREDIT_PACKAGES = [
  { credits: 100, price: 4.99, bonus: 0 },
  { credits: 500, price: 19.99, bonus: 50 },
  { credits: 1000, price: 34.99, bonus: 150 },
  { credits: 2500, price: 79.99, bonus: 500 },
] as const;

/**
 * Adiciona créditos ao usuário
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description: string,
  referenceId?: string
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("update_user_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
    p_reference_id: referenceId || null,
  });

  if (error) throw new Error(`Erro ao adicionar créditos: ${error.message}`);
  return data;
}

/**
 * Remove créditos do usuário
 */
export async function deductCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description: string,
  referenceId?: string
) {
  return addCredits(userId, -amount, type, description, referenceId);
}

/**
 * Verifica se o usuário tem créditos suficientes
 */
export async function hasEnoughCredits(userId: string, amount: number) {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (error) throw new Error(`Erro ao verificar créditos: ${error.message}`);
  return profile.credits >= amount;
}

/**
 * Obtém o saldo de créditos do usuário
 */
export async function getUserCredits(userId: string) {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits, tier, total_spent")
    .eq("id", userId)
    .single();

  if (error) throw new Error(`Erro ao obter créditos: ${error.message}`);
  return profile;
}

/**
 * Obtém histórico de transações do usuário
 */
export async function getCreditTransactions(
  userId: string,
  limit = 50,
  offset = 0
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error)
    throw new Error(`Erro ao obter transações: ${error.message}`);

  return data;
}

/**
 * Calcula o tier baseado no total gasto
 */
export function calculateTier(totalSpent: number): "bronze" | "silver" | "gold" | "platinum" {
  if (totalSpent >= 1000) return "platinum";
  if (totalSpent >= 500) return "gold";
  if (totalSpent >= 100) return "silver";
  return "bronze";
}

/**
 * Benefícios por tier
 */
export const TIER_BENEFITS = {
  bronze: {
    name: "Bronze",
    discount: 0,
    monthlyBonus: 0,
    features: ["Acesso básico", "Templates gratuitos"],
  },
  silver: {
    name: "Silver",
    discount: 5,
    monthlyBonus: 10,
    features: [
      "5% de desconto",
      "+10 créditos/mês",
      "Templates premium",
    ],
  },
  gold: {
    name: "Gold",
    discount: 10,
    monthlyBonus: 25,
    features: [
      "10% de desconto",
      "+25 créditos/mês",
      "Todos os templates",
      "Suporte prioritário",
    ],
  },
  platinum: {
    name: "Platinum",
    discount: 15,
    monthlyBonus: 50,
    features: [
      "15% de desconto",
      "+50 créditos/mês",
      "Tudo ilimitado",
      "Suporte VIP",
      "Beta features",
    ],
  },
} as const;
