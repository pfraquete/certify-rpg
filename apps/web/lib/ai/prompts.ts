import { OpenAIMessage } from "./openai";

export interface NPCGenerationInput {
  type: "npc";
  race?: string;
  class?: string;
  alignment?: string;
  level?: number;
  setting?: string;
  additionalContext?: string;
}

export interface ItemGenerationInput {
  type: "item";
  itemType?: "weapon" | "armor" | "potion" | "artifact" | "other";
  rarity?: "common" | "uncommon" | "rare" | "very rare" | "legendary";
  level?: number;
  setting?: string;
  additionalContext?: string;
}

export interface LocationGenerationInput {
  type: "location";
  locationType?: "city" | "dungeon" | "wilderness" | "tavern" | "castle" | "other";
  size?: "small" | "medium" | "large";
  setting?: string;
  additionalContext?: string;
}

export interface StoryGenerationInput {
  type: "story";
  genre?: string;
  tone?: "serious" | "humorous" | "dark" | "epic";
  length?: "short" | "medium" | "long";
  setting?: string;
  additionalContext?: string;
}

export interface QuestGenerationInput {
  type: "quest";
  questType?: "main" | "side" | "fetch" | "combat" | "puzzle";
  difficulty?: "easy" | "medium" | "hard" | "deadly";
  partyLevel?: number;
  setting?: string;
  additionalContext?: string;
}

export type AIGenerationInput =
  | NPCGenerationInput
  | ItemGenerationInput
  | LocationGenerationInput
  | StoryGenerationInput
  | QuestGenerationInput;

// System prompts for each type
const SYSTEM_PROMPTS = {
  npc: `Você é um mestre de RPG experiente especializado em criar NPCs (personagens não-jogadores) detalhados e interessantes.
Crie NPCs únicos com personalidade, motivações, histórias de fundo e características marcantes.
Sempre retorne a resposta em formato JSON válido seguindo a estrutura fornecida.`,

  item: `Você é um mestre de RPG experiente especializado em criar itens mágicos e equipamentos únicos.
Crie itens interessantes com propriedades, histórias e mecânicas de jogo bem definidas.
Sempre retorne a resposta em formato JSON válido seguindo a estrutura fornecida.`,

  location: `Você é um mestre de RPG experiente especializado em criar localizações detalhadas e imersivas.
Crie locais com descrições ricas, NPCs relevantes, pontos de interesse e ganchos de aventura.
Sempre retorne a resposta em formato JSON válido seguindo a estrutura fornecida.`,

  story: `Você é um mestre de RPG experiente especializado em criar histórias envolventes e narrativas épicas.
Crie histórias com início, meio e fim, personagens interessantes e reviravoltas emocionantes.
Sempre retorne a resposta em formato JSON válido seguindo a estrutura fornecida.`,

  quest: `Você é um mestre de RPG experiente especializado em criar missões e aventuras memoráveis.
Crie quests com objetivos claros, desafios interessantes, recompensas apropriadas e ganchos narrativos.
Sempre retorne a resposta em formato JSON válido seguindo a estrutura fornecida.`,
};

/**
 * Generate NPC prompt
 */
export function generateNPCPrompt(input: NPCGenerationInput): OpenAIMessage[] {
  const userPrompt = `Crie um NPC para RPG com as seguintes características:
${input.race ? `- Raça: ${input.race}` : ""}
${input.class ? `- Classe: ${input.class}` : ""}
${input.alignment ? `- Alinhamento: ${input.alignment}` : ""}
${input.level ? `- Nível: ${input.level}` : ""}
${input.setting ? `- Cenário: ${input.setting}` : ""}
${input.additionalContext ? `- Contexto adicional: ${input.additionalContext}` : ""}

Retorne a resposta APENAS em formato JSON com a seguinte estrutura:
{
  "name": "Nome do NPC",
  "race": "Raça",
  "class": "Classe",
  "level": número,
  "alignment": "Alinhamento",
  "appearance": "Descrição física detalhada",
  "personality": "Traços de personalidade",
  "background": "História de fundo",
  "motivations": "Motivações e objetivos",
  "quirks": ["Peculiaridade 1", "Peculiaridade 2"],
  "voice": "Como o NPC fala",
  "relationships": "Relações com outros personagens ou facções",
  "secrets": "Segredos que o NPC guarda",
  "hooks": ["Gancho de aventura 1", "Gancho de aventura 2"]
}`;

  return [
    { role: "system", content: SYSTEM_PROMPTS.npc },
    { role: "user", content: userPrompt },
  ];
}

/**
 * Generate Item prompt
 */
export function generateItemPrompt(input: ItemGenerationInput): OpenAIMessage[] {
  const userPrompt = `Crie um item para RPG com as seguintes características:
${input.itemType ? `- Tipo: ${input.itemType}` : ""}
${input.rarity ? `- Raridade: ${input.rarity}` : ""}
${input.level ? `- Nível sugerido: ${input.level}` : ""}
${input.setting ? `- Cenário: ${input.setting}` : ""}
${input.additionalContext ? `- Contexto adicional: ${input.additionalContext}` : ""}

Retorne a resposta APENAS em formato JSON com a seguinte estrutura:
{
  "name": "Nome do Item",
  "type": "Tipo do item",
  "rarity": "Raridade",
  "description": "Descrição detalhada",
  "appearance": "Aparência física",
  "properties": ["Propriedade 1", "Propriedade 2"],
  "mechanics": "Regras e mecânicas de jogo",
  "history": "História e origem do item",
  "curse": "Maldição (se houver)",
  "attunement": "Requisitos de sintonização",
  "value": "Valor estimado em PO"
}`;

  return [
    { role: "system", content: SYSTEM_PROMPTS.item },
    { role: "user", content: userPrompt },
  ];
}

