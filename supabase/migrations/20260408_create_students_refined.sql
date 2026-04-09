-- Migration: Refinamento do Schema com base na Inspeção do Moodle
-- Executar este script no painel do Supabase (SQL Editor)

CREATE SCHEMA IF NOT EXISTS arkos;

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ies_id UUID NOT NULL DEFAULT '8f399f2a-e9fc-4560-9111-64d56d194567',
    external_id_moodle TEXT UNIQUE,
    full_name_hash TEXT NOT NULL,
    cpf_hash TEXT,
    email_hash TEXT,
    course_name TEXT,
    moodle_role TEXT,
    current_status TEXT DEFAULT 'Ativo',
    moodle_last_access BIGINT,
    sed_score FLOAT DEFAULT 0.0,
    svf_score FLOAT DEFAULT 0.0,
    ipi_e_score FLOAT DEFAULT 0.0,
    scr_final_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar segurança
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Política inicial para permitir leitura no Front-end (MVP) e escrita pelo motor Python
CREATE POLICY "Acesso Total MVP" ON public.students FOR ALL USING (true);
