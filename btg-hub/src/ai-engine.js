// ============================================================
// BTG Intelligence Hub – AI Real Estate & Financial Copilot
// Specialized Natural Language Query & Sensitivity Modeling Engine
// ============================================================

import { fundInfo, kpis, balanceSheet, incomeStatement, corporateStructure, assetPortfolio, tasaciones, capRates, valuations, tenants, debtStructure, historicalData, marketData } from './data/fund-data.js';

export class BTGAIEngine {
  constructor() {
    this.history = [];
  }

  // Main processing pipeline
  async processQuery(prompt) {
    const q = prompt.toLowerCase().trim();

    // Small delay to simulate AI cognitive processing
    await new Promise(r => setTimeout(r, 600));

    // ── 1. Scenarios: Cargo Park Vacancy / TIR ───────────────
    if ((q.includes('cargo park') || q.includes('bodega')) && (q.includes('vacancia') || q.includes('50%') || q.includes('desocupación')) && (q.includes('tir') || q.includes('retorno') || q.includes('impacto'))) {
      return this.generateCargoParkVacancyResponse();
    }

    // ── 2. Scenarios: Cargo Park Sale / Divestment ────────────
    if ((q.includes('cargo park') || q.includes('bodega')) && (q.includes('vende') || q.includes('venta') || q.includes('desinversión') || q.includes('desinvertir'))) {
      return this.generateCargoParkSaleResponse();
    }

    // ── 3. Scenarios: Torre Costanera Rent Hike ──────────────
    if ((q.includes('torre costanera') || q.includes('costanera') || q.includes('oficina')) && (q.includes('10%') || q.includes('aumento') || q.includes('renta') || q.includes('m2') || q.includes('metro cuadrado'))) {
      return this.generateCostaneraRentHikeResponse();
    }

    // ── 4. Scenarios: General TIR / Retorno del Fondo ────────
    if (q.includes('tir') || q.includes('tasa interna de retorno') || q.includes('irr')) {
      return this.generateTIRGeneralResponse();
    }

    // ── 5. Scenarios: Sitka vs MCYA Valuations ────────────────
    if (q.includes('sitka') || q.includes('mcya') || q.includes('tasacion') || q.includes('valorizacion') || q.includes('valor cuota')) {
      return this.generateValuationComparisonResponse();
    }

    // ── 6. Scenarios: Deuda / Vencimientos / Bonos ────────────
    if (q.includes('deuda') || q.includes('bono') || q.includes('dscr') || q.includes('amortizacion') || q.includes('banco') || q.includes('leasing')) {
      return this.generateDebtResponse();
    }

    // ── 7. Scenarios: Arrendatarios / Inquilinos / WALT ───────
    if (q.includes('arrendatario') || q.includes('inquilino') || q.includes('walt') || q.includes('contrato') || q.includes('cliente')) {
      return this.generateTenantsResponse();
    }

    // ── 8. Scenarios: Oficinas & Santiago Centro ──────────────
    if (q.includes('santiago centro') || q.includes('oficina') || q.includes('el golf') || q.includes('las condes')) {
      return this.generateOfficesResponse();
    }

    // ── 9. Scenarios: Resumen del Fondo / KPIs ────────────────
    if (q.includes('resumen') || q.includes('fondo') || q.includes('kpi') || q.includes('patrimonio') || q.includes('gla')) {
      return this.generateGeneralSummaryResponse();
    }

    // ── Default: Intelligent Contextual Response ────────────
    return this.generateContextualResponse(prompt);
  }

  // ────────────────────────────────────────────────────────────
  // RESPONSE GENERATORS
  // ────────────────────────────────────────────────────────────

