const fs = require('fs');
const path = require('path');

const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'page.tsx');

if (fs.existsSync(pagePath)) {
    let page = fs.readFileSync(pagePath, 'utf-8');
    
    // Using Regex to bypass spacing inconsistencies safely
    const regex = /<Link\s+href=["']#diagnostico["']\s+className={styles\.btnLargeHero}/g;
    
    if (regex.test(page)) {
        page = page.replace(regex, '<Link href="/diagnostico" className={styles.btnLargeHero} target="_blank"');
        fs.writeFileSync(pagePath, page, 'utf-8');
        console.log("Regex Replacement Succeeded. Hero link is fully accurate with target_blank");
    } else {
        console.log("Regex Target NOT Found in page.tsx. Let us verify file strings.");
        // Let's print out around line 187 so we can read exact syntax if it fails.
        const lines = page.split('\n');
        for (let i = 175; i < 195; i++) {
            if (lines[i]) console.log((i+1) + ': ' + lines[i].trim());
        }
    }
}
