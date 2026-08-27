// ============================================================
// BTG Intelligence Hub – Main Entry Point
// ============================================================

import './styles/main.css';
import {
  fundInfo, kpis, balanceSheet, incomeStatement,
  corporateStructure, assetPortfolio, tasaciones,
  capRates, valuations, tenants, debtStructure,
  historicalData, marketData, marketNewsAndContingencies,
  deleveraging, riskClassification, fundHighlights,
} from './data/fund-data.js';
import {
  renderPatrimonioChart, renderNoiDscrChart,
  renderDebtNoiChart, renderDebtEquityChart,
  renderTasacionesChart, renderCapRatesChart,
  renderPortfolioComposition, renderTenantActivityChart,
  renderContractProfileChart, renderDebtCompositionChart,
  renderAmortizationChart, renderValuationCompChart,
  renderDeleveragingChart,
} from './charts.js';

// ── Helper: Format numbers ──────────────────────────────
function fmtNum(n, prefix = '', suffix = '') {
  if (typeof n !== 'number') return n;
  return `${prefix}${n.toLocaleString('es-CL')}${suffix}`;
}

function fmtMM(n) {
  return `M$${Math.round(n).toLocaleString('es-CL')}`;
}

// ── 1. NAVBAR & Back-to-Top ──────────────────────────────
function initNavbarAndScroll() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const backToTop = document.getElementById('btnBackToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    // Active section tracking
    const sections = document.querySelectorAll('.section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile toggle
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '64px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(6, 26, 46, 0.98)';
      navLinks.style.padding = '1rem';
      navLinks.style.borderBottom = '1px solid rgba(148,163,184,0.08)';
    });
  }
}

