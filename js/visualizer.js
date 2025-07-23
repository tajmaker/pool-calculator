// --- SVG визуализация для concrete ---
function renderPoolSVG(shape, length, width, depth) {
  // Фиксированные размеры SVG
  const maxW = 340, maxH = 180;
  // Пропорции
  let l = Math.max(4, Math.min(50, length));
  let w = Math.max(2, Math.min(20, width));
  // Масштабирование (чтобы всегда вписывалось в SVG)
  let scale = Math.min((maxW-40) / l, (maxH-40) / w);
  let svgW = maxW, svgH = maxH;
  let poolW = l * scale, poolH = w * scale;
  let x = (svgW - poolW) / 2, y = (svgH - poolH) / 2;
  // 3D эффект: эллипс-дно
  let d = Math.max(1, Math.min(3, depth));
  let depthPx = 18 + (d-1)*10;
  let grad = 'url(#poolGrad)';
  let shadow = 'filter: drop-shadow(0 10px 24px #1786f933);';
  // Форма
  let poolShape = '';
  let bottomShape = '';
  if (shape === 'rectangle') {
    poolShape = `<rect x="${x}" y="${y}" width="${poolW}" height="${poolH}" rx="18" fill="${grad}" stroke="#1786f9" stroke-width="3" style="${shadow}"/>`;
    bottomShape = `<ellipse cx="${svgW/2}" cy="${y+poolH+depthPx/2}" rx="${poolW/2-8}" ry="${depthPx/2}" fill="#b3d6f7" opacity="0.45"/>`;
  } else if (shape === 'oval') {
    poolShape = `<ellipse cx="${svgW/2}" cy="${svgH/2}" rx="${poolW/2}" ry="${poolH/2}" fill="${grad}" stroke="#1786f9" stroke-width="3" style="${shadow}"/>`;
    bottomShape = `<ellipse cx="${svgW/2}" cy="${svgH/2+poolH/2}" rx="${poolW/2-8}" ry="${depthPx/2}" fill="#b3d6f7" opacity="0.45"/>`;
  } else if (shape === 'square') {
    let side = Math.min(poolW, poolH);
    let sx = (svgW-side)/2, sy = (svgH-side)/2;
    poolShape = `<rect x="${sx}" y="${sy}" width="${side}" height="${side}" rx="14" fill="${grad}" stroke="#1786f9" stroke-width="3" style="${shadow}"/>`;
    bottomShape = `<ellipse cx="${svgW/2}" cy="${sy+side+depthPx/2}" rx="${side/2-8}" ry="${depthPx/2}" fill="#b3d6f7" opacity="0.45"/>`;
  }
  // Градиент
  let defs = `<defs><linearGradient id="poolGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eaf6ff"/><stop offset="100%" stop-color="#1786f9"/></linearGradient></defs>`;
  // Размеры
  let label = `<text x="${svgW/2}" y="${y+poolH/2}" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold" dy=".3em">${l}m × ${w}m</text>`;
  // Глубина
  let depthLabel = `<text x="${svgW-12}" y="${svgH-12}" text-anchor="end" fill="#fff" font-size="13" font-weight="bold">Depth: ${d}m</text>`;
  return `<div style="width:100%;max-width:${maxW}px;margin:0 auto;">
    <svg width="100%" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block;">
      ${defs}
      <g>
        ${bottomShape}
        ${poolShape}
        ${label}
        ${depthLabel}
      </g>
    </svg>
  </div>`;
}

