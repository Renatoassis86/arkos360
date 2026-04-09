const fs = require('fs');
const path = require('path');

const pagePath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'dashboard', 'templates', 'popular', '[id]', 'page.tsx');

if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf-8');
    
    // 1. Add any needed imports at top if not present, but we can do FileReader with raw text processing or PapaParse.
    // Let's use XLSX just like EmissaoForm.tsx for best compatibility.
    if (!content.includes("import * as XLSX from 'xlsx'")) {
         content = content.replace("import Link from 'next/link'", "import Link from 'next/link'\nimport * as XLSX from 'xlsx'");
         console.log("Added XLSX import.");
    }

    // 2. Add spreadsheet rows state
    if (!content.includes("const [excelRows, setExcelRows] = useState<any[]>([])")) {
        content = content.replace("const [selectedCourse, setSelectedCourse] = useState('')", "const [selectedCourse, setSelectedCourse] = useState('')\n  const [excelRows, setExcelRows] = useState<any[]>([])\n  const [successCount, setSuccessCount] = useState<number | null>(null)");
         console.log("Added excelRows and successCount state variables.");
    }

    // 3. Replace handleSpreadsheetUpload dummy logic
    const oldUploadFn = `  const handleSpreadsheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      alert('✅ Planilha "' + e.target.files[0].name + '" carregada com sucesso! (Simulação de processamento)')
    }
  }`;

    const newUploadFn = `  const handleSpreadsheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)
      setExcelRows(data)
      alert(\`✅ Planilha "\${file.name}" carregada com êxito! Encontrados \${data.length} registros.\`)
    }
    reader.readAsBinaryString(file)
  }`;

    if (content.includes(oldUploadFn)) {
        content = content.replace(oldUploadFn, newUploadFn);
        console.log("handleSpreadsheetUpload replaced with real FileReader XLSX logic.");
    }

    // 4. Implement handleBulkSubmit function setup
    if (!content.includes("const handleBulkSubmit = async () =>")) {
        const afterUpload = `    reader.readAsBinaryString(file)
  }`;
        const bulkSubmitFn = `\n\n  const handleBulkSubmit = async () => {
    if (excelRows.length === 0) return;
    setLoading(true);

    try {
      // Create body rows based on accurate spreadsheet headers mapping to placeholders tags keys or columns.
      // E.g. excel data { "NOME DO ALUNO": "Fulano", "CPF": "123" }
      const response = await fetch(\`/api/documentos/batch/\${id}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(excelRows)
      });
  
      if (response.ok) {
        setSuccessCount(excelRows.length)
      } else {
        alert("Erro ao enviar pacotes de em massa.");
      }
    } catch (err) {
      alert("Erro de conexão ao enviar dados.");
    } finally {
      setLoading(false);
    }
  }`;
        content = content.replace(afterUpload, afterUpload + bulkSubmitFn);
         console.log("handleBulkSubmit function layout appended.");
    }

    // 5. Update render wrapper in Tab 2 element render view structure setup triggers absolute correctly rules nodes framing triggers sequential triggered!
    // Let's find out the view template matching
    const oldTab2View = `<div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <input 
                type="file" 
                ref={spreadsheetInputRef} 
                onChange={handleSpreadsheetUpload} 
                accept=".csv, .xlsx, .xls" 
                hidden 
              />
              <button 
                type="button"
                onClick={handleDownloadTemplate}
                style={{ padding: '0.75rem 1.2rem', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ⬇️ Baixar Planilha Guia
              </button>
              <button 
                type="button"
                onClick={() => spreadsheetInputRef.current?.click()}
                style={{ padding: '0.75rem 1.2rem', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                📂 Selecionar Arquivo
              </button>
            </div>`;

    const newTab2View = `<div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <input 
                type="file" 
                ref={spreadsheetInputRef} 
                onChange={handleSpreadsheetUpload} 
                accept=".csv, .xlsx, .xls" 
                hidden 
              />
              <button 
                type="button"
                onClick={handleDownloadTemplate}
                style={{ padding: '0.75rem 1.2rem', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ⬇️ Baixar Planilha Guia
              </button>
              <button 
                type="button"
                onClick={() => spreadsheetInputRef.current?.click()}
                style={{ padding: '0.75rem 1.2rem', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                📂 Selecionar Arquivo
              </button>
            </div>

            {excelRows.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', background: 'rgba(200,245,66,0.05)', color: 'var(--primary)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(200,245,66,0.1)' }}>
                  🎉 Planilha lida com êxito! Encontrados <strong>{excelRows.length}</strong> registros prontos para emissão.
                </div>
                <button onClick={handleBulkSubmit} disabled={loading} style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? 'Tratando fila...' : 'Processar Carga em Lote'}
                </button>
              </div>
            )}

            {successCount !== null && (
              <div style={{ marginTop: '1rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                ✅ <strong>{successCount}</strong> documentos criados com sucesso! Verifique na lista principal.
              </div>
            )}`;

    if (content.includes(oldTab2View)) {
        content = content.replace(oldTab2View, newTab2View);
        console.log("Tab 2 view appended with BulkSubmit button trigger correctly!");
    }

    fs.writeFileSync(pagePath, content, 'utf-8');
}
