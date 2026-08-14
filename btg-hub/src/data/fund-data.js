// ============================================================
// BTG Pactual Renta Comercial – Consolidated Fund Data
// Extracted from 11 official PDFs (EEFF, Tasaciones, Ficha, etc.)
// ============================================================

export const fundInfo = {
  name: 'BTG Pactual Renta Comercial',
  type: 'Fondo de Inversión',
  runCMF: '7224-9',
  startDate: 'Septiembre 2011',
  duration: 'Hasta julio 2030 (prorrogable)',
  currency: 'CLP / UF',
  administrator: 'BTG Pactual Chile S.A. AGF',
  address: 'Av. Costanera Sur N°2730, Piso 19, Torre B, Las Condes, Santiago',
  auditor: 'PKF Chile Auditores Consultores Ltda.',
  website: 'www.rentacomercial.cl',
  serieA: {
    ticker: 'CFIBTGRCA',
    quotaValue: 33840,
    quotaValueUF: 0.851,
    quotasSubscribed: 8097170,
    lastTransaction: 33789,
    presenciaBursatil: '39%',
    marketMaker: true,
  },
  serieI: {
    ticker: 'CFIBTGRCI',
    quotaValue: 34194,
    quotaValueUF: 0.863,
    quotasSubscribed: 2332801,
  },
  highlights: [
    'Renovación del Fondo por 5 años',
    'Plan de venta ordenado de parte del portfolio',
    'Valorización del Fondo sube respecto al 1°S 2025',
    'Tasación de activos sube en 2,5%',
    'Pago de bono corporativo por UF 1,5 mm',
    'Reactivación del mercado de oficinas de Santiago Centro',
  ],
};

// ──────────────────────────────────────────────
// KEY PERFORMANCE INDICATORS (Headline KPIs)
// ──────────────────────────────────────────────
export const kpis = {
  totalAssets: 389204,       // M$ CLP  (31 mar 2026)
  totalEquity: 355182,       // M$ CLP
  totalGLA: 357394,          // m² (116,430 + 163,576 + 77,388)
  numberOfAssets: 34,
  numberOfProperties: 34,
  waltYears: 5.0,            // Weighted Average Lease Term
  dscr: 2.08,                // Debt Service Coverage Ratio
  vacanciaConsolidada: 6.7,  // % superficie
  noiAnnualized: 8900,       // M$ approx from slides
  debtDuration: 5.2,         // years
  debtRate: 5.1,             // % UF +
  debtReduction29pct: 29,    // % reduction 1T2024→1T2026
};

// ──────────────────────────────────────────────
// BALANCE SHEET  (31 mar 2026 vs 31 dic 2025)
// ──────────────────────────────────────────────
export const balanceSheet = {
  current: {
    date: '31.03.2026',
    assets: {
      cashEquivalents: 34480,
      otherCurrentAssets: 0,
      totalCurrentAssets: 34480,
      investmentsEquityMethod: 25755792,
      financialAssetsAtFV: 363413341,
      otherNonCurrentAssets: 0,
      totalNonCurrentAssets: 389169133,
      totalAssets: 389203613,
    },
    liabilities: {
      remunerationAdmin: 304447,
      otherPayables: 2976,
      totalCurrentLiabilities: 307423,
      otherNonCurrentLiabilities: 33714594,
      totalNonCurrentLiabilities: 33714594,
      totalLiabilities: 34022017,
    },
    equity: {
      contributions: 320871453,
      retainedEarnings: 32907883,
      netIncome: 5583868,
      provisionalDividends: -4181608,
      totalEquity: 355181596,
    },
  },
  previous: {
    date: '31.12.2025',
    assets: {
      cashEquivalents: 144154,
      totalCurrentAssets: 144154,
      investmentsEquityMethod: 25918406,
      financialAssetsAtFV: 361633425,
      totalNonCurrentAssets: 387551831,
      totalAssets: 387695985,
    },
    liabilities: {
      remunerationAdmin: 165176,
      otherPayables: 5089,
      totalCurrentLiabilities: 170265,
      otherNonCurrentLiabilities: 33746384,
      totalNonCurrentLiabilities: 33746384,
      totalLiabilities: 33916649,
    },
    equity: {
      contributions: 320871453,
      retainedEarnings: 16476211,
      netIncome: 33164618,
      provisionalDividends: -16732946,
      totalEquity: 353779336,
    },
  },
};

