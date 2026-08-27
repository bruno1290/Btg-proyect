// ============================================================
// BTG Intelligence Hub – Chart.js Configurations & Renderers
// ============================================================

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// ── Shared Theme Config ──────────────────────────────────
const COLORS = {
  primary: '#0a2d4d',
  primaryFaded: 'rgba(10, 45, 77, 0.15)',
  secondary: '#2563eb',
  secondaryFaded: 'rgba(37, 99, 235, 0.15)',
  tertiary: '#d97706',
  tertiaryFaded: 'rgba(217, 119, 6, 0.15)',
  blue: '#2563eb',
  blueFaded: 'rgba(37, 99, 235, 0.15)',
  danger: '#dc2626',
  dangerFaded: 'rgba(220, 38, 38, 0.15)',
  success: '#059669',
  text: '#0a2d4d',
  textMuted: '#64748b',
  gridLine: 'rgba(0, 0, 0, 0.06)',
  bg: '#ffffff',
};

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      labels: {
        color: COLORS.textMuted,
        font: { family: 'Inter', size: 11, weight: '500' },
        boxWidth: 12,
        boxHeight: 12,
        borderRadius: 3,
        padding: 16,
        usePointStyle: true,
        pointStyle: 'rectRounded',
      },
    },
    tooltip: {
      backgroundColor: '#0a2d4d',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: 'Inter', size: 12, weight: '600' },
      bodyFont: { family: 'Inter', size: 11 },
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      ticks: { color: COLORS.textMuted, font: { family: 'Inter', size: 10 } },
      grid: { color: COLORS.gridLine, drawBorder: false },
      border: { display: false },
    },
    y: {
      ticks: { color: COLORS.textMuted, font: { family: 'Inter', size: 10 } },
      grid: { color: COLORS.gridLine, drawBorder: false },
      border: { display: false },
    },
  },
};

function mergeDefaults(overrides) {
  return JSON.parse(JSON.stringify({ ...CHART_DEFAULTS, ...overrides }));
}

// ── 1. Patrimonio Evolution (Bar Chart) ──────────────────
export function renderPatrimonioChart(ctx, data) {
  const opts = mergeDefaults({});
  opts.plugins.legend.display = false;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.years,
      datasets: [{
        label: 'Patrimonio (MM CLP)',
        data: data.patrimonio,
        backgroundColor: data.patrimonio.map((_, i) =>
          i === data.patrimonio.length - 1 ? COLORS.primary : COLORS.secondaryFaded
        ),
        borderColor: data.patrimonio.map((_, i) =>
          i === data.patrimonio.length - 1 ? COLORS.primary : COLORS.secondary
        ),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: {
            ...opts.scales.y.ticks,
            callback: (v) => `${v} MM`,
          },
        },
      },
    },
  });
}

// ── 2. NOI vs DSCR (Dual Axis) ──────────────────────────
export function renderNoiDscrChart(ctx, data) {
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.years,
      datasets: [
        {
          label: 'NOI (MM CLP)',
          data: data.noiSSS,
          backgroundColor: COLORS.primaryFaded,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y',
          order: 2,
        },
        {
          label: 'DSCR (veces)',
          data: data.dscr,
          type: 'line',
          borderColor: COLORS.tertiary,
          backgroundColor: COLORS.tertiaryFaded,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: COLORS.tertiary,
          tension: 0.3,
          fill: false,
          yAxisID: 'y1',
          order: 1,
        },
      ],
    },
    options: {
      ...opts,
      scales: {
        x: opts.scales.x,
        y: {
          ...opts.scales.y,
          position: 'left',
          title: { display: true, text: 'NOI (MM CLP)', color: COLORS.textMuted, font: { size: 10 } },
        },
        y1: {
          ...opts.scales.y,
          position: 'right',
          title: { display: true, text: 'DSCR (x)', color: COLORS.textMuted, font: { size: 10 } },
          grid: { drawOnChartArea: false },
        },
      },
    },
  });
}

// ── 3. Debt/NOI (Line Chart) ─────────────────────────────
export function renderDebtNoiChart(ctx, data) {
  const opts = mergeDefaults({});
  opts.plugins.legend.display = false;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.years,
      datasets: [{
        label: 'Deuda Neta / NOI',
        data: data.debtNetNoi,
        borderColor: COLORS.tertiary,
        backgroundColor: COLORS.tertiaryFaded,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: COLORS.tertiary,
        pointBorderColor: COLORS.bg,
        pointBorderWidth: 2,
        tension: 0.35,
        fill: true,
      }],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `${v}x` },
        },
      },
    },
  });
}

