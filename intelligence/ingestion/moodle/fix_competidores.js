const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'CompetidoresSeccion.tsx');

if (!fs.existsSync(filePath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

if (lines.length > 26) {
    const line27 = lines[26];
    if (line27.includes("O BENCHMARK MÁXIMO") && line27.includes("position: 'absolute'")) {
        console.log("Found pattern on line 27");
        if (line27.includes("</div><div style")) {
            const parts = line27.split("</div><div style");
            lines[26] = parts[0] + "</div>";
            console.log("Updated line 27");
            
            // Remove lines 28 to 34 (indices 27 to 33 inclusive)
            for (let i = 27; i < 34; i++) {
                 if (i < lines.length) {
                      lines[i] = "";
                 }
            }
            
            fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
            console.log("Successfully updated file.");
        } else {
             console.log("Could not split line 27 accurately.");
        }
    } else {
         console.log("Pattern not found on line 27.");
    }
} else {
    console.log("File too short.");
}