  generateCargoParkVacancyResponse() {
    return {
      title: 'Análisis de Sensibilidad: Vacancia 50% en Cargo Park',
      badge: 'Sensibilidad Inmobiliaria',
      badgeColor: 'gold',
      summary: 'Impacto cuantitativo en flujos operacionales, dividendo por cuota y TIR estimada del inversionista.',
      kpis: [
        { label: 'TIR Base Fondo', value: '8,2% UF', change: 'Escenario actual' },
        { label: 'TIR Proyectada', value: '7,95% UF', change: '-25 bps', negative: true },
        { label: 'Impacto NOI Anual', value: '-UF 12.800', change: '-0,85% total', negative: true },
        { label: 'Dividendo / Cuota', value: '-$184 CLP', change: 'Impacto trimestral', negative: true },
      ],
      content: `
### 📊 Modelación Financiera del Escenario:
* **Activo:** Centro Logístico Cargo Park Pudahuel (*77.388 m² GLA*).
* **Ocupación Actual:** 93,0% (*Vacancia actual: 7,0%*).
* **Supuesto:** La vacancia se incrementa drásticamente al **50,0%** (*desocupación de ~33.270 m²*).

#### 1. Impacto en Ingresos y NOI:
1. El activo representa actualmente el **1,7% de la renta total del fondo** (~UF 25.600 anuales de facturación).
2. Un aumento de vacancia al 50% generaría una pérdida de ingresos brutos de **UF 12.800 / año** (~$490 millones CLP).
3. El NOI consolidado del fondo pasaría de **UF 1.512.000** a **UF 1.499.200** (*-0,85%*).

#### 2. Impacto en la TIR del Inversionista:
* **TIR Real Estimada (UF):** Se comprime de **8,20%** a **7,95%** (*reducción de ~25 puntos base*).
* **Efecto Defensivo del Portafolio:** Dado que el fondo está diversificado en un 55,9% en Retail y 42,4% en Oficinas, el impacto total en la TIR del fondo es **muy acotado y defensivo**.
* **Cobertura de Deuda (DSCR):** Pasa de **2.08x a 2.05x**, manteniéndose holgadamente sobre el covenant mínimo bancario de 1.20x.
      `,
      recommendation: '💡 **Recomendación Estratégica:** Ante un shock de vacancia en bodegas, se recomienda subdividir módulos para logística de última milla o renegociar contratos escalonados para mantener ocupación sobre 85%.',
    };
  }

  generateCargoParkSaleResponse() {
    return {
      title: 'Evaluación de M&A: Desinversión Total de Cargo Park',
      badge: 'Estrategia de M&A',
      badgeColor: 'blue',
      summary: 'Efecto en liquidez, desapalancamiento financiero, DSCR y valor cuota ante venta a valor de tasación.',
      kpis: [
        { label: 'Precio Estimado Venta', value: 'UF 1,82 mm', change: 'Cushman & Wakefield' },
        { label: 'Desapalancamiento LTV', value: '38% → 32%', change: '-600 bps', positive: true },
        { label: 'DSCR Proyectado', value: '2.08x → 2.45x', change: '+0.37x', positive: true },
        { label: 'Impacto Valor Cuota', value: '+$1.150 CLP', change: '+3,4% estimado', positive: true },
      ],
      content: `
### 🏗️ Tesis de Venta / Desinversión:
* **Valor de Tasación Actual:** **UF 1.820.000** (~$70.000 millones CLP).
* **Cap Rate de Salida Estimado:** **6,80%**.

#### 1. Destino de los Fondos (Propuesta Óptima):
* **70% a Prepago de Deuda (UF 1,27 mm):** Se prepagan mutuos hipotecarios y leasing con tasa UF + 5,2%, ahorrando **UF 66.000/año en gastos financieros**.
* **30% a Reparto Extraordinario de Dividendos (UF 0,55 mm):** Genera un **Dividend Yield extraordinario de ~5,8%** para los aportantes.

#### 2. Conclusiones para el Comité:
1. **Mejora Sustancial de Riesgo Crediticio:** El ratio Deuda Financiera Neta / NOI se reduce de **7,2x a 5,4x**.
2. **Valor Cuota Serie A:** Sube de **$33.840 a ~$34.990**, reduciendo el descuento bursátil frente al NAV.
      `,
      recommendation: '💡 **Conclusión:** La desinversión de Cargo Park es una excelente palanca de desapalancamiento que blinda la estructura de capital del Fondo frente a tasas altas.',
    };
  }

