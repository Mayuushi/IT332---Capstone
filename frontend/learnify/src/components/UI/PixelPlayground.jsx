import React, { useEffect, useRef } from "react";

const PixelPlayground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0;
    let height = 0;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    let cell = 4;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = width > 900 ? 6 : width > 600 ? 5 : 4;
    };
    resize();
    let groundY = 0;
    const align = v => Math.round(v / cell) * cell;
    const groundStart = align(height * 0.75) - 3 * cell;
    const sky = "#7EC8FF";
    const grass = "#4CD964";
    const dirt = "#2E8B57";
    const build = "#FFC04D";
    const buildOutline = "#CC9A3A";
    const roof = "#FF4D6D";
    const roofOutline = "#C13B54";
    const windowOn = "#FFFFFF";
    const windowOff = "#CDE8FF";
    const windowFrame = "#2B2D42";
    const door = "#8B4513";
    const trunk = "#7B4B2A";
    const leaves = "#2ECC71";
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const students = [];
    const balls = [];
    const clouds = [];
    const makeCloud = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.35,
        w: align(16 + Math.random() * 48),
        h: align(8 + Math.random() * 16),
        vx: 0.1 + Math.random() * 0.15
      };
    };
    for (let i = 0; i < 8; i++) clouds.push(makeCloud());
    const createStudent = () => {
      const paletteTops = ["#FF6B6B", "#4D96FF", "#FFC75F", "#845EC2", "#00C9A7", "#FF9671"];
      const palettePants = ["#2E2E3A", "#1B3C73", "#3E497A", "#2B2D42"];
      const scale = [1, 1, 1, 2][Math.floor(Math.random() * 4)];
      return {
        x: Math.random() * width,
        y: groundStart,
        vx: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.6),
        vy: 0,
        dir: Math.random() < 0.5 ? -1 : 1,
        top: pick(paletteTops),
        pant: pick(palettePants),
        skin: pick(["#F9D7B9", "#F4B183", "#D48C53", "#B56B3A"]),
        hair: pick(["#3B2F2F", "#1F1B1B", "#5B3A29", "#2D2A32"]),
        step: 0,
        scale
      };
    };
    for (let i = 0; i < 12; i++) students.push(createStudent());
    for (let i = 0; i < 2; i++) {
      balls.push({
        x: Math.random() * width,
        y: 0,
        vx: (Math.random() < 0.5 ? -0.8 : 0.8) * (0.8 + Math.random() * 0.4),
        vy: -Math.random() * 2,
        clr: pick(["#FF4D6D", "#00D1FF", "#FFD166", "#06D6A0"]),
        size: [cell, cell * 2][Math.floor(Math.random() * 2)]
      });
    }
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;
      groundY = align(height * 0.75);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, groundY);
      for (const c of clouds) {
        c.x += c.vx;
        if (c.x > width + 40) c.x = -40;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(align(c.x), align(c.y), c.w, c.h);
        ctx.fillRect(align(c.x + c.w * 0.2), align(c.y - c.h * 0.5), align(c.w * 0.6), align(c.h * 0.8));
      }
      ctx.fillStyle = grass;
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.fillStyle = dirt;
      for (let gx = 0; gx < width; gx += cell * 3) {
        ctx.fillRect(align(gx), align(groundY + cell * 2), cell, cell);
      }
      const bw = align(Math.max(260, Math.min(360, Math.floor(width * 0.45))));
      const bh = align(Math.max(140, Math.min(180, Math.floor(height * 0.32))));
      const prefer = width > 720 ? width * 0.68 - bw / 2 : width * 0.22 - bw / 2;
      const bx = align(Math.max(0, Math.min(width - bw, prefer)));
      const by = align(groundY - bh - cell);
      ctx.fillStyle = build;
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = buildOutline;
      ctx.fillRect(bx - cell, by, cell, bh);
      ctx.fillRect(bx + bw, by, cell, bh);
      ctx.fillRect(bx, by + bh, bw, cell);
      ctx.fillStyle = roof;
      ctx.fillRect(bx - cell * 2, by - cell * 3, bw + cell * 4, cell * 3);
      ctx.fillStyle = roofOutline;
      ctx.fillRect(bx - cell * 2, by - cell * 3, bw + cell * 4, cell);
      ctx.fillRect(bx - cell * 2, by - cell * 3, cell, cell * 3);
      ctx.fillRect(bx + bw + cell * 3, by - cell * 3, cell, cell * 3);
      const wxCount = Math.max(3, Math.floor(bw / (cell * 9)));
      const wyCount = 3;
      const wGapX = Math.floor(bw / (wxCount + 1));
      const wGapY = Math.floor(bh / (wyCount + 2));
      for (let iy = 0; iy < wyCount; iy++) {
        for (let ix = 1; ix <= wxCount; ix++) {
          const wx = align(bx + ix * wGapX - cell * 2);
          const wy = align(by + (iy + 1) * wGapY);
          const ww = cell * 5;
          const wh = cell * 5;
          ctx.fillStyle = Math.random() > 0.2 ? windowOn : windowOff;
          ctx.fillRect(wx, wy, ww, wh);
          ctx.fillStyle = windowFrame;
          ctx.fillRect(wx - cell, wy, cell, wh);
          ctx.fillRect(wx + ww, wy, cell, wh);
          ctx.fillRect(wx, wy - cell, ww, cell);
          ctx.fillRect(wx, wy + wh, ww, cell);
        }
      }
      ctx.fillStyle = door;
      const dw = cell * 7;
      const dh = cell * 12;
      ctx.fillRect(align(bx + bw / 2 - dw / 2), align(by + bh - dh), dw, dh);
      const treeX = [align(width * 0.1), bx + bw + cell * 6];
      for (const tx of treeX) {
        ctx.fillStyle = trunk;
        ctx.fillRect(align(tx), align(groundY - cell * 20), cell * 4, cell * 20);
        ctx.fillStyle = leaves;
        ctx.fillRect(align(tx - cell * 6), align(groundY - cell * 28), cell * 16, cell * 10);
      }
      for (const s of students) {
        s.vy += 0.12;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < cell) {
          s.x = cell;
          s.vx *= -1;
          s.dir *= -1;
        }
        if (s.x > width - cell * 8) {
          s.x = width - cell * 8;
          s.vx *= -1;
          s.dir *= -1;
        }
        const baseY = groundY - 3 * cell;
        if (s.y > baseY) {
          s.y = baseY;
          s.vy = 0;
          if (Math.random() < 0.015) s.vy = -2 - Math.random() * 1.6;
        }
        s.step += Math.abs(s.vx) * 0.1;
        const f = Math.floor(s.step) % 2;
        const sx = align(s.x);
        const sy = align(s.y);
        const sc = s.scale;
        ctx.fillStyle = s.skin;
        ctx.fillRect(sx + cell * 2 * sc, sy - cell * 8 * sc, cell * 2 * sc, cell * 2 * sc);
        ctx.fillStyle = s.hair;
        ctx.fillRect(sx + cell * 2 * sc, sy - cell * 10 * sc, cell * 2 * sc, cell * 2 * sc);
        ctx.fillStyle = s.top;
        ctx.fillRect(sx + cell * 1 * sc, sy - cell * 6 * sc, cell * 4 * sc, cell * 3 * sc);
        ctx.fillStyle = s.pant;
        ctx.fillRect(sx + cell * 1 * sc, sy - cell * 3 * sc, cell * 4 * sc, cell * 2 * sc);
        ctx.fillStyle = "#2B2B2B";
        const legOffset = f === 0 ? -1 : 1;
        const l1x = s.dir === 1 ? cell * (1 + legOffset) * sc : cell * (1 - legOffset) * sc;
        const l2x = s.dir === 1 ? cell * (3 - legOffset) * sc : cell * (3 + legOffset) * sc;
        ctx.fillRect(sx + l1x, sy - cell * 1 * sc, cell * 1 * sc, cell * 1 * sc);
        ctx.fillRect(sx + l2x, sy - cell * 1 * sc, cell * 1 * sc, cell * 1 * sc);
        ctx.fillStyle = s.top;
        const armY = sy - cell * 6 * sc + (f === 0 ? 0 : cell * 1 * sc);
        const armX = s.dir === 1 ? sx + cell * 5 * sc : sx + cell * 0 * sc;
        ctx.fillRect(armX, armY, cell * 1 * sc, cell * 2 * sc);
      }
      for (const b of balls) {
        b.vy += 0.12;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < cell) {
          b.x = cell;
          b.vx *= -1;
        }
        if (b.x > width - b.size) {
          b.x = width - b.size;
          b.vx *= -1;
        }
        const gy = groundY - 3 * cell + cell;
        if (b.y > gy) {
          b.y = gy;
          b.vy *= -(0.5 + Math.random() * 0.2);
        }
        ctx.fillStyle = b.clr;
        ctx.fillRect(align(b.x), align(b.y), b.size, b.size);
      }
      raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas className="pixel-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default PixelPlayground;