// ── 4. Debt/Equity (Line Chart) ──────────────────────────
export function renderDebtEquityChart(ctx, data) {
  const opts = mergeDefaults({});
  opts.plugins.legend.display = false;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.years,
      datasets: [{
        label: 'Deuda Neta / Patrimonio',
        data: data.debtNetEquity,
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondaryFaded,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: COLORS.secondary,
        pointBorderColor: COLORS.bg,
        pointBorderWidth: 2,
        tension: 0.35,
        fill: true,
      }],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `${v}x` },
        },
      },
    },
  });
}

// ── 5. Tasaciones by Asset Type (Grouped Bars) ───────────
export function renderTasacionesChart(ctx, tasaciones) {
  const labels = tasaciones.byAssetType.map(t => t.type);
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '2019',
          data: tasaciones.byAssetType.map(t => t.y2019),
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          borderColor: 'rgba(148, 163, 184, 0.4)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: '2024',
          data: tasaciones.byAssetType.map(t => t.y2024),
          backgroundColor: COLORS.secondaryFaded,
          borderColor: COLORS.secondary,
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: '2025',
          data: tasaciones.byAssetType.map(t => t.y2025),
          backgroundColor: COLORS.primaryFaded,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `UF ${v}M` },
        },
      },
    },
  });
}

// ── 6. Cap Rates (Line Chart) ────────────────────────────
export function renderCapRatesChart(ctx, capRates) {
  const years = ['2019', '2023', '2024', '2025'];
  const typeColors = [COLORS.blue, COLORS.secondary, COLORS.danger, COLORS.primary, COLORS.tertiary];
  const opts = mergeDefaults({});

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: capRates.regimen.map((cr, i) => ({
        label: cr.type,
        data: [cr.y2019, cr.y2023, cr.y2024, cr.y2025],
        borderColor: typeColors[i],
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: typeColors[i],
        pointBorderColor: COLORS.bg,
        pointBorderWidth: 2,
        tension: 0.3,
      })),
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `${v}%` },
        },
      },
    },
  });
}

// ── 7. Portfolio Composition (Doughnut) ──────────────────
export function renderPortfolioComposition(ctx) {
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Oficinas', 'Centros Comerciales', 'Bodegas & Estac.'],
      datasets: [{
        data: [42.4, 55.9, 1.7],
        backgroundColor: [COLORS.blue, COLORS.tertiary, COLORS.success],
        borderColor: COLORS.bg,
        borderWidth: 3,
        hoverOffset: 8,
      }],
    },
    options: {
      ...opts,
      cutout: '65%',
      scales: { x: { display: false }, y: { display: false } },
      plugins: {
        ...opts.plugins,
        tooltip: {
          ...opts.plugins.tooltip,
          callbacks: {
            label: function(context) {
              return ' ' + context.label + ': ' + context.raw + '% de renta';
            }
          }
        },
        legend: {
          ...opts.plugins.legend,
          position: 'bottom',
        },
      },
    },
  });
}

// ── 8. Tenant Activity (Doughnut) ────────────────────────
export function renderTenantActivityChart(ctx, tenants) {
  const actColors = [
    COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.blue,
    COLORS.success, '#8b5cf6', COLORS.danger, '#ec4899',
    '#14b8a6', '#a855f7', '#f97316', '#6b7280',
  ];
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: tenants.byActivity.map(a => a.activity),
      datasets: [{
        data: tenants.byActivity.map(a => a.pct),
        backgroundColor: actColors,
        borderColor: COLORS.bg,
        borderWidth: 2,
        hoverOffset: 6,
      }],
    },
    options: {
      ...opts,
      cutout: '60%',
      scales: { x: { display: false }, y: { display: false } },
      plugins: {
        ...opts.plugins,
        tooltip: {
          ...opts.plugins.tooltip,
          callbacks: {
            label: function(context) {
              return ' ' + context.label + ': ' + context.raw + '%';
            }
          }
        },
        legend: {
          ...opts.plugins.legend,
          display: false,
        },
      },
    },
  });
}

// ── 9. Contract Profile (Stacked Bar) ────────────────────
export function renderContractProfileChart(ctx, tenants) {
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tenants.contractProfile.map(c => c.year),
      datasets: [
        {
          label: 'Oficinas',
          data: tenants.contractProfile.map(c => c.oficina),
          backgroundColor: COLORS.blue,
          borderRadius: 2,
        },
        {
          label: 'Comercial',
          data: tenants.contractProfile.map(c => c.comercial),
          backgroundColor: COLORS.primary,
          borderRadius: 2,
        },
        {
          label: 'Bodegas',
          data: tenants.contractProfile.map(c => c.bodega),
          backgroundColor: COLORS.tertiary,
          borderRadius: 2,
        },
      ],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        x: { ...opts.scales.x, stacked: true },
        y: {
          ...opts.scales.y,
          stacked: true,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `${v}%` },
        },
      },
    },
  });
}

