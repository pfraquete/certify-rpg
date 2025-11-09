-- Campanhas (Projetos de RPG)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  system TEXT, -- Sistema de RPG (D&D, Pathfinder, etc)
  image_url TEXT,
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Certificados
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  player_name TEXT NOT NULL,
  character_name TEXT,
  achievement TEXT NOT NULL,
  template TEXT DEFAULT 'classic', -- classic, fantasy, modern, custom
  background_color TEXT DEFAULT '#1a1a2e',
  text_color TEXT DEFAULT '#ffffff',
  custom_css TEXT,
  pdf_url TEXT, -- URL do PDF gerado
  image_url TEXT, -- URL da imagem do certificado
  metadata JSONB DEFAULT '{}', -- Dados extras (XP, level, etc)
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_campaign_id ON certificates(campaign_id);
CREATE INDEX idx_certificates_created_at ON certificates(created_at DESC);

-- Transações de Créditos
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positivo = ganhou, Negativo = gastou
  type TEXT NOT NULL, -- purchase, referral, ai_generation, certificate, reward
  description TEXT,
  reference_id UUID, -- ID do certificado, geração de IA, etc
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- Conteúdo Gerado por IA
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- npc, item, location, story, quest
  prompt TEXT NOT NULL,
  content JSONB NOT NULL, -- Resultado da IA estruturado
  model TEXT DEFAULT 'gpt-4', -- Modelo usado
  tokens_used INTEGER,
  cost_credits INTEGER DEFAULT 10,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_campaign_id ON ai_generations(campaign_id);
CREATE INDEX idx_ai_generations_type ON ai_generations(type);
CREATE INDEX idx_ai_generations_is_favorite ON ai_generations(is_favorite);
CREATE INDEX idx_ai_generations_created_at ON ai_generations(created_at DESC);

-- Templates de Certificados
CREATE TABLE certificate_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- NULL = template público
  name TEXT NOT NULL,
  description TEXT,
  css TEXT NOT NULL,
  html_structure TEXT NOT NULL,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_certificate_templates_user_id ON certificate_templates(user_id);
CREATE INDEX idx_certificate_templates_is_public ON certificate_templates(is_public);
CREATE INDEX idx_certificate_templates_is_premium ON certificate_templates(is_premium);

-- RLS Policies para Campanhas
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies para Certificados
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certificates" ON certificates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own certificates" ON certificates
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies para Transações de Crédito
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Apenas o sistema pode criar transações (via functions)
CREATE POLICY "Service role can insert transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- RLS Policies para Gerações de IA
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai generations" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create ai generations" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai generations" ON ai_generations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ai generations" ON ai_generations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies para Templates
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public templates" ON certificate_templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create templates" ON certificate_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON certificate_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON certificate_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Function para atualizar créditos
CREATE OR REPLACE FUNCTION update_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_new_credits INTEGER;
BEGIN
  -- Atualiza créditos do usuário
  UPDATE profiles
  SET credits = credits + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING credits INTO v_new_credits;

  -- Se gastou créditos e ficou negativo, reverte
  IF v_new_credits < 0 THEN
    RAISE EXCEPTION 'Créditos insuficientes';
  END IF;

  -- Registra a transação
  INSERT INTO credit_transactions (user_id, amount, type, description, reference_id, metadata)
  VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id, p_metadata);

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificate_templates_updated_at
  BEFORE UPDATE ON certificate_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir templates padrão
INSERT INTO certificate_templates (name, description, css, html_structure, is_public, thumbnail_url) VALUES
('Classic RPG', 'Template clássico com bordas douradas e pergaminho',
'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 4px solid #d4af37; padding: 40px; font-family: "Cinzel", serif;',
'<div class="certificate"><h1>{{title}}</h1><p>{{description}}</p></div>',
true,
NULL
),
('Fantasy Scroll', 'Pergaminho medieval com detalhes em ouro',
'background: url("/scroll-bg.png"); background-size: cover; padding: 60px; color: #2c1810;',
'<div class="scroll"><h2>{{player_name}}</h2><p>{{achievement}}</p></div>',
true,
NULL
),
('Modern Dark', 'Design moderno com tema escuro',
'background: #0f0f0f; border-left: 5px solid #00ff88; padding: 40px; font-family: "Inter", sans-serif;',
'<div class="modern"><h1>{{title}}</h1><p>{{achievement}}</p></div>',
true,
NULL
);

-- Inserir créditos iniciais para novos usuários
CREATE OR REPLACE FUNCTION give_initial_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Dar 100 créditos de boas-vindas
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 100, 'reward', 'Créditos de boas-vindas');

  -- Atualizar créditos do perfil
  UPDATE profiles SET credits = 100 WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER give_initial_credits_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION give_initial_credits();
