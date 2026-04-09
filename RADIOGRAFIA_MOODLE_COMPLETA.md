# Radiografia Geral de Dados e Processos ETL (Moodle FICV)

Este manual serve como o guia definitivo para arquitetar pipelines de dados (ETL), séries temporais e modelos analíticos com base no ecossistema modular do Moodle.

---

## 🧭 1. Grandes Estruturas de Dados do Moodle

O Moodle armazena dados de forma altamente modularizada. Abaixo está a decomposição dos dados pelo seu valor para a **Tomada de Decisão**.

### 📁 A. Dados de Cadastro e Perfil (Dados Demográficos)
| Dado / Variável | Estrutura | ETL / Usabilidade | Valor para Decisão |
| :--- | :--- | :--- | :--- |
| `id` / `username` | Estruturado | Chave primária para joins com Supabase. | Unicidade do Usuário. |
| `email` | Estruturado | Sanitização (lowercase). | Canal de Comunicação. |
| `cpf` (CustomField) | Semi-estruturado | Remover pontos/traços via Regex. | Controle de Contratos e Inadimplência. |
| `semestre` (Custom) | Estruturado | Converter para Date ou Ciclo (ex: 20241). | Segmentar safras de alunos. |

---

### 📊 B. Dados de Gradebook (Desempenho Acadêmico)
| Dado / Variável | Estrutura | ETL / Usabilidade | Valor para Decisão |
| :--- | :--- | :--- | :--- |
| `graderaw` / `finalgrade` | Estruturado (Float) | Divisão por `grademax` para normalizar escalas. | Média de aprovação direta. |
| `notas_disciplinas` | **Não Estruturado** | Usar **Split (`\|`)** e Regex `([\w\s]+):\s?(\d+\.?\d*)` para extrair Key-Value. | Análise de Dificuldade por Módulo. |

---

### 📡 C. Módulos de Atividades (Logs de Interação)
Estas variáveis ficam disponíveis no Moodle geralmente através de APIs de Atividade (`mod_assign`, `mod_quiz`):

| Módulo Moodle | Variáveis Extraíveis | Processo de ETL Sugerido | Série Temporal / BI |
| :--- | :--- | :--- | :--- |
| **Quiz (Provas)** | `timemodified`, `sumgrades`, `state` | Agrupar por data de entrega (Série Temporal). | Tempo de resposta vs. Nota tira dúvidas. |
| **Assign (Tarefas)**| `status` (submetido, pendente) | Formatar data de submissão. | Pontualidade de entrega por Curso. |
| **Forum (Posts)** | `numreplies`, `timecreated` | Contagem simples de interações numéricas. | Medição de Engajamento do Aluno. |

---

## 🛠️ 2. Pipeline de ETL (Extract, Transform, Load) Recomendado

Para que os dados vindo da API alimentem dashboards de BI eficientes, os pipelines devem seguir esta receita:

1.  **Filtro de Amostragem (Extração)**:
    *   Fazer loops paralelos de cursos por categoria (já implementados nas Server Actions).
2.  **Transformação de Tipos de Dados**:
    *   **Datas**: O Moodle devolve datas em Unix Timestamp (`1710842400`). Converter no ETL para ISO String (`2024-03-19`) para séries temporais.
    *   **Status de Curso**: Moodle retorna booleanos ou IDs. Converter para strings executivas (`Aprovado`, `Reprovado`, `Em Curso`).
3.  **Carga (Load)**:
    *   Inserir os dados na tabela `dados_moodle_cursos` do Supabase usando **Upsert** (Para atualizar as notas sem duplicar registros).

---

## 📈 3. Séries Temporais e Inteligência Acadêmica

Com estes dados estruturados no Supabase, é possível plotar:

*   **Curva de Grade Progressiva**: Alinhando `timemodified` de exercícios e quizes com as notas do Gradebook para ver a evolução do aluno por semana.
*   **Predictive Churn (Risco de Evasão)**: Alunos cuja data do último quiz (`lastaccess`) for > 30 dias atrás ganham "Flag de Alerta Vermelho".
*   **Taxa de Aprovação por Período**: O cruzamento de `semestre` + `curso` + `media_geral` gera histogramas exatos de aprovação instantânea.
