# 🏢 BTG Pactual Renta Comercial – Intelligence Hub

Plataforma analítica e interactiva para el fondo **BTG Pactual Renta Comercial** (RUN CMF 7224-9).

---

## 🚀 Cómo Ejecutar en Otro Computador

### Requisitos Previos
- **Node.js** instalado (versión 18 o superior). Descargar de [nodejs.org](https://nodejs.org/).

### Pasos Rápidos

1. **Abrir la terminal en la carpeta del proyecto**:
   ```bash
   cd btg-hub
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   👉 `http://localhost:5173/`

---

## 🛠️ Comandos Disponibles

- `npm run dev` — Servidor de desarrollo local con recarga automática.
- `npm run build` — Compila la versión estática de producción en la carpeta `/dist`.
- `npm run preview` — Previsualiza el bundle compilado de producción.

---

## 📂 Estructura del Código

- `src/main.js` — Punto de entrada, interacción UI, filtros y navegación.
- `src/data/fund-data.js` — Datos financieros, tasaciones, contratos y activos.
- `src/building-3d.js` — Motor de proyección 3D interactivo en Canvas.
- `src/charts.js` — Gráficos financieros e inmobiliarios con Chart.js.
- `src/simulator.js` — Lógica reactiva del simulador de valor cuota.
- `src/styles/main.css` — Sistema de diseño y estilos institucionales BTG.
