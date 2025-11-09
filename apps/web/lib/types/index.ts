import { Database } from "./database";

// Table types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
export type CreditTransaction = Database["public"]["Tables"]["credit_transactions"]["Row"];
export type AIGeneration = Database["public"]["Tables"]["ai_generations"]["Row"];
export type CertificateTemplate = Database["public"]["Tables"]["certificate_templates"]["Row"];

// Insert types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"];
export type CertificateInsert = Database["public"]["Tables"]["certificates"]["Insert"];
export type CreditTransactionInsert = Database["public"]["Tables"]["credit_transactions"]["Insert"];
export type AIGenerationInsert = Database["public"]["Tables"]["ai_generations"]["Insert"];
export type CertificateTemplateInsert = Database["public"]["Tables"]["certificate_templates"]["Insert"];

// Update types
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type CampaignUpdate = Database["public"]["Tables"]["campaigns"]["Update"];
export type CertificateUpdate = Database["public"]["Tables"]["certificates"]["Update"];
export type AIGenerationUpdate = Database["public"]["Tables"]["ai_generations"]["Update"];
export type CertificateTemplateUpdate = Database["public"]["Tables"]["certificate_templates"]["Update"];

// Enums
export type Tier = "bronze" | "silver" | "gold" | "platinum";
export type CampaignStatus = "active" | "completed" | "paused";
export type CreditTransactionType = "purchase" | "referral" | "ai_generation" | "certificate" | "reward";
export type AIGenerationType = "npc" | "item" | "location" | "story" | "quest";
export type CertificateTemplate = "classic" | "fantasy" | "modern" | "custom";

// Extended types with relations
export interface CertificateWithCampaign extends Certificate {
  campaign?: Campaign | null;
}

export interface AIGenerationWithCampaign extends AIGeneration {
  campaign?: Campaign | null;
}

export interface ProfileStats {
  total_certificates: number;
  total_ai_generations: number;
  total_campaigns: number;
  credits_spent: number;
  credits_earned: number;
}
