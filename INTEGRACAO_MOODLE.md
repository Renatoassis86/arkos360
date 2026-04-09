# Integração Moodle (FICV) - Relatório e Sincronização

Esta documentação descreve o status da integração com o Moodle na plataforma ARKOS, os dados que estão sendo puxados, o que ainda **falta mapear**, e como funciona o novo processo de sincronização para o banco de dados.

---

## 📋 Variaveis Puxadas em Tempo Real (Atuais)
Ao consultar as APIs do Moodle (`core_enrol_get_enrolled_users` e `gradereport_user_get_grade_items`), o sistema **já puxa hoje de forma real**:

| Variável | Origem | Descrição |
| :--- | :--- | :--- |
| `Nome Completo` | Moodle (Core) | Nome do aluno cadastrado no Moodle. |
| `E-mail` | Moodle (Core) | E-mail de cadastro. |
| `CPF` | Moodle (Custom Field) | Mapeado diretamente dos campos personalizados do Moodle. |
| `Data de Nascimento` | Moodle (Custom Field) | Mapeado dos campos personalizados do Moodle. |
| `Semestre` | Moodle (Custom Field) | Posição ou ciclo letivo do aluno. |
| `Notas por Disciplina` | Moodle (Gradebook) | String mesclando as avaliações (Ex: *Modulo 1: 9.5 \| Modulo 2: 8.0*). |
| `Média Geral` | Mapeamento (Cálculo) | Média aritmética das notas reais lidas do Gradebook do aluno. |
| `Status` | Mapeamento (Cálculo) | Exibe `Aprovado` (média >= 7) ou `Em Curso`. |

---

## 🚨 O que o Moodle NÃO fornece de forma Automática (O que Falta)
Para complementar a base de dados ideal solicitada:
1. **Professor da Disciplina**: O Moodle não vincula o nome do "Professor" diretamente na listagem de matrículas de um aluno. Geralmente, o Professor é um usuário com outro cargo (Role).
2. **Titulação do Professor**: Não existe campo nativo no Moodle para carregar títulos (Doutor, Mestre) de forma global em uma Action de alunos. É necessário criar um campo personalizado (Custom Field) no perfil dos próprios Professores no Moodle.
3. **Créditos da Disciplina**: É uma informação que precisa ser cadastrada nos metadados do curso por vocês lá no ambiente virtual.

---

## 🛠️ Nova Funcionalidade: Banco de Dados no Supabase
Criamos a tabela `dados_moodle_cursos` no Supabase com suporte aos campos:
* `curso` (Nome do Curso)
* `disciplina` (Nome da disciplina que o aluno cursa)
* `professor` (Nome do Professor)
* `titulacao_professor` (Titulação)
* `carga_horaria`
* `creditos`
* `nota` (Média final real)

### 🚀 Sincronização Automática (Breve)
Para que os dados sejam atualizados no banco **a cada hora automaticamente** sem precisar clicar em botões:
1. É necessário configurar um **Cron Job** (Serviço externo ou trigger no Supabase) que aponte para um Endpoint API no backend do Next.js.
2. Criamos a Server Action `syncAllMoodleData` no backend para servir de motor para esse processo em lote.

---

## 💡 Como Visualizar Agora na Tela Corretamente
Se você estiver abrindo os Relatórios e vir telas antigas:
1. **Derrube o servidor local** no seu terminal de comandos pressionando `Ctrl + C`.
2. Rode `npm run dev` novamente para forçar o re-build da página.
3. No seu navegador, abra a aba e pressione **`Ctrl + F5`** (Limpeza Forçada de Cache). 
4. Atente-se que nos **Relatórios Dinâmicos**, o passo n°1 agora é escolher se quer dados de toda uma **Categoria** (ex: Pós) ou de uma **Disciplina** e dar o click no botão de consulta.
