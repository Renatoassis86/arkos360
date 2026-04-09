import os

filepath = r'd:\repositorio_geral\app_gestao_contratos\src\components\CompetidoresSeccion.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_grid_content = """            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Amazon', logo: '/amazon_logo_1774226927016.png', text: 'Utiliza técnicas avançadas de otimização em tempo real e aprendizado de máquina em toda a sua cadeia de suprimentos para gerenciar estoques com base na incerteza da demanda.' },
                { name: 'Capital One', logo: '/capital_one_logo_1774226915516.png', text: 'Pioneira em "estratégias baseadas em informações", conduz cerca de 8.000 testes de marketing por ano para atrair clientes lucrativos com precisão.' },
                { name: 'Google', logo: '/google_logo_1774223514822.png', text: 'Aplica o rigor analítico a algoritmos de busca e ao "People Operations", utilizando ciência de dados para formar melhores líderes e estratégias de retenção.' },
                { name: 'Walmart', logo: '/walmart_logo_wm_1774224400966.png', text: 'Referência em supply-chain, compartilha dados em tempo real com 60 mil fornecedores via Retail Link, prevendo demandas sazonais ou atípicas (como furacões).' },
                { name: 'UPS', logo: '/ups_logo_1774225354790.png', text: 'Investiu no sistema ORION, que otimiza rotas de 55 mil motoristas diariamente, gerando economia de centenas de milhões de dólares ao ano em combustível.' },
                { name: 'Caesars Entertainment', logo: '/caesars_logo_1774222462389.png', text: 'Revolucionou o setor de cassinos fidelizando clientes por meio de análise de dados no ponto de venda para ofertas personalizadas em tempo real.' },
                { name: 'Progressive', logo: '/progressive_logo_1774226810879.png', text: 'Destaca-se pelo program Snapshot, precificando seguros dinamicamente ao coletar dados reais sobre como o cliente dirige (velocidade, freadas).' },
                { name: 'Times Esportivos (Patriots)', logo: '/patriots_logo_final_1774222536717.png', text: 'Patriots e Oakland A\\'s utilizam estatística avançada para montar equipes e definir jogadas, avaliando a psicologia e força mental dos atletas.' }
              ].map((c) => (
                 <div key={c.name} style={{ background: '#111318', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <img src={c.logo} style={{ height: '32px', width: 'fit-content', filter: 'brightness(0) invert(1)', opacity: 0.8, objectFit: 'contain' }} alt={c.name} />
                    <div>
                      <div style={{ color: '#F4F2ED', fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>{c.name}</div>
                      <p style={{ color: '#8A8F99', fontSize: '0.8rem', lineHeight: '1.5' }}>{c.text}</p>
                    </div>
                 </div>
              ))}
            </div>"""

# I need to find the lines for the broken block 
# It starts roughly around line 152 after '<p style={{ color: \'#8A8F99\'...'
full_text = "".join(lines)

import re
# Use Regex to match the whole broken section from <div style={{ display: 'grid' to the end of that direct .map grid list before </div>
pattern = r"<div style={{ display: 'grid', gridTemplateColumns: 'repe.*?</div>"

fixed_text = re.sub(pattern, new_grid_content, full_text, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(fixed_text)

print("Grid updated successfully!")