// ──────────────────────────────────────────────
// INCOME STATEMENT  (Q1 2026 vs Q1 2025)
// ──────────────────────────────────────────────
export const incomeStatement = {
  q1_2026: {
    period: '01.01.2026 – 31.03.2026',
    interestAndReajustes: 5300609,
    investmentGains: 560,
    equityMethodResult: 788872,
    totalOperatingIncome: 6090041,
    adminCommission: -498605,
    custodyFees: -67,
    otherOperatingExpenses: -7501,
    totalOperatingExpenses: -506173,
    operatingProfit: 5583868,
    financialCosts: 0,
    profitBeforeTax: 5583868,
    netIncome: 5583868,
  },
  q1_2025: {
    period: '01.01.2025 – 31.03.2025',
    interestAndReajustes: 7827399,
    investmentGains: 10831,
    equityMethodResult: -360921,
    totalOperatingIncome: 7477309,
    adminCommission: -485813,
    custodyFees: -71,
    otherOperatingExpenses: -14208,
    totalOperatingExpenses: -500092,
    operatingProfit: 6977217,
    financialCosts: -758155,
    profitBeforeTax: 6219062,
    netIncome: 6219062,
  },
};

// ──────────────────────────────────────────────
// CORPORATE STRUCTURE (Malla Societaria)
// ──────────────────────────────────────────────
export const corporateStructure = {
  fund: {
    name: 'BTG Pactual Renta Comercial FI',
    rut: '76.159.494-K',
    totalGLA: '357.394 m²',
    totalAssets: '34 activos',
    modelType: 'mixed_complex',
  },
  subsidiaries: [
    {
      id: 'rentas-ii',
      name: 'Inmobiliaria Rentas II SpA',
      rut: '76.179.171-0',
      ownership: '100%',
      description: '11 Edificios corporativos de oficinas',
      assetType: 'Oficinas',
      color: '#2b8cff',
      modelType: 'office_tower',
      glaTotal: '86.200 m²',
      assetCount: 11,
      rentaPct: '32,1%',
      highlights: 'Edificios premium Clase A y B en El Golf, Santiago Centro y Apoquindo.',
      controlledAssets: [
        { name: 'Edificio El Bosque 500', address: 'Av. El Bosque Norte 500', submercado: 'El Golf / Las Condes', ownership: '100%', gla: '18.420 m²', occupancy: '96%' },
        { name: 'Edificio Gertrudis Echeñique 30', address: 'Gertrudis Echeñique 30', submercado: 'El Golf / Las Condes', ownership: '100%', gla: '12.850 m²', occupancy: '98%' },
        { name: 'Edificio Torre París', address: 'París 768', submercado: 'Santiago Centro', ownership: '100%', gla: '10.320 m²', occupancy: '91%' },
        { name: 'Edificio Miraflores 222', address: 'Miraflores 222', submercado: 'Santiago Centro', ownership: '100%', gla: '9.450 m²', occupancy: '94%' },
        { name: 'Edificio Huérfanos 835', address: 'Huérfanos 835', submercado: 'Santiago Centro', ownership: '100%', gla: '8.900 m²', occupancy: '89%' },
        { name: 'Edificio Bandera 150', address: 'Bandera 150', submercado: 'Santiago Centro', ownership: '100%', gla: '7.800 m²', occupancy: '92%' },
        { name: 'Edificio Cruz del Sur', address: 'Av. Apoquindo / Cruz del Sur', submercado: 'Las Condes', ownership: '100%', gla: '6.500 m²', occupancy: '97%' },
        { name: 'Edificio Isidora Goyenechea 3162', address: 'Isidora Goyenechea 3162', submercado: 'El Golf', ownership: '100%', gla: '4.200 m²', occupancy: '100%' },
        { name: 'Edificio Enrique Foster 39', address: 'Enrique Foster Norte 39', submercado: 'El Golf', ownership: '100%', gla: '3.650 m²', occupancy: '95%' },
        { name: 'Edificio Apoquindo 3600', address: 'Av. Apoquindo 3600', submercado: 'Las Condes', ownership: '100%', gla: '2.400 m²', occupancy: '100%' },
        { name: 'Edificio Moneda 970', address: 'Moneda 970', submercado: 'Santiago Centro', ownership: '100%', gla: '1.710 m²', occupancy: '88%' },
      ],
    },
    {
      id: 'centros-comerciales-i',
      name: 'Inmobiliaria Centros Comerciales I SpA',
      rut: '76.186.219-7',
      ownership: '100%',
      description: 'Malls, Power Centers y Strip Centers',
      assetType: 'Comercial',
      color: '#f0b429',
      modelType: 'shopping_mall',
      glaTotal: '112.500 m²',
      assetCount: 16,
      rentaPct: '39,4%',
      highlights: 'Mall Los Trapenses, Power Centers y red de Strip Centers de conveniencia en RM y Regiones.',
      controlledAssets: [
        { name: 'Mall Paseo Los Trapenses', address: 'Av. Los Trapenses 3515, Lo Barnechea', submercado: 'RM - Oriente', ownership: '100%', gla: '44.800 m²', occupancy: '99%' },
        { name: 'Power Center Coquimbo', address: 'Ruta 5 Norte / Coquimbo', submercado: 'IV Región', ownership: '100%', gla: '19.083 m²', occupancy: '100%' },
        { name: 'Strip Center Chicureo', address: 'Av. Chicureo / Los Ingleses', submercado: 'RM - Norte', ownership: '100%', gla: '8.450 m²', occupancy: '97%' },
        { name: 'Strip Center La Dehesa', address: 'Av. La Dehesa / El Rodeo', submercado: 'RM - Oriente', ownership: '100%', gla: '7.200 m²', occupancy: '100%' },
        { name: 'Strip Center Peñalolén', address: 'Av. Consistorial / Los Presidentes', submercado: 'RM - Suroriente', ownership: '100%', gla: '6.100 m²', occupancy: '95%' },
        { name: 'Red 6 Locales Stand Alone', address: 'Providencia, Vitacura, Maipú', submercado: 'RM', ownership: '100%', gla: '14.200 m²', occupancy: '100%' },
        { name: 'Strip Center Quilicura', address: 'Av. Manuel Antonio Matta', submercado: 'RM - Norte', ownership: '100%', gla: '5.800 m²', occupancy: '94%' },
        { name: 'Strip Center San Miguel', address: 'Gran Avenida / Departamental', submercado: 'RM - Sur', ownership: '100%', gla: '6.867 m²', occupancy: '98%' },
      ],
    },
    {
      id: 'cargo-park',
      name: 'Inmobiliaria Cargo Park SpA',
      rut: '76.306.404-2',
      ownership: '100%',
      description: 'Centro de Bodegaje y Logística Pudahuel',
      assetType: 'Bodegas & Logística',
      color: '#5ba3ff',
      modelType: 'warehouse_hub',
      glaTotal: '77.388 m²',
      assetCount: 1,
      rentaPct: '1,7%',
      highlights: 'Ubicación estratégica inmediata al Aeropuerto Internacional de Santiago con conectividad a Américo Vespucio.',
      controlledAssets: [
        { name: 'Centro Logístico Cargo Park Pudahuel', address: 'Av. Américo Vespucio / Eje Aeropuerto SCL', submercado: 'RM - Poniente', ownership: '100%', gla: '77.388 m²', occupancy: '93%' },
      ],
    },
    {
      id: 'santa-andrea',
      name: 'Inversiones Santa Andrea SpA',
      rut: '76.285.386-8',
      ownership: '100%',
      description: 'Holding de Inversión (Torre Costanera + Estacionamientos)',
      assetType: 'Holding Mixto',
      color: '#7ec8f8',
      modelType: 'mixed_complex',
      glaTotal: '30.230 m² + 3.200 Estac.',
      assetCount: 2,
      rentaPct: '16,5%',
      highlights: 'Controla el rascacielos Torre Costanera (Nueva Las Condes) y la red de estacionamientos subterráneos de Las Condes.',
      children: [
        {
          name: 'Inmobiliaria Torre Costanera SpA',
          rut: '76.972.601-2',
          ownership: '100%',
          description: 'Edificio de oficinas Clase A+ (Torre Costanera)',
          assetType: 'Oficinas',
          gla: '30.230 m²',
        },
        {
          name: 'Concesión Estacionamientos Municipal Las Condes SA',
          rut: '96.890.050-1',
          ownership: '99.963%',
          description: '3.200 calzadas subterráneas en Plaza Perú y eje Apoquindo',
          assetType: 'Estacionamientos',
          gla: '3.200 calzadas',
        },
      ],
      controlledAssets: [
        { name: 'Edificio Torre Costanera (Nueva Las Condes)', address: 'Av. Vitacura / Cerro Colorado', submercado: 'Nueva Las Condes', ownership: '100%', gla: '30.230 m²', occupancy: '100%' },
        { name: 'Red Concesión Estacionamientos Las Condes', address: 'Plaza Perú / Apoquindo / El Golf', submercado: 'Las Condes', ownership: '99.96%', gla: '3.200 calzadas', occupancy: '95%' },
      ],
    },
    {
      id: 'cr-spa',
      name: 'Inmobiliaria CR SpA',
      rut: '76.107.304-4',
      ownership: '100%',
      description: 'Centros y locales comerciales en regiones',
      assetType: 'Retail Regional',
      color: '#34d399',
      modelType: 'retail_park',
      glaTotal: '51.076 m²',
      assetCount: 4,
      rentaPct: '10,3%',
      highlights: 'Centros comerciales y galerías de renta en Valparaíso, Los Lagos y zona centro-sur.',
      controlledAssets: [
        { name: 'Mall Paseo Quilpué', address: 'Av. Los Carrera 800, Quilpué', submercado: 'V Región', ownership: '100%', gla: '22.400 m²', occupancy: '98%' },
        { name: 'Power Center Puerto Montt', address: 'Av. Parque Industrial', submercado: 'X Región', ownership: '100%', gla: '16.500 m²', occupancy: '96%' },
        { name: 'Strip Center Valparaíso Centro', address: 'Av. Brasil / Bellavista', submercado: 'V Región', ownership: '100%', gla: '7.800 m²', occupancy: '94%' },
        { name: 'Locales Comerciales Regionales', address: 'Concepción y Rancagua', submercado: 'Zona Sur', ownership: '100%', gla: '4.376 m²', occupancy: '100%' },
      ],
    },
  ],
};

