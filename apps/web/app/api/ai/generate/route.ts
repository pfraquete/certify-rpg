import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithOpenAI, parseAIJSON } from "@/lib/ai/openai";
import { getPromptMessages, AIGenerationInput } from "@/lib/ai/prompts";
import { CREDIT_COSTS } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as AIGenerationInput & {
      campaignId?: string;
    };

    // Get user's credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Calculate cost based on type
    const cost =
      CREDIT_COSTS.AI_GENERATION[
        body.type as keyof typeof CREDIT_COSTS.AI_GENERATION
      ] || 10;

    // Check if user has enough credits
    if (profile.credits < cost) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: cost,
          available: profile.credits,
        },
        { status: 402 }
      );
    }

    // Generate prompt messages
    const messages = getPromptMessages(body);

    // Call OpenAI
    const response = await generateWithOpenAI(messages, {
      model: "gpt-4",
      maxTokens: 2000,
      temperature: 0.8,
    });

    // Parse JSON response
    const content = parseAIJSON(response.content);

    // Save to database
    const { data: generation, error: insertError } = await supabase
      .from("ai_generations")
      .insert({
        user_id: user.id,
        campaign_id: body.campaignId || null,
        type: body.type,
        prompt: JSON.stringify(body),
        content,
        model: response.model,
        tokens_used: response.tokens,
        cost_credits: cost,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to save generation:", insertError);
      return NextResponse.json(
        { error: "Failed to save generation" },
        { status: 500 }
      );
    }

    // Deduct credits
    const { error: creditError } = await supabase.rpc("update_user_credits", {
      p_user_id: user.id,
      p_amount: -cost,
      p_type: "ai_generation",
      p_description: `Geração de IA: ${body.type}`,
      p_reference_id: generation.id,
    });

    if (creditError) {
      console.error("Failed to deduct credits:", creditError);
      // Note: Generation is already saved, but credits not deducted
      // In production, you might want to implement a retry mechanism
    }

    return NextResponse.json({
      success: true,
      data: generation,
      creditsUsed: cost,
      creditsRemaining: profile.credits - cost,
    });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
