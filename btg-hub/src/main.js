// ============================================================
// BTG Intelligence Hub – Main Entry Point
// ============================================================

import './styles/main.css';
import {
  fundInfo, kpis, balanceSheet, incomeStatement,
  corporateStructure, assetPortfolio, tasaciones,
  capRates, valuations, tenants, debtStructure,
  historicalData, marketData, marketNewsAndContingencies,
} from './data/fund-data.js';
import {
  renderPatrimonioChart, renderNoiDscrChart,
  renderDebtNoiChart, renderDebtEquityChart,
  renderTasacionesChart, renderCapRatesChart,
  renderPortfolioComposition, renderTenantActivityChart,
  renderContractProfileChart, renderDebtCompositionChart,
  renderAmortizationChart, renderValuationCompChart,
} from './charts.js';
import { initSimulator } from './simulator.js';

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

// ── 2. Executive Summary Modal ───────────────────────────
function initExecutiveModal() {
  const modal = document.getElementById('executiveModal');
  const btnOpen = document.getElementById('btnExecutiveSummary');
  const btnClose = document.getElementById('modalClose');

  if (!modal || !btnOpen || !btnClose) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ── 3. Animated Counters ─────────────────────────────────
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
      icon: '💎',
      iconClass: 'purple',
      change: `+${((bs.assets.totalAssets / balanceSheet.previous.assets.totalAssets - 1) * 100).toFixed(1)}%`,
      positive: true,
    },
    {
      label: 'Patrimonio Neto',
      value: fmtMM(bs.equity.totalEquity / 1000),
      icon: '🏦',
      iconClass: 'green',
      change: `+${((bs.equity.totalEquity / balanceSheet.previous.equity.totalEquity - 1) * 100).toFixed(1)}%`,
      positive: true,
    },
    {
      label: 'Resultado Q1 2026',
      value: fmtMM(is.netIncome / 1000),
      icon: '📈',
      iconClass: 'gold',
      change: `${((is.netIncome / incomeStatement.q1_2025.netIncome - 1) * 100).toFixed(1)}%`,
      positive: is.netIncome >= incomeStatement.q1_2025.netIncome,
    },
    {
      label: 'Ingresos Operacionales',
      value: fmtMM(is.totalOperatingIncome / 1000),
      icon: '💰',
      iconClass: 'blue',
      change: `${((is.totalOperatingIncome / incomeStatement.q1_2025.totalOperatingIncome - 1) * 100).toFixed(1)}%`,
      positive: false,
    },
  ];

  container.innerHTML = cards.map(c => `
    <div class="card">
      <div class="card-header">
        <div class="card-icon ${c.iconClass}">${c.icon}</div>
      </div>
      <div class="metric-label">${c.label}</div>
      <div class="metric-value small">${c.value}</div>
      <div class="metric-change ${c.positive ? 'positive' : 'negative'}">${c.change} vs Q1 2025</div>
    </div>
  `).join('');
}

import { Building3DRenderer } from './building-3d.js';

let building3dInstance = null;
let activeSubId = 'rentas-ii';

// ── 6. Populate Corporate Structure & 3D Projector ───────
function renderCorporateStructure() {
  const container = document.getElementById('structureDiagram');
  if (!container) return;

  container.innerHTML = `
    <div class="structure-node root ${activeSubId === 'root' ? 'active-node' : ''}" data-sub-id="root" style="border-left: 3px solid var(--accent-primary);">
      <div class="node-name">${corporateStructure.fund.name}</div>
      <div class="node-rut">${corporateStructure.fund.rut}</div>
      <div class="node-ownership">FONDO MATRIZ</div>
      <div class="node-3d-hint">⚡ Proyectar Portafolio 3D</div>
    </div>
    <div class="structure-connector"></div>
    <div class="structure-children">
      ${corporateStructure.subsidiaries.map(sub => `
        <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-sm);">
          <div class="structure-node ${activeSubId === sub.id ? 'active-node' : ''}" data-sub-id="${sub.id}" style="border-left: 3px solid ${sub.color};">
            <div class="node-name" style="font-size: 0.78rem;">${sub.name}</div>
            <div class="node-rut">${sub.rut}</div>
            <div class="node-ownership">${sub.ownership} · ${sub.assetType}</div>
            <div style="font-size: 0.64rem; color: var(--text-muted); margin-top: 4px;">${sub.assetCount} activos · ${sub.glaTotal}</div>
            <div class="node-3d-hint">🔍 Proyectar Activos 3D</div>
          </div>
          ${sub.children ? `
            <div class="structure-connector" style="height: 20px;"></div>
            <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap; justify-content: center;">
              ${sub.children.map(child => `
                <div class="structure-node" data-sub-id="${sub.id}" style="min-width: 140px; border-left: 3px solid ${sub.color}; opacity: 0.85;">
                  <div class="node-name" style="font-size: 0.68rem;">${child.name}</div>
                  <div class="node-rut">${child.rut}</div>
                  <div class="node-ownership">${child.ownership}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;

  initCorporateHologramProjector();
}

