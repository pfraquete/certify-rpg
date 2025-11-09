export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          credits: number
          tier: string
          role: string
          referral_code: string
          referred_by: string | null
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          credits?: number
          tier?: string
          role?: string
          referral_code?: string
          referred_by?: string | null
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          credits?: number
          tier?: string
          role?: string
          referral_code?: string
          referred_by?: string | null
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          system: string | null
          image_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          system?: string | null
          image_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          system?: string | null
          image_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          campaign_id: string | null
          title: string
          description: string | null
          player_name: string
          character_name: string | null
          achievement: string
          template: string
          background_color: string
          text_color: string
          custom_css: string | null
          pdf_url: string | null
          image_url: string | null
          metadata: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_id?: string | null
          title: string
          description?: string | null
          player_name: string
          character_name?: string | null
          achievement: string
          template?: string
          background_color?: string
          text_color?: string
          custom_css?: string | null
          pdf_url?: string | null
          image_url?: string | null
          metadata?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_id?: string | null
          title?: string
          description?: string | null
          player_name?: string
          character_name?: string | null
          achievement?: string
          template?: string
          background_color?: string
          text_color?: string
          custom_css?: string | null
          pdf_url?: string | null
          image_url?: string | null
          metadata?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          reference_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          reference_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          reference_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      ai_generations: {
        Row: {
          id: string
          user_id: string
          campaign_id: string | null
          type: string
          prompt: string
          content: Json
          model: string
          tokens_used: number | null
          cost_credits: number
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_id?: string | null
          type: string
          prompt: string
          content: Json
          model?: string
          tokens_used?: number | null
          cost_credits?: number
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_id?: string | null
          type?: string
          prompt?: string
          content?: Json
          model?: string
          tokens_used?: number | null
          cost_credits?: number
          is_favorite?: boolean
          created_at?: string
        }
      }
      certificate_templates: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          css: string
          html_structure: string
          thumbnail_url: string | null
          is_public: boolean
          is_premium: boolean
          use_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          css: string
          html_structure: string
          thumbnail_url?: string | null
          is_public?: boolean
          is_premium?: boolean
          use_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          description?: string | null
          css?: string
          html_structure?: string
          thumbnail_url?: string | null
          is_public?: boolean
          is_premium?: boolean
          use_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      update_user_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description: string
          p_reference_id?: string
          p_metadata?: Json
        }
        Returns: boolean
      }
    }
  }
}