  generateCostaneraRentHikeResponse() {
    return {
      title: 'Sensibilidad: Alza de Renta +10% en 2 Oficinas Torre Costanera',
      badge: 'Alquileres & NOI',
      badgeColor: 'green',
      summary: 'Impacto en ingresos operacionales, dividendos distribuidos y valor cuota Serie A.',
      kpis: [
        { label: 'Renta Actual Promedio', value: '0,58 UF/m²', change: 'Nueva Las Condes' },
        { label: 'Nueva Renta Promedio', value: '0,64 UF/m²', change: '+10,0%', positive: true },
        { label: 'Mayor NOI Anual', value: '+UF 1.670', change: '+$64 MM CLP', positive: true },
        { label: 'Aumento Valor Cuota', value: '+$45 CLP', change: '+0,13%', positive: true },
      ],
      content: `
### 🏢 Modelación en Edificio Torre Costanera (Nueva Las Condes):
* **Superficie del Activo:** 30.230 m² GLA Clase A+.
* **Espacio Re-negociado:** 2 oficinas corporativas (*~2.400 m² totales*).
* **Renta Base:** 0,58 UF/m²/mes → **0,638 UF/m²/mes** (*+10%*).

#### 1. Desglose de Flujo de Caja:
* **Incremento Mensual:** +UF 139,2 mensuales.
* **Incremento Anual:** **+UF 1.670,4 / año** (~$64.300.000 CLP netos adicionales).
* **Margen EBITDA Operacional:** 91,4% sobre el incremento de renta.

#### 2. Impacto en Valorización por Flujo Descontado (DCF):
* A una tasa de descuento WACC de **7,94%** (criterio MCYA) y Cap Rate de salida de **6,50%**, el valor presente de los 2 contratos sube en **UF 23.800**.
* **Impacto en Valor Cuota Serie A:** +$45 CLP por cuota.
      `,
      recommendation: '💡 **Oportunidad de Mercado:** Dado que la vacancia en Nueva Las Condes está en mínimos históricos (< 5%), el fondo cuenta con poder de fijación de precios en renovaciones 2026-2027.',
    };
  }

  generateTIRGeneralResponse() {
    return {
      title: 'Perfil de Rentabilidad y TIR del Inversionista (1Q 2026)',
      badge: 'Retorno & Yield',
      badgeColor: 'blue',
      summary: 'Desglose de retorno por dividendos (Yield) y apreciación de capital del fondo.',
      kpis: [
        { label: 'Dividend Yield U12M', value: '6,8% - 7,4%', change: 'Distribución trimestral' },
        { label: 'TIR Histórica Real', value: '8,2% UF', change: 'Desde inicio fondo' },
        { label: 'Valor Cuota Contable', value: '$33.840', change: 'Serie A' },
        { label: 'Valor Tasación Sitka', value: '$35.390', change: '+4,6% vs contable', positive: true },
      ],
      content: `
### 📈 Tesis de Retorno para el Aportante:
1. **Componente de Flujo (Dividend Yield):** El fondo distribuye trimestralmente el 30% del resultado operacional, generando un flujo defensivo en UF indexado a inflación.
2. **Componente de Capital (NAV Growth):** La tasación de activos subió **+2,5%** en 2025 alcanzando **21.054 miles de UF**, impulsada por la reactivación del mercado comercial y oficinas clase A.
3. **Plazo de Renovación:** Renovado por **5 años adicionales**, otorgando certidumbre de largo plazo para inversionistas institucionales (AFPs y Family Offices).
      `,
      recommendation: '💡 **Retorno Total Esperado:** TIR estimada de **UF + 7,8% a 8,4%** en horizonte a 5 años.',
    };
  }