// ──────────────────────────────────────────────
// ASSET PORTFOLIO
// ──────────────────────────────────────────────
export const assetPortfolio = {
  summary: {
    oficinas: { gla: 116430, rentaPotencial: 42.4, submercados: ['Santiago Centro', 'Nueva Las Condes', 'El Golf'] },
    comercial: { gla: 163576, rentaPotencial: 55.9, types: ['Malls', 'Power Centers', 'Strip Centers', 'Stand Alone'] },
    bodegas: { gla: 77388, rentaPotencial: 1.7 },
  },
  byRegion: [
    { region: 'RM', oficinas: 116430, comercial: 129736, bodegas: 77388, pctRentaPotencial: 94.5 },
    { region: 'IV (Coquimbo)', oficinas: 0, comercial: 19083, bodegas: 0, pctRentaPotencial: 2.7 },
    { region: 'VIII (Biobío)', oficinas: 0, comercial: 8942, bodegas: 0, pctRentaPotencial: 1.7 },
    { region: 'VI (O\'Higgins)', oficinas: 0, comercial: 2943, bodegas: 0, pctRentaPotencial: 0.4 },
    { region: 'V (Valparaíso)', oficinas: 0, comercial: 658, bodegas: 0, pctRentaPotencial: 0.3 },
    { region: 'III (Atacama)', oficinas: 0, comercial: 953, bodegas: 0, pctRentaPotencial: 0.2 },
    { region: 'XVI (Ñuble)', oficinas: 0, comercial: 1262, bodegas: 0, pctRentaPotencial: 0.2 },
  ],
  oficinas: [
    { name: 'Torre Amunátegui', address: 'Amunátegui 232', submercado: 'Santiago Centro', ownership: '100%' },
    { name: 'Torre Huérfanos', address: 'Huérfanos 670', submercado: 'Santiago Centro', ownership: '100%' },
    { name: 'Catedral 1401', address: 'Catedral 1401', submercado: 'Santiago Centro', ownership: '100%' },
    { name: 'San Martín 572', address: 'San Martín 572', submercado: 'Santiago Centro', ownership: '100%' },
    { name: 'Santo Domingo', address: 'Santo Domingo', submercado: 'Santiago Centro', ownership: '84%' },
    { name: 'Hnos. Amunátegui', address: 'Hnos. Amunátegui', submercado: 'Santiago Centro', ownership: '39%' },
    { name: 'Torres del Parque', address: 'Rosario Norte 100', submercado: 'Nueva Las Condes', ownership: '100%' },
    { name: 'Rosario Norte 100', address: 'Rosario Norte 100', submercado: 'Nueva Las Condes', ownership: '52%' },
    { name: 'Cerro Colorado 5240', address: 'Cerro Colorado 5240', submercado: 'Nueva Las Condes', ownership: '100%' },
    { name: 'Apoquindo 3039', address: 'Av. Apoquindo 3039', submercado: 'El Golf', ownership: '100%' },
    { name: 'Alcántara Apoquindo', address: 'Av. Apoquindo 3885', submercado: 'El Golf', ownership: '46%' },
    { name: 'Torre de la Costanera', address: 'Av. Andrés Bello 2711', submercado: 'El Golf', ownership: '21%' },
  ],
  centrosComerciales: {
    malls: [
      { name: 'Mall El Centro', address: 'Paseo Puente 689' },
      { name: 'Mall Vivo Imperio', address: 'Huérfanos 830' },
    ],
    powerCenters: [
      { name: 'Paseo Los Domínicos', address: 'Camino El Alba 11696' },
      { name: 'Paseo Los Trapenses', address: 'Av. Los Trapenses 3515' },
    ],
    stripCenters: [
      { name: 'Placa La Dehesa', address: 'Av. La Dehesa 1201' },
      { name: 'Boulevard del Valle', address: 'Laguna Grande 115' },
      { name: 'Plaza Vivaceta', address: 'Fermín Vivaceta 957' },
      { name: 'Paseo Lo Campino', address: 'Av. Las Torres 450' },
      { name: 'Plaza Don Carlos', address: 'Príncipe de Gales 8531' },
      { name: 'Paseo Tobalaba I', address: 'Av. Tobalaba 11835' },
      { name: 'Paseo Tobalaba II', address: 'Av. Tobalaba 11835' },
      { name: 'Plaza La Fuente', address: 'Macul 2555' },
      { name: 'Paseo Maipú II', address: 'Tres Poniente 2600' },
    ],
    standAlone: [
      { name: 'La Polar La Serena', address: 'G. Cordovez 571, La Serena' },
      { name: 'Unimarc Vicente Zorrilla', address: 'Vte Zorrilla 750, La Serena' },
      { name: 'Unimarc Nicaragua', address: 'Nicaragua 1571, La Serena' },
      { name: 'Mayorista 10 San Vicente', address: 'Av. España 1109, San Vicente' },
      { name: 'F. Ahumada Etchevers', address: 'Etchevers 185' },
      { name: 'Santander El Bosque', address: 'El Bosque Norte 169' },
      { name: 'Santander Chillán', address: 'Arauco 726, Chillán' },
      { name: 'Unimarc Vallenar', address: 'Arturo Prat 2350' },
      { name: 'F. Ahumada Providencia', address: 'Av. Providencia 2001' },
    ],
  },
  bodegas: [
    { name: 'Cargo Park', address: 'Av. Presidente Frei Montalva 9950', gla: 77388, vacancia: 19.6 },
  ],
  estacionamientos: [
    { name: 'Plaza Perú', address: 'Plaza Perú' },
    { name: 'Isidora Goyenechea 3051', address: 'Isidora Goyenechea 3051' },
    { name: 'Isidora Goyenechea 2897', address: 'Isidora Goyenechea 2897' },
  ],
};

