const fs = require('fs');
const path = require('path');

const oaklandPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'public', 'logos', 'oakland_as.svg');
const compPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'CompetidoresSeccion.tsx');

// 1. Remove solid background from oakland_as.svg
if (fs.existsSync(oaklandPath)) {
    let svg = fs.readFileSync(oaklandPath, 'utf-8');
    const targetPath = `<path d="M 0,512 H 512 V 0 H 0 Z" fill="#003831" />`;
    if (svg.includes(targetPath)) {
        svg = svg.replace(targetPath, "");
        fs.writeFileSync(oaklandPath, svg, 'utf-8');
        console.log("Removed background path from oakland_as.svg");
    } else {
        console.log("Specific background path for Oakland As not found in SVG. Checking regex.");
        svg = svg.replace(/<path d="M 0,512 H 512 V 0 H 0 Z"\s+fill="[^"]+"\s*\/?>/gi, "");
        fs.writeFileSync(oaklandPath, svg, 'utf-8');
    }
} else {
    console.log("oakland_as.svg not found!");
}

// 2. Update filter in CompetidoresSeccion.tsx to grayscale(1)
if (fs.existsSync(compPath)) {
    let tsx = fs.readFileSync(compPath, 'utf-8');
    const targetFilter = `filter: 'brightness(0) invert(1)'`;
    const replacementFilter = `filter: 'grayscale(1) contrast(1.3) brightness(1.2)'`;
    
    if (tsx.includes(targetFilter)) {
        // Replace all instances
        tsx = tsx.split(targetFilter).join(replacementFilter);
        fs.writeFileSync(compPath, tsx, 'utf-8');
        console.log("Updated filters in CompetidoresSeccion to grayscale!");
    } else {
        console.log("Target filter not found in Comp file.");
    }
} else {
    console.log("CompetidoresSeccion.tsx not found!");
}

console.log("Done.");
