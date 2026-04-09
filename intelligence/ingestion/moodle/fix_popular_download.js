const fs = require('fs');
const path = require('path');

const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'dashboard', 'templates', 'popular', '[id]', 'page.tsx');

if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf-8');
    
    // 1. Fix handleDownloadTemplate with \uFEFF BOM and Blob
    const oldFn = `  const handleDownloadTemplate = () => {
    // Gerar um CSV simples com os cabeçalhos das variáveis do template
    let headers = fields.map(f => f.rotulo)
    
    // Se houver disciplinas carregadas, adicioná-las aos cabeçalhos
    if (dbDisciplines.length > 0) {
      dbDisciplines.forEach(d => {
        headers.push(\`NOTA_\${d.nome.toUpperCase().replace(/\\s+/g, '_')}\`)
      })
    }

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\\n"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", \`modelo_\${template?.titulo || 'documento'}.csv\`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }`;

    const newFn = `  const handleDownloadTemplate = () => {
    let headers = fields.map(f => f.rotulo || f.chave_tag)
    if (dbDisciplines.length > 0) {
      dbDisciplines.forEach(d => {
        headers.push(\`NOTA_\${d.nome.toUpperCase().replace(/\\s+/g, '_')}\`)
      })
    }

    // Add \uFEFF BOM starting text string to enforce strict UTF-8 CSV parsing in Microsoft Excel Windows
    const csvContent = "\\uFEFF" + headers.join(',') + "\\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", \`modelo_\${template?.titulo || 'documento'}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }`;

    if (content.includes(oldFn)) {
        content = content.replace(oldFn, newFn);
        console.log("handleDownloadTemplate successfully patched with BOM.");
    }

    // 2. Fix potential temp.corpo_template.match() crash
    const oldMatch = `          const matches = temp.corpo_template.match(/\\{\\{([^}]+)\\}\\}/g) || []`;
    const newMatch = `          const matches = temp.corpo_template ? (temp.corpo_template.match(/\\{\\{([^}]+)\\}\\}/g) || []) : []`;

    if (content.includes(oldMatch)) {
        content = content.replace(oldMatch, newMatch);
        console.log("Fallback body template match successfully guarded.");
    } else {
        // Double check regex in case formatting is different
        const genericMatch = /const matches = temp\.corpo_template\.match\([\s\S]*?\)\s*\|\|\s*\[\]/;
        if (genericMatch.test(content)) {
            content = content.replace(genericMatch, `const matches = temp.corpo_template ? (temp.corpo_template.match(/\\{\\{([^}]+)\\}\\}/g) || []) : []`);
             console.log("Fallback body template match generic successfully guarded.");
        }
    }

    fs.writeFileSync(pagePath, content, 'utf-8');
} else {
    console.log("Page path not found for popular/[id]/page.tsx");
}