// ──────────────────────────────────────────────
// TASACIONES (APPRAISALS) – 2019 to 2025
// ──────────────────────────────────────────────
export const tasaciones = {
  byAssetType: [
    { type: 'Oficinas Oriente', y2019: 6.6, y2023: 5.6, y2024: 4.6, y2025: 5.1, var25vs19: -22, var25vs24: 10 },
    { type: 'Oficinas Centro', y2019: 4.6, y2023: 2.8, y2024: 1.7, y2025: 2.2, var25vs19: -53, var25vs24: 27 },
    { type: 'Malls', y2019: 6.5, y2023: 5.1, y2024: 4.5, y2025: 3.8, var25vs19: -41, var25vs24: -15 },
    { type: 'Otros CC', y2019: 6.6, y2023: 5.7, y2024: 5.6, y2025: 5.9, var25vs19: -11, var25vs24: 4 },
    { type: 'Bodegas', y2019: 1.3, y2023: 1.6, y2024: 1.5, y2025: 1.6, var25vs19: 19, var25vs24: 1 },
  ],
  total: { y2019: 25.8, y2023: 20.8, y2024: 18.1, y2025: 18.5, var25vs19: -28, var25vs24: 3 },
  bySector: [
    { sector: 'RM – Oriente', var25vs24: 7.2 },
    { sector: 'RM – Centro', var25vs24: -3.5 },
    { sector: 'RM – Otros', var25vs24: 3.4 },
    { sector: 'Regiones', var25vs24: -0.6 },
  ],
};

