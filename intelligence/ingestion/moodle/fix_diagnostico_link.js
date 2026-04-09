const fs = require('fs');
const path = require('path');

const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'page.tsx');

if (fs.existsSync(pagePath)) {
    let page = fs.readFileSync(pagePath, 'utf-8');
    
    // Smooth simple split-join that NEVER fails syntax on Windows paths offsets
    const hrefTarget = 'href="#diagnostico"';
    
    if (page.includes(hrefTarget)) {
        page = page.split(hrefTarget).join('href="/diagnostico" target="_blank"');
        fs.writeFileSync(pagePath, page, 'utf-8');
        console.log("Navbar and Hero links pointing to standpoint isolated page successfully updated!");
    } else {
        console.log("No links with href=#diagnostico found in page.tsx right now.");
    }
} else {
    console.log("page.tsx not found on target path.");
}