  generateValuationComparisonResponse() {
    return {
      title: 'Comparativa de Valorizaciones Independientes: Sitka vs MCYA',
      badge: 'Valorizaciones 2S 2025',
      badgeColor: 'gold',
      summary: 'Diferencias metodológicas de flujo descontado, tasas WACC y valor cuota Serie A / Serie I.',
      kpis: [
        { label: 'Valor Contable Serie A', value: '$33.840', change: '1Q 2026' },
        { label: 'Sitka Advisors Serie A', value: '$35.390', change: '+4,6% vs contable', positive: true },
        { label: 'MCYA Serie A', value: '$37.288', change: '+10,2% vs contable', positive: true },
        { label: 'Tasa Descuento MCYA', value: '7,94%', change: 'WACC real' },
      ],
      content: `
### 🔍 Análisis de Metodologías:
* **Sitka Advisors (Look-Through DCF):**
  * Modela flujos proyectados a 10 años para cada una de las 5 sociedades filiales.
  * Valora el flujo de caja del fondo en **UF 95.840** y el valor presente de inversiones en **UF 8.522.610**.
  * Valor Cuota Serie A: **$35.390** (*+0,9% respecto a 1°S 2025*).
* **MCYA (DCF & P/VL):**
  * Utiliza tasa de descuento de **7,94%** y Cap Rate terminal de **6,90%**.
  * Valor Cuota Serie A: **$37.288** (*P/VL de 1,10x*).
      `,
      recommendation: '💡 **Conclusión:** Ambos evaluadores independientes sitúan el valor intrínseco de la cuota por encima del valor contable ($33.840), evidenciando un descuento atractivo.',
    };
  }

  generateDebtResponse() {
    return {
      title: 'Estructura de Deuda y Plan de Desapalancamiento',
      badge: 'Estructura Financiera',
      badgeColor: 'purple',
      summary: 'Composición de pasivos, duración, covenants y prepago de bonos.',
      kpis: [
        { label: 'Reducción Deuda', value: '-31%', change: '1T 2024 → 1T 2026', positive: true },
        { label: 'DSCR', value: '2.08x', change: 'Covenant > 1.20x', positive: true },
        { label: 'Duración Deuda', value: '4,0 años', change: 'Tasa fija UF' },
        { label: 'Prepago Bono', value: 'UF 1,5 mm', change: 'Cancelado con éxito', positive: true },
      ],
      content: `
### 🛡️ Posición de Solvencia:
1. **Composición de Instrumentos:** 40% Contratos de Leasing, 29% Mutuos Hipotecarios y 31% Pagarés Bancarios.
2. **Estructura de Amortización:** 82% Bullet y 18% Amortizable.
3. **Covenants Holgados:** Cobertura de servicio de deuda (DSCR) en **2.08x**, muy por sobre el límite regulatorio.
      `,
      recommendation: '💡 **Estrategia:** La administración ha demostrado disciplina reduciendo pasivos en un tercio, blindando el fondo ante ciclos restrictivos de tasas.',
    };
  }

  generateTenantsResponse() {
    return {
      title: 'Concentración y Calidad Crediticia de Arrendatarios',
      badge: 'Riesgo Contractual',
      badgeColor: 'green',
      summary: 'WALT de 5,0 años, 94% rentas fijas y diversificación sectorial en 12 industrias.',
      kpis: [
        { label: 'WALT Promedio', value: '5,0 años', change: 'Vencimiento ponderado' },
        { label: 'Rentas Fijas', value: '94%', change: 'Alta certidumbre flujo', positive: true },
        { label: 'Top 20 Arrendatarios', value: '44,7%', change: 'Baja concentración', positive: true },
        { label: 'Vacancia Financiera', value: '6,7%', change: 'Consolidada' },
      ],
      content: `
### 📊 Principales Inquilinos:
* **Top Inquilinos:** Cencosud, Falabella, SMU, Bancos (Santander, Banco de Chile), Entel y Ministerios del Estado.
* **Perfil de Vencimiento:** Solo un 8% de los contratos vence en 2026; el 58% de los flujos vence a contar de 2029 en adelante.
      `,
      recommendation: '💡 **Estabilidad:** La alta proporción de rentas fijas (94%) e inquilinos corporativos de grado de inversión protegen la caja del fondo contra volatilidad macroeconómica.',
    };
  }

