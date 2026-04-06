/**
 * particles.js — Animated background canvas (grid + nodes)
 * Joseph Odhiambo Portfolio
 */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    this.mouse = { x: null, y: null };
    this.animId = null;

    this.config = {
      particleCount: 60,
      maxDistance: 150,
      particleSpeed: 0.4,
      particleSize: 1.5,
      gridOpacity: 0.03,
      gridSpacing: 60,
      color: '0, 229, 255'
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.particles = [];
    const count = Math.min(this.config.particleCount, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(x, y) {
    return {
      x: x || Math.random() * this.canvas.width,
      y: y || Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * this.config.particleSpeed,
      vy: (Math.random() - 0.5) * this.config.particleSpeed,
      size: Math.random() * this.config.particleSize + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawGrid() {
    const ctx = this.ctx;
    const { gridSpacing, gridOpacity, color } = this.config;
    ctx.strokeStyle = `rgba(${color}, ${gridOpacity})`;
    ctx.lineWidth = 0.5;

    for (let x = 0; x < this.canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }
  }

  drawParticles() {
    const ctx = this.ctx;
    const { color, maxDistance } = this.config;

    this.particles.forEach(p => {
      p.pulse += 0.02;
      const dynamicOpacity = p.opacity + Math.sin(p.pulse) * 0.1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${dynamicOpacity})`;
      ctx.fill();

      // Mouse repulsion
      if (this.mouse.x && this.mouse.y) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Speed cap
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2) { p.vx *= 0.9; p.vy *= 0.9; }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const pa = this.particles[i];
        const pb = this.particles[j];
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `rgba(${color}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawParticles();
    this.animId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('bg-canvas');
});
