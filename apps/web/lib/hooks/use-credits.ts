"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { CreditTransaction } from "@/lib/types";

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [tier, setTier] = useState<string>("bronze");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  const supabase = createClient();

  // Load initial credits
  useEffect(() => {
    if (!user) return;

    const loadCredits = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("credits, tier")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setCredits(data.credits);
        setTier(data.tier);
      }
      setLoading(false);
    };

    loadCredits();
  }, [user, supabase]);

  // Subscribe to credit changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("credit_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setCredits(payload.new.credits);
          setTier(payload.new.tier);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "credit_transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setTransactions((prev) => [payload.new as CreditTransaction, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  // Load transactions
  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      const { data } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setTransactions(data);
      }
    };

    loadTransactions();
  }, [user, supabase]);

  return {
    credits,
    tier,
    loading,
    transactions,
    refresh: async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("credits, tier")
        .eq("id", user.id)
        .single();
      if (data) {
        setCredits(data.credits);
        setTier(data.tier);
      }
    },
  };
}
