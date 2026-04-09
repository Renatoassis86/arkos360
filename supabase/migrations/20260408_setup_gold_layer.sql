-- Migration: Setup ARKOS Gold Layer (Feature Store)
-- Basado nos objetivos OE1, OE3 e OE7 do TCC ARKOS 360

-- Create Schemas if not exist
CREATE SCHEMA IF NOT EXISTS arkos;

-- 1. Unified Student Record (USR)
CREATE TABLE IF NOT EXISTS arkos.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ies_id UUID NOT NULL, -- Para Multi-tenancy
    external_id_sponte TEXT,
    external_id_prime TEXT,
    full_name_hash TEXT NOT NULL, -- SHA-256 conforme OE1
    cpf_hash TEXT NOT NULL, -- SHA-256 conforme OE1
    course_name TEXT,
    current_status TEXT, -- Ativo, Trancado, Evadido, Formado
    enrollment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Feature Snapshots (Onde residem os indicadores SED, SVF, IPI-e)
CREATE TABLE IF NOT EXISTS arkos.feature_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES arkos.students(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    
    -- Indicadores Preditivos
    sed_score FLOAT, -- Slope de Engajamento Digital
    svf_score FLOAT, -- Score de Vulnerabilidade Financeira
    ipi_e_score FLOAT, -- Indicador de Pertencimento Institucional
    
    -- Scores de Inteligência (Saídas dos Motores)
    churn_probability FLOAT, -- XGBoost/CatBoost
    default_probability FLOAT, -- XGBoost/CatBoost
    survival_probability_6m FLOAT, -- Modelo de Cox (timing 6 meses)
    nlp_sentiment_score FLOAT, -- BERTimbau
    
    -- Score Composto de Risco (SCR) - Fórmula OE7
    scr_final_score FLOAT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Intervenções (Para o Motor Causal / Uplift)
CREATE TABLE IF NOT EXISTS arkos.interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES arkos.students(id) ON DELETE CASCADE,
    intervention_type TEXT NOT NULL, -- 'Bolsa', 'Desconto', 'Ligação Pedagógica'
    treatment_value FLOAT, -- Ex: 0.10 para 10%
    execution_date DATE NOT NULL,
    executed_by_ui UUID, -- Usuário do Arkos
    
    -- Resultado observado para o motor causal
    outcome_observed BOOLEAN, -- Se o aluno permaneceu/pagou após a ação
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Multi-tenancy
ALTER TABLE arkos.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE arkos.feature_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE arkos.interventions ENABLE ROW LEVEL SECURITY;

-- Exemplo de política RLS (Simplificada)
CREATE POLICY ies_isolation_policy ON arkos.students
    FOR ALL USING (ies_id = auth.uid()); -- Assumindo que auth.uid() é o IES_ID no JWT