function initCorporateHologramProjector() {
  const inspectorContainer = document.getElementById('hologramInspector');
  if (!inspectorContainer) return;

  // Find active entity
  let currentEntity = null;
  if (activeSubId === 'root') {
    currentEntity = {
      name: corporateStructure.fund.name,
      rut: corporateStructure.fund.rut,
      ownership: '100% FONDO',
      assetType: 'Portafolio Consolidado 34 Activos',
      color: '#2b8cff',
      modelType: 'mixed_complex',
      glaTotal: corporateStructure.fund.totalGLA,
      assetCount: 34,
      rentaPct: '100%',
      highlights: 'Consolidación de activos inmobiliarios comerciales, oficinas corporativas y centros logísticos en Chile.',
      controlledAssets: [
        { name: 'Edificio Torre Costanera', address: 'Av. Vitacura / Cerro Colorado', submercado: 'Nueva Las Condes', ownership: '100%', gla: '30.230 m²', occupancy: '100%' },
        { name: 'Edificio El Bosque 500', address: 'Av. El Bosque Norte 500', submercado: 'El Golf / Las Condes', ownership: '100%', gla: '18.420 m²', occupancy: '96%' },
        { name: 'Mall Paseo Los Trapenses', address: 'Av. Los Trapenses 3515, Lo Barnechea', submercado: 'RM - Oriente', ownership: '100%', gla: '44.800 m²', occupancy: '99%' },
        { name: 'Centro Logístico Cargo Park Pudahuel', address: 'Av. Américo Vespucio / Eje Aeropuerto', submercado: 'RM - Poniente', ownership: '100%', gla: '77.388 m²', occupancy: '93%' },
        { name: 'Power Center Coquimbo', address: 'Ruta 5 Norte / Coquimbo', submercado: 'IV Región', ownership: '100%', gla: '19.083 m²', occupancy: '100%' },
        { name: 'Red Concesión Estacionamientos Las Condes', address: 'Plaza Perú / Apoquindo / El Golf', submercado: 'Las Condes', ownership: '99.96%', gla: '3.200 calzadas', occupancy: '95%' },
        { name: 'Mall Paseo Quilpué', address: 'Av. Los Carrera 800, Quilpué', submercado: 'V Región', ownership: '100%', gla: '22.400 m²', occupancy: '98%' },
        { name: 'Edificio Gertrudis Echeñique 30', address: 'Gertrudis Echeñique 30', submercado: 'El Golf / Las Condes', ownership: '100%', gla: '12.850 m²', occupancy: '98%' },
      ],
    };
  } else {
    currentEntity = corporateStructure.subsidiaries.find(s => s.id === activeSubId) || corporateStructure.subsidiaries[0];
  }

  // Render Inspector HTML
  inspectorContainer.innerHTML = `
    <div class="hologram-inspector">
      <div class="hologram-header">
        <div class="hologram-title-group">
          <span class="hologram-status-badge">
            <span class="beacon"></span>
            Proyección 3D Activa
          </span>
          <div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0;">
              ${currentEntity.name}
            </h4>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
              RUT: ${currentEntity.rut} · Control: ${currentEntity.ownership}
            </span>
          </div>
        </div>
        <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap;">
          <span class="tag" style="background: rgba(43, 140, 255, 0.15); color: var(--accent-light-blue);">${currentEntity.assetType}</span>
          <span class="tag green">${currentEntity.rentaPct} Renta del Fondo</span>
        </div>
      </div>

      <div class="hologram-body">
        <!-- 3D Hologram Canvas -->
        <div>
          <div class="hologram-canvas-container" id="canvas3DContainer">
            <canvas class="hologram-canvas" id="building3dCanvas"></canvas>
          </div>
          <div class="hologram-model-info">
            <span>ARQUETIPO: <strong>${currentEntity.modelType.toUpperCase()}</strong></span>
            <span style="color: var(--accent-primary);">3D INTERACTIVO 360°</span>
          </div>
        </div>

        <!-- Controlled Assets Details & List -->
        <div class="hologram-details">
          <div class="hologram-kpi-row">
            <div class="hologram-kpi-card">
              <div class="metric-label">Superficie GLA</div>
              <div class="kpi-num" style="color: var(--accent-primary);">${currentEntity.glaTotal}</div>
            </div>
            <div class="hologram-kpi-card">
              <div class="metric-label">Activos Controlados</div>
              <div class="kpi-num">${currentEntity.assetCount}</div>
            </div>
            <div class="hologram-kpi-card">
              <div class="metric-label">Participación Renta</div>
              <div class="kpi-num" style="color: var(--accent-tertiary);">${currentEntity.rentaPct}</div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
              <span class="metric-label" style="font-size: 0.75rem;">Activos Proyectados en Esta Sociedad:</span>
              <span style="font-size: 0.7rem; color: var(--text-muted);">${currentEntity.highlights}</span>
            </div>
            <div class="controlled-assets-list">
              ${(currentEntity.controlledAssets || []).map(asset => `
                <div class="asset-projected-card">
                  <div class="asset-name">${asset.name}</div>
                  <div class="asset-address">${asset.address}</div>
                  <div class="asset-stats-row">
                    <span class="tag blue">${asset.submercado}</span>
                    <span style="color: #ffffff; font-weight: 600;">${asset.gla}</span>
                    <span style="color: var(--accent-success); font-weight: 600;">${asset.occupancy || '100%'} Ocup.</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize or update 3D building canvas
  const canvas = document.getElementById('building3dCanvas');
  if (canvas) {
    if (building3dInstance) {
      building3dInstance.stop();
    }
    building3dInstance = new Building3DRenderer(canvas);
    building3dInstance.setModel(currentEntity.modelType, currentEntity.color || '#2b8cff');
    building3dInstance.start();
  }

  // Bind click & hover events on nodes
  const nodes = document.querySelectorAll('.structure-node');
  nodes.forEach(node => {
    const subId = node.dataset.subId;
    if (!subId) return;

    node.addEventListener('click', () => {
      if (activeSubId !== subId) {
        activeSubId = subId;
        renderCorporateStructure();
      }
    });

    node.addEventListener('mouseenter', () => {
      if (activeSubId !== subId) {
        activeSubId = subId;
        renderCorporateStructure();
      }
    });
  });
}


