const fs = require('fs');
const path = require('path');

const diagPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'diagnostico', 'page.tsx');

if (fs.existsSync(diagPath)) {
    let diag = fs.readFileSync(diagPath, 'utf-8');
    
    // 1. Update getEstagioNome logic
    const oldFn = `  const getEstagioNome = (score: number) => {
    if (score >= 3.9) return { nome: 'Estágio 5: Competidores Analíticos', target: 'Arkos Systems' }
    if (score >= 3.5) return { nome: 'Estágio 4: Empresas Analíticas', target: 'Arkos Market Intelligence' }
    if (score >= 2.7) return { nome: 'Estágio 3: Aspirantes Analíticos', target: 'Arkos Data' }
    if (score >= 1.9) return { nome: 'Estágio 2: Análise Localizada', target: 'Arkos Academy' }
    return { nome: 'Estágio 1: Deficientes Analíticos', target: 'Arkos Strategy' }
  }`;

    const newFn = `  const getEstagioNome = (score: number) => {
    if (score >= 3.9) return { nome: 'Estágio 5: Competidores Analíticos', img: '/arkos_diagnostico_e5_1774345637269.png' }
    if (score >= 3.5) return { nome: 'Estágio 4: Empresas Analíticas', img: '/arkos_diagnostico_e4_1774345618307.png' }
    if (score >= 2.7) return { nome: 'Estágio 3: Aspirantes Analíticos', img: '/arkos_diagnostico_e3_1774345596147.png' }
    if (score >= 1.9) return { nome: 'Estágio 2: Análise Localizada', img: '/arkos_diagnostico_e2_1774345580705.png' }
    return { nome: 'Estágio 1: Deficientes Analíticos', img: '/arkos_diagnostico_e1_1774345563597.png' }
  }`;

    if (diag.includes(oldFn)) {
        diag = diag.replace(oldFn, newFn);
    }

    // 2. Update step === 'result' layout
    const oldResultRegex = /\{step === 'result' && scoreData && \([\s\S]*?className=\{styles\.quizSection\}[\s\S]*?<\/motion\.div>\s*\)\}/m;

    const newResult = `{step === 'result' && scoreData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.quizSection} style={{ maxWidth: '960px', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', background: '#111318', border: '1px solid #1F242D', padding: '40px', borderRadius: '16px', textAlign: 'left' }}>
              
              {/* Left Side: Results */}
              <div style={{ flex: 1 }}>
                <Trophy size={48} color="#C8F542" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '1.4rem', color: '#F4F2ED', marginBottom: '8px' }}>Resultado do Diagnóstico</h2>
                
                <div className={styles.pulseMeter} style={{ color: '#C8F542', borderColor: '#C8F542', margin: '0 0 16px 0', width: '60px', height: '60px', fontSize: '1.5rem', lineHeight: '60px' }}>
                  {scoreData.score.toFixed(1)}
                </div>

                <h3 style={{ fontSize: '1.5rem', color: '#C8F542', fontWeight: 800, marginBottom: '24px' }}>
                  {getEstagioNome(scoreData.score).nome}
                </h3>

                <div style={{ background: '#1F242D', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ color: '#8A8F99', fontSize: '0.85rem', marginBottom: '4px' }}>Maior gargalo estratégico:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F4F2ED', fontWeight: 700 }}>
                    <AlertTriangle size={20} color="#C8F542" /> {scoreData.gargalo}
                  </div>
                </div>

                <div style={{ background: '#1F242D', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(200,245,66,0.1)' }}>
                  <p style={{ color: '#C8F542', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px' }}>RECOMENDAÇÃO:</p>
                  <p style={{ color: '#F4F2ED', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {scoreData.gargalo === 'DADOS' && '🚀 Arkos Platform & Arkos Data'}
                    {(scoreData.gargalo === 'LIDERANÇA' || scoreData.gargalo === 'ANALISTAS') && '🎓 Arkos Academy & Arkos Strategy'}
                    {(scoreData.gargalo === 'EMPREENDIMENTO' || scoreData.gargalo === 'ALVOS') && '💼 Arkos Systems & Arkos Market Intelligence'}
                  </p>
                  <p style={{ color: '#8A8F99', fontSize: '0.8rem', lineHeight: '1.5' }}>
                    Esta solução foi selecionada para atuar na raiz do seu gargalo e acelerar sua jornada rumo ao Estágio 5.
                  </p>
                </div>

                <Link href="/solucoes" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                  Conheça as Soluções no Hub Arkos
                </Link>

                {/* Botão de Voltar para Home */}
                <Link href="/" style={{ display: 'block', marginTop: '16px', color: '#8A8F99', textDecoration: 'none', fontSize: '0.85rem', textAlign: 'center' }}>
                  ← Voltar para a tela principal
                </Link>
              </div>

              {/* Right Side: Round Image representing the Stage */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={getEstagioNome(scoreData.score).img} 
                  alt={getEstagioNome(scoreData.score).nome} 
                  style={{ width: '100%', maxWidth: '420px', height: 'auto', borderRadius: '24px', objectFit: 'cover', aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.05)' }} 
                />
              </div>

            </div>
          </motion.div>
        )}`

    if (oldResultRegex.test(diag)) {
        diag = diag.replace(oldResultRegex, newResult);
        fs.writeFileSync(diagPath, diag, 'utf-8');
        console.log("Diag results page side-by-side view successfully appended!");
    } else {
        console.log("Could not match the old Result block regex.");
    }
}