// --- SVG визуализация для Concrete pool (Top view и Side view) ---
function renderConcreteSVGs(shape, length, width, depth) {
  // Контейнеры для SVG
  const topView = document.getElementById('svg-top-view');
  const sideView = document.getElementById('svg-side-view');
  if (!topView || !sideView) return;
  // --- Пропорции и размеры SVG ---
  const maxW = 340, maxH = 180;
  // Для top view: длина по горизонтали, ширина по вертикали
  let l = Math.max(2, Math.min(50, length));
  let w = Math.max(2, Math.min(20, width));
  let scale = Math.min((maxW-40) / l, (maxH-40) / w);
  let svgW = maxW, svgH = maxH;
  let poolW = l * scale, poolH = w * scale;
  let x = (svgW - poolW) / 2, y = (svgH - poolH) / 2;
  // --- Top view SVG ---
  let poolShape = '', outline = '', gradId = 'poolGradTop';
  if (shape === 'rectangle') {
    poolShape = `<rect x="${x}" y="${y}" width="${poolW}" height="${poolH}" rx="18" fill="url(#${gradId})" stroke="#0797ee" stroke-width="4" filter="drop-shadow(0 4px 16px #0797ee22)"/>`;
    outline = '';
  } else if (shape === 'oval') {
    poolShape = `<ellipse cx="${svgW/2}" cy="${svgH/2}" rx="${poolW/2}" ry="${poolH/2}" fill="url(#${gradId})" stroke="#0797ee" stroke-width="4" filter="drop-shadow(0 4px 16px #0797ee22)"/>`;
    outline = '';
  } else if (shape === 'square') {
    let side = Math.min(poolW, poolH);
    let sx = (svgW-side)/2, sy = (svgH-side)/2;
    poolShape = `<rect x="${sx}" y="${sy}" width="${side}" height="${side}" rx="16" fill="url(#${gradId})" stroke="#0797ee" stroke-width="4" filter="drop-shadow(0 4px 16px #0797ee22)"/>`;
    outline = '';
  }
  // --- Dimension labels (Top view) ---
  let dimLabels = `
    <text x="${svgW/2}" y="${y-10}" text-anchor="middle" fill="#0797ee" font-size="15" font-family="Arial, sans-serif">${l.toFixed(1)}m</text>
    <text x="${x-8}" y="${svgH/2}" text-anchor="end" fill="#0797ee" font-size="15" font-family="Arial, sans-serif" dy=".3em">${w.toFixed(1)}m</text>
  `;
  // --- Градиент ---
  let grad = `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b3e6ff"/><stop offset="100%" stop-color="#0797ee"/></linearGradient></defs>`;
  // --- SVG Top view ---
  topView.innerHTML = `<svg width="100%" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block;max-width:100%;border-radius:18px;background:#f9fafc;">
    ${grad}
    ${poolShape}
    ${outline}
    ${dimLabels}
  </svg>`;
  // --- Side view SVG ---
  // Глубина: от 1 до 3 м, пропорционально maxH
  const sideW = 220, sideH = 80, sideX = (svgW-sideW)/2, sideY = 10;
  let d = Math.max(1, Math.min(3, depth));
  let depthPx = ((d-1)/(3-1)) * (sideH-24) + 24; // min 24px, max sideH
  let gradId2 = 'poolGradSide';
  let poolRect = `<rect x="${sideX}" y="${sideY}" width="${sideW}" height="${sideH}" rx="18" fill="url(#${gradId2})" stroke="#0797ee" stroke-width="4" filter="drop-shadow(0 4px 16px #0797ee22)"/>`;
  let waterRect = `<rect x="${sideX+8}" y="${sideY+sideH-depthPx}" width="${sideW-16}" height="${depthPx}" rx="10" fill="url(#${gradId2})" opacity="0.85"/>`;
  // --- Dimension label (Side view) ---
  let dimLabelSide = `<text x="${sideX+sideW+8}" y="${sideY+sideH-depthPx/2}" fill="#0797ee" font-size="15" font-family="Arial, sans-serif" dy=".3em">${d.toFixed(1)}m</text>`;
  let grad2 = `<defs><linearGradient id="${gradId2}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b3e6ff"/><stop offset="100%" stop-color="#0797ee"/></linearGradient></defs>`;
  // --- SVG Side view ---
  sideView.innerHTML = `<svg width="100%" height="${sideH+sideY*2}" viewBox="0 0 ${svgW} ${sideH+sideY*2}" style="display:block;max-width:100%;border-radius:18px;background:#f9fafc;">
    ${grad2}
    ${poolRect}
    ${waterRect}
    ${dimLabelSide}
  </svg>`;
  // TODO: добавить анимацию изменения размеров и плавные переходы
  // TODO: добавить более сложные формы (freeform, kidney и т.д.)
}

