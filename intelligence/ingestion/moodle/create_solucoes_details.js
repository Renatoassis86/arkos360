const fs = require('fs');
const path = require('path');

const detailPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'solucoes', '[id]', 'page.tsx');

const code = `'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../solucoes.module.css'
import { ArrowLeft, CheckCircle2, ShoppingCart, Users, FileText, Package, BarChart2, Cpu, Shield } from 'lucide-react'

const catalog: Record<string, any> = {
  clm: { title: 'Gestão de Contratos (CLM)', desc: 'Geração e tracking automático de documentos.', image: '/arkos_dashboard_decision_1774133572097.png' },
  crm: { title: 'Gestão Comercial (CRM)', desc: 'Funil avançado e tração de propostas.', image: '/arkos_real_executive_dashboard_1774143584596.png' },
  recrutamento: { title: 'Gestão de Talentos (HRMS)', desc: 'DP e Previsão de Turnover dinâmica.', image: '/arkos_executive_dashboard_1774143501248.png' },
  pedidos: { title: 'Pedidos e Demandas (ERP)', desc: 'Fluxos integrados e chamados de SLA.', image: '/arkos_data_dashboard_holo_1774143471858.png' },
  commerce: { title: 'Arkos Commerce Suite', desc: 'Motor financeiro B2B e E-commerce.', image: '/arkos_laptop_mockup_1774143172389.png' },
  growth: { title: 'Arkos Growth Agency', desc: 'Squads de tráfego pago e escala ROI.', image: '/arkos_real_executive_dashboard_1774143584596.png' },
  marketing: { title: 'Marketing Intelligence', desc: 'Aquisição de leads e análise de sentimentos.', image: '/arkos_laptop_mockup_1774143172389.png' },
  data: { title: 'Arkos Data', desc: 'Data warehouse e pipelines conectadas.', image: '/arkos_data_stream_1774143375030.png' },
  ai: { title: 'Arkos AI Agents', desc: 'Agentes autônomos e resolução preditiva.', image: '/arkos_data_brain_1774143436679.png' },
  strategy: { title: 'Arkos Strategy', desc: 'Planos estatísticos e Cruzamento de cenários.', image: '/arkos_business_strategy_1774143055983.png' },
  academy: { title: 'Arkos Academy', desc: 'Plataforma EaD e Letramento avançado.', image: '/arkos_corporate_boardroom_1774143669395.png' }
};

export default function SolucoesDetails() {
  const params = useParams();
  const id = params.id as string;
  const item = catalog[id] || { title: 'Módulo Arkos', desc: 'Descrição detalhada em desenvolvimento.' };

  return (
    <div className={styles.container} style={{ minHeight: '100vh', background: '#0A0C0F', paddingTop: '60px' }}>
      <main className="flex-1 flex flex-col items-center justify-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        
        <Link href="/solucoes" style={{ color: '#8A8F99', textDecoration: 'none', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Voltar para o Ecossistema
        </Link>

        {/* Side-by-side Details layout */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', background: '#111318', border: '1px solid #1F242D', padding: '40px', borderRadius: '16px', width: '100%', textAlign: 'left' }}>
          
          <div style={{ flex: 1.2 }}>
            <h1 style={{ fontSize: '1.8rem', color: '#C8F542', fontWeight: 800, marginBottom: '12px' }}>{item.title}</h1>
            <p style={{ color: '#F4F2ED', fontSize: '1.1rem', marginBottom: '24px', lineHeight: '1.6' }}>{item.desc}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8A8F99' }}><CheckCircle2 size={18} color="#C8F542" /> Totalmente integrado ao Ecossistema Arkos</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8A8F99' }}><CheckCircle2 size={18} color="#C8F542" /> Prescrição de Inteligência de Dados Dinâmica</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8A8F99' }}><CheckCircle2 size={18} color="#C8F542" /> Painéis de Report Automático para C-Level</div>
            </div>

            <button style={{ background: '#C8F542', color: '#000', fontWeight: '800', fontSize: '0.875rem', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => window.open('https://wa.me/5583981957737', '_blank')}>
              Quero Conversar sobre esta Solução
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img 
              src={item.image || '/arkos_corporate_presenting_1774143639165.png'} 
              alt={item.title} 
              style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.05)' }} 
            />
          </div>

        </div>

      </main>
    </div>
  )
}`;

fs.mkdirSync(path.dirname(detailPath), { recursive: true });
fs.writeFileSync(detailPath, code, 'utf-8');
console.log("Detailed Solutions view accurately created!");