// ── 10. Debt Composition (Doughnut) ──────────────────────
export function renderDebtCompositionChart(ctx, debtStructure) {
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: debtStructure.composition.map(c => c.type),
      datasets: [{
        data: debtStructure.composition.map(c => c.pct),
        backgroundColor: debtStructure.composition.map(c => c.color),
        borderColor: COLORS.bg,
        borderWidth: 3,
        hoverOffset: 8,
      }],
    },
    options: {
      ...opts,
      cutout: '65%',
      scales: { x: { display: false }, y: { display: false } },
      plugins: {
        ...opts.plugins,
        legend: {
          ...opts.plugins.legend,
          position: 'bottom',
        },
      },
    },
  });
}

// ── 11. Amortization Profile (Bar) ───────────────────────
export function renderAmortizationChart(ctx, debtStructure) {
  const opts = mergeDefaults({});
  opts.plugins.legend.display = false;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: debtStructure.amortizationProfile.map(a => a.year),
      datasets: [{
        label: 'Amortización (m UF)',
        data: debtStructure.amortizationProfile.map(a => a.amount),
        backgroundColor: debtStructure.amortizationProfile.map((a) =>
          a.amount > 2000 ? COLORS.primary : COLORS.secondaryFaded
        ),
        borderColor: debtStructure.amortizationProfile.map((a) =>
          a.amount > 2000 ? COLORS.primary : COLORS.secondary
        ),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `${v} mUF` },
        },
      },
    },
  });
}

// ── 12. Valuation Comparison (Grouped Bar) ───────────────
export function renderValuationCompChart(ctx, valuations) {
  const opts = mergeDefaults({});
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Serie A', 'Serie I'],
      datasets: [
        {
          label: 'Valor Contable',
          data: [valuations.contable.serieA, valuations.contable.serieI],
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          borderColor: 'rgba(148, 163, 184, 0.5)',
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: `Sitka Advisors`,
          data: [valuations.sitka.serieA.s2_2025, valuations.sitka.serieI.s2_2025],
          backgroundColor: COLORS.primaryFaded,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: `MCYA`,
          data: [valuations.mcya.serieA.value, valuations.mcya.serieI.value],
          backgroundColor: COLORS.secondaryFaded,
          borderColor: COLORS.secondary,
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      ...opts,
      scales: {
        ...opts.scales,
        y: {
          ...opts.scales.y,
          ticks: { ...opts.scales.y.ticks, callback: (v) => `$${v.toLocaleString()}` },
          suggestedMin: 30000,
        },
      },
    },
  });
}

// ── 11. DELEVERAGING CHART ───────────────────────────────
export function renderDeleveragingChart(canvasId, deleveraging) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const opts = mergeDefaults({});

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: deleveraging.quarters,
      datasets: [
        {
          label: 'Deuda Financiera Bruta',
          data: deleveraging.deudaBruta,
          backgroundColor: '#0a2d4d',
          borderRadius: 4,
          order: 2,
          yAxisID: 'y',
        },
        {
          label: 'Deuda Financiera Neta',
          data: deleveraging.deudaNeta,
          backgroundColor: '#2563eb',
          borderRadius: 4,
          order: 3,
          yAxisID: 'y',
        },
        {
          label: 'Efectivo y Equivalente',
          data: deleveraging.efectivo,
          backgroundColor: '#d97706',
          borderRadius: 4,
          order: 4,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'RCSD (der.)',
          data: deleveraging.rcsd,
          borderColor: '#6b7280',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [6, 3],
          pointBackgroundColor: '#6b7280',
          pointRadius: 4,
          pointHoverRadius: 6,
          order: 1,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      ...opts,
      scales: {
        x: {
          ...opts.scales.x,
          stacked: false,
        },
        y: {
          ...opts.scales.y,
          position: 'left',
          title: {
            display: true,
            text: 'Deuda Financiera UF (millones)',
            color: COLORS.textMuted,
            font: { family: 'Inter', size: 10, weight: '500' },
          },
          ticks: {
            ...opts.scales.y.ticks,
            callback: (v) => `${v}`,
          },
          suggestedMin: 5,
          suggestedMax: 17,
        },
        y1: {
          position: 'right',
          ticks: {
            color: COLORS.textMuted,
            font: { family: 'Inter', size: 10 },
            callback: (v) => `${v.toFixed(1)}x`,
          },
          grid: { display: false },
          border: { display: false },
          suggestedMin: 1.0,
          suggestedMax: 2.5,
          title: {
            display: true,
            text: 'RCSD',
            color: COLORS.textMuted,
            font: { family: 'Inter', size: 10, weight: '500' },
          },
        },
      },
      plugins: {
        ...opts.plugins,
        legend: {
          ...opts.plugins.legend,
          position: 'bottom',
        },
      },
    },
  });
}
