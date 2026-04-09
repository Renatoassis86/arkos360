const fs = require('fs');
const path = require('path');

const hubCss = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'DiagnosticoHub.module.css');
const pageCss = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'page.module.css');

const hubAppend = `
@media (max-width: 768px) {
  .title { font-size: 1.8rem !important; }
  .pulseMeter { width: 100px; height: 100px; font-size: 2rem; }
  .btnLargeHero { padding: 14px 32px; font-size: 1.1rem; }
  .stairVector { width: 150px !important; height: 60px !important; display: flex; align-items: center; justify-content: center; }
  .stairIndex { position: relative; top: -10px !important; right: auto !important; left: 12px !important; margin: 0; }
  .btnPrimary { width: 100% !important; justify-content: center; }
}
`;

const pageAppend = `
@media (max-width: 768px) {
  .solucaoHero h2, .resultadosHero h2, .camadasHero h2, .doresHero h2 { font-size: 1.8rem !important; }
  .btnLargeHero { padding: 14px 32px; font-size: 1rem !important; }
  .statsGrid { grid-template-columns: 1fr !important; }
  .compMegaRow { grid-template-columns: 1fr !important; }
  .resultadosGridMetrics { grid-template-columns: 1fr !important; }
}
`;

if (fs.existsSync(hubCss)) {
    fs.appendFileSync(hubCss, hubAppend);
    console.log("Appended styles to DiagnosticoHub.module.css");
}

if (fs.existsSync(pageCss)) {
    fs.appendFileSync(pageCss, pageAppend);
    console.log("Appended styles to page.module.css");
}

console.log("Responsive styling appends complete.");
