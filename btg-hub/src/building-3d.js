// ============================================================
// BTG Intelligence Hub – 3D Holographic Building Engine
// Pure Canvas Vector 3D Renderer with Real-time Perspective,
// Matrix Rotation, Neon Glow & Holographic HUD Scanning
// ============================================================

export class Building3DRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rotX = 0.35; // Pitch
    this.rotY = 0.65; // Yaw
    this.rotSpeed = 0.008;
    this.zoom = 1.0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.autoRotate = true;
    this.scanLineY = 0;
    this.modelType = 'office_tower';
    this.accentColor = '#2b8cff';
    this.glowColor = 'rgba(43, 140, 255, 0.4)';
    this.animId = null;

    this.initEvents();
  }

  initEvents() {
    const c = this.canvas;
    c.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.rotY += dx * 0.01;
      this.rotX += dy * 0.01;
      this.rotX = Math.max(-1.2, Math.min(1.2, this.rotX));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        setTimeout(() => { this.autoRotate = true; }, 2000);
      }
    });

    // Touch support for mobile
    c.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.lastMouseX;
      const dy = e.touches[0].clientY - this.lastMouseY;
      this.rotY += dx * 0.01;
      this.rotX += dy * 0.01;
      this.rotX = Math.max(-1.2, Math.min(1.2, this.rotX));
      this.lastMouseX = e.touches[0].clientX;
      this.lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        setTimeout(() => { this.autoRotate = true; }, 2000);
      }
    });
  }

  setModel(type, accentColor = '#2b8cff') {
    this.modelType = type;
    this.accentColor = accentColor;
    this.glowColor = accentColor.startsWith('#')
      ? this.hexToRgba(accentColor, 0.45)
      : 'rgba(43, 140, 255, 0.45)';
    this.generateGeometry();
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16) || 43;
    const g = parseInt(hex.slice(3, 5), 16) || 140;
    const b = parseInt(hex.slice(5, 7), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  generateGeometry() {
    const vertices = [];
    const edges = [];
    const polygons = [];

    const addBox = (x, y, z, w, h, d, floorCount = 0) => {
      const baseIdx = vertices.length;
      const hw = w / 2;
      const hd = d / 2;

      // 8 corners
      vertices.push(
        { x: x - hw, y: y, z: z - hd },
        { x: x + hw, y: y, z: z - hd },
        { x: x + hw, y: y, z: z + hd },
        { x: x - hw, y: y, z: z + hd },
        { x: x - hw, y: y - h, z: z - hd },
        { x: x + hw, y: y - h, z: z - hd },
        { x: x + hw, y: y - h, z: z + hd },
        { x: x - hw, y: y - h, z: z + hd }
      );

      // Bottom square
      edges.push([baseIdx, baseIdx + 1], [baseIdx + 1, baseIdx + 2], [baseIdx + 2, baseIdx + 3], [baseIdx + 3, baseIdx]);
      // Top square
      edges.push([baseIdx + 4, baseIdx + 5], [baseIdx + 5, baseIdx + 6], [baseIdx + 6, baseIdx + 7], [baseIdx + 7, baseIdx + 4]);
      // Vertical pillars
      edges.push([baseIdx, baseIdx + 4], [baseIdx + 1, baseIdx + 5], [baseIdx + 2, baseIdx + 6], [baseIdx + 3, baseIdx + 7]);

      // Floor rings
      if (floorCount > 1) {
        const floorStep = h / floorCount;
        for (let f = 1; f < floorCount; f++) {
          const fY = y - f * floorStep;
          const fIdx = vertices.length;
          vertices.push(
            { x: x - hw, y: fY, z: z - hd },
            { x: x + hw, y: fY, z: z - hd },
            { x: x + hw, y: fY, z: z + hd },
            { x: x - hw, y: fY, z: z + hd }
          );
          edges.push([fIdx, fIdx + 1], [fIdx + 1, fIdx + 2], [fIdx + 2, fIdx + 3], [fIdx + 3, fIdx]);
        }
      }
    };

    if (this.modelType === 'office_tower') {
      // Modern Skyscraper Tower (El Bosque / Costanera style)
      // Podium / Base
      addBox(0, 70, 0, 90, 20, 90, 2);
      // Main Glass Tower
      addBox(0, 50, 0, 70, 140, 70, 10);
      // Crown / Upper tier
      addBox(0, -90, 0, 50, 30, 50, 3);
      // Rooftop spire/helipad
      const topIdx = vertices.length;
      vertices.push(
        { x: 0, y: -140, z: 0 },
        { x: -15, y: -120, z: -15 },
        { x: 15, y: -120, z: -15 },
        { x: 15, y: -120, z: 15 },
        { x: -15, y: -120, z: 15 }
      );
      edges.push(
        [topIdx, topIdx + 1], [topIdx, topIdx + 2], [topIdx, topIdx + 3], [topIdx, topIdx + 4],
        [topIdx + 1, topIdx + 2], [topIdx + 2, topIdx + 3], [topIdx + 3, topIdx + 4], [topIdx + 4, topIdx + 1]
      );
    } else if (this.modelType === 'shopping_mall') {
      // Modern Shopping Mall (Paseo Los Trapenses style)
      // Central Atrium Mall
      addBox(0, 50, 0, 110, 45, 110, 3);
      // Left Wing
      addBox(-90, 50, 0, 70, 35, 80, 2);
      // Right Wing
      addBox(90, 50, 0, 70, 35, 80, 2);
      // Front Entrance Plaza / Canopy
      addBox(0, 50, 80, 60, 25, 50, 2);
      // Glass Dome / Arch over center
      const domeIdx = vertices.length;
      vertices.push(
        { x: 0, y: -20, z: 0 },
        { x: -30, y: 5, z: -30 },
        { x: 30, y: 5, z: -30 },
        { x: 30, y: 5, z: 30 },
        { x: -30, y: 5, z: 30 }
      );
      edges.push(
        [domeIdx, domeIdx + 1], [domeIdx, domeIdx + 2], [domeIdx, domeIdx + 3], [domeIdx, domeIdx + 4],
        [domeIdx + 1, domeIdx + 2], [domeIdx + 2, domeIdx + 3], [domeIdx + 3, domeIdx + 4], [domeIdx + 4, domeIdx + 1]
      );
    } else if (this.modelType === 'warehouse_hub') {
      // Industrial Cargo Park Logistics Center
      // Main Logistics Warehouse 1
      addBox(-55, 45, 0, 95, 40, 140, 2);
      // Warehouse 2
      addBox(55, 45, 0, 95, 40, 140, 2);
      // Central Loading Yard
      addBox(0, 45, 0, 15, 10, 140, 1);
      // Office Admin Annex
      addBox(-55, 45, 85, 60, 25, 30, 2);
      // Rooftop Solar / Truss lines
      const roofIdx = vertices.length;
      vertices.push(
        { x: -55, y: -10, z: -70 },
        { x: -55, y: -10, z: 70 },
        { x: 55, y: -10, z: -70 },
        { x: 55, y: -10, z: 70 }
      );
      edges.push([roofIdx, roofIdx + 1], [roofIdx + 2, roofIdx + 3]);
    } else if (this.modelType === 'mixed_complex') {
      // Twin Towers + Subterranean Parking (Santa Andrea SpA)
      // Subterranean levels (glowing wireframe underground)
      addBox(0, 85, 0, 150, 30, 110, 3);
      // Tower A (Tall Office)
      addBox(-45, 55, 0, 55, 150, 55, 10);
      // Tower B (Commercial & Hotel)
      addBox(45, 55, 0, 55, 100, 55, 7);
      // Skybridge linking both towers
      addBox(0, -10, 0, 35, 16, 25, 1);
    } else {
      // Retail Park / Strip Center (CR SpA)
      addBox(-60, 50, 0, 80, 30, 60, 2);
      addBox(60, 50, 0, 80, 30, 60, 2);
      addBox(0, 50, -40, 120, 35, 50, 2);
      // Canopy & Pylons
      addBox(0, 50, 40, 180, 10, 20, 1);
    }

    // Add Ground Grid
    const gridIdx = vertices.length;
    const gridSz = 120;
    for (let i = -gridSz; i <= gridSz; i += 40) {
      vertices.push({ x: i, y: 75, z: -gridSz }, { x: i, y: 75, z: gridSz });
      edges.push([vertices.length - 2, vertices.length - 1]);
      vertices.push({ x: -gridSz, y: 75, z: i }, { x: gridSz, y: 75, z: i });
      edges.push([vertices.length - 2, vertices.length - 1]);
    }

    this.geometry = { vertices, edges, gridStartIdx: gridIdx };
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.generateGeometry();

    const loop = () => {
      this.render();
      if (this.autoRotate && !this.isDragging) {
        this.rotY += this.rotSpeed;
      }
      this.scanLineY = (this.scanLineY + 1.2) % (this.canvas.height || 260);
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  render() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    // Resize handling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 340;
    const h = rect.height || 260;

    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Background Cyber Grid & Vignette
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.4);
    bgGrad.addColorStop(0, 'rgba(10, 45, 77, 0.4)');
    bgGrad.addColorStop(1, 'rgba(6, 26, 46, 0.95)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    if (!this.geometry) {
      ctx.restore();
      return;
    }

    // 3D Transform Matrices
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);
    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);

    const fov = 420;
    const cx = w / 2;
    const cy = h / 2 + 15;

    // Transform and Project Vertices
    const projected = this.geometry.vertices.map((v) => {
      // Rotate around Y (Yaw)
      let x1 = v.x * cosY + v.z * sinY;
      let y1 = v.y;
      let z1 = -v.x * sinY + v.z * cosY;

      // Rotate around X (Pitch)
      let x2 = x1;
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX + 380; // Distance offset

      // Perspective divide
      const scale = fov / Math.max(z2, 50);
      return {
        x: cx + x2 * scale * this.zoom,
        y: cy + y2 * scale * this.zoom,
        z: z2,
      };
    });

    // Draw Ground Grid (Subtle)
    ctx.strokeStyle = 'rgba(43, 140, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < this.geometry.edges.length; i++) {
      const [i1, i2] = this.geometry.edges[i];
      if (i1 >= this.geometry.gridStartIdx) {
        const p1 = projected[i1];
        const p2 = projected[i2];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
    }
    ctx.stroke();

    // Draw Glowing 3D Building Edges
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.glowColor;
    ctx.strokeStyle = this.accentColor;
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    for (let i = 0; i < this.geometry.edges.length; i++) {
      const [i1, i2] = this.geometry.edges[i];
      if (i1 < this.geometry.gridStartIdx && i2 < this.geometry.gridStartIdx) {
        const p1 = projected[i1];
        const p2 = projected[i2];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
    }
    ctx.stroke();

    // Draw Holographic Vertices / Nodes
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < Math.min(this.geometry.gridStartIdx, projected.length); i += 2) {
      const p = projected[i];
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    }

    // Holographic Scanning Line
    ctx.shadowBlur = 0;
    const scanGrad = ctx.createLinearGradient(0, this.scanLineY - 12, 0, this.scanLineY + 12);
    scanGrad.addColorStop(0, 'rgba(43, 140, 255, 0)');
    scanGrad.addColorStop(0.5, 'rgba(126, 200, 248, 0.45)');
    scanGrad.addColorStop(1, 'rgba(43, 140, 255, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, this.scanLineY - 12, w, 24);

    // Tech HUD Overlay Corner Marks
    ctx.strokeStyle = 'rgba(126, 200, 248, 0.4)';
    ctx.lineWidth = 1.5;
    const cornerSize = 12;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(10, 10 + cornerSize);
    ctx.lineTo(10, 10);
    ctx.lineTo(10 + cornerSize, 10);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(w - 10 - cornerSize, 10);
    ctx.lineTo(w - 10, 10);
    ctx.lineTo(w - 10, 10 + cornerSize);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(10, h - 10 - cornerSize);
    ctx.lineTo(10, h - 10);
    ctx.lineTo(10 + cornerSize, h - 10);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(w - 10 - cornerSize, h - 10);
    ctx.lineTo(w - 10, h - 10);
    ctx.lineTo(w - 10, h - 10 - cornerSize);
    ctx.stroke();

    // HUD Text
    ctx.font = '9px "Inter", monospace';
    ctx.fillStyle = 'rgba(184, 207, 224, 0.6)';
    ctx.fillText(`3D_PROJECTION: ${this.modelType.toUpperCase()}`, 16, 22);
    ctx.fillText(`ROT_Y: ${(this.rotY % (Math.PI * 2)).toFixed(2)} rad`, 16, h - 16);
    ctx.fillText('ARRÁSTRALO PARA ROTAR', w - 130, h - 16);

    ctx.restore();
  }
}
