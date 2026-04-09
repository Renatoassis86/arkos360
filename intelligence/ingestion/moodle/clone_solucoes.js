const fs = require('fs');
const path = require('path');

const modulosPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'dashboard', 'modulos', 'page.tsx');
const solucoesPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'solucoes', 'page.tsx');
const solucoesCssPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'solucoes', 'solucoes.module.css');
const modulosCssPath = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'src', 'app', 'dashboard', 'modulos', 'modulos.module.css');

if (fs.existsSync(modulosPath)) {
    let modulos = fs.readFileSync(modulosPath, 'utf-8');
    
    fs.mkdirSync(path.dirname(solucoesPath), { recursive: true });

    // Copy CSS to create standalone module
    if (fs.existsSync(modulosCssPath)) {
        fs.writeFileSync(solucoesCssPath, fs.readFileSync(modulosCssPath, 'utf-8'), 'utf-8');
    }

    // Extract everything inside return array
    const arrayMatch = modulos.match(/\[\s*\{\s*id:\s*'clm'[\s\S]*?\}\s*\]/m);
    
    if (arrayMatch) {
        const arrayStr = arrayMatch[0];
        
        const standalonePage = `'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Users, ShoppingCart, LogOut, Package, ArrowRight, CheckCircle, MessageCircle, BarChart2, Cpu, Shield } from 'lucide-react'
import styles from './solucoes.module.css'

export default function SolucoesPage() {
  return (
    <div className={styles.container} style={{ minHeight: '100vh', background: '#0A0C0F', paddingTop: '45px' }}>
      <main className="flex-1 flex flex-col items-center justify-center">
        
        <Link href="/diagnostico" style={{ color: '#8A8F99', textDecoration: 'none', marginBottom: '16px', fontSize: '0.85rem' }}>
          ← Voltar para Resultados
        </Link>

        <div className={styles.titleArea} style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className={styles.title} style={{ fontSize: '2rem', color: '#F4F2ED', fontWeight: 800 }}>Explore o Ecossistema ARKOS</h1>
          <p className={styles.subtitle} style={{ color: '#8A8F99', fontSize: '1rem', maxWidth: '600px', margin: '8px auto' }}>
            Nossas soluções foram desenvolvidas para atuar como a espinha dorsal da sua maturidade corporativa.
          </p>
        </div>

        <div className={styles.grid}>
          {${arrayStr}.map((modulo) => (
            <div key={modulo.id} style={{ display: 'flex' }}>
              <Link 
                href={\`/solucoes/\${modulo.id}\`} 
                style={{ textDecoration: 'none', display: 'flex', width: '100%' }}
              >
                <div 
                  className={styles.card} 
                  style={{ 
                    padding: 0, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={modulo.foto} alt={modulo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper} style={{ color: modulo.color }}>
                        {modulo.icon}
                      </div>
                      <span className={styles.accentTag} style={{ color: modulo.color }}>
                        {modulo.tag}
                      </span>
                    </div>
                    
                    <h2 className={styles.cardTitle}>{modulo.titulo}</h2>
                    <p className={styles.cardDesc} style={{ margin: 0, flexGrow: 1, fontSize: '0.783rem' }}>{modulo.desc}</p>
                    
                    <div className={styles.cardFooter} style={{ marginTop: '16px' }}>
                      <button style={{ 
                        width: '100%', 
                        background: '#1F2937', 
                        color: '#C8F542', 
                        border: '1px solid rgba(200,245,66,0.3)', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Saiba Mais Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}`;
        fs.writeFileSync(solucoesPath, standalonePage, 'utf-8');
        console.log("Public /solucoes page standalone accurately cloned!");
    } else {
        console.log("Could not find the modulos Array using regex match.");
    }
}