/**
 * Generate Location prompt
 */
export function generateLocationPrompt(
  input: LocationGenerationInput
): OpenAIMessage[] {
  const userPrompt = `Crie uma localização para RPG com as seguintes características:
${input.locationType ? `- Tipo: ${input.locationType}` : ""}
${input.size ? `- Tamanho: ${input.size}` : ""}
${input.setting ? `- Cenário: ${input.setting}` : ""}
${input.additionalContext ? `- Contexto adicional: ${input.additionalContext}` : ""}

Retorne a resposta APENAS em formato JSON com a seguinte estrutura:
{
  "name": "Nome do Local",
  "type": "Tipo de localização",
  "size": "Tamanho",
  "description": "Descrição geral",
  "atmosphere": "Atmosfera e sensação do local",
  "history": "História do local",
  "pointsOfInterest": [
    {"name": "Ponto 1", "description": "Descrição"}
  ],
  "npcs": [
    {"name": "NPC 1", "role": "Papel no local"}
  ],
  "secrets": ["Segredo 1", "Segredo 2"],
  "encounters": ["Encontro possível 1", "Encontro possível 2"],
  "loot": "Tesouros ou recompensas disponíveis",
  "hooks": ["Gancho de aventura 1", "Gancho de aventura 2"]
}`;

  return [
    { role: "system", content: SYSTEM_PROMPTS.location },
    { role: "user", content: userPrompt },
  ];
}

/**
 * Generate Story prompt
 */
export function generateStoryPrompt(input: StoryGenerationInput): OpenAIMessage[] {
  const userPrompt = `Crie uma história para RPG com as seguintes características:
${input.genre ? `- Gênero: ${input.genre}` : ""}
${input.tone ? `- Tom: ${input.tone}` : ""}
${input.length ? `- Tamanho: ${input.length}` : ""}
${input.setting ? `- Cenário: ${input.setting}` : ""}
${input.additionalContext ? `- Contexto adicional: ${input.additionalContext}` : ""}

Retorne a resposta APENAS em formato JSON com a seguinte estrutura:
{
  "title": "Título da História",
  "genre": "Gênero",
  "tone": "Tom narrativo",
  "summary": "Resumo em uma frase",
  "hook": "Gancho inicial",
  "introduction": "Introdução da história",
  "risingAction": "Desenvolvimento e complicações",
  "climax": "Clímax da história",
  "resolution": "Resolução",
  "themes": ["Tema 1", "Tema 2"],
  "characters": [
    {"name": "Personagem", "role": "Papel na história"}
  ],
  "twists": ["Reviravolta 1", "Reviravolta 2"],
  "possibleEndings": ["Final 1", "Final 2"]
}`;

  return [
    { role: "system", content: SYSTEM_PROMPTS.story },
    { role: "user", content: userPrompt },
  ];
}

/**
 * Generate Quest prompt
 */
export function generateQuestPrompt(input: QuestGenerationInput): OpenAIMessage[] {
  const userPrompt = `Crie uma quest para RPG com as seguintes características:
${input.questType ? `- Tipo: ${input.questType}` : ""}
${input.difficulty ? `- Dificuldade: ${input.difficulty}` : ""}
${input.partyLevel ? `- Nível do grupo: ${input.partyLevel}` : ""}
${input.setting ? `- Cenário: ${input.setting}` : ""}
${input.additionalContext ? `- Contexto adicional: ${input.additionalContext}` : ""}

Retorne a resposta APENAS em formato JSON com a seguinte estrutura:
{
  "title": "Título da Quest",
  "type": "Tipo de quest",
  "difficulty": "Dificuldade",
  "level": "Nível sugerido",
  "summary": "Resumo da quest",
  "questGiver": "Quem dá a quest",
  "objectives": ["Objetivo 1", "Objetivo 2"],
  "description": "Descrição detalhada",
  "challenges": [
    {"type": "Tipo", "description": "Descrição"}
  ],
  "locations": ["Local 1", "Local 2"],
  "npcs": [
    {"name": "NPC", "role": "Papel"}
  ],
  "rewards": {
    "experience": "XP",
    "gold": "Ouro",
    "items": ["Item 1", "Item 2"],
    "reputation": "Reputação ganha"
  },
  "consequences": "Consequências de sucesso/falha",
  "hooks": ["Gancho para próxima aventura"]
}`;

  return [
    { role: "system", content: SYSTEM_PROMPTS.quest },
    { role: "user", content: userPrompt },
  ];
}

/**
 * Get prompt messages based on input type
 */
export function getPromptMessages(input: AIGenerationInput): OpenAIMessage[] {
  switch (input.type) {
    case "npc":
      return generateNPCPrompt(input);
    case "item":
      return generateItemPrompt(input);
    case "location":
      return generateLocationPrompt(input);
    case "story":
      return generateStoryPrompt(input);
    case "quest":
      return generateQuestPrompt(input);
    default:
      throw new Error("Invalid generation type");
  }
}