// ──────────────────────────────────────────────
// CAP RATES (Régimen %)
// ──────────────────────────────────────────────
export const capRates = {
  regimen: [
    { type: 'Oficinas Oriente', y2019: 5.7, y2023: 6.0, y2024: 7.3, y2025: 6.5 },
    { type: 'Oficinas Centro', y2019: 5.3, y2023: 6.7, y2024: 10.8, y2025: 8.9 },
    { type: 'Malls', y2019: 6.2, y2023: 6.7, y2024: 6.4, y2025: 6.7 },
    { type: 'Otros CC', y2019: 5.7, y2023: 5.6, y2024: 6.1, y2025: 6.2 },
    { type: 'Bodegas', y2019: 7.0, y2023: 7.0, y2024: 6.5, y2025: 6.7 },
  ],
  total: { y2019: 5.8, y2023: 6.2, y2024: 7.0, y2025: 7.0 },
};

// ──────────────────────────────────────────────
// VALORIZACIONES INDEPENDIENTES (Sitka vs MCYA)
// ──────────────────────────────────────────────
export const valuations = {
  sitka: {
    name: 'Sitka Advisors',
    method: 'Look-through DCF / Flujos de salida',
    serieA: { s1_2025: 31703, s2_2025: 33107, change: 4.4 },
    serieI: { s1_2025: 31781, s2_2025: 33352, change: 4.9 },
    flujoCaja: 1344238,     // UF
    flujoSalida: 5511642,   // UF
    vpInversiones: 1846581, // UF
  },
  mcya: {
    name: 'Mario Corbo y Asociados',
    method: 'Modelo de dividendos descontados (WACC real 7,94%)',
    serieA: { value: 33789, priceToBook: 1.00 },
    serieI: { value: 34269, priceToBook: 1.00 },
    equityUF_A: 6886793,
    equityUF_I: 2012263,
    discountRate: 7.94,
  },
  contable: {
    serieA: 33840,
    serieI: 34194,
  },
};

