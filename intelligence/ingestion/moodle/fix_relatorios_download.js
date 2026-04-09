const fs = require('fs');
const path = require('path');

const relatoriosPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'dashboard', 'documentos', 'alunos', 'relatorios', 'page.tsx');

if (fs.existsSync(relatoriosPath)) {
    let content = fs.readFileSync(relatoriosPath, 'utf-8');
    
    const oldFnRegex = /const handleExport = \(\) => \{([\s\S]*?)const encodedUri = encodeURI\(csvContent\)([\s\S]*?)\}[\s\S]*?const link = document\.createElement\("a"\)[\s\S]*?link\.click\(\)/m;

    const oldFnPattern = `  const handleExport = () => {
    // Adicionar BOM (\\uFEFF) para garantir que o Excel abra com codificação UTF-8 correta (sem acentos corrompidos)
    let csvContent = "\\uFEFFdata:text/csv;charset=utf-8,"
    
    // Alinhar os títulos das colunas com os nomes das variáveis do Moodle
    const headers = availableColumns
      .filter(c => selectedColumns.includes(c.id))
      .map(c => c.label.toUpperCase()) // Pode ser ajustado para c.id se quiserem a tag exata
      .join(",")
    csvContent += headers + "\\n"

    filteredAlunos.forEach(aluno => {
      const row = availableColumns
        .filter(c => selectedColumns.includes(c.id))
        .map(c => {
          const val = aluno[c.id]
          if (typeof val === 'object') return \`"\${JSON.stringify(val).replace(/"/g, '""')}"\`
          return \`"\${String(val || '').replace(/"/g, '""')}"\`
        })
        .join(",")
      csvContent += row + "\\n"
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", \`relatorio_moodle_curso_\${selectedCourse}.csv\`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }`;

    const newFn = `  const handleExport = () => {
    const headers = availableColumns
      .filter(c => selectedColumns.includes(c.id))
      .map(c => c.label.toUpperCase())
      .join(",")
    let csvContent = headers + "\\n"

    filteredAlunos.forEach(aluno => {
      const row = availableColumns
        .filter(c => selectedColumns.includes(c.id))
        .map(c => {
          const val = aluno[c.id]
          if (typeof val === 'object') return \`"\${JSON.stringify(val).replace(/"/g, '""')}"\`
          return \`"\${String(val || '').replace(/"/g, '""')}"\`
        })
        .join(",")
      csvContent += row + "\\n"
    })

    const blob = new Blob(["\\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", \`relatorio_moodle_curso_\${selectedCourse}.csv\`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }`;

    if (content.includes(oldFnPattern)) {
        content = content.replace(oldFnPattern, newFn);
        fs.writeFileSync(relatoriosPath, content, 'utf-8');
        console.log("handleExport in relatorios/page.tsx successfully patched with Blob.");
    } else {
        console.log("Could not find exact oldFnPattern match in relatorios/page.tsx");
    }
}
