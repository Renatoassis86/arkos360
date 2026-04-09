const fs = require('fs');
const path = require('path');

const formPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'dashboard', 'documentos', 'emitir', '[id]', 'EmissaoForm.tsx');

if (fs.existsSync(formPath)) {
    let content = fs.readFileSync(formPath, 'utf-8');

    // 1. Fix handleManualSubmit referencing nome_campo
    const oldManualSubmit = `    campos.forEach(c => {
      dadosPreenchimento[c.nome_campo] = formData.get(c.nome_campo)
    })`;

    const newManualSubmit = `    campos.forEach(c => {
      const fieldKey = c.nome_campo || c.chave_tag || c.rotulo;
      if (fieldKey) {
        dadosPreenchimento[fieldKey] = formData.get(fieldKey);
      }
    })`;

    if (content.includes(oldManualSubmit)) {
         content = content.replace(oldManualSubmit, newManualSubmit);
    }

    // 2. Fix campos.map looping referencing nome_campo
    const oldLoop = `          {campos.map(c => {
            if (c.nome_campo === 'NOME_ALUNO' || c.nome_campo === 'CRA') return null;
            return (
              <div key={c.id}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>{c.label || c.nome_campo.replace(/_/g, ' ')}</label>
                <input name={c.nome_campo} type={c.tipo_input === 'numero' ? 'number' : 'text'} step="0.1" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '8px' }} required />
              </div>
            )
          })}`;

    const newLoop = `          {campos.map(c => {
            const fieldKey = c.nome_campo || c.chave_tag || c.rotulo || '';
            const fieldLabel = c.label || c.rotulo || fieldKey.replace(/_/g, ' ').replace('{{', '').replace('}}', '').toUpperCase();
            
            if (fieldKey === 'NOME_ALUNO' || fieldKey === 'CRA' || fieldKey === '{{nome_aluno}}') return null;
            
            return (
              <div key={c.id || fieldKey}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>{fieldLabel}</label>
                <input name={fieldKey} type={c.tipo_input === 'numero' ? 'number' : 'text'} step="0.1" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '8px' }} required />
              </div>
            )
          })}`;

    if (content.includes(oldLoop)) {
         content = content.replace(oldLoop, newLoop);
    }

    // 3. Fix placeholder string mapping join
    const oldPlaceholder = `{campos.map(c => c.nome_campo).join(', ')}`;
    const newPlaceholder = `{campos.map(c => c.nome_campo || c.rotulo || c.chave_tag).filter(Boolean).join(', ')}`;

    if (content.includes(oldPlaceholder)) {
        content = content.replace(oldPlaceholder, newPlaceholder);
    }

    fs.writeFileSync(formPath, content, 'utf-8');
    console.log("EmissaoForm successfully patched with safe fields fallbacks.");
} else {
    console.log("EmissaoForm path not found.");
}
