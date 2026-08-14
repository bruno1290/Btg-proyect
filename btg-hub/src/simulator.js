// ============================================================
// BTG Intelligence Hub – Interactive Simulator Module
// ============================================================

import { valuations, kpis } from './data/fund-data.js';

const BASE_QUOTA_A = valuations.contable.serieA; // $33,840
const BASE_QUOTA_I = valuations.contable.serieI; // $34,194

// Simulation parameters with defaults and ranges
const PARAMS = [
  {
    id: 'vacancia',
    label: 'Tasa de Vacancia (%)',
    min: 0,
    max: 25,
    step: 0.5,
    default: kpis.vacanciaConsolidada, // 6.7%
    unit: '%',
    impact: -0.012, // % impact on quota per 1% change
    icon: '🏢',
  },
  {
    id: 'capRate',
    label: 'Cap Rate de Salida (%)',
    min: 4,
    max: 12,
    step: 0.1,
    default: 7.0,
    unit: '%',
    impact: -0.025, // % impact on quota per 1% change
    icon: '📊',
  },
  {
    id: 'discountRate',
    label: 'Tasa de Descuento (%)',
    min: 5,
    max: 12,
    step: 0.1,
    default: valuations.mcya.discountRate, // 7.94%
    unit: '%',
    impact: -0.018,
    icon: '💰',
  },
  {
    id: 'desinversion',
    label: 'Venta Anual (UF mm)',
    min: 0,
    max: 3,
    step: 0.1,
    default: 1.2,
    unit: ' UF mm',
    impact: 0.008,
    icon: '🏗️',
  },
];

const PRESETS = {
  base: {
    vacancia: kpis.vacanciaConsolidada,
    capRate: 7.0,
    discountRate: valuations.mcya.discountRate,
    desinversion: 1.2,
  },
  optimistic: {
    vacancia: 4.5,
    capRate: 6.2,
    discountRate: 7.2,
    desinversion: 1.8,
  },
  conservative: {
    vacancia: 9.5,
    capRate: 7.8,
    discountRate: 8.5,
    desinversion: 0.8,
  },
  stress: {
    vacancia: 14.0,
    capRate: 8.5,
    discountRate: 9.5,
    desinversion: 0.2,
  },
};

export function initSimulator() {
  const controlsEl = document.getElementById('simulatorControls');
  const resultEl = document.getElementById('simulatorResult');

  if (!controlsEl || !resultEl) return;

  // Build slider controls
  controlsEl.innerHTML = PARAMS.map(p => `
    <div class="slider-group">
      <label for="sim-${p.id}">${p.icon} ${p.label}</label>
      <div class="slider-value" id="val-${p.id}">${p.default}${p.unit}</div>
      <input 
        type="range" 
        id="sim-${p.id}" 
        min="${p.min}" 
        max="${p.max}" 
        step="${p.step}" 
        value="${p.default}"
      />
      <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted);">
        <span>${p.min}${p.unit}</span>
        <span>${p.max}${p.unit}</span>
      </div>
    </div>
  `).join('');

  // Build result display
  resultEl.innerHTML = `
    <div style="margin-bottom: var(--space-md);">
      <div class="metric-label">Valor Cuota Estimado</div>
      <div class="metric-label" style="font-size: 0.65rem; margin-top: 2px;">Serie A</div>
    </div>
    <div class="result-value" id="simResultValue">$${BASE_QUOTA_A.toLocaleString()}</div>
    <div class="result-change" id="simResultChange" style="color: var(--accent-primary);">0.0% vs actual</div>
    <div class="divider" style="width: 60%;"></div>
    <div>
      <div class="metric-label">Serie I</div>
      <div class="result-value" id="simResultValueI" style="font-size: 1.8rem;">$${BASE_QUOTA_I.toLocaleString()}</div>
      <div class="result-change" id="simResultChangeI" style="font-size: 0.85rem; color: var(--accent-primary);">0.0% vs actual</div>
    </div>
    <div class="divider" style="width: 60%;"></div>
    <div style="font-size: 0.7rem; color: var(--text-muted); max-width: 220px; text-align: center; line-height: 1.5;">
      Simulación basada en análisis de sensibilidad lineal con datos 1Q 2026.
    </div>
  `;

  // Attach slider event listeners
  PARAMS.forEach(p => {
    const slider = document.getElementById(`sim-${p.id}`);
    slider.addEventListener('input', () => {
      // Clear active preset when manually adjusting
      document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
      updateSimulation();
    });
  });

  // Attach preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      const presetData = PRESETS[presetKey];
      if (!presetData) return;

      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(presetData).forEach(id => {
        const slider = document.getElementById(`sim-${id}`);
        if (slider) {
          slider.value = presetData[id];
        }
      });

      updateSimulation();
    });
  });

  function updateSimulation() {
    let totalImpact = 0;

    PARAMS.forEach(p => {
      const slider = document.getElementById(`sim-${p.id}`);
      const valueEl = document.getElementById(`val-${p.id}`);
      const currentVal = parseFloat(slider.value);
      const delta = currentVal - p.default;

      valueEl.textContent = `${currentVal}${p.unit}`;
      totalImpact += delta * p.impact;
    });

    // Calculate new quota values
    const newQuotaA = Math.round(BASE_QUOTA_A * (1 + totalImpact));
    const newQuotaI = Math.round(BASE_QUOTA_I * (1 + totalImpact));
    const changePct = (totalImpact * 100).toFixed(1);

    // Update display
    const resultValueA = document.getElementById('simResultValue');
    const resultChangeA = document.getElementById('simResultChange');
    const resultValueI = document.getElementById('simResultValueI');
    const resultChangeI = document.getElementById('simResultChangeI');

    resultValueA.textContent = `$${newQuotaA.toLocaleString()}`;
    resultValueI.textContent = `$${newQuotaI.toLocaleString()}`;

    const sign = totalImpact >= 0 ? '+' : '';
    resultChangeA.textContent = `${sign}${changePct}% vs actual`;
    resultChangeI.textContent = `${sign}${changePct}% vs actual`;

    const colorClass = totalImpact >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)';
    resultChangeA.style.color = colorClass;
    resultChangeI.style.color = colorClass;

    if (totalImpact >= 0) {
      resultValueA.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))';
    } else {
      resultValueA.style.background = 'linear-gradient(135deg, var(--accent-danger), var(--accent-tertiary))';
    }
    resultValueA.style.webkitBackgroundClip = 'text';
    resultValueA.style.webkitTextFillColor = 'transparent';
    resultValueA.style.backgroundClip = 'text';
  }
}