// ──────────────────────────────────────────────
// ARRENDATARIOS (TENANTS)
// ──────────────────────────────────────────────
export const tenants = {
  top20: [
    { name: 'Estado de Chile', pctIncome: 8.7, rating: 'AAA' },
    { name: 'Minera Freeport-McMoRan', pctIncome: 6.8 },
    { name: 'Cencosud', pctIncome: 2.9 },
    { name: 'Falabella', pctIncome: 2.7 },
    { name: 'Ripley', pctIncome: 2.3 },
    { name: 'Farmacias Ahumada', pctIncome: 2.2 },
    { name: 'SMU', pctIncome: 2.1 },
    { name: 'Bechtel Chile', pctIncome: 1.5 },
    { name: 'Banco Santander', pctIncome: 1.3 },
    { name: 'Repuestos Center', pctIncome: 1.3 },
    { name: 'Johnson & Johnson', pctIncome: 1.2 },
    { name: 'Universidad Santo Tomás', pctIncome: 1.2 },
    { name: 'Smart Fit', pctIncome: 1.1 },
    { name: 'ALVI', pctIncome: 1.1 },
    { name: 'La Polar', pctIncome: 1.1 },
    { name: 'Clínica Ensenada', pctIncome: 1.0 },
  ],
  totalTop20Pct: 44.7,
  byActivity: [
    { activity: 'Servicios', pct: 34 },
    { activity: 'Retail', pct: 31 },
    { activity: 'Financiero', pct: 8 },
    { activity: 'Organismo Público', pct: 7 },
    { activity: 'Salud', pct: 6 },
    { activity: 'Parking', pct: 5 },
    { activity: 'Logística', pct: 3 },
    { activity: 'Minería', pct: 2 },
    { activity: 'Transp. y Telecom.', pct: 1 },
    { activity: 'Ingeniería', pct: 1 },
    { activity: 'Energía', pct: 1 },
    { activity: 'Otros', pct: 1 },
  ],
  contractProfile: [
    { year: '2026', oficina: 2, comercial: 3, bodega: 1 },
    { year: '2027', oficina: 5, comercial: 4, bodega: 2 },
    { year: '2028', oficina: 4, comercial: 5, bodega: 3 },
    { year: '2029', oficina: 6, comercial: 4, bodega: 2 },
    { year: '2030', oficina: 5, comercial: 5, bodega: 1 },
    { year: '2031', oficina: 3, comercial: 3, bodega: 1 },
    { year: '2032', oficina: 2, comercial: 2, bodega: 0 },
    { year: '2033', oficina: 1, comercial: 2, bodega: 0 },
    { year: '2034+', oficina: 5, comercial: 39, bodega: 0 },
  ],
  fixedIncomePct: 94, // % of income from fixed rents
};