// ── 7. Populate Asset Summary Cards ──────────────────────
function renderAssetSummary() {
  const container = document.getElementById('assetSummaryCards');
  if (!container) return;

  const assets = [
    {
      title: 'Oficinas',
      gla: '116.430 m²',
      count: '12 edificios',
      rentaPct: '42,4%',
      icon: '🏢',
      iconClass: 'blue',
      markets: assetPortfolio.summary.oficinas.submercados.join(', '),
    },
    {
      title: 'Centros Comerciales',
      gla: '163.576 m²',
      count: '2 Malls, 2 Power Centers, 9 Strip Centers, 9 Stand Alone',
      rentaPct: '55,9%',
      icon: '🛍️',
      iconClass: 'green',
      markets: 'Malls, Power Centers, Strip Centers, Stand Alone',
    },
    {
      title: 'Bodegas & Estacionamientos',
      gla: '77.388 m²',
      count: '1 Centro de Bodegas + 3 Estacionamientos',
      rentaPct: '1,7%',
      icon: '📦',
      iconClass: 'gold',
      markets: 'Cargo Park, Estac. Las Condes',
    },
  ];

  container.innerHTML = assets.map(a => `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">${a.title}</div>
          <div class="card-subtitle">${a.count}</div>
        </div>
        <div class="card-icon ${a.iconClass}">${a.icon}</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-md);">
        <div>
          <div class="metric-label">GLA</div>
          <div class="metric-value small">${a.gla}</div>
        </div>
        <div class="tag ${a.iconClass}">${a.rentaPct} renta</div>
      </div>
      <div style="font-size: 0.72rem; color: var(--text-muted);">${a.markets}</div>
    </div>
  `).join('');
}

