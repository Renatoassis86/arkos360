import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Título do TCC para a Hero Section
const TCC_TITLE = "Predição de Evasão Estudantil em Instituições de Ensino Superior Privadas: Uma aplicação de machine learning com explicabilidade para apoio à decisão gerencial";

const SECTIONS = [
  { id: 'intelligence', label: 'Comando de Inteligência', active: true },
  { id: 'radiography', label: 'Radiografia Moodle', active: false },
  { id: 'financial', label: 'Risco Financeiro (Sponte)', active: false, status: 'In Development' },
  { id: 'social', label: 'Engajamento Social (Insta)', active: false, status: 'In Development' },
  { id: 'whatsapp', label: 'Serviço Clínico (WA)', active: false, status: 'In Development' },
  { id: 'causal', label: 'Causal Uplift Engine', active: false, status: 'In Development' },
];

function App() {
  const [activeTab, setActiveTab] = useState('radiography');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros de Hierarquia Moodle
  const [filterMacro, setFilterMacro] = useState('');
  const [filterModality, setFilterModality] = useState('');
  const [filterDegree, setFilterDegree] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('moodle_last_access', { ascending: false })
        .limit(30);

      if (error) {
        console.error("Erro na leitura Supabase:", error);
      }
      if (data) {
        setStudents(data);
      }
      setLoading(false);
    }
    fetchStudents();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand">
          <h2 className="brand-logo">ARKOS 360</h2>
          <span className="brand-tagline">Predictive Intelligence</span>
        </div>
        
        <nav className="nav-menu">
          {SECTIONS.map(section => (
            <div 
              key={section.id} 
              className={`nav-item ${activeTab === section.id ? 'active' : ''} ${section.status ? 'locked' : ''}`}
              onClick={() => !section.status && setActiveTab(section.id)}
            >
              <div className="nav-label-group">
                <span className="nav-text">{section.label}</span>
                {section.status && <span className="status-tag">{section.status}</span>}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>v1.0.0-beta</p>
          <p>Conforme LGPD & TCC OE9</p>
        </div>
      </aside>

      <main className="content">
        <header className="main-header with-hero">
          <div className="hero-section">
            <img src="/hero_students.png" alt="University Students" className="hero-img" />
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="tcc-main-title">{TCC_TITLE}</h1>
              <div className="header-meta">
                <p className="subtitle">Visualização baseada no Valor em Risco e Engajamento Digital (SED)</p>
                <div className="system-status">
                  <div className="status-pill alive"><span className="dot"></span> Moodle: Online</div>
                  <div className="status-pill pending"><span className="dot"></span> Sponte: Pending</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'intelligence' && (
          <div className="view-intelligence">
             {/* KPIs de Alto nível */}
             <div className="kpi-grid">
                <div className="kpi-card">
                  <label>Taxa de Evasão Projetada</label>
                  <div className="value">14.2%</div>
                  <small className="trend negative">↑ 2% vs mês anterior</small>
                </div>
                <div className="kpi-card highlight">
                  <label>Alunos Sincronizados (Raw)</label>
                  <div className="value">{loading ? '...' : students.length}</div>
                  <small>Tracking vivo</small>
                </div>
                <div className="kpi-card">
                  <label>ROI de Intervenção (Causal)</label>
                  <div className="value">--</div>
                  <small>Em Desenvolvimento</small>
                </div>
             </div>

             {loading ? (
                <div className="loading-state">
                  <div className="loading-bar"></div>
                  <p>Injetando dados reais do Data Lake...</p>
                </div>
             ) : (
                <div className="dossier-grid">
                  {students.map(student => (
                    <div key={student.id} className={`student-card ${student.scr_final_score > 50 ? 'critical' : ''}`}>
                      <div className="card-header">
                        <span className={`badge ${student.scr_final_score > 50 ? 'critical' : 'safe'}`}>
                          {student.scr_final_score > 50 ? 'Critical' : 'Safe'}
                        </span>
                        <span className="risk-score">{student.scr_final_score || 0}% SCR</span>
                      </div>
                      <h3 style={{fontSize: '1.1rem'}}>{student.full_name_hash.substring(0,8)}... (Hash)</h3>
                      <p className="source">Curso: {student.course_name?.substring(0, 20)}...</p>

                      <div className="metrics">
                        <div className="m-item">
                           <span className="m-label">Último Acesso</span>
                           <span className="m-value green">{student.moodle_last_access ? new Date(student.moodle_last_access * 1000).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="m-item">
                           <span className="m-label">CPF (Masked)</span>
                           <span className="m-value" style={{fontSize: '0.8rem'}}>{student.cpf_hash ? "Verificado" : "Pendente"}</span>
                        </div>
                      </div>

                      <div className="prescription-box">
                        <label>AI PRESCRIPTION</label>
                        <p>{student.scr_final_score > 50 ? 'Contato Consultivo + Plano de Bolsa' : 'Ações Nudge (Engajar via fórum)'}</p>
                      </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'radiography' && (
          <div className="view-radiography">
             <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-label">Total Alunos</span>
                  <span className="stat-value">{students.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Cursos Ativos</span>
                  <span className="stat-value">{[...new Set(students.map(s => s.course_name))].length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Engajamento Médio</span>
                  <span className="stat-value">76%</span>
                </div>
             </div>

             <div className="filters-panel">
                <select value={filterMacro} onChange={e => {setFilterMacro(e.target.value); setFilterModality(''); setFilterDegree('');}}>
                  <option value="">Todas as Instituições (Macro)</option>
                  {[...new Set(students.map(s => s.macro_category).filter(Boolean))].map(m => (
                    <option key={m as string} value={m as string}>{m as string}</option>
                  ))}
                </select>
                <select value={filterModality} onChange={e => {setFilterModality(e.target.value); setFilterDegree('');}}>
                  <option value="">Todas as Modalidades</option>
                  {[...new Set(students.filter(s => !filterMacro || s.macro_category === filterMacro).map(s => s.modality).filter(Boolean))].map(m => (
                    <option key={m as string} value={m as string}>{m as string}</option>
                  ))}
                </select>
                <select value={filterDegree} onChange={e => setFilterDegree(e.target.value)}>
                  <option value="">Todos os Departamentos / Graus</option>
                  {[...new Set(students.filter(s => (!filterMacro || s.macro_category === filterMacro) && (!filterModality || s.modality === filterModality)).map(s => s.degree).filter(Boolean))].map(m => (
                    <option key={m as string} value={m as string}>{m as string}</option>
                  ))}
                </select>
             </div>

             <div className="dossier-grid">
                {students.filter(s => (!filterMacro || s.macro_category === filterMacro) && (!filterModality || s.modality === filterModality) && (!filterDegree || s.degree === filterDegree)).map(student => (
                  <div key={student.id} className="student-card premium">
                    <div className="card-top">
                      <h3 className="category-tag">{student.macro_category}</h3>
                      <span className="modality-label">{student.modality}</span>
                    </div>
                    <p className="degree-path">{student.degree}</p>
                    
                    <div className="course-box">
                       {student.course_tag && <span className="tag-pill">{student.course_tag}</span>}
                       <p className="course-name">{student.clean_course_name}</p>
                    </div>

                    <div className="student-metrics">
                       <div className="met-row">
                         <span>Média Geral</span>
                         <span className="met-val highlight">--</span>
                       </div>
                       <div className="met-row">
                         <span>Status Financeiro</span>
                         <span className="met-val gray">Pendente Sponte</span>
                       </div>
                    </div>

                    <div className="card-footer">
                       <span>ID: {student.external_id_moodle}</span>
                       <span className="access-date">Ativo desde: {student.moodle_last_access ? new Date(student.moodle_last_access * 1000).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab !== 'intelligence' && activeTab !== 'radiography' && (
          <div className="placeholder-view">
            <div className="empty-state">
              <h2>Módulo em Desenvolvimento</h2>
              <p>Aguardando integração de dados do sistema {activeTab.toUpperCase()}.</p>
              <div className="loading-bar"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
