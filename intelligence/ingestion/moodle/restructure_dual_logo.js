const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'CompetidoresSeccion.tsx');

if (!fs.existsSync(filePath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update UPS image link to .svg 
content = content.replace("logo: '/logos/ups.png'", "logo: '/logos/ups.svg'");

// 2. Update Times Esportivos to array of logos
content = content.replace(
    `{ name: 'Times Esportivos (Patriots)', logo: '/logos/patriots.svg'`, 
    `{ name: 'Times Esportivos (Patriots)', logo: ['/logos/patriots.svg', '/logos/oakland_as.svg']`
);

// 3. Update img tag to support arrays and handle maxWidth for Progressive
const targetImgNode = `<img src={c.logo} style={{ height: '40px', width: 'fit-content', filter: 'brightness(0) invert(1)', opacity: 1.0, objectFit: 'contain' }} alt={c.name} />`;

const replacementImgNode = `<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                       {Array.isArray(c.logo) ? (
                           c.logo.map((l, i) => (
                               <img key={i} src={l} style={{ height: '40px', width: 'fit-content', maxWidth: '140px', filter: 'brightness(0) invert(1)', opacity: 1.0, objectFit: 'contain' }} alt={c.name} />
                           ))
                       ) : (
                           <img src={c.logo} style={{ height: '40px', width: 'fit-content', maxWidth: '140px', filter: 'brightness(0) invert(1)', opacity: 1.0, objectFit: 'contain' }} alt={c.name} />
                       )}
                    </div>`;

if (content.includes(targetImgNode)) {
    content = content.replace(targetImgNode, replacementImgNode);
    console.log("Successfully updated image node layout!");
} else {
    console.log("Target image node layout did not match exactly, using fallback injection.");
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("CompetidoresSeccion updated perfectly.");
