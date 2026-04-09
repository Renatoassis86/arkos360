const fs = require('fs');
const path = require('path');

const hubPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'DiagnosticoHub.tsx');
const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'page.tsx');
const hubCss = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'components', 'DiagnosticoHub.module.css');

// 1. Revert staircase index width to px
if (fs.existsSync(hubPath)) {
    let hub = fs.readFileSync(hubPath, 'utf-8');
    const targetWidth = `style={{ width: \`\${30 + item.lvl * 12}%\` }}`;
    const replacementWidth = `style={{ width: \`\${200 + item.lvl * 50}px\` }}`;
    
    if (hub.includes(targetWidth)) {
        hub = hub.replace(targetWidth, replacementWidth);
    }
    
    // Ensure the button strictly uses target="_blank"
    hub = hub.replace(
        `<Link href="/diagnostico" className={styles.btnLargeHero}>`,
        `<Link href="/diagnostico" className={styles.btnLargeHero} target="_blank">`
    );
    
    fs.writeFileSync(hubPath, hub, 'utf-8');
    console.log("Reverted stair width and appended target_blank on Diagnostics button.");
}

// 2. Remove Poster fallback image from Video inside page.tsx Solução section 
if (fs.existsSync(pagePath)) {
    let page = fs.readFileSync(pagePath, 'utf-8');
    const posterTarget = `poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"`;
    
    if (page.includes(posterTarget)) {
        page = page.replace(posterTarget, "");
    }
    
    const hrefTarget = `href="#diagnostico"`;
    if (page.includes(hrefTarget)) {
        page = page.split(hrefTarget).join(`href="/diagnostico" target="_blank"`);
        console.log("Updated navbar and footer item anchors to standalone isolated page.");
    }
    
    fs.writeFileSync(pagePath, page, 'utf-8');
}

console.log("Clean-up refactors complete.");
