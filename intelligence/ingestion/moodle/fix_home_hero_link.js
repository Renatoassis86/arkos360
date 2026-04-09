const fs = require('fs');
const path = require('path');

const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'page.tsx');
const diagPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'diagnostico', 'page.tsx');

// 1. Fix Home Hero Link
if (fs.existsSync(pagePath)) {
    let page = fs.readFileSync(pagePath, 'utf-8');
    const searchTarget = '<Link href="#diagnostico" className={styles.btnLargeHero}';
    const replaceWith = '<Link href="/diagnostico" className={styles.btnLargeHero} target="_blank"';
    
    if (page.includes(searchTarget)) {
        page = page.replace(searchTarget, replaceWith);
        fs.writeFileSync(pagePath, page, 'utf-8');
        console.log("Hero Link successfully updated on page.tsx");
    } else {
        console.log("Hero link target string not found on page.tsx");
    }
}

// 2. Enhance Recommendations on /diagnostico/page.tsx
if (fs.existsSync(diagPath)) {
    let diag = fs.readFileSync(diagPath, 'utf-8');
    
    // Find the scoreData.gargalo block
    const anchorStr = '                  <AlertTriangle size={20} color="#C8F542" /> {scoreData.gargalo}\n                }</div>';
    
    const insertStr = `                  <AlertTriangle size={20} color="#C8F542" /> {scoreData.gargalo}
                </div>
              </div>

              <div style={{ background: '#1F242D', padding: '24px', borderRadius: '12px', marginBottom: '30px', textAlign: 'left', border: '1px solid rgba(200,245,66,0.1)' }}>
                <p style={{ color: '#C8F542', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>RECOMENDAÇÃO ARKOS:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ color: '#F4F2ED', fontSize: '1.2rem', fontWeight: 700 }}>
                    {scoreData.gargalo === 'DADOS' && '🚀 Arkos Platform & Arkos Data'}
                    {(scoreData.gargalo === 'LIDERANÇA' || scoreData.gargalo === 'ANALISTAS') && '🎓 Arkos Academy & Arkos Strategy'}
                    {(scoreData.gargalo === 'EMPREENDIMENTO' || scoreData.gargalo === 'ALVOS') && '💼 Arkos Systems & Arkos Market Intelligence'}
                  </p>
                  <p style={{ color: '#8A8F99', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Esta solução foi selecionada estrategicamente para atuar na raiz do seu maior gargalo e acelerar sua jornada rumo ao Estágio 5 de Competitividade Analítica.
                  </p>
                </div>`;
                
    if (diag.includes(anchorStr)) {
        diag = diag.replace(anchorStr, insertStr);
        fs.writeFileSync(diagPath, diag, 'utf-8');
        console.log("Recommendations UI successfully appended to diagnostics page.tsx");
    } else {
        console.log("Anchor string for recommendations not found in diagnostics page.tsx");
    }
}

console.log("Updates complete.");