// ── 8. Populate Region Table ─────────────────────────────
function renderRegionTable() {
  const table = document.getElementById('regionTable');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Región</th>
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

// ── 9. Populate Oficinas Table with Filtering ────────────
let activeOfficeFilter = 'all';
let officeSearchQuery = '';

function renderOficinasTable() {
  const table = document.getElementById('oficinasTable');
  if (!table) return;

  let list = assetPortfolio.oficinas;

  // Apply filter pill
  if (activeOfficeFilter !== 'all') {
    list = list.filter(o => o.submercado.toLowerCase().includes(activeOfficeFilter.toLowerCase()));
  }

  // Apply search query
  if (officeSearchQuery.trim()) {
    const q = officeSearchQuery.toLowerCase();
    list = list.filter(o => 
      o.name.toLowerCase().includes(q) || 
      o.address.toLowerCase().includes(q) || 
      o.submercado.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    table.innerHTML = `
      <thead>
        <tr><th>Activo</th><th>Dirección</th><th>Submercado</th><th class="text-right">Participación</th></tr>
      </thead>
      <tbody>
        <tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron activos para la búsqueda.</td></tr>
      </tbody>
    `;
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Activo</th>
        <th>Dirección</th>
        <th>Submercado</th>
        <th class="text-right">Participación</th>
      </tr>
    </thead>
    <tbody>
      ${list.map(o => `
        <tr>
          <td><strong>${o.name}</strong></td>
          <td>${o.address}</td>
          <td><span class="tag blue">${o.submercado}</span></td>
          <td class="text-right highlight">${o.ownership}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function initOfficeControls() {
  const pills = document.querySelectorAll('#officeFilterPills .filter-pill');
  const searchInput = document.getElementById('officeSearchInput');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeOfficeFilter = pill.dataset.filter;
      renderOficinasTable();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      officeSearchQuery = e.target.value;
      renderOficinasTable();
    });
  }
}

// ── 10. Populate Tasaciones Table ────────────────────────
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

// ── 11. Populate Valuation Comparison ────────────────────
function renderValuationComparison() {
  const container = document.getElementById('valuationComparison');
  if (!container) return;

  container.innerHTML = `
    <div class="comparison-card" style="border-left: 3px solid var(--accent-primary);">
      <div class="provider-name" style="color: var(--accent-primary);">🔍 ${valuations.sitka.name}</div>
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
      <div class="provider-name" style="color: var(--accent-secondary);">📊 ${valuations.mcya.name}</div>
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

// ── 12. Populate Tenant Bars with Search ─────────────────
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
  const colors = ['#2b8cff', '#5ba3ff', '#f0b429', '#7ec8f8', '#34d399', '#a3c4f3', '#f0b429', '#2b8cff'];

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

  // Animate bars
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

// ── 13. Populate Tenant Metrics ──────────────────────────
function renderTenantMetrics() {
  const container = document.getElementById('tenantMetrics');
  if (!container) return;

  const metrics = [
    { label: 'WALT (años a término)', value: '5,0', icon: '📅', desc: 'Weighted Average Lease Term' },
    { label: 'Ingresos fijos', value: '94%', icon: '🔒', desc: 'Porcentaje de rentas fijas vs variables' },
    { label: 'Top 20 concentración', value: '44,7%', icon: '📊', desc: 'Los 20 principales representan menos del 50%' },
    { label: 'Vacancia financiera', value: `${kpis.vacanciaConsolidada}%`, icon: '📉', desc: 'Vacancia consolidada del fondo' },
    { label: 'Diversificación sectorial', value: '12 sectores', icon: '🏗️', desc: 'Servicios, Retail, Financiero, Salud, etc.' },
    { label: 'Vencimiento promedio', value: '5,0 años', icon: '⏱️', desc: 'A fecha de término de contrato' },
  ];

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
      ${metrics.map(m => `
        <div style="padding: var(--space-md); background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 1.1rem; margin-bottom: var(--space-xs);">${m.icon}</div>
          <div class="metric-label">${m.label}</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">${m.value}</div>
          <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px;">${m.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── 14. Populate Debt KPIs ───────────────────────────────
function renderDebtKpis() {
  const container = document.getElementById('debtKpis');
  if (!container) return;

  const kpiData = [
    { label: 'Duration', value: `${debtStructure.duration} años`, sub: `@ UF + ${debtStructure.rate}%`, icon: '⏱️', iconClass: 'blue' },
    { label: 'Estructura Bullet', value: `${debtStructure.structure[1].pct}%`, sub: 'vs 18% Amortizing', icon: '📊', iconClass: 'purple' },
    { label: 'Reducción Deuda', value: `-${debtStructure.debtReduction}%`, sub: '1T 2024 → 1T 2026', icon: '📉', iconClass: 'green' },
    { label: 'DSCR', value: `${kpis.dscr}x`, sub: 'Ratio cobertura de deuda', icon: '🛡️', iconClass: 'gold' },
  ];

  container.innerHTML = kpiData.map(k => `
    <div class="card">
      <div class="card-header">
        <div class="card-icon ${k.iconClass}">${k.icon}</div>
      </div>
      <div class="metric-label">${k.label}</div>
      <div class="metric-value small">${k.value}</div>
      <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${k.sub}</div>
    </div>
  `).join('');
}

// ── 15. Populate Market Section ──────────────────────────
function renderMarketSection() {
  const kpisContainer = document.getElementById('marketKpis');
  if (kpisContainer) {
    const mkpis = [
      { label: 'Presencia Bursátil', value: `${marketData.presenciaBursatil.btg}%`, sub: 'CFIBTGRCA', icon: '📈', iconClass: 'green' },
      { label: 'Vacancia Oficinas Santiago', value: `${marketData.officasVacancy.q1_2026}%`, sub: `↓ desde ${marketData.officasVacancy.q4_2025}%`, icon: '🏢', iconClass: 'blue' },
      { label: 'Vol. Transado U12M', value: `$${(marketData.volumeTraded.btg.last12m).toLocaleString()}`, sub: 'MM CLP últimos 12 meses', icon: '💹', iconClass: 'gold' },
    ];

    kpisContainer.innerHTML = mkpis.map(k => `
      <div class="card">
        <div class="card-header">
          <div class="card-icon ${k.iconClass}">${k.icon}</div>
        </div>
        <div class="metric-label">${k.label}</div>
        <div class="metric-value small">${k.value}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${k.sub}</div>
      </div>
    `).join('');
  }

  // Volume Table
  const volumeTable = document.getElementById('volumeTable');
  if (volumeTable) {
    const vd = marketData.volumeTraded;
    volumeTable.innerHTML = `
      <thead>
        <tr>
          <th>Métrica</th>
          <th class="text-right">BTG RC</th>
          <th class="text-right">Peer 1</th>
          <th class="text-right">Peer 2</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Último mes</td><td class="text-right highlight">${vd.btg.lastMonth}</td><td class="text-right">${vd.peer1.lastMonth}</td><td class="text-right">${vd.peer2.lastMonth}</td></tr>
        <tr><td>Promedio U6M</td><td class="text-right highlight">${vd.btg.avg6m}</td><td class="text-right">${vd.peer1.avg6m}</td><td class="text-right">${vd.peer2.avg6m}</td></tr>
        <tr><td>Promedio U12M</td><td class="text-right highlight">${vd.btg.avg12m}</td><td class="text-right">${vd.peer1.avg12m}</td><td class="text-right">${vd.peer2.avg12m}</td></tr>
        <tr><td>Últimos 12 meses</td><td class="text-right highlight">${vd.btg.last12m.toLocaleString()}</td><td class="text-right">${vd.peer1.last12m.toLocaleString()}</td><td class="text-right">${vd.peer2.last12m.toLocaleString()}</td></tr>
        <tr><td>Presencia Bursátil</td><td class="text-right highlight">${marketData.presenciaBursatil.btg}%</td><td class="text-right">${marketData.presenciaBursatil.peer1}%</td><td class="text-right">${marketData.presenciaBursatil.peer2}%</td></tr>
      </tbody>
    `;
  }

  // Vacancy Section
  const vacancyEl = document.getElementById('vacancySection');
  if (vacancyEl) {
    vacancyEl.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 3.5rem; font-weight: 900; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          ${marketData.officasVacancy.q1_2026}%
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-sm);">Vacancia 1Q 2026</div>
      </div>
      <div style="display: flex; justify-content: center; gap: var(--space-xl);">
        <div style="text-align: center;">
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-secondary);">${marketData.officasVacancy.q4_2025}%</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Q4 2025</div>
        </div>
        <div style="font-size: 2rem; color: var(--accent-success);">→</div>
        <div style="text-align: center;">
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--accent-primary);">${marketData.officasVacancy.q1_2026}%</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Q1 2026</div>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: center; line-height: 1.6;">
        La vacancia del mercado de oficinas continuó mostrando una tendencia a la baja, reducción transversal en oficinas Clase A y Clase B. Fuente: JLL 1Q 2026.
      </div>
    `;
  }
}

// ── 16. NOTICIAS & CONTINGENCIAS DE MERCADO ──────────────
let newsCurrentFilter = 'all';
let newsSearchQuery = '';

function renderNewsSection() {
  const kpiContainer = document.getElementById('newsKpisContainer');
  const gridContainer = document.getElementById('newsCardsGrid');
  const filterPills = document.querySelectorAll('#newsFilterPills .filter-pill');
  const searchInput = document.getElementById('newsSearchInput');

  if (!gridContainer || !marketNewsAndContingencies) return;

  // Render KPI summary
  if (kpiContainer) {
    const kpisData = marketNewsAndContingencies.summaryKpis;
    kpiContainer.innerHTML = `
      <div class="kpi-card" style="border-top: 3px solid var(--accent-success);">
        <div class="kpi-label">Impacto Regulatorio Neto</div>
        <div class="kpi-value" style="font-size: 1.3rem; color: var(--accent-success);">${kpisData.regulatorioImpact}</div>
        <div class="kpi-sub">Foco en Renta Comercial & Flujo</div>
      </div>
      <div class="kpi-card" style="border-top: 3px solid var(--accent-primary);">
        <div class="kpi-label">Fuentes Monitoreadas</div>
        <div class="kpi-value" style="font-size: 1.15rem; color: #ffffff;">5 Consultoras</div>
        <div class="kpi-sub">${kpisData.sourcesMonitored}</div>
      </div>
      <div class="kpi-card" style="border-top: 3px solid var(--accent-light-blue);">
        <div class="kpi-label">Absorción Neta 1Q</div>
        <div class="kpi-value" style="font-size: 1.3rem; color: var(--accent-light-blue);">${kpisData.absorptionTrend}</div>
        <div class="kpi-sub">Reactivación Las Condes / Apoquindo</div>
      </div>
      <div class="kpi-card" style="border-top: 3px solid var(--accent-tertiary);">
        <div class="kpi-label">Tasa Política Monetaria</div>
        <div class="kpi-value" style="font-size: 1.3rem; color: var(--accent-tertiary);">${kpisData.tpmRate}</div>
        <div class="kpi-sub">Alivio en Gastos Financieros</div>
      </div>
    `;
  }

  // Filter cards function
  function updateNewsCards() {
    const filtered = marketNewsAndContingencies.items.filter(item => {
      const matchFilter = (newsCurrentFilter === 'all') || (item.category === newsCurrentFilter);
      const matchSearch = !newsSearchQuery ||
        item.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
        (item.affectedAssets || []).some(a => a.toLowerCase().includes(newsSearchQuery.toLowerCase()));
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          🔍 No se encontraron reportes o contingencias que coincidan con la búsqueda.
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(item => {
      const isPositive = item.impactLevel === 'positive';
      const isNeutral = item.impactLevel === 'neutral';
      const impactClass = isPositive ? '' : isNeutral ? 'neutral' : 'risk';

      return `
        <div class="news-card">
          <div>
            <div class="news-header-meta">
              <span class="news-source-tag ${item.category}">
                <span>●</span> ${item.categoryLabel}
              </span>
              <span class="news-date">${item.date} · ${item.source}</span>
            </div>

            <h3 class="news-title">${item.title}</h3>
            <p class="news-summary-text">${item.summary}</p>

            <div class="contingency-impact-box ${impactClass}">
              <div class="contingency-impact-header">
                <span class="contingency-impact-label">Impacto en BTG Renta Comercial:</span>
                <span class="tag ${isPositive ? 'green' : isNeutral ? 'gold' : 'red'}" style="font-size: 0.65rem;">
                  ${item.impactBadge}
                </span>
              </div>
              <div class="contingency-impact-body">
                ${item.fundImpactAnalysis
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n\n/g, '<br/>')
                }
              </div>
              ${item.affectedAssets ? `
                <div class="affected-assets-row">
                  <span style="font-size: 0.65rem; color: var(--text-muted); align-self: center; margin-right: 4px;">Activos Vinculados:</span>
                  ${item.affectedAssets.map(a => `<span class="affected-asset-tag">${a}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="news-card-actions">
            <button class="btn-news-copilot" data-prompt="${item.copilotPrompt}">
              <span>✨</span> Analizar con Copilot IA
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Connect Copilot buttons on cards
    gridContainer.querySelectorAll('.btn-news-copilot').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        const drawer = document.getElementById('aiChatDrawer');
        const chatInput = document.getElementById('aiChatInput');
        const chatForm = document.getElementById('aiChatForm');

        if (drawer && chatInput && chatForm) {
          drawer.classList.add('active');
          chatInput.value = prompt;
          setTimeout(() => {
            chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }, 150);
        }
      });
    });
  }

  // Filter Pills Event
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      newsCurrentFilter = pill.dataset.filter;
      updateNewsCards();
    });
  });

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      newsSearchQuery = e.target.value;
      updateNewsCards();
    });
  }

  // Initial render
  updateNewsCards();
}

import { BTGAIEngine } from './ai-engine.js';

// ── 16. AI Real Estate Copilot Chat ──────────────────────
const aiEngine = new BTGAIEngine();

function initAICopilot() {
  const triggerBtn = document.getElementById('btnOpenAICopilot');
  const closeBtn = document.getElementById('btnCloseAIChat');
  const clearBtn = document.getElementById('btnClearAIChat');
  const settingsBtn = document.getElementById('btnAISettings');
  const settingsCloseBtn = document.getElementById('btnCloseAISettings');
  const settingsPanel = document.getElementById('aiSettingsPanel');
  const providerSelect = document.getElementById('aiProviderSelect');
  const apiKeyInput = document.getElementById('aiApiKeyInput');
  const modelInput = document.getElementById('aiModelInput');
  const saveSettingsBtn = document.getElementById('btnSaveAISettings');
  const clearKeyBtn = document.getElementById('btnClearAIKey');

  const drawer = document.getElementById('aiChatDrawer');
  const chatForm = document.getElementById('aiChatForm');
  const chatInput = document.getElementById('aiChatInput');
  const messagesContainer = document.getElementById('aiChatMessages');
  const promptChips = document.querySelectorAll('#aiSuggestions .ai-prompt-chip');

  if (!triggerBtn || !drawer || !chatForm || !chatInput || !messagesContainer) return;

  // Load existing credentials into settings panel
  const creds = aiEngine.getCredentials();
  if (providerSelect) providerSelect.value = creds.provider;
  if (apiKeyInput) apiKeyInput.value = creds.apiKey;
  if (modelInput) modelInput.value = creds.model;

  // Toggle drawer
  triggerBtn.addEventListener('click', () => {
    drawer.classList.toggle('active');
    if (drawer.classList.contains('active')) {
      setTimeout(() => chatInput.focus(), 150);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
  }

  // Toggle Settings Panel
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => {
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (settingsCloseBtn && settingsPanel) {
    settingsCloseBtn.addEventListener('click', () => {
      settingsPanel.style.display = 'none';
    });
  }

  // Auto update model name on provider change
  if (providerSelect && modelInput) {
    providerSelect.addEventListener('change', () => {
      const p = providerSelect.value;
      if (p === 'groq') modelInput.value = 'llama-3.3-70b-versatile';
      else if (p === 'openai') modelInput.value = 'gpt-4o-mini';
      else if (p === 'openrouter') modelInput.value = 'deepseek/deepseek-chat';
      else if (p === 'gemini') modelInput.value = 'gemini-1.5-flash';
    });
  }

  // Save Settings
  if (saveSettingsBtn && settingsPanel) {
    saveSettingsBtn.addEventListener('click', () => {
      const p = providerSelect.value;
      const key = apiKeyInput.value.trim();
      const m = modelInput.value.trim();
      aiEngine.setCredentials(p, key, m);
      settingsPanel.style.display = 'none';

      // Notification bubble
      const notifMsg = document.createElement('div');
      notifMsg.className = 'ai-msg-assistant';
      notifMsg.innerHTML = `
        <div class="ai-response-card green">
          <div class="ai-response-title" style="color: var(--accent-success);">⚙️ Configuración Guardada</div>
          <div class="ai-response-text">
            Conectado al proveedor: <strong>${p.toUpperCase()}</strong> (${m}). ${key ? 'Clave de API activa para razonamiento LLM en vivo.' : 'Usando motor matemático local.'}
          </div>
        </div>
      `;
      messagesContainer.appendChild(notifMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  // Clear Key
  if (clearKeyBtn && settingsPanel) {
    clearKeyBtn.addEventListener('click', () => {
      if (apiKeyInput) apiKeyInput.value = '';
      aiEngine.setCredentials('groq', '', 'llama-3.3-70b-versatile');
      settingsPanel.style.display = 'none';
    });
  }

  // Clear chat
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      messagesContainer.innerHTML = `
        <div class="ai-msg-assistant">
          <div class="ai-response-card blue">
            <div class="ai-response-header">
              <h5 class="ai-response-title">🤖 Conversación Reiniciada</h5>
              <span class="tag blue">Listo</span>
            </div>
            <div class="ai-response-text">
              Hazme cualquier pregunta sobre sensibilidades de vacancia, ventas de activos, flujo de caja o valorizaciones.
            </div>
          </div>
        </div>
      `;
    });
  }

  // Quick prompt chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      if (!prompt) return;
      chatInput.value = prompt;
      handleUserSubmit(prompt);
    });
  });

  // Form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prompt = chatInput.value.trim();
    if (!prompt) return;
    handleUserSubmit(prompt);
  });

  async function handleUserSubmit(prompt) {
    chatInput.value = '';

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg-user';
    userMsg.textContent = prompt;
    messagesContainer.appendChild(userMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Append typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'ai-msg-assistant';
    typingMsg.id = 'aiTypingIndicator';
    typingMsg.innerHTML = `
      <div class="ai-typing-indicator">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span style="margin-left: 6px;">Razonando en vivo con datos del fondo...</span>
      </div>
    `;
    messagesContainer.appendChild(typingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Process via AI Engine
    try {
      const res = await aiEngine.processQuery(prompt);

      // Remove typing indicator
      const typingEl = document.getElementById('aiTypingIndicator');
      if (typingEl) typingEl.remove();

      // Append assistant response
      const assistantMsg = document.createElement('div');
      assistantMsg.className = 'ai-msg-assistant';

      const colorClass = res.badgeColor || 'blue';
      const kpisHtml = (res.kpis || []).map(k => `
        <div class="ai-kpi-chip">
          <div class="chip-label">${k.label}</div>
          <div class="chip-val" style="${k.positive ? 'color: var(--accent-success);' : k.negative ? 'color: var(--accent-danger);' : ''}">${k.value}</div>
          <div style="font-size: 0.6rem; color: var(--text-muted);">${k.change}</div>
        </div>
      `).join('');

      // Simple Markdown converter for lists, bold, and math
      const textToFormat = res.rawText || res.content || '';
      const formattedContent = textToFormat
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/#### (.*?)\n/g, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br/><br/>');

      assistantMsg.innerHTML = `
        <div class="ai-response-card ${colorClass}">
          <div class="ai-response-header">
            <h5 class="ai-response-title">${res.title}</h5>
            <span class="tag ${colorClass}">${res.badge || 'Análisis'}</span>
          </div>
          ${res.summary ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 8px;">${res.summary}</div>` : ''}
          ${kpisHtml ? `<div class="ai-response-kpis">${kpisHtml}</div>` : ''}
          <div class="ai-response-text">${formattedContent}</div>
          ${res.recommendation ? `<div class="ai-recommendation-box">${res.recommendation}</div>` : ''}
          ${res.apiError ? `<div style="font-size: 0.65rem; color: var(--accent-danger); margin-top: 6px;">(Nota: LLM API error: ${res.apiError}, calculado con motor analítico local)</div>` : ''}
        </div>
      `;

      messagesContainer.appendChild(assistantMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
      const typingEl = document.getElementById('aiTypingIndicator');
      if (typingEl) typingEl.remove();

      const errMsg = document.createElement('div');
      errMsg.className = 'ai-msg-assistant';
      errMsg.innerHTML = `
        <div class="ai-response-card" style="border-left-color: var(--accent-danger);">
          <div class="ai-response-title" style="color: var(--accent-danger);">Error de procesamiento</div>
          <div class="ai-response-text">No pude procesar la consulta en este momento. Intenta reformularla.</div>
        </div>
      `;
      messagesContainer.appendChild(errMsg);
    }
  }
}

// ── INITIALIZATION ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Scroll
  initNavbarAndScroll();

  // Executive Summary Modal
  initExecutiveModal();

  // AI Real Estate Copilot
  initAICopilot();

  // Animated counters
  initCounters();

  // Scroll reveals
  initRevealAnimations();

  // Dynamic content population
  renderBalanceCards();
  renderCorporateStructure();
  renderAssetSummary();
  renderRegionTable();
  renderOficinasTable();
  initOfficeControls();
  renderTasacionesTable();
  renderValuationComparison();
  renderTenantBars();
  initTenantSearch();
  renderTenantMetrics();
  renderDebtKpis();
  renderMarketSection();
  renderNewsSection();

  // Initialize simulator
  initSimulator();

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
  }, 300);
});

