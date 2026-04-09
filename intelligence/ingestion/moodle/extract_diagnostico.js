const fs = require('fs');
const path = require('path');

const hubPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'DiagnosticoHub.tsx');
const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'diagnostico', 'page.tsx');

if (!fs.existsSync(hubPath)) {
  console.log("DiagnosticoHub.tsx not found!");
  process.exit(1);
}

const hubContent = fs.readFileSync(hubPath, 'utf-8');

// 1. Create the new standalone page file
const pageContent = `'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { saveDiagnostico } from '@/app/actions/save-diagnostico'
import styles from '@/components/DiagnosticoHub.module.css'

export default function DiagnosticoPage() {
  const [step, setStep] = useState<'lead' | 'quiz' | 'loading' | 'result'>('lead')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [lead, setLead] = useState({ nome: '', empresa: '', email: '', whatsapp: '' })
  const [scoreData, setScoreData] = useState<any>(null)

  // 1. Array de Perguntas (20)
  const perguntas = [
    // LIDERANÇA
    { id: 1, block: 'LIDERANÇA', text: 'Em grandes decisões estratégicas, qual é a atitude do CEO ou Diretoria?', options: [
      { id: 'A', text: 'Decidem puramente baseados em instinto e experiência passada.' },
      { id: 'B', text: 'Pedem relatórios, mas cada diretor defende os números do seu próprio silo.' },
      { id: 'C', text: 'Exigem dados corporativos consistentes, mas a TI demora a entregá-lo.' },
      { id: 'D', text: 'Agem como "farejadores de dados", usando dashboards para decisões rápidas e preditivas.' }
    ]},
    { id: 2, block: 'LIDERANÇA', text: 'Quando um dado analítico contraria a opinião de um gerente experiente, o que ocorre?', options: [
      { id: 'A', text: 'O dado é ignorado e a intuição vence.' },
      { id: 'B', text: 'Há ceticismo e o dado é torturado até confessar o que o gerente quer.' },
      { id: 'C', text: 'O dado é aceito, mas a mudança real na operação é muito lenta.' },
      { id: 'D', text: 'A empresa tem uma cultura ágil de "teste e aprendizado" e muda a rota na hora.' }
    ]},
    { id: 3, block: 'LIDERANÇA', text: 'Qual a visão da empresa sobre investimentos em Inteligência e Dados?', options: [
      { id: 'A', text: 'Um custo que deve ser mantido ao mínimo.' },
      { id: 'B', text: 'Um projeto da TI que o negócio não entende muito bem.' },
      { id: 'C', text: 'Uma necessidade, mas ainda sofre para provar seu ROI.' },
      { id: 'D', text: 'O pilar da vantagem competitiva, com patrocínio apaixonado do alto escalão.' }
    ]},
    { id: 4, block: 'LIDERANÇA', text: 'Os líderes da sua empresa promovem uma cultura meritocrática baseada em números?', options: [
      { id: 'A', text: 'Não, avaliações são subjetivas e políticas.' },
      { id: 'B', text: 'Apenas em áreas óbvias, como metas de vendas isoladas.' },
      { id: 'C', text: 'Sim, mas faltam indicadores claros que unam a empresa toda.' },
      { id: 'D', text: 'Sim, métricas guiam bônus, promoções e a gestão implacável da operação.' }
    ]},
    // Empreendimento
    { id: 5, block: 'EMPREENDIMENTO', text: 'Como os dados fluem pela empresa (Finanças, Vendas, RH, Logística)?', options: [
      { id: 'A', text: 'Temos "ilhas de dados". Os departamentos não se falam.' },
      { id: 'B', text: 'Planilhas (geralmente com erros) são trocadas por e-mail.' },
      { id: 'C', text: 'Temos sistemas robustos, mas os dados ainda precisam de conciliação manual.' },
      { id: 'D', text: 'Possuímos uma "única versão da verdade", gerida com uma perspectiva empresarial.' }
    ]},
    { id: 6, block: 'EMPREENDIMENTO', text: 'Quando há um problem complexo (margem caindo), como ele é investigado?', options: [
      { id: 'A', text: 'No escuro. Descobrimos tarde demais.' },
      { id: 'B', text: 'Cada departamento apresenta sua versão e a culpa é transferida.' },
      { id: 'C', text: 'Um comitê se reúne para tentar cruzar dados de diferentes bases.' },
      { id: 'D', text: 'Plataformas visuais mostram a raiz do problema quase em tempo real.' }
    ]},
    { id: 7, block: 'EMPREENDIMENTO', text: 'O financiamento de tecnologia na sua empresa é feito como?', options: [
      { id: 'A', text: 'Quando quebra, a gente compra.' },
      { id: 'B', text: 'Cada área compra seus softwares, gerando fragmentação.' },
      { id: 'C', text: 'Centralizado na TI, mas sem grande alinhamento com a estratégia.' },
      { id: 'D', text: 'TI e Negócios operam lado a lado, investindo em vantagem competitiva.' }
    ]},
    { id: 8, block: 'EMPREENDIMENTO', text: 'Qual o nível de automação das decisões táticas diárias?', options: [
      { id: 'A', text: 'Zero. Tudo depende de aprovação humana manual.' },
      { id: 'B', text: 'Apenas em aprovações financeiras básicas de sistema.' },
      { id: 'C', text: 'Algumas regras de negócio alertam gestores sobre exceções.' },
      { id: 'D', text: 'Algoritmos tomam decisões automatizadas e integradas (Ex: preços e rotas).' }
    ]},
    // Dados
    { id: 9, block: 'DADOS', text: 'Qual a qualidade atual da base de dados da empresa?', options: [
      { id: 'A', text: 'Inconsistente, cheia de duplicidades e falta de padrão.' },
      { id: 'B', text: 'Requer semanas de limpeza manual (processo doloroso).' },
      { id: 'C', text: 'Organizada, mas presa dentro dos sistemas de origem (ERP/CRM).' },
      { id: 'D', text: 'Dados integrados, precisos e disponíveis em repositórios corporativos.' }
    ]},
    { id: 10, block: 'DADOS', text: 'O que vocês fazem com o gigantesco volume de dados gerado?', options: [
      { id: 'A', text: 'Não armazenamos, ou só guardamos por obrigação fiscal.' },
      { id: 'B', text: 'Criamos relatórios para ver "o que aconteceu" no passado.' },
      { id: 'C', text: 'Tentamos responder "por que aconteceu" com cruzamento de dados.' },
      { id: 'D', text: 'Usamos algoritmos para saber "o que vai acontecer" (Análise Preditiva).' }
    ]},
    { id: 11, block: 'DADOS', text: 'Como vocês utilizam dados não-estruturados e informações externas?', options: [
      { id: 'A', text: 'Nunca usamos.' },
      { id: 'B', text: 'De forma pontual, lendo notícias ou relatórios esporádicos.' },
      { id: 'C', text: 'Compramos dados de terceiros, mas não integramos aos nossos.' },
      { id: 'D', text: 'Vasculhamos o mercado e cruzamos variáveis externas o tempo todo.' }
    ]},
    { id: 12, block: 'DADOS', text: 'Quem em sua empresa tem facilidade de acessar insights nos dados?', options: [
      { id: 'A', text: 'Ninguém confia nos dados atuais.' },
      { id: 'B', text: 'Apenas especialistas de TI que extraem os relatórios.' },
      { id: 'C', text: 'Gerentes que recebem dashboards padronizados.' },
      { id: 'D', text: 'Gestores da linha de frente possuem "análise de autoatendimento" em tempo real.' }
    ]},
    // Alvos
    { id: 13, block: 'ALVOS', text: 'Ao traçar a estratégia, onde a empresa aplica seus maiores esforços de análise?', options: [
      { id: 'A', text: 'Atiramos para todos os lados sem alvo definido.' },
      { id: 'B', text: 'Tentamos melhorar atividades funcionais desconexas.' },
      { id: 'C', text: 'Escolhemos métricas-chave, mas reagimos em vez de antecipar.' },
      { id: 'D', text: 'Focamos pesadamente na nossa competência distintiva para dominar o mercado.' }
    ]},
    { id: 14, block: 'ALVOS', text: 'Na hora de gerir clientes, qual é o nível de precisão?', options: [
      { id: 'A', text: 'Tratamos todos os clientes exatamente da mesma forma.' },
      { id: 'B', text: 'Dividimos em blocos demográficos amplos.' },
      { id: 'C', text: 'Identificamos os mais rentáveis e focamos neles.' },
      { id: 'D', text: 'Calculamos propensão de compra e LTV para ofertas hiperpersonalizadas.' }
    ]},
    { id: 15, block: 'ALVOS', text: 'Como vocês precificam produtos ou serviços?', options: [
      { id: 'A', text: 'Baseado no custo mais uma margem, ou copiando o concorrente.' },
      { id: 'B', text: 'Fazemos descontos quando as vendas caem.' },
      { id: 'C', text: 'Usamos planilhas que sugerem faixas de preços sazonais.' },
      { id: 'D', text: 'Otimização algorítmica: precificação dinâmica ajustada à demanda.' }
    ]},
    { id: 16, block: 'ALVOS', text: 'Na hora de inovar, lançar um produto, qual é a base da decisão?', options: [
      { id: 'A', text: 'Palpite do dono ou cópia do mercado.' },
      { id: 'B', text: 'Pesquisas tradicionais e longas reuniões de comitê.' },
      { id: 'C', text: 'Observamos o histórico do que deu certo antes.' },
      { id: 'D', text: 'Simulações profundas, modelagem preditiva e testes rigorosos.' }
    ]},
    // Analistas
    { id: 17, block: 'ANALISTAS', text: 'Quem é o responsável por gerar inteligência competitiva hoje?', options: [
      { id: 'A', text: 'Não temos essa função.' },
      { id: 'B', text: 'Funcionários usando Excel que perdem 80% do tempo arrumando planilhas.' },
      { id: 'C', text: 'Analistas que estão ilhados em departamentos específicos.' },
      { id: 'D', text: 'Um CDAO e equipe centralizada de cientistas de dados altamente capacitados.' }
    ]},
    { id: 18, block: 'ANALISTAS', text: 'Como é o treinamento para letramento em dados (data literacy) da sua equipe?', options: [
      { id: 'A', text: 'Inexistente.' },
      { id: 'B', text: 'Restrito a ensinar a equipe a apertar os botões do sistema.' },
      { id: 'C', text: 'Gestores são treinados para ler indicadores de performance.' },
      { id: 'D', text: 'Constante. Exigimos habilidades numéricas e experimentais desde o recrutamento.' }
    ]},
    { id: 19, block: 'ANALISTAS', text: 'Quais ferramentas a equipe de estratégia utiliza no dia a dia?', options: [
      { id: 'A', text: 'Calculadoras, cadernos e instinto.' },
      { id: 'B', text: 'Excel e funções matemáticas.' },
      { id: 'C', text: 'Ferramentas de Business Intelligence (BI) para relatórios visuais.' },
      { id: 'D', text: 'Softwares predíticos, aprendizado de máquina, R ou Python.' }
    ]},
    { id: 20, block: 'ANALISTAS', text: 'O que acontece quando os dados apresentam um cenário "fora da caixa"?', options: [
      { id: 'A', text: 'Geram desconfiança e são rapidamente engavetados.' },
      { id: 'B', text: 'Acham interessante, mas a empresa não sabe como executar.' },
      { id: 'C', text: 'O RH ou a TI são culpados pelos números.' },
      { id: 'D', text: 'A liderança confia no modelo, ajusta a estratégia e cria novos testes.' }
    ]}
  ]

  const totalQuestions = perguntas.length
  const currentProgress = ((currentQuestion) / totalQuestions) * 100

  const handleAnswerSelect = (optId: string) => {
    setAnswers(prev => ({ ...prev, [perguntas[currentQuestion].id]: optId }))
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }, 200)
  }

  const handleSubmit = async () => {
    setStep('loading')
    const result = await saveDiagnostico(lead, answers)
    if (result.success) {
      setScoreData(result.data)
      setStep('result')
    } else {
      alert('Erro ao salvar. Tente novamente.')
      setStep('quiz')
    }
  }

  const getEstagioNome = (lvl: number) => {
    const list = [
      'Deficientes Analíticos',
      'Empresas de Análise Localizada',
      'Aspirantes Analíticos',
      'Empresas Analíticas',
      'Competidores Analíticos'
    ]
    return list[lvl - 1] || 'Deficientes Analíticos'
  }

  return (
    <div className={styles.container} style={{ minHeight: '100vh', paddingTop: '80px' }}>
      {(step === 'lead' || step === 'quiz' || step === 'loading') && (
        <section className={styles.quizSection}>
          <div className={styles.quizContainer}>
            <div className={styles.progressBar} style={{ width: \`\${currentProgress}%\` }} />
            <AnimatePresence mode='wait'>
              {step === 'lead' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 className={styles.title} style={{ fontSize: '1.5rem', textAlign: 'center' }}>Qualificação do Negócio</h3>
                  <p className={styles.description} style={{ textAlign: 'center' }}>Preencha os dados e entenda seu nível de maturidade analítica.</p>
                  <input className={styles.input} placeholder="Nome Completo" value={lead.nome} onChange={e => setLead(p => ({ ...p, nome: e.target.value }))} />
                  <input className={styles.input} placeholder="Nome da Empresa" value={lead.empresa} onChange={e => setLead(p => ({ ...p, empresa: e.target.value }))} />
                  <input className={styles.input} placeholder="E-mail Corporativo" value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))} />
                  <input className={styles.input} placeholder="WhatsApp" value={lead.whatsapp} onChange={e => setLead(p => ({ ...p, whatsapp: e.target.value }))} />
                  <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('quiz')}>Iniciar Diagnóstico</button>
                </motion.div>
              )}
              {step === 'quiz' && (
                <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', color: '#C8F542', fontSize: '0.75rem' }}>
                    <span>{perguntas[currentQuestion].block}</span>
                    <span>{currentQuestion + 1} / {totalQuestions}</span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4 }}>{perguntas[currentQuestion].text}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {perguntas[currentQuestion].options.map((opt) => (
                      <button key={opt.id} className={\`\${styles.optionCard} \${answers[perguntas[currentQuestion].id] === opt.id ? styles.optionCardActive : ''}\`} onClick={() => handleAnswerSelect(opt.id)}>
                        <span style={{ color: '#C8F542', fontWeight: 800, marginRight: '8px' }}>{opt.id})</span> {opt.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 'loading' && (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <div style={{ border: '4px solid #1F242D', borderTopColor: '#C8F542', width: '40px', height: '40px', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }} />
                  <p className={styles.description}>Processando inteligência analítica com Davenport e Harris...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {step === 'result' && scoreData && (
        <section className={styles.quizSection}>
          <div className={styles.quizContainer} style={{ maxWidth: '800px', textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center', textAlign: 'left' }}>
              <div>
                <div className={styles.pulseMeter} style={{ margin: '0 0 20px 0' }}>{scoreData.score.toFixed(1)}</div>
                <h2 className={styles.title} style={{ color: '#C8F542', fontSize: '1.8rem' }}>{getEstagioNome(scoreData.estagio)}</h2>
                <p className={styles.description} style={{ marginBottom: '20px' }}>O algoritmo calculou a postura de dados da sua empresa e localizou o seu nível.</p>
              </div>
              <div style={{ width: '100%', height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
                <svg width="220" height="220" viewBox="0 0 220 220" style={{ margin: '0 auto' }}>
                  <polygon points="110,20 190,70 160,160 60,160 30,70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <polygon points="110,40 170,80 145,150 75,150 50,80" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <polygon points="110,48 165,85 140,145 80,135 60,78" fill="rgba(200,245,66,0.15)" stroke="#C8F542" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className={styles.statsGrid} style={{ marginTop: '30px' }}>
              <div className={styles.statCard} style={{ borderLeft: '4px solid #C8F542' }}>
                <div style={{ color: '#C8F542', fontWeight: 800 }}>Ponto Focal de Risco</div>
                <div style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: 700, margin: '8px 0' }}>{scoreData.area_dor}</div>
              </div>
            </div>
            <div style={{ marginTop: '30px', background: '#111318', padding: '24px', borderRadius: '12px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.03)' }}>
              <h4 style={{ color: '#C8F542', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}> <ShieldCheck size={18} /> Recomendação Estratégica ARKOS:</h4>
              <div style={{ background: '#1F242D', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #C8F542' }}>
                <p style={{ color: '#8A8F99', fontSize: '0.85rem', lineHeight: '1.5' }}>Descubra como estruturar sua empresa baseada em inteligência.</p>
              </div>
              <button className={styles.btnPrimary} style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }} onClick={() => window.open('https://wa.me/5583981957737')}>
                Agende uma mentoria
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
\`;

const targetDir = path.dirname(pagePath);
if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}
fs.writeFileSync(pagePath, pageContent, 'utf-8');
console.log("Created standalone page: " + pagePath);

// 2. Refactor DiagnosticoHub.tsx to strip conditions and add Link
let hub = hubContent;

// Update button to Link component
hub = hub.replace(
    `<button className={styles.btnLargeHero} onClick={() => setStep('lead')}>`,
    `import Link from 'next/link';\n            <Link href="/diagnostico" className={styles.btnLargeHero}>`
);
hub = hub.replace(`</button>`, `</Link>`);

// Fix standard imports missing at top framing node 
if (!hub.includes(`import Link from 'next/link'`)) {
    hub = hub.replace(`import { useState } from 'react'`, `import { useState } from 'react'\nimport Link from 'next/link'`);
    // Cleanup internal inline import placed inside node list 
    hub = hub.replace(`import Link from 'next/link';\n            <Link`, `<Link`);
}

// Strip Quiz and Result rendering sections 282-417 
const searchStrip = hub.indexOf(`{/* ── SEÇÃO 3: QUIZ OU LEAD ── */}`);
const endStrip = hub.lastIndexOf(`{/* ── VISÃO DO RESULTADO ── */}`);

if (searchStrip !== -1) {
    console.log("Stripping bottom blocks for Quiz...");
    let topPart = hub.substring(0, searchStrip);
    let bottomPart = "    </div>\n  )\n}"; // closing tag layouts
    hub = topPart + bottomPart;
}

fs.writeFileSync(hubPath, hub, 'utf-8');
console.log("Done refactoring DiagnosticoHub.tsx.");