// --- WOW SVG визуализация для Concrete pool (Top view и Side view, с анимацией и эффектами) ---
function renderConcreteWOWSVGs(shape, length, width, depth) {
  // Контейнеры для SVG
  const topView = document.getElementById('svg-top-view');
  const sideView = document.getElementById('svg-side-view');
  if (!topView || !sideView) return;
  // --- Пропорции и размеры SVG ---
  const maxW = 340, maxH = 180;
  // Для top view: длина по горизонтали, ширина по вертикали
  let l = Math.max(2, Math.min(50, length));
  let w = Math.max(2, Math.min(20, width));
  let d = Math.max(1, Math.min(3, depth));
  let scale = Math.min((maxW-40) / l, (maxH-40) / w);
  let svgW = maxW, svgH = maxH;
  let poolW = l * scale, poolH = w * scale;
  let x = (svgW - poolW) / 2, y = (svgH - poolH) / 2;
  // --- WOW Top view SVG ---
  let gradId = 'poolGradTopWOW';
  let shadow = 'filter: drop-shadow(0 10px 24px #1786f955);';
  let glare = `<ellipse cx="${svgW/2}" cy="${y+poolH/2-10}" rx="${poolW/2-12}" ry="${poolH/6}" fill="#fff" opacity="0.18">
    <animate attributeName="opacity" values="0.18;0.05;0.18" dur="2.5s" repeatCount="indefinite"/>
  </ellipse>`;
  let ripple = `<ellipse cx="${svgW/2}" cy="${svgH/2}" rx="${poolW/2-8}" ry="${poolH/2-8}" fill="none" stroke="#fff" stroke-width="2" opacity="0.13">
    <animate attributeName="rx" values="${poolW/2-8};${poolW/2-4};${poolW/2-8}" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="${poolH/2-8};${poolH/2-4};${poolH/2-8}" dur="2.2s" repeatCount="indefinite"/>
  </ellipse>`;
  let poolShape = '', outline = '';
  if (shape === 'rectangle') {
    poolShape = `<rect x="${x}" y="${y}" width="${poolW}" height="${poolH}" rx="18" fill="url(#${gradId})" stroke="#1786f9" stroke-width="4" style="${shadow}"/>`;
    outline = '';
  } else if (shape === 'oval') {
    poolShape = `<ellipse cx="${svgW/2}" cy="${svgH/2}" rx="${poolW/2}" ry="${poolH/2}" fill="url(#${gradId})" stroke="#1786f9" stroke-width="4" style="${shadow}"/>`;
    outline = '';
  } else if (shape === 'square') {
    let side = Math.min(poolW, poolH);
    let sx = (svgW-side)/2, sy = (svgH-side)/2;
    poolShape = `<rect x="${sx}" y="${sy}" width="${side}" height="${side}" rx="14" fill="url(#${gradId})" stroke="#1786f9" stroke-width="4" style="${shadow}"/>`;
    outline = '';
  }
  // --- Dimension labels (Top view) ---
  let dimLabelL = `<g><line x1="${x}" y1="${y+poolH+16}" x2="${x+poolW}" y2="${y+poolH+16}" stroke="#1786f9" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow)"/>
    <text x="${svgW/2}" y="${y+poolH+32}" text-anchor="middle" fill="#1786f9" font-size="15" font-weight="bold">${l} m</text></g>`;
  let dimLabelW = `<g><line x1="${x-16}" y1="${y}" x2="${x-16}" y2="${y+poolH}" stroke="#1786f9" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow)"/>
    <text x="${x-28}" y="${svgH/2}" text-anchor="middle" fill="#1786f9" font-size="15" font-weight="bold" transform="rotate(-90,${x-28},${svgH/2})">${w} m</text></g>`;
  // --- SVG defs ---
  let defs = `<defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#eaf6ff"/>
      <stop offset="100%" stop-color="#1786f9"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#1786f9" />
    </marker>
  </defs>`;
  // --- WOW Top view SVG ---
  topView.innerHTML = `<svg width="100%" height="${svgH+48}" viewBox="0 0 ${svgW} ${svgH+48}" style="display:block;max-width:100%;border-radius:18px;background:#f9fafc;">
    ${defs}
    <g>
      ${poolShape}
      ${glare}
      ${ripple}
      ${dimLabelL}
      ${dimLabelW}
    </g>
  </svg>`;
  // --- WOW Side view SVG ---
  // Side view: длина по горизонтали, глубина по вертикали
  let sideW = poolW, sideH = 80, sideY = 24;
  let grad2 = `<defs><linearGradient id="poolGradSideWOW" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eaf6ff"/><stop offset="100%" stop-color="#1786f9"/></linearGradient></defs>`;
  let poolRect = `<rect x="${x}" y="${sideY}" width="${sideW}" height="${sideH}" rx="12" fill="url(#poolGradSideWOW)" stroke="#1786f9" stroke-width="3" style="${shadow}"/>`;
  let waterRect = `<rect x="${x+4}" y="${sideY+8}" width="${sideW-8}" height="${sideH-16}" rx="8" fill="#b3d6f7" opacity="0.45"/>
    <ellipse cx="${svgW/2}" cy="${sideY+sideH-8}" rx="${sideW/2-12}" ry="8" fill="#1786f9" opacity="0.18">
      <animate attributeName="opacity" values="0.18;0.05;0.18" dur="2.5s" repeatCount="indefinite"/>
    </ellipse>`;
  let wave = `<path d="M${x+12},${sideY+sideH-16} Q${x+sideW/4},${sideY+sideH-24} ${x+sideW/2},${sideY+sideH-16} T${x+sideW-12},${sideY+sideH-16}" stroke="#fff" stroke-width="2" fill="none">
    <animate attributeName="d" values="M${x+12},${sideY+sideH-16} Q${x+sideW/4},${sideY+sideH-24} ${x+sideW/2},${sideY+sideH-16} T${x+sideW-12},${sideY+sideH-16};M${x+12},${sideY+sideH-16} Q${x+sideW/4},${sideY+sideH-8} ${x+sideW/2},${sideY+sideH-24} T${x+sideW-12},${sideY+sideH-16};M${x+12},${sideY+sideH-16} Q${x+sideW/4},${sideY+sideH-24} ${x+sideW/2},${sideY+sideH-16} T${x+sideW-12},${sideY+sideH-16}" dur="2.2s" repeatCount="indefinite"/>
  </path>`;
  let dimLabelSide = `<g><line x1="${x}" y1="${sideY+sideH+16}" x2="${x+sideW}" y2="${sideY+sideH+16}" stroke="#1786f9" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow)"/>
    <text x="${svgW/2}" y="${sideY+sideH+32}" text-anchor="middle" fill="#1786f9" font-size="15" font-weight="bold">${l} m</text>
    <line x1="${x+sideW+16}" y1="${sideY}" x2="${x+sideW+16}" y2="${sideY+sideH}" stroke="#1786f9" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow)"/>
    <text x="${x+sideW+28}" y="${sideY+sideH/2}" text-anchor="middle" fill="#1786f9" font-size="15" font-weight="bold" transform="rotate(-90,${x+sideW+28},${sideY+sideH/2})">${d} m</text></g>`;
  sideView.innerHTML = `<svg width="100%" height="${sideH+sideY*2+48}" viewBox="0 0 ${svgW} ${sideH+sideY*2+48}" style="display:block;max-width:100%;border-radius:18px;background:#f9fafc;">
    ${grad2}
    <g>
      ${poolRect}
      ${waterRect}
      ${wave}
      ${dimLabelSide}
    </g>
  </svg>`;
} 