// ── 2. Animated Counters ─────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1500;
        const start = performance.now();

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          if (isDecimal) {
            el.textContent = `${prefix}${current.toFixed(2)}${suffix}`;
          } else {
            el.textContent = `${prefix}${Math.round(current).toLocaleString('es-CL')}${suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ── 4. Scroll Reveal Animations ──────────────────────────
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ── 5. Populate Balance Sheet Cards ──────────────────────
function renderBalanceCards() {
  const container = document.getElementById('balanceCards');
  if (!container) return;

  const bs = balanceSheet.current;
  const is = incomeStatement.q1_2026;

  const cards = [
    {
      label: 'Activos Totales',
      value: fmtMM(bs.assets.totalAssets / 1000),
      change: `+${((bs.assets.totalAssets / balanceSheet.previous.assets.totalAssets - 1) * 100).toFixed(1)}%`,
      positive: true,
    },
    {
      label: 'Patrimonio Neto',
      value: fmtMM(bs.equity.totalEquity / 1000),
      change: `+${((bs.equity.totalEquity / balanceSheet.previous.equity.totalEquity - 1) * 100).toFixed(1)}%`,
      positive: true,
    },
    {
      label: 'Resultado Q1 2026',
      value: fmtMM(is.netIncome / 1000),
      change: `${((is.netIncome / incomeStatement.q1_2025.netIncome - 1) * 100).toFixed(1)}%`,
      positive: is.netIncome >= incomeStatement.q1_2025.netIncome,
    },
    {
      label: 'Ingresos Operacionales',
      value: fmtMM(is.totalOperatingIncome / 1000),
      change: `${((is.totalOperatingIncome / incomeStatement.q1_2025.totalOperatingIncome - 1) * 100).toFixed(1)}%`,
      positive: false,
    },
  ];

  container.innerHTML = cards.map(c => `
    <div class="card">
      <div class="metric-label">${c.label}</div>
      <div class="metric-value small">${c.value}</div>
      <div class="metric-change ${c.positive ? 'positive' : 'negative'}">${c.change} vs Q1 2025</div>
    </div>
  `).join('');
}

// ── 6. Expandable Portfolio Calugas ──────────────────────
let activePortfolioCategory = null;

function renderPortfolioCalugas() {
  const container = document.getElementById('portfolioCalugas');
  if (!container) return;

  const categories = [
    {
      id: 'oficinas',
      title: 'Oficinas',
      count: '12 edificios',
      gla: '116.430 m²',
      rentaPct: '42,4%',
      markets: 'Santiago Centro, Nueva Las Condes, El Golf',
      color: '#2563eb',
    },
    {
      id: 'comercial',
      title: 'Centros Comerciales',
      count: '2 Malls, 2 Power Centers, 9 Strip Centers, 9 Stand Alone',
      gla: '163.576 m²',
      rentaPct: '55,9%',
      markets: 'Malls, Power Centers, Strip Centers, Stand Alone',
      color: '#d97706',
    },
    {
      id: 'bodegas',
      title: 'Bodegas & Estacionamientos',
      count: '1 Centro de Bodegas + 3 Estacionamientos',
      gla: '77.388 m²',
      rentaPct: '1,7%',
      markets: 'Cargo Park, Estac. Las Condes',
      color: '#059669',
    },
  ];

  container.innerHTML = categories.map(cat => `
    <div class="caluga-card ${activePortfolioCategory === cat.id ? 'active' : ''}" data-category="${cat.id}" style="cursor: pointer; border-top: 3px solid ${cat.color};">
      <div class="card-header">
        <div>
          <div class="card-title">${cat.title}</div>
          <div class="card-subtitle">${cat.count}</div>
        </div>
        <svg class="caluga-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${cat.color}" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-sm);">
        <div>
          <div class="metric-label">GLA</div>
          <div class="metric-value small">${cat.gla}</div>
        </div>
        <div class="tag" style="background: ${cat.color}15; color: ${cat.color}; border: 1px solid ${cat.color}30;">${cat.rentaPct} renta</div>
      </div>
      <div style="font-size: 0.72rem; color: var(--text-muted);">${cat.markets}</div>
    </div>
  `).join('');

  // Bind click events
  container.querySelectorAll('.caluga-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      if (activePortfolioCategory === cat) {
        activePortfolioCategory = null;
      } else {
        activePortfolioCategory = cat;
      }
      renderPortfolioCalugas();
      renderPortfolioExpanded();
    });
  });
}

function renderPortfolioExpanded() {
  const container = document.getElementById('portfolioExpanded');
  if (!container) return;

  if (!activePortfolioCategory) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  let assets = [];
  let title = '';

  if (activePortfolioCategory === 'oficinas') {
    title = 'Detalle de Oficinas';
    assets = assetPortfolio.oficinas.map(o => ({
      name: o.name,
      address: o.address,
      comuna: o.comuna || 'RM',
      gla: o.gla || 0,
      vacancia: o.vacancia || 0,
      pesoFondo: o.pesoFondo || 0,
    }));
  } else if (activePortfolioCategory === 'comercial') {
    title = 'Detalle de Centros Comerciales';
    const cc = assetPortfolio.centrosComerciales;
    const allCC = [
      ...cc.malls.map(a => ({ ...a, tipo: 'Mall' })),
      ...cc.powerCenters.map(a => ({ ...a, tipo: 'Power Center' })),
      ...cc.stripCenters.map(a => ({ ...a, tipo: 'Strip Center' })),
      ...cc.standAlone.map(a => ({ ...a, tipo: 'Stand Alone' })),
    ];
    assets = allCC.map(a => ({
      name: a.name,
      address: a.address,
      comuna: a.comuna || 'Varias',
      gla: a.gla || 0,
      vacancia: a.vacancia || 0,
      pesoFondo: a.pesoFondo || 0,
    }));
  } else if (activePortfolioCategory === 'bodegas') {
    title = 'Detalle de Bodegas & Estacionamientos';
    assets = [
      ...assetPortfolio.bodegas.map(b => ({
        name: b.name,
        address: b.address,
        comuna: b.comuna || 'RM',
        gla: b.gla || 0,
        vacancia: b.vacancia || 0,
        pesoFondo: b.pesoFondo || 0,
      })),
      ...assetPortfolio.estacionamientos.map(e => ({
        name: e.name,
        address: e.address,
        comuna: e.comuna || 'Las Condes',
        gla: e.calzadas ? e.calzadas + ' calzadas' : 0,
        vacancia: 0,
        pesoFondo: e.pesoFondo || 0,
      })),
    ];
  }

  // Sort by pesoFondo descending
  assets.sort((a, b) => b.pesoFondo - a.pesoFondo);

  container.innerHTML = `
    <div class="portfolio-expanded-panel" style="margin-top: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0;">${title}</h3>
        <span class="tag blue">${assets.length} activos</span>
      </div>
      <div class="asset-cards-grid">
        ${assets.map(a => `
          <div class="asset-detail-card" onclick="openAssetModal('${a.name}', '${a.comuna}', '${a.address}', '${typeof a.gla === 'number' ? a.gla.toLocaleString('es-CL') + ' m²' : a.gla}', '${a.vacancia}%', '${a.pesoFondo}%')">
            <div class="asset-detail-name">${a.name}</div>
            <div class="asset-detail-address">${a.comuna}</div>
            <div class="asset-detail-meta" style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Peso Fondo</span>
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${a.pesoFondo}%</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Vacancia</span>
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${a.vacancia}%</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Global function to open asset modal
window.openAssetModal = function(name, comuna, address, gla, vacancia, pesoFondo) {
  const modalHTML = `
    <div id="assetModalOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="background: #ffffff; width: 90%; max-width: 500px; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); position: relative;">
        <button onclick="document.getElementById('assetModalOverlay').remove()" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
        <h2 style="margin: 0 0 4px 0; font-size: 1.2rem; color: var(--text-primary); font-weight: 700;">${name}</h2>
        <p style="margin: 0 0 20px 0; font-size: 0.85rem; color: var(--text-secondary);">${address}, ${comuna}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: var(--bg-secondary); padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Superficie Arrendable</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${gla}</div>
          </div>
          <div style="background: var(--bg-secondary); padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Peso en el Fondo</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${pesoFondo}</div>
          </div>
          <div style="background: var(--bg-secondary); padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Vacancia</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${vacancia}</div>
          </div>
          <div style="background: var(--bg-secondary); padding: 12px; border-radius: 8px;">
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Propiedad</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">100%</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

// ── 7. Populate Region Table ─────────────────────────────
function renderRegionTable() {
  const table = document.getElementById('regionTable');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Region</th>
        <th class="text-right">Oficinas (m²)</th>
        <th class="text-right">Comercial (m²)</th>
        <th class="text-right">Bodegas (m²)</th>
        <th class="text-right">% Renta Pot.</th>
      </tr>
    </thead>
    <tbody>
      ${assetPortfolio.byRegion.map(r => `
        <tr>
          <td><strong>${r.region}</strong></td>
          <td class="text-right">${r.oficinas ? r.oficinas.toLocaleString('es-CL') : '—'}</td>
          <td class="text-right">${r.comercial ? r.comercial.toLocaleString('es-CL') : '—'}</td>
          <td class="text-right">${r.bodegas ? r.bodegas.toLocaleString('es-CL') : '—'}</td>
          <td class="text-right highlight">${r.pctRentaPotencial}%</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

// ── 8. Deleveraging Section ──────────────────────────────
function renderDeleveragingSection() {
  // KPIs
  const kpisContainer = document.getElementById('deleveragingKpis');
  if (kpisContainer) {
    const kpiData = [
      { label: 'Deuda Bruta Actual', value: 'UF 9,9 mm', sub: 'Desde UF 15,8 mm en 4Q 2022' },
      { label: 'Reduccion Deuda', value: '-37%', sub: 'Deuda financiera bruta' },
      { label: 'Caja por Ventas', value: 'UF 2,15 mm', sub: 'Generada desde 4Q 2022' },
      { label: 'RCSD', value: `${kpis.dscr}x`, sub: 'Ratio cobertura de deuda' },
    ];
    kpisContainer.innerHTML = kpiData.map(k => `
      <div class="card">
        <div class="metric-label">${k.label}</div>
        <div class="metric-value small">${k.value}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${k.sub}</div>
      </div>
    `).join('');
  }

  // Highlights
  const highlightsContainer = document.getElementById('deleveragingHighlights');
  if (highlightsContainer) {
    highlightsContainer.innerHTML = deleveraging.highlights.map(h => `
      <div class="deleveraging-highlight-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${h}</span>
      </div>
    `).join('');
  }

  // Events
  const eventsContainer = document.getElementById('deleveragingEvents');
  if (eventsContainer) {
    eventsContainer.innerHTML = `
      <div class="metric-label" style="margin-bottom: var(--space-sm);">Eventos Clave</div>
      ${deleveraging.events.map(e => `
        <div class="deleveraging-event-item">
          <span class="event-quarter">${e.quarter}</span>
          <span class="event-label">${e.label}</span>
        </div>
      `).join('')}
    `;
  }
}

// ── 9. Debt KPIs ─────────────────────────────────────────
function renderDebtKpis() {
  const container = document.getElementById('debtKpis');
  if (!container) return;

  const kpiData = [
    { label: 'Duration', value: `${debtStructure.duration} anos`, sub: `@ UF + ${debtStructure.rate}%` },
    { label: 'Estructura Bullet', value: `${debtStructure.structure[1].pct}%`, sub: 'vs 18% Amortizing' },
    { label: 'Reduccion Deuda', value: `-${debtStructure.debtReduction}%`, sub: '1T 2024 → 1T 2026' },
    { label: 'DSCR', value: `${kpis.dscr}x`, sub: 'Ratio cobertura de deuda' },
  ];

  container.innerHTML = kpiData.map(k => `
    <div class="card">
      <div class="metric-label">${k.label}</div>
      <div class="metric-value small">${k.value}</div>
      <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${k.sub}</div>
    </div>
  `).join('');
}

// ── 10. Risk Classification Section ──────────────────────
function renderRiskClassification() {
  const container = document.getElementById('riskRatingSection');
  if (!container) return;

  const rc = riskClassification;
  container.innerHTML = `
    <div class="risk-rating-panel">
      <div class="risk-rating-badge">
        <div class="risk-badge-label">Clasificacion de Cuota</div>
        <div class="risk-badge-value">${rc.rating}</div>
        <div class="risk-badge-agency">${rc.agency}</div>
      </div>
      <div class="risk-metrics-grid">
        <div class="risk-metric">
          <div class="metric-label">Loan to Value</div>
          <div class="metric-value small">${rc.loanToValue}</div>
        </div>
        <div class="risk-metric">
          <div class="metric-label">Cap Rate Contable</div>
          <div class="metric-value small">${rc.capRateContable}</div>
        </div>
        <div class="risk-metric">
          <div class="metric-label">Cap Rate Bursatil</div>
          <div class="metric-value small">${rc.capRateBursatil}</div>
        </div>
        <div class="risk-metric">
          <div class="metric-label">Div. Yield + Amort.</div>
          <div class="metric-value small">${rc.dividendYieldPlusAmort}</div>
        </div>
        <div class="risk-metric">
          <div class="metric-label">Leverage</div>
          <div class="metric-value small">${rc.leverage}</div>
        </div>
        <div class="risk-metric">
          <div class="metric-label">Dividend Yield</div>
          <div class="metric-value small">${rc.dividendYield}</div>
        </div>
      </div>
    </div>
  `;
}

// ── 11. Tasaciones Table ─────────────────────────────────
function renderTasacionesTable() {
  const table = document.getElementById('tasacionesTable');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Tipo de Activo</th>
        <th class="text-right">2019</th>
        <th class="text-right">2023</th>
        <th class="text-right">2024</th>
        <th class="text-right">2025</th>
        <th class="text-right">Var 25/19</th>
        <th class="text-right">Var 25/24</th>
      </tr>
    </thead>
    <tbody>
      ${tasaciones.byAssetType.map(t => `
        <tr>
          <td><strong>${t.type}</strong></td>
          <td class="text-right">${t.y2019}</td>
          <td class="text-right">${t.y2023}</td>
          <td class="text-right">${t.y2024}</td>
          <td class="text-right highlight">${t.y2025}</td>
          <td class="text-right ${t.var25vs19 >= 0 ? 'positive' : 'negative'}">${t.var25vs19 > 0 ? '+' : ''}${t.var25vs19}%</td>
          <td class="text-right ${t.var25vs24 >= 0 ? 'positive' : 'negative'}">${t.var25vs24 > 0 ? '+' : ''}${t.var25vs24}%</td>
        </tr>
      `).join('')}
      <tr style="font-weight: 700;">
        <td>Total</td>
        <td class="text-right">${tasaciones.total.y2019}</td>
        <td class="text-right">${tasaciones.total.y2023}</td>
        <td class="text-right">${tasaciones.total.y2024}</td>
        <td class="text-right highlight">${tasaciones.total.y2025}</td>
        <td class="text-right ${tasaciones.total.var25vs19 >= 0 ? 'positive' : 'negative'}">${tasaciones.total.var25vs19}%</td>
        <td class="text-right ${tasaciones.total.var25vs24 >= 0 ? 'positive' : 'negative'}">+${tasaciones.total.var25vs24}%</td>
      </tr>
    </tbody>
  `;
}

// ── 12. Valuation Comparison ─────────────────────────────
function renderValuationComparison() {
  const container = document.getElementById('valuationComparison');
  if (!container) return;

  container.innerHTML = `
    <div class="comparison-card" style="border-left: 3px solid var(--accent-primary);">
      <div class="provider-name" style="color: var(--accent-primary);">${valuations.sitka.name}</div>
      <div class="provider-method">${valuations.sitka.method}</div>
      <div class="values-grid">
        <div class="value-item">
          <div class="value-label">Serie A</div>
          <div class="value-number" style="color: var(--accent-primary);">$${valuations.sitka.serieA.s2_2025.toLocaleString()}</div>
          <div class="metric-change positive">+${valuations.sitka.serieA.change}% 2S 2025</div>
        </div>
        <div class="value-item">
          <div class="value-label">Serie I</div>
          <div class="value-number" style="color: var(--accent-primary);">$${valuations.sitka.serieI.s2_2025.toLocaleString()}</div>
          <div class="metric-change positive">+${valuations.sitka.serieI.change}% 2S 2025</div>
        </div>
      </div>
      <div class="divider"></div>
      <div style="display: flex; gap: var(--space-lg); font-size: 0.72rem;">
        <div><span style="color: var(--text-muted);">Flujo de Caja:</span> <strong>${valuations.sitka.flujoCaja.toLocaleString()} UF</strong></div>
        <div><span style="color: var(--text-muted);">VP Inversiones:</span> <strong>${valuations.sitka.vpInversiones.toLocaleString()} UF</strong></div>
      </div>
    </div>
    <div class="comparison-card" style="border-left: 3px solid var(--accent-secondary);">
      <div class="provider-name" style="color: var(--accent-secondary);">${valuations.mcya.name}</div>
      <div class="provider-method">${valuations.mcya.method}</div>
      <div class="values-grid">
        <div class="value-item">
          <div class="value-label">Serie A</div>
          <div class="value-number" style="color: var(--accent-secondary);">$${valuations.mcya.serieA.value.toLocaleString()}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">P/VL: ${valuations.mcya.serieA.priceToBook}x</div>
        </div>
        <div class="value-item">
          <div class="value-label">Serie I</div>
          <div class="value-number" style="color: var(--accent-secondary);">$${valuations.mcya.serieI.value.toLocaleString()}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">P/VL: ${valuations.mcya.serieI.priceToBook}x</div>
        </div>
      </div>
      <div class="divider"></div>
      <div style="display: flex; gap: var(--space-lg); font-size: 0.72rem;">
        <div><span style="color: var(--text-muted);">Equity A:</span> <strong>${valuations.mcya.equityUF_A.toLocaleString()} UF</strong></div>
        <div><span style="color: var(--text-muted);">Tasa Desc.:</span> <strong>${valuations.mcya.discountRate}%</strong></div>
      </div>
    </div>
  `;
}

// ── 13. Tenant Bars ──────────────────────────────────────
let tenantSearchQuery = '';

function renderTenantBars() {
  const container = document.getElementById('tenantBars');
  if (!container) return;

  let list = tenants.top20;
  if (tenantSearchQuery.trim()) {
    const q = tenantSearchQuery.toLowerCase();
    list = list.filter(t => t.name.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">No se encontraron arrendatarios.</div>`;
    return;
  }

  const maxPct = Math.max(...tenants.top20.map(t => t.pctIncome));
  const colors = ['#0a2d4d', '#2563eb', '#d97706', '#059669', '#7c3aed', '#0891b2', '#dc2626', '#0a2d4d'];

  container.innerHTML = `
    <div class="bar-chart-horizontal">
      ${list.map((t, i) => `
        <div class="bar-item">
          <div class="bar-label">${t.name}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${(t.pctIncome / maxPct) * 100}%; background: ${colors[i % colors.length]};" data-width="${(t.pctIncome / maxPct) * 100}"></div>
          </div>
          <div class="bar-value">${t.pctIncome}%</div>
        </div>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    container.querySelectorAll('.bar-fill').forEach(bar => {
      const w = bar.dataset.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        bar.style.width = `${w}%`;
      });
    });
  }, 100);
}

function initTenantSearch() {
  const input = document.getElementById('tenantSearchInput');
  if (input) {
    input.addEventListener('input', (e) => {
      tenantSearchQuery = e.target.value;
      renderTenantBars();
    });
  }
}

// ── 14. Tenant Metrics ───────────────────────────────────
function renderTenantMetrics() {
  const container = document.getElementById('tenantMetrics');
  if (!container) return;

  const metrics = [
    { label: 'WALT (anos a termino)', value: '5,0', desc: 'Weighted Average Lease Term' },
    { label: 'Ingresos fijos', value: '94%', desc: 'Porcentaje de rentas fijas vs variables' },
    { label: 'Top 20 concentracion', value: '44,7%', desc: 'Los 20 principales representan menos del 50%' },
    { label: 'Vacancia financiera', value: `${kpis.vacanciaConsolidada}%`, desc: 'Vacancia consolidada del fondo' },
    { label: 'Diversificacion sectorial', value: '12 sectores', desc: 'Servicios, Retail, Financiero, Salud, etc.' },
    { label: 'Vencimiento promedio', value: '5,0 anos', desc: 'A fecha de termino de contrato' },
  ];

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
      ${metrics.map(m => `
        <div style="padding: var(--space-md); background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div class="metric-label">${m.label}</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">${m.value}</div>
          <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px;">${m.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── 15. Fund Highlights ──────────────────────────────────
function renderFundHighlights() {
  const container = document.getElementById('highlightsGrid');
  if (!container) return;

  container.innerHTML = fundHighlights.map(h => `
    <div class="highlight-card">
      <div class="highlight-card-header">
        <span class="highlight-category">${h.category}</span>
        <span class="highlight-date">${h.date}</span>
      </div>
      <h3 class="highlight-title">${h.title}</h3>
      <p class="highlight-description">${h.description}</p>
    </div>
  `).join('');
}

// ── INITIALIZATION ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Scroll
  initNavbarAndScroll();

  // Animated counters
  initCounters();

  // Scroll reveals
  initRevealAnimations();

  // Dynamic content population
  renderBalanceCards();
  renderPortfolioCalugas();
  renderPortfolioExpanded();
  renderRegionTable();
  renderDeleveragingSection();
  renderDebtKpis();
  renderRiskClassification();
  renderTasacionesTable();
  renderValuationComparison();
  renderTenantBars();
  initTenantSearch();
  renderTenantMetrics();
  renderFundHighlights();

  // Render Chart.js charts
  setTimeout(() => {
    const c1 = document.getElementById('chartPatrimonio');
    if (c1) renderPatrimonioChart(c1.getContext('2d'), historicalData);

    const c2 = document.getElementById('chartNoiDscr');
    if (c2) renderNoiDscrChart(c2.getContext('2d'), historicalData);

    const c3 = document.getElementById('chartDebtNoi');
    if (c3) renderDebtNoiChart(c3.getContext('2d'), historicalData);

    const c4 = document.getElementById('chartDebtEquity');
    if (c4) renderDebtEquityChart(c4.getContext('2d'), historicalData);

    const c5 = document.getElementById('chartPortfolioComposition');
    if (c5) renderPortfolioComposition(c5.getContext('2d'));

    const c6 = document.getElementById('chartTasaciones');
    if (c6) renderTasacionesChart(c6.getContext('2d'), tasaciones);

    const c7 = document.getElementById('chartCapRates');
    if (c7) renderCapRatesChart(c7.getContext('2d'), capRates);

    const c8 = document.getElementById('chartValuationComp');
    if (c8) renderValuationCompChart(c8.getContext('2d'), valuations);

    const c9 = document.getElementById('chartTenantActivity');
    if (c9) renderTenantActivityChart(c9.getContext('2d'), tenants);

    const c10 = document.getElementById('chartContractProfile');
    if (c10) renderContractProfileChart(c10.getContext('2d'), tenants);

    const c11 = document.getElementById('chartDebtComposition');
    if (c11) renderDebtCompositionChart(c11.getContext('2d'), debtStructure);

    const c12 = document.getElementById('chartAmortization');
    if (c12) renderAmortizationChart(c12.getContext('2d'), debtStructure);

    // New deleveraging chart
    renderDeleveragingChart('chartDeleveraging', deleveraging);
  }, 300);
});
