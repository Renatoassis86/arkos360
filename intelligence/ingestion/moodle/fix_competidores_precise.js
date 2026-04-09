const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'CompetidoresSeccion.tsx');

if (!fs.existsSync(filePath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.replace(/\r\n/g, '\n').split('\n');

// 1. Insert Video if not exists
const videoCode = `              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.4, overflow: 'hidden', borderRadius: '16px' }}>
                <iframe 
                  src="https://www.youtube.com/embed/GV3HUDMQ-F8?autoplay=1&mute=1&controls=0&loop=1&playlist=GV3HUDMQ-F8&modestbranding=1&rel=0" 
                  style={{ width: '100%', height: '100%', transform: 'scale(1.35)', border: 'none', pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }}
                  allow="autoplay; encrypted-media"
                />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, transparent, rgba(17,19,24,0.95))' }}></div>
              </div>`;

let hasVideo = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("https://www.youtube.com/embed/GV3HUDMQ-F8")) {
         hasVideo = true;
         break;
    }
}

if (!hasVideo) {
    console.log("Inserting video background...");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("background: 'linear-gradient(135deg, rgba(200,245,66,0.02)") && lines[i].includes("<div")) {
             lines.splice(i + 1, 0, videoCode);
             break;
        }
    }
} else {
    console.log("Video already inserted, skipping video part.");
}

// 2. Replace Bottom Organization Array Loop
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("name: 'Amazon'") && lines[i].includes("text: 'Utiliza técnicas")) {
        startIndex = i - 1; // It should be {[ above the array
        break;
    }
}

if (startIndex !== -1) {
    for (let i = startIndex + 1; i < lines.length; i++) {
        if (lines[i].includes("}")) { // Look for the end of the map line map((c) => ( div ))
            if (lines[i].includes("))}")) {
                endIndex = i;
                break;
            }
        }
    }
}

console.log("Start Index Array: ", startIndex, " End Index: ", endIndex);

if (startIndex !== -1 && endIndex !== -1) {
     const replacementBlock = `              {[
                { name: 'Amazon', logo: '/logos/amazon.png', text: 'A <strong>Amazon</strong> utiliza técnicas avançadas de otimização em tempo real e aprendizado de máquina em toda a sua cadeia de suprimentos para gerenciar estoques com base na incerteza da demanda.' },
                { name: 'Capital One', logo: '/logos/capital_one.png', text: 'A <strong>Capital One</strong> é pioneira em "estratégias baseadas em informações", conduzindo cerca de 8.000 testes de marketing por ano para atrair clientes lucrativos com precisão.' },
                { name: 'Google', logo: '/logos/google.png', text: 'O <strong>Google</strong> aplica o rigor analítico a algoritmos de busca e ao "People Operations", utilizando ciência de dados para formar melhores líderes e estratégias de retenção.' },
                { name: 'Walmart', logo: '/logos/walmart.png', text: 'O <strong>Walmart</strong> é referência em supply-chain, compartilhando dados em tempo real com 60 mil fornecedores via Retail Link, prevendo demandas sazonais ou atípicas.' },
                { name: 'UPS', logo: '/logos/ups.png', text: 'A <strong>UPS</strong> investiu no sistema ORION, que otimiza rotas de 55 mil motoristas diariamente, gerando economia de centenas de milhões de dólares ao ano.' },
                { name: 'Caesars Entertainment', logo: '/logos/caesars.png', text: 'A <strong>Caesars Entertainment</strong> revolucionou o setor de cassinos fidelizando clientes por meio de análise de dados no ponto de venda para ofertas personalizadas.' },
                { name: 'Progressive', logo: '/logos/progressive.png', text: 'A <strong>Progressive</strong> destaca-se pelo programa Snapshot, precificando seguros dinamicamente ao coletar dados reais sobre como o cliente dirige.' },
                { name: 'Times Esportivos (Patriots)', logo: '/logos/patriots.png', text: 'Os <strong>Patriots</strong> e Oakland A\\'s utilizam estatística avançada para montar equipes e definir jogadas, avaliando a psicologia dos atletas.' }
              ].map((c) => (
                 <div key={c.name} style={{ background: '#111318', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <img src={c.logo} style={{ height: '40px', width: 'fit-content', filter: 'none', opacity: 1.0, objectFit: 'contain' }} alt={c.name} />
                    <div>
                      <p style={{ color: '#8A8F99', fontSize: '0.8rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: c.text }} />
                    </div>
                 </div>
              ))`;

     lines.splice(startIndex, (endIndex - startIndex) + 1, replacementBlock);
     fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
     console.log("Successfully updated CompetidoresSeccion array loop.");
} else {
     console.log("Could not update CompetidoresSeccion array bounds.");
}
