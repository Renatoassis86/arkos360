const fs = require('fs');
const path = require('path');

const hubPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'DiagnosticoHub.tsx');
const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'diagnostico', 'page.tsx');

if (!fs.existsSync(hubPath)) {
  console.log("DiagnosticoHub.tsx not found!");
  process.exit(1);
}

const hubContent = fs.readFileSync(hubPath, 'utf-8');

const startStr = 'const perguntas = [';
const endStr = 'const totalQuestions = perguntas.length';

const startIndex = hubContent.indexOf(startStr);
const endIndex = hubContent.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find start or end index for array inside hubContent!");
  process.exit(1);
}

const accurateArray = hubContent.substring(startIndex, endIndex);

let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Find the section that covers local short layout target nodes
const localStart = pageContent.indexOf('const perguntas = [');
const localEnd = pageContent.indexOf('const totalQuestions =');

if (localStart !== -1 && localEnd !== -1) {
  const top = pageContent.substring(0, localStart);
  const bottom = pageContent.substring(localEnd);
  pageContent = top + accurateArray + bottom;
  
  fs.writeFileSync(pagePath, pageContent, 'utf-8');
  console.log("Replaced layout with accurate 20 parameters sequence successfully on standalone page!");
} else {
  console.log("Target pattern not found in standalone page.");
}
