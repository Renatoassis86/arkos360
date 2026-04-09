const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/app/page.tsx',
  'src/app/dashboard/templates/novo/page.tsx',
  'src/app/dashboard/documentos/alunos/manual/page.tsx'
];

filesToClean.forEach(fileRelPath => {
    const filePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', ...fileRelPath.split('/'));
    if (!fs.existsSync(filePath)) {
        console.log(`File omit: ${fileRelPath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    
    // We replace ** within JSX text that is surrounded by regular string content.
    // Replace universally in these specific template pages is safe if they are all view files.
    // Replace `\*\*` with absolute empty string
    const updatedContent = content.replace(/\*\*/g, '');

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`Successfully cleaned asterisks from: ${fileRelPath}`);
    } else {
        console.log(`No asterisks found to clean in: ${fileRelPath}`);
    }
});
