/**
 * PQC Demo — Live Theme Tweaker
 * ─────────────────────────────────────────────────────────────────────
 * Press Shift+T to toggle the floating panel.
 * Changes are applied instantly via CSS custom properties on :root.
 * Saved to localStorage so they persist across page loads.
 * ─────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'pqc-theme-overrides';

  // ── PRESETS ──────────────────────────────────────────────────────────
  const PRESETS = {
    'TERMINAL': {
      '--body-bg':      '#07080d',
      '--bg':           '#07080d',
      '--bg2':          '#0c0e16',
      '--bg3':          '#111320',
      '--safe':         '#1e6fa8',
      '--safe-glow':    '#2a9fd6',
      '--threat':       '#c43a00',
      '--threat-glow':  '#ff5500',
      '--quantum':      '#00e87a',
      '--quantum-glow': '#00ff99',
      '--text':         '#c0cfe0',
      '--text-dim':     '#4a5a70',
      '--red':          '#ff2200',
      '--amber':        '#ff8800',
    },
    'CNXN BRAND': {
      '--body-bg':      'gradient',   // special — handled below
      '--bg':           '#001a38',
      '--bg2':          '#002C5C',
      '--bg3':          '#003875',
      '--safe':         '#0076BD',
      '--safe-glow':    '#0099D7',
      '--threat':       '#c43a00',
      '--threat-glow':  '#ff5500',
      '--quantum':      '#7EC352',
      '--quantum-glow': '#A4CF57',
      '--text':         '#BBC5CC',
      '--text-dim':     '#5a7a9a',
      '--red':          '#ff2200',
      '--amber':        '#FFCC40',
    },
  };

  const CNXN_GRADIENT = 'linear-gradient(180deg, #002C5C 0%, #0076BD 100%)';

  // Variables we expose in the panel (label, var name, type)
  const CONTROLS = [
    { label: 'Font Scale',       v: '--font-scale',   type: 'range', min: 0.7, max: 1.5, step: 0.05, default: 1.0 },
    { label: 'Page Background',  v: '--body-bg',      type: 'color' },
    { label: 'Surface — deep',   v: '--bg',           type: 'color' },
    { label: 'Surface — mid',    v: '--bg2',          type: 'color' },
    { label: 'Surface — top',    v: '--bg3',          type: 'color' },
    { label: 'Safe',             v: '--safe',         type: 'color' },
    { label: 'Safe Glow',        v: '--safe-glow',    type: 'color' },
    { label: 'Threat',           v: '--threat',       type: 'color' },
    { label: 'Threat Glow',      v: '--threat-glow',  type: 'color' },
    { label: 'Quantum',          v: '--quantum',      type: 'color' },
    { label: 'Quantum Glow',     v: '--quantum-glow', type: 'color' },
    { label: 'Text',             v: '--text',         type: 'color' },
    { label: 'Text Dim',         v: '--text-dim',     type: 'color' },
    { label: 'Red',              v: '--red',          type: 'color' },
    { label: 'Amber',            v: '--amber',        type: 'color' },
  ];

  // ── APPLY OVERRIDES FROM STORAGE ON LOAD ─────────────────────────────
  function loadAndApply() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      Object.entries(saved).forEach(([prop, val]) => {
        document.documentElement.style.setProperty(prop, val);
        if (prop === '--font-scale') {
          document.body.style.zoom = parseFloat(val);
        }
      });
    } catch (e) { /* ignore */ }
  }

  function getCurrentValue(varName) {
    // Check inline style first (tweaker overrides), then computed
    const inline = document.documentElement.style.getPropertyValue(varName).trim();
    if (inline) return inline;
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  function setVar(varName, value) {
    document.documentElement.style.setProperty(varName, value);
    // Save to storage
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      saved[varName] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) { /* ignore */ }
  }

  function clearAllOverrides() {
    CONTROLS.forEach(({ v }) => document.documentElement.style.removeProperty(v));
    document.body.style.zoom = '';
    localStorage.removeItem(STORAGE_KEY);
  }

  // ── PANEL BUILDER ─────────────────────────────────────────────────────
  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'pqc-tweaker';
    panel.setAttribute('aria-label', 'Theme Tweaker');

    panel.innerHTML = `
      <div id="pqct-header">
        <span id="pqct-title">⬡ THEME TWEAKER</span>
        <button id="pqct-close" title="Close (Shift+T)">✕</button>
      </div>
      <div id="pqct-presets">
        ${Object.keys(PRESETS).map(name =>
          `<button class="pqct-preset" data-preset="${name}">${name}</button>`
        ).join('')}
      </div>
      <div id="pqct-rows"></div>
      <div id="pqct-actions">
        <button id="pqct-reset">RESET</button>
        <button id="pqct-copy">COPY :root CSS</button>
      </div>
    `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #pqc-tweaker {
        position: fixed;
        top: 70px;
        right: 20px;
        width: 310px;
        background: #0c0e16;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 6px;
        z-index: 99999;
        font-family: 'Inconsolata', 'Courier New', monospace;
        font-size: 12px;
        color: #c0cfe0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.7);
        user-select: none;
        display: none;
      }
      #pqc-tweaker.open { display: block; }
      #pqct-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 8px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        cursor: grab;
      }
      #pqct-header:active { cursor: grabbing; }
      #pqct-title {
        font-size: 11px;
        letter-spacing: 0.12em;
        color: #00e87a;
        font-weight: 700;
      }
      #pqct-close {
        background: none;
        border: none;
        color: #4a5a70;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 0;
      }
      #pqct-close:hover { color: #c0cfe0; }
      #pqct-presets {
        display: flex;
        gap: 6px;
        padding: 8px 14px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .pqct-preset {
        flex: 1;
        background: #111320;
        border: 1px solid rgba(255,255,255,0.1);
        color: #c0cfe0;
        padding: 5px 0;
        font-family: inherit;
        font-size: 10px;
        letter-spacing: 0.08em;
        cursor: pointer;
        border-radius: 3px;
        transition: border-color 0.15s, color 0.15s;
      }
      .pqct-preset:hover { border-color: #00e87a; color: #00e87a; }
      .pqct-preset.active { border-color: #00e87a; color: #00e87a; background: rgba(0,232,122,0.07); }
      #pqct-rows {
        padding: 10px 14px;
        max-height: 420px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      #pqct-rows::-webkit-scrollbar { width: 4px; }
      #pqct-rows::-webkit-scrollbar-track { background: transparent; }
      #pqct-rows::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
      .pqct-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pqct-row label {
        flex: 1;
        color: #4a5a70;
        font-size: 11px;
        letter-spacing: 0.04em;
        cursor: default;
      }
      .pqct-swatch {
        width: 32px;
        height: 20px;
        border-radius: 3px;
        border: 1px solid rgba(255,255,255,0.15);
        cursor: pointer;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
      }
      .pqct-swatch input[type="color"] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        border: none;
        padding: 0;
      }
      .pqct-hex {
        width: 68px;
        background: #07080d;
        border: 1px solid rgba(255,255,255,0.08);
        color: #c0cfe0;
        font-family: inherit;
        font-size: 11px;
        padding: 3px 5px;
        border-radius: 3px;
        text-transform: uppercase;
      }
      .pqct-hex:focus { outline: none; border-color: #00e87a; }
      #pqct-actions {
        display: flex;
        gap: 6px;
        padding: 8px 14px 12px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      #pqct-actions button {
        flex: 1;
        background: #111320;
        border: 1px solid rgba(255,255,255,0.1);
        color: #c0cfe0;
        padding: 6px 0;
        font-family: inherit;
        font-size: 10px;
        letter-spacing: 0.08em;
        cursor: pointer;
        border-radius: 3px;
        transition: border-color 0.15s, color 0.15s;
      }
      #pqct-reset:hover  { border-color: #ff5500; color: #ff5500; }
      #pqct-copy:hover   { border-color: #2a9fd6; color: #2a9fd6; }
      #pqct-copy.copied  { border-color: #00e87a; color: #00e87a; }
      .pqct-range {
        flex: 1;
        accent-color: #00e87a;
        height: 4px;
        cursor: pointer;
      }
      .pqct-range-val {
        width: 42px;
        text-align: right;
        font-size: 11px;
        color: #c0cfe0;
        flex-shrink: 0;
      }

      /* Corner indicator — always visible */
      #pqct-indicator {
        position: fixed;
        bottom: 14px;
        right: 16px;
        font-family: 'Inconsolata', monospace;
        font-size: 18px;
        color: rgba(0,232,122,0.25);
        cursor: pointer;
        z-index: 99998;
        line-height: 1;
        transition: color 0.2s;
        user-select: none;
      }
      #pqct-indicator:hover { color: rgba(0,232,122,0.7); }
    `;
    document.head.appendChild(style);

    return panel;
  }

  function populateRows(panel) {
    const rowsEl = panel.querySelector('#pqct-rows');
    rowsEl.innerHTML = '';

    CONTROLS.forEach(({ label, v, type, min, max, step, default: defaultVal }) => {
      const raw = getCurrentValue(v);

      const row = document.createElement('div');
      row.className = 'pqct-row';
      row.dataset.var = v;

      if (type === 'range') {
        const currentVal = parseFloat(raw) || defaultVal;
        row.innerHTML = `
          <label>${label}</label>
          <input class="pqct-range" type="range" min="${min}" max="${max}" step="${step}" value="${currentVal}" data-var="${v}">
          <span class="pqct-range-val" data-var="${v}">${currentVal.toFixed(2)}×</span>
        `;
      } else {
        // If the value is a gradient or not a parseable color, skip the swatch
        const isGradient = raw.includes('gradient') || raw.includes('linear') || raw.includes('radial');

        if (isGradient) {
          row.innerHTML = `
            <label>${label}</label>
            <div class="pqct-swatch" title="${raw}" style="background:${raw}; cursor:default;"></div>
            <input class="pqct-hex" type="text" value="(gradient)" readonly style="color:#4a5a70; width:80px;">
          `;
        } else {
          const hexVal = rgbToHex(raw) || raw;
          row.innerHTML = `
            <label>${label}</label>
            <div class="pqct-swatch" style="background:${hexVal};">
              <input type="color" value="${hexVal}" data-var="${v}">
            </div>
            <input class="pqct-hex" type="text" value="${hexVal}" data-var="${v}" maxlength="7">
          `;
        }
      }

      rowsEl.appendChild(row);
    });

    // Range slider → live update (font scale applies to <html> font-size via CSS calc)
    rowsEl.querySelectorAll('.pqct-range').forEach(slider => {
      slider.addEventListener('input', () => {
        const varName = slider.dataset.var;
        const val = parseFloat(slider.value);
        setVar(varName, val);
        // Apply font scale via zoom so px-based sizes scale too
        document.body.style.zoom = val;
        const readout = rowsEl.querySelector(`.pqct-range-val[data-var="${varName}"]`);
        if (readout) readout.textContent = val.toFixed(2) + '×';
      });
    });

    // Color picker → live update
    rowsEl.querySelectorAll('input[type="color"]').forEach(picker => {
      picker.addEventListener('input', () => {
        const varName = picker.dataset.var;
        const val = picker.value;
        setVar(varName, val);
        // Sync hex input + swatch bg
        const hexInput = rowsEl.querySelector(`.pqct-hex[data-var="${varName}"]`);
        if (hexInput) hexInput.value = val.toUpperCase();
        const swatch = picker.closest('.pqct-swatch');
        if (swatch) swatch.style.background = val;
      });
    });

    // Hex text → live update
    rowsEl.querySelectorAll('.pqct-hex[data-var]').forEach(hexInput => {
      hexInput.addEventListener('change', () => {
        const varName = hexInput.dataset.var;
        let val = hexInput.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (!/^#[0-9a-fA-F]{6}$/.test(val)) { hexInput.value = getCurrentValue(varName); return; }
        val = val.toUpperCase();
        hexInput.value = val;
        setVar(varName, val);
        // Sync color picker + swatch
        const picker = rowsEl.querySelector(`input[type="color"][data-var="${varName}"]`);
        if (picker) picker.value = val;
        const swatch = picker ? picker.closest('.pqct-swatch') : null;
        if (swatch) swatch.style.background = val;
      });
    });
  }

  function applyPreset(name, panel) {
    const preset = PRESETS[name];
    if (!preset) return;

    Object.entries(preset).forEach(([prop, val]) => {
      const actual = val === 'gradient' ? CNXN_GRADIENT : val;
      setVar(prop, actual);
    });

    // Re-render rows to reflect new values
    populateRows(panel);

    // Mark active preset button
    panel.querySelectorAll('.pqct-preset').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === name);
    });
  }

  function buildCSSExport() {
    const lines = [':root {'];
    CONTROLS.forEach(({ v }) => {
      const val = getCurrentValue(v);
      lines.push(`  ${v}: ${val};`);
    });
    lines.push('}');
    return lines.join('\n');
  }

  // ── DRAG SUPPORT ──────────────────────────────────────────────────────
  function makeDraggable(panel) {
    const header = panel.querySelector('#pqct-header');
    let dragging = false, ox = 0, oy = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.target.id === 'pqct-close') return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      ox = e.clientX - rect.left;
      oy = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(window.innerWidth  - panel.offsetWidth,  e.clientX - ox));
      const y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - oy));
      panel.style.left  = x + 'px';
      panel.style.top   = y + 'px';
      panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => { dragging = false; });
  }

  // ── INIT ──────────────────────────────────────────────────────────────
  function init() {
    // Apply any saved overrides immediately
    loadAndApply();

    // Build panel (hidden until Shift+T)
    const panel = buildPanel();
    document.body.appendChild(panel);

    // Corner indicator
    const indicator = document.createElement('div');
    indicator.id = 'pqct-indicator';
    indicator.textContent = '⬡';
    indicator.title = 'Theme Tweaker (Shift+T)';
    document.body.appendChild(indicator);

    makeDraggable(panel);

    function openPanel() {
      populateRows(panel);
      panel.classList.add('open');
    }

    function closePanel() {
      panel.classList.remove('open');
    }

    function togglePanel() {
      if (panel.classList.contains('open')) closePanel();
      else openPanel();
    }

    // Keyboard: Shift+T
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'T' || e.key === 't') && !e.ctrlKey && !e.metaKey) {
        togglePanel();
      }
    });

    // Corner indicator click
    indicator.addEventListener('click', togglePanel);

    // Close button
    panel.querySelector('#pqct-close').addEventListener('click', closePanel);

    // Preset buttons
    panel.querySelectorAll('.pqct-preset').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset, panel));
    });

    // Reset button
    panel.querySelector('#pqct-reset').addEventListener('click', () => {
      clearAllOverrides();
      populateRows(panel);
      panel.querySelectorAll('.pqct-preset').forEach(b => b.classList.remove('active'));
    });

    // Copy CSS button
    const copyBtn = panel.querySelector('#pqct-copy');
    copyBtn.addEventListener('click', () => {
      const css = buildCSSExport();
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.textContent = 'COPIED ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'COPY :root CSS';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback: select a temp textarea
        const ta = document.createElement('textarea');
        ta.value = css;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = 'COPIED ✓';
        setTimeout(() => { copyBtn.textContent = 'COPY :root CSS'; }, 2000);
      });
    });
  }

  // ── HELPERS ───────────────────────────────────────────────────────────
  function rgbToHex(raw) {
    if (!raw) return null;
    if (raw.startsWith('#')) return raw.length === 7 ? raw.toUpperCase() : null;
    const m = raw.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (!m) return null;
    return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