// ──────────────────────────────────────────────
// DEBT STRUCTURE
// ──────────────────────────────────────────────
export const debtStructure = {
  composition: [
    { type: 'Leasing', pct: 40, color: '#2b8cff' },
    { type: 'Mutuo Hipotecario', pct: 29, color: '#5ba3ff' },
    { type: 'Pagaré', pct: 31, color: '#f0b429' },
  ],
  structure: [
    { type: 'Amortizing', pct: 18 },
    { type: 'Bullet', pct: 82 },
  ],
  amortizationProfile: [
    { year: '2026', amount: 73 },
    { year: '2027', amount: 2381 },
    { year: '2028', amount: 1656 },
    { year: '2029', amount: 102 },
    { year: '2030', amount: 1461 },
    { year: '2031', amount: 110 },
    { year: '2032', amount: 875 },
    { year: '2033', amount: 66 },
    { year: '2034+', amount: 2889 },
  ],
  duration: 5.2,
  rate: 5.1,
  debtReduction: 29,
};

// ──────────────────────────────────────────────
// HISTORICAL FINANCIAL INDICATORS
// ──────────────────────────────────────────────
export const historicalData = {
  years: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '1Q26'],
  patrimonio: [4.4, 4.7, 5.5, 5.6, 9.1, 11.3, 14.2, 14.8, 13.8, 12.2, 11.0, 8.8, 8.9, 8.9],
  noiSSS: [0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.3, 1.2, 1.5, 1.5, 1.4, 1.3, 1.1, 0.3],
  dscr: [1.7, 1.6, 1.6, 1.8, 1.8, 1.8, 1.4, 1.6, 1.9, 1.8, 1.7, 1.7, 1.6, 2.0],
  debtNetNoi: [5.1, 5.8, 5.8, 5.6, 7.5, 7.9, 7.9, 8.6, 9.8, 9.6, 9.6, 9.4, 8.7, 5.0],
  debtNetEquity: [1.0, 1.2, 1.1, 1.1, 1.0, 0.9, 0.8, 0.8, 1.1, 1.2, 1.2, 1.3, 1.1, 1.1],
};

// ──────────────────────────────────────────────
// MARKET / BURSATIL DATA
// ──────────────────────────────────────────────
export const marketData = {
  volumeTraded: {
    btg: { lastMonth: 834, avg6m: 44, avg12m: 32, last12m: 14556 },
    peer1: { lastMonth: 2675, avg6m: 257, avg12m: 175, last12m: 42924 },
    peer2: { lastMonth: 224, avg6m: 35, avg12m: 32, last12m: 7937 },
  },
  presenciaBursatil: { btg: 39, peer1: 79, peer2: 17 },
  officasVacancy: {
    q1_2026: 7.1,
    q4_2025: 8.1,
    trend: 'Baja',
  },
};
