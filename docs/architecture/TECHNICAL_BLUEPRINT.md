# ARKOS 360 - Blueprint de Arquitetura Técnica

## 1. Visão Geral
O ARKOS 360 é uma plataforma de inteligência integrada (Preditiva, Causal e Prescritiva) para a gestão de evasão e inadimplência em IES Privadas. A arquitetura é construída sobre o Supabase (Postgres) e Python, garantindo escalabilidade e rigor científico.

## 2. Camada de Inteligência e IA
- **Risk Engine:** XGBoost, LightGBM e CatBoost otimizados via Optuna (OE2).
- **Temporal Engine:** Modelo de Sobrevivência de Cox para estimar o *timing* da evasão (OE3).
- **Indicadores Proprietários (Metodologia Arkos):**
    - **SED (Slope de Engajamento Digital):** Tendência de acessos Moodle via regressão linear.
    - **SVF (Financeiro):** Proporção de débitos acumulados sobre mensalidade.
    - **IPI-e (Social):** Indicador de Pertencimento via log de eventos institucionais.
- **NLP Engine:** BERTimbau para análise de sentimentos em PT-BR (OE6).
- **Causal Engine:** Uplift Modeling (T-Learner e Causal Forest) para targeting de intervenções (OE5).

## 3. Arquitetura de Dados (Data Bedrock)

### 3.1 Estratégia de Ingestão e Camadas (Supabase / Postgres)
Utilizaremos o paradigma de camadas (Lakehouse) dentro do Postgres para garantir rastreabilidade:

*   **Schema `raw` (Bronze):** 
    *   **Legacy Prime:** Tabelas espelho para a carga histórica única (2017-2025).
    *   **Live Sponte:** Tabelas que recebem os payloads brutos da API.
    *   **Moodle LMS:** Ingestão de logs de acesso e notas acadêmicas.
*   **Schema `arkos` (Silver/Gold - Feature Store):**
    *   **Unified Student Record (USR):** Entidade única consolidada na tabela `arkos.students`.
    *   **Feature Snapshots:** Armazenamento longitudinal de indicadores (SED, SVF, IPI-e).
    *   **Interventions:** Registro de ações para o motor causal.

## 4. Estrutura de Diretórios
- `/supabase`: Configurações de banco, migrações e Edge Functions.
- `/intelligence`: Motores de IA e Feature Engineering.
    - `/risk_engine`: Modelagem XGBoost/CatBoost.
    - `/nlp`: Fine-tuning do BERTimbau.
    - `/causal`: Inferência causal e Uplift.
    - `/features`: Lógica de extração de indicadores proprietários.
- `/dashboard`: Interface React/Vite para gestão executiva.
- `/docs`: Documentação acadêmica e técnica.

## 5. Requisitos Não Funcionais Críticos
- **Multi-tenancy:** Row Level Security (RLS) mandatório para isolamento entre IES.
- **Explicabilidade:** SHAP Values integrados em todas as predições.
- **LGPD:** Pseudonimização SHA-256 para dados sensíveis.
