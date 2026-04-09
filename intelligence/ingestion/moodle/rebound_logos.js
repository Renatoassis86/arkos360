const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'CompetidoresSeccion.tsx');

if (!fs.existsSync(filePath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

// 1. Switch extensions to .svg for relevant files in array
const replacements = [
    { from: '/logos/capital_one.png', to: '/logos/capital_one.svg' },
    { from: '/logos/walmart.png', to: '/logos/walmart.svg' },
    { from: '/logos/caesars.png', to: '/logos/caesars.svg' },
    { from: '/logos/progressive.png', to: '/logos/progressive.svg' },
    { from: '/logos/patriots.png', to: '/logos/patriots.svg' }
];

replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
});

// 2. Change image filter to brightness(0) invert(1)
const targetImgLine = `style={{ height: '40px', width: 'fit-content', filter: 'none', opacity: 1.0, objectFit: 'contain' }}`;
const replacementImgLine = `style={{ height: '40px', width: 'fit-content', filter: 'brightness(0) invert(1)', opacity: 1.0, objectFit: 'contain' }}`;

if (content.includes(targetImgLine)) {
    content = content.replace(targetImgLine, replacementImgLine);
    console.log("Successfully updated image tag filters!");
} else {
    console.log("Target img line not explicitly matched. Using regex fallback.");
    content = content.replace(/filter:\s*'none'/g, "filter: 'brightness(0) invert(1)'");
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Done updating CompetidoresSeccion.");