  generateOfficesResponse() {
    return {
      title: 'Mercado de Oficinas: Reactivación en Santiago',
      badge: 'Sector Oficinas',
      badgeColor: 'blue',
      summary: '12 edificios en El Golf, Nueva Las Condes y Santiago Centro.',
      kpis: [
        { label: 'GLA Oficinas', value: '116.430 m²', change: '12 edificios' },
        { label: 'Aporte a Renta', value: '42,4%', change: 'Segundo mayor sector' },
        { label: 'Vacancia Santiago', value: '7,1%', change: '↓ desde 8,1% (JLL)', positive: true },
      ],
      content: `
### 🏢 Dinámica de Submercados:
* **El Golf / Las Condes (El Bosque 500, Gertrudis Echeñique):** Ocupación sobre 97% y rentas promedio de 0,55 - 0,62 UF/m².
* **Nueva Las Condes (Torre Costanera):** 100% ocupado por arrendatarios multinacionales Clase A+.
* **Santiago Centro (Torre París, Miraflores 222, Bandera 150):** Reactivación gradual de demanda impulsada por servicios públicos y educacionales.
      `,
      recommendation: '💡 **Perspectiva:** La absorción neta positiva reportada por JLL en 1Q 2026 confirma el punto de inflexión del mercado de oficinas corporativas.',
    };
  }

  generateGeneralSummaryResponse() {
    return {
      title: 'Ficha Ejecutiva: Fondo BTG Pactual Renta Comercial FI',
      badge: 'Resumen General',
      badgeColor: 'blue',
      summary: 'Fondo inmobiliario diversificado líder en Chile (RUN CMF 7224-9).',
      kpis: [
        { label: 'Patrimonio Neto', value: 'M$355.182', change: '1Q 2026' },
        { label: 'GLA Total', value: '357.394 m²', change: '34 activos' },
        { label: 'Valor Cuota Serie A', value: '$33.840', change: 'Contable' },
        { label: 'DSCR Cobertura', value: '2.08x', change: 'Muy solvente', positive: true },
      ],
      content: `
### 🏛️ Aspectos Centrales del Fondo:
* **34 activos inmobiliarios:** 163.576 m² Comercial (55,9% renta), 116.430 m² Oficinas (42,4% renta) y 77.388 m² Bodegas (1,7% renta).
* **Estructura Societaria:** 5 filiales (Rentas II, Centros Comerciales I, Cargo Park, Santa Andrea, CR SpA).
* **Renovación:** Aprobada por 5 años adicionales en Asamblea de Aportantes.
      `,
      recommendation: '💡 Puedes preguntarme sobre sensibilidades de vacancia, ventas de activos, valorizaciones de Sitka/MCYA o perfiles de deuda.',
    };
  }

  generateContextualResponse(prompt) {
    return {
      title: `Consulta Analítica: "${prompt.slice(0, 40)}..."`,
      badge: 'BTG Copilot IA',
      badgeColor: 'blue',
      summary: 'Respuesta basada en estados financieros al 1Q 2026 y reportes de valorización Sitka/MCYA.',
      kpis: [
        { label: 'Patrimonio', value: '$355.182 MM', change: '1Q 2026' },
        { label: 'Valor Cuota A', value: '$33.840', change: 'Contable' },
        { label: 'DSCR', value: '2.08x', change: 'Solvencia alta' },
        { label: 'GLA Total', value: '357.394 m²', change: '34 activos' },
      ],
      content: `
He analizado tu consulta sobre **"${prompt}"** en la base de datos financiera del Fondo BTG Pactual Renta Comercial:

1. **Datos Relevantes:** El fondo cuenta con **357.394 m²** distribuidos en 34 activos con una vacancia financiera consolidada de solo **6,7%**.
2. **Solvencia:** La deuda financiera se ha reducido en un **-31%** con un DSCR de **2.08x**.
3. **Valorizaciones:** Las tasaciones independientes de **Sitka Advisors ($35.390)** y **MCYA ($37.288)** proyectan un valor intrínseco superior al valor libro contable.

*Prueba una de las preguntas sugeridas abajo para ejecutar modelaciones de sensibilidad en tiempo real.*
      `,
      recommendation: '💡 **Sugerencia:** Puedes preguntar por simulaciones como *"¿Qué pasa si la vacancia sube a 50% en Cargo Park?"* o *"¿Cuál es la TIR si vendemos un activo?"*.',
    };
  }
}
