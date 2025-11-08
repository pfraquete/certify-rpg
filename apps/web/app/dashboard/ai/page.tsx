"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCredits } from "@/lib/hooks/use-credits";
import { CREDIT_COSTS } from "@/lib/credits";
import { toast } from "sonner";
import { Sparkles, User, Package, MapPin, BookOpen, Scroll, Coins, Loader2 } from "lucide-react";

type GenerationType = "npc" | "item" | "location" | "story" | "quest";

interface GenerationResult {
  type: GenerationType;
  content: unknown;
}

export default function AIPage() {
  const { credits } = useCredits();
  const [selectedType, setSelectedType] = useState<GenerationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  // NPC Form State
  const [npcForm, setNpcForm] = useState({
    race: "",
    class: "",
    alignment: "",
    level: "",
    setting: "",
    additionalContext: "",
  });

  // Item Form State
  const [itemForm, setItemForm] = useState({
    itemType: "",
    rarity: "",
    level: "",
    setting: "",
    additionalContext: "",
  });

  // Location Form State
  const [locationForm, setLocationForm] = useState({
    locationType: "",
    size: "",
    setting: "",
    additionalContext: "",
  });

  // Story Form State
  const [storyForm, setStoryForm] = useState({
    genre: "",
    tone: "",
    length: "",
    setting: "",
    additionalContext: "",
  });

  // Quest Form State
  const [questForm, setQuestForm] = useState({
    questType: "",
    difficulty: "",
    partyLevel: "",
    setting: "",
    additionalContext: "",
  });

  const generationTypes = [
    {
      type: "npc" as const,
      icon: User,
      title: "NPC",
      description: "Crie personagens não-jogadores únicos",
      cost: CREDIT_COSTS.AI_GENERATION.npc,
    },
    {
      type: "item" as const,
      icon: Package,
      title: "Item Mágico",
      description: "Gere itens e equipamentos especiais",
      cost: CREDIT_COSTS.AI_GENERATION.item,
    },
    {
      type: "location" as const,
      icon: MapPin,
      title: "Localização",
      description: "Crie lugares detalhados e imersivos",
      cost: CREDIT_COSTS.AI_GENERATION.location,
    },
    {
      type: "story" as const,
      icon: BookOpen,
      title: "História",
      description: "Desenvolva narrativas envolventes",
      cost: CREDIT_COSTS.AI_GENERATION.story,
    },
    {
      type: "quest" as const,
      icon: Scroll,
      title: "Quest",
      description: "Planeje missões e aventuras",
      cost: CREDIT_COSTS.AI_GENERATION.quest,
    },
  ];

  const handleGenerate = async () => {
    if (!selectedType) return;

    const cost = CREDIT_COSTS.AI_GENERATION[selectedType];

    if (credits < cost) {
      toast.error("Créditos insuficientes", {
        description: `Você precisa de ${cost} créditos`,
      });
      return;
    }

    setLoading(true);

    try {
      let body: Record<string, unknown> = { type: selectedType };

      switch (selectedType) {
        case "npc":
          body = { ...body, ...npcForm };
          break;
        case "item":
          body = { ...body, ...itemForm };
          break;
        case "location":
          body = { ...body, ...locationForm };
          break;
        case "story":
          body = { ...body, ...storyForm };
          break;
        case "quest":
          body = { ...body, ...questForm };
          break;
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar conteúdo");
      }

      setResult({
        type: selectedType,
        content: data.data.content,
      });

      toast.success("Conteúdo gerado com sucesso!", {
        description: `${cost} créditos foram debitados`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar conteúdo", {
        description: error instanceof Error ? error.message : "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedType) {
    const typeInfo = generationTypes.find((t) => t.type === selectedType)!;

    return (
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedType(null);
                setResult(null);
              }}
            >
              ← Voltar
            </Button>
            <h1 className="text-3xl font-bold mt-2">Gerar {typeInfo.title}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              {typeInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-semibold">{credits}</span>
          </div>
        </div>

        {/* Form */}
        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Preencha os campos para personalizar a geração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedType === "npc" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="race">Raça</Label>
                      <Input
                        id="race"
                        placeholder="Ex: Elfo, Humano, Anão..."
                        value={npcForm.race}
                        onChange={(e) =>
                          setNpcForm({ ...npcForm, race: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="class">Classe</Label>
                      <Input
                        id="class"
                        placeholder="Ex: Guerreiro, Mago, Ladino..."
                        value={npcForm.class}
                        onChange={(e) =>
                          setNpcForm({ ...npcForm, class: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="alignment">Alinhamento</Label>
                      <Input
                        id="alignment"
                        placeholder="Ex: Caótico Bom, Leal Neutro..."
                        value={npcForm.alignment}
                        onChange={(e) =>
                          setNpcForm({ ...npcForm, alignment: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Nível</Label>
                      <Input
                        id="level"
                        type="number"
                        placeholder="1-20"
                        value={npcForm.level}
                        onChange={(e) =>
                          setNpcForm({ ...npcForm, level: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="setting">Cenário/Ambientação</Label>
                    <Input
                      id="setting"
                      placeholder="Ex: D&D 5e, Pathfinder, medieval..."
                      value={npcForm.setting}
                      onChange={(e) =>
                        setNpcForm({ ...npcForm, setting: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="context">Contexto Adicional</Label>
                    <textarea
                      id="context"
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Descreva qualquer informação adicional..."
                      value={npcForm.additionalContext}
                      onChange={(e) =>
                        setNpcForm({
                          ...npcForm,
                          additionalContext: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {selectedType === "item" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemType">Tipo de Item</Label>
                      <select
                        id="itemType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={itemForm.itemType}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, itemType: e.target.value })
                        }
                      >
                        <option value="">Selecione...</option>
                        <option value="weapon">Arma</option>
                        <option value="armor">Armadura</option>
                        <option value="potion">Poção</option>
                        <option value="artifact">Artefato</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="rarity">Raridade</Label>
                      <select
                        id="rarity"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={itemForm.rarity}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, rarity: e.target.value })
                        }
                      >
                        <option value="">Selecione...</option>
                        <option value="common">Comum</option>
                        <option value="uncommon">Incomum</option>
                        <option value="rare">Raro</option>
                        <option value="very rare">Muito Raro</option>
                        <option value="legendary">Lendário</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="setting">Cenário/Ambientação</Label>
                    <Input
                      id="setting"
                      placeholder="Ex: D&D 5e, Pathfinder, medieval..."
                      value={itemForm.setting}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, setting: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="context">Contexto Adicional</Label>
                    <textarea
                      id="context"
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Descreva qualquer informação adicional..."
                      value={itemForm.additionalContext}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          additionalContext: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleGenerate}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar ({typeInfo.cost} créditos)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>
                Conteúdo gerado com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg overflow-auto max-h-[600px]">
                {JSON.stringify(result.content, null, 2)}
              </pre>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => setResult(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Gerar Novo
                </Button>
                <Button className="flex-1" disabled>
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gerador de IA</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Use inteligência artificial para criar conteúdo para suas campanhas
        </p>
      </div>

      {/* Credits Display */}
      <Card className="border-yellow-500 dark:border-yellow-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{credits}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  créditos disponíveis
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard/credits"}>
              Comprar Mais
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generation Types */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {generationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.type}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedType(type.type)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold">{type.cost}</span>
                  </div>
                </div>
                <CardTitle>{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Gerar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
