/* ==========================================================================
   OpenBalancer — High-Performance Infrastructure JS Logic
   Operated by INCONTROL PLUS ЕООД
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  if (typeof initLanguageSwitcher === 'function') {
    initLanguageSwitcher();
  }
  initMobileDrawer();
  initTerminalTabs();
  initTelemetrySparkline();
  initAudioMicroFeedback();
  initLoadBalancerSimulator();
  initDocsLatencyHeatmap();
  initCustomErrorPageStudio();
  initConfigBuilder();
  initFaqAccordion();
  initContactModal();
  initContactPageForm();
  initSmoothScroll();
  initCookieBanner();
  initDocsScrollspy();
  initDocsSearch();
  initDocsConfigBuilder();
  initInteractiveApiTester();
  initCopySnippetButtons();
});

/**
 * Web Audio Micro-Feedback Synthesizer
 * Zero-asset, high-performance synthesized tones for routing, failover, and spikes.
 */
const SoundFX = (function () {
  let audioCtx = null;
  let isMuted = false;
  try {
    isMuted = localStorage.getItem('openbalancer_sfx_muted') === 'true';
  } catch (e) {}

  function getContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.04, gainVal = 0.04, freqEnd = null) {
    if (isMuted) return;
    try {
      const ctx = getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, freqEnd), now + duration);
      }

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch (e) {}
  }

  return {
    isMuted: () => isMuted,
    setMuted: (val) => {
      isMuted = val;
      try {
        localStorage.setItem('openbalancer_sfx_muted', val ? 'true' : 'false');
      } catch (e) {}
    },
    toggleMuted: () => {
      const next = !isMuted;
      SoundFX.setMuted(next);
      if (!next) {
        playTone(880, 'sine', 0.05, 0.05);
      }
      return next;
    },
    playRouting: (latency = 12) => {
      const freq = Math.max(380, 960 - (latency * 1.5));
      playTone(freq, 'sine', 0.03, 0.035, freq * 1.05);
    },
    playTokenTick: () => {
      playTone(1200, 'sine', 0.012, 0.018);
    },
    playFailover: () => {
      playTone(440, 'sawtooth', 0.08, 0.06, 260);
      setTimeout(() => playTone(240, 'triangle', 0.1, 0.06, 160), 70);
    },
    playSpike: () => {
      playTone(380, 'sine', 0.09, 0.05, 290);
    },
    playRecovery: () => {
      playTone(523.25, 'sine', 0.06, 0.04);
      setTimeout(() => playTone(659.25, 'sine', 0.06, 0.04), 50);
      setTimeout(() => playTone(783.99, 'sine', 0.1, 0.04), 100);
    },
    playSurge: () => {
      playTone(600, 'triangle', 0.04, 0.04, 850);
    },
    playClick: () => {
      playTone(1000, 'sine', 0.02, 0.025);
    }
  };
})();

/**
 * Audio Micro-Feedback Controller
 */
function initAudioMicroFeedback() {
  const toggleBtn = document.getElementById('sim-audio-toggle');
  const icon = document.getElementById('sim-audio-icon');
  const label = document.getElementById('sim-audio-label');

  function updateAudioUI() {
    const isMuted = SoundFX.isMuted();
    if (toggleBtn) {
      if (isMuted) {
        toggleBtn.classList.add('muted');
      } else {
        toggleBtn.classList.remove('muted');
      }
    }
    if (icon) {
      icon.textContent = isMuted ? '🔇' : '🔊';
    }
    if (label) {
      const isBg = (document.documentElement.lang || 'en') === 'bg';
      label.textContent = isMuted 
        ? (isBg ? 'Звукови ефекти: ИЗКЛ' : 'Sound FX: MUTED') 
        : (isBg ? 'Звукови ефекти: ВКЛ' : 'Sound FX: ON');
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      SoundFX.toggleMuted();
      updateAudioUI();
    });
  }

  updateAudioUI();
}

/**
 * Real-Time Latency Heatmap & Flamegraph Canvas Factory
 */
function createLatencyHeatmapEngine(canvasId, flamegraphContainerId, options = {}) {
  const canvas = document.getElementById(canvasId);
  const flamegraphEl = document.getElementById(flamegraphContainerId);
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const cols = 36;
  const history = [];
  for (let i = 0; i < cols; i++) {
    history.push({
      b0: Math.floor(Math.random() * 8 + 12),
      b1: Math.floor(Math.random() * 4 + 2),
      b2: Math.random() > 0.8 ? 1 : 0,
      b3: 0
    });
  }

  let rollingLatencies = [1.1, 1.2, 0.9, 1.4, 2.1, 8.4, 12.0, 1.18, 0.84, 1.35, 14.1];
  let animId = null;

  const buckets = [
    { label: '<10ms', color: '#10b981', rgba: '16, 185, 129' },
    { label: '10-50ms', color: '#06b6d4', rgba: '6, 182, 212' },
    { label: '50-200ms', color: '#f59e0b', rgba: '245, 158, 11' },
    { label: '>200ms', color: '#ef4444', rgba: '239, 68, 68' }
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = (options.height || 120) * dpr;
    ctx.scale(dpr, dpr);
  }

  function record(latency) {
    rollingLatencies.push(latency);
    if (rollingLatencies.length > 80) rollingLatencies.shift();

    const lastSlice = history[history.length - 1];
    if (latency < 10) lastSlice.b0++;
    else if (latency < 50) lastSlice.b1++;
    else if (latency < 200) lastSlice.b2++;
    else lastSlice.b3++;

    updateStats();
  }

  function tickHistory() {
    history.shift();
    history.push({ b0: 0, b1: 0, b2: 0, b3: 0 });
  }

  function getPercentile(pct) {
    if (rollingLatencies.length === 0) return 1.2;
    const sorted = [...rollingLatencies].sort((a, b) => a - b);
    const idx = Math.floor(sorted.length * (pct / 100));
    return sorted[Math.min(idx, sorted.length - 1)];
  }

  function updateStats() {
    let tot0 = 0, tot1 = 0, tot2 = 0, tot3 = 0;
    history.forEach(s => {
      tot0 += s.b0; tot1 += s.b1; tot2 += s.b2; tot3 += s.b3;
    });
    const total = Math.max(1, tot0 + tot1 + tot2 + tot3);

    const prefix = options.idPrefix || 'sim';
    const b0El = document.getElementById(`${prefix}-b0-pct`);
    const b1El = document.getElementById(`${prefix}-b1-pct`);
    const b2El = document.getElementById(`${prefix}-b2-pct`);
    const b3El = document.getElementById(`${prefix}-b3-pct`);

    if (b0El) b0El.textContent = `${Math.round((tot0 / total) * 100)}%`;
    if (b1El) b1El.textContent = `${Math.round((tot1 / total) * 100)}%`;
    if (b2El) b2El.textContent = `${Math.round((tot2 / total) * 100)}%`;
    if (b3El) b3El.textContent = `${Math.round((tot3 / total) * 100)}%`;

    const p50El = document.getElementById(`${prefix}-pct-p50`);
    const p90El = document.getElementById(`${prefix}-pct-p90`);
    const p99El = document.getElementById(`${prefix}-pct-p99`);
    const p999El = document.getElementById(`${prefix}-pct-p999`);

    if (p50El) p50El.textContent = `${getPercentile(50).toFixed(1)}ms`;
    if (p90El) p90El.textContent = `${getPercentile(90).toFixed(1)}ms`;
    if (p99El) p99El.textContent = `${getPercentile(99).toFixed(1)}ms`;
    if (p999El) p999El.textContent = `${(getPercentile(99) * 1.8).toFixed(1)}ms`;

    const fgTotalEl = document.getElementById(`${prefix}-fg-total-ms`);
    if (fgTotalEl) {
      const avg = (getPercentile(50) + 0.28).toFixed(2);
      fgTotalEl.textContent = `${avg} ms`;
    }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = options.height || 120;
    if (w === 0) return;

    ctx.clearRect(0, 0, w, h);

    const marginL = 55;
    const marginR = 12;
    const marginT = 10;
    const marginB = 20;

    const plotW = w - marginL - marginR;
    const plotH = h - marginT - marginB;

    const numRows = 4;
    const rowH = plotH / numRows;
    const colW = plotW / cols;

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yLabels = ['>200ms', '50-200ms', '10-50ms', '<10ms'];
    const rowColors = ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'];

    for (let r = 0; r < numRows; r++) {
      const y = marginT + r * rowH + rowH / 2;
      ctx.fillStyle = rowColors[r];
      ctx.fillText(yLabels[r], marginL - 8, y);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.moveTo(marginL, marginT + r * rowH);
      ctx.lineTo(marginL + plotW, marginT + r * rowH);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(marginL, marginT + plotH);
    ctx.lineTo(marginL + plotW, marginT + plotH);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('-60s', marginL, h - 6);
    ctx.textAlign = 'center';
    ctx.fillText('-30s', marginL + plotW / 2, h - 6);
    ctx.textAlign = 'right';
    ctx.fillText('Now', marginL + plotW, h - 6);

    let maxVal = 1;
    history.forEach(s => {
      maxVal = Math.max(maxVal, s.b0, s.b1, s.b2, s.b3);
    });

    for (let c = 0; c < cols; c++) {
      const slice = history[c];
      const vals = [slice.b3, slice.b2, slice.b1, slice.b0];
      const x = marginL + c * colW + 1;
      const cellW = Math.max(2, colW - 2);

      for (let r = 0; r < numRows; r++) {
        const val = vals[r];
        const y = marginT + r * rowH + 1;
        const cellH = Math.max(2, rowH - 2);

        if (val > 0) {
          const intensity = Math.min(1, 0.25 + (val / maxVal) * 0.75);
          const rgb = buckets[3 - r].rgba;
          ctx.fillStyle = `rgba(${rgb}, ${intensity})`;
          ctx.fillRect(x, y, cellW, cellH);

          if (c === cols - 1 && val > 0) {
            ctx.shadowColor = `rgba(${rgb}, 0.8)`;
            ctx.shadowBlur = 4;
            ctx.fillRect(x, y, cellW, cellH);
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
          ctx.fillRect(x, y, cellW, cellH);
        }
      }
    }
  }

  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 50);
  loop();

  const tickInterval = setInterval(() => {
    tickHistory();
    record(Math.random() > 0.9 ? Math.floor(Math.random() * 40 + 12) : (Math.random() * 5 + 1.1));
  }, 1500);

  updateStats();

  return {
    record,
    recordBatch: (count, baseLat = 12, jitter = 4) => {
      for (let i = 0; i < count; i++) {
        const lat = Math.max(1, baseLat + (Math.random() * jitter * 2 - jitter));
        record(lat);
      }
    },
    injectSpike: () => {
      for (let i = 0; i < 15; i++) {
        record(500 + Math.random() * 80);
      }
    },
    injectOutage: () => {
      for (let i = 0; i < 8; i++) {
        record(220 + Math.random() * 40);
      }
    },
    reset: () => {
      history.forEach(s => {
        s.b0 = Math.floor(Math.random() * 6 + 10);
        s.b1 = Math.floor(Math.random() * 3 + 1);
        s.b2 = 0;
        s.b3 = 0;
      });
      rollingLatencies = [1.1, 1.2, 0.9, 1.4, 2.1, 8.4];
      updateStats();
    }
  };
}

/**
 * Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/**
 * Live Prometheus Telemetry Sparkline Generator
 */
function initTelemetrySparkline() {
  const linePath = document.getElementById('sparkline-line');
  const areaPath = document.getElementById('sparkline-area');
  if (!linePath || !areaPath) return;

  const pointsCount = 17;
  const values = [50, 45, 48, 35, 40, 25, 30, 20, 28, 18, 22, 15, 25, 18, 22, 12, 16];

  function updateChart() {
    values.shift();
    const lastVal = values[values.length - 1];
    const delta = (Math.random() * 12) - 6;
    const newVal = Math.min(52, Math.max(10, Math.round(lastVal + delta)));
    values.push(newVal);

    const step = 800 / (pointsCount - 1);
    let dLine = `M0,${values[0]}`;
    let dArea = `M0,${values[0]}`;

    for (let i = 1; i < pointsCount; i++) {
      const x = Math.round(i * step);
      const y = values[i];
      dLine += ` L${x},${y}`;
      dArea += ` L${x},${y}`;
    }

    dArea += ` L800,60 L0,60 Z`;

    linePath.setAttribute('d', dLine);
    areaPath.setAttribute('d', dArea);
  }

  setInterval(updateChart, 1600);
}

/**
 * Terminal Tabs & Snippet Switcher
 */
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const copyBtn = document.getElementById('terminal-copy-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(c => {
        c.style.display = 'none';
      });

      const activeContent = document.getElementById(`tab-${target}`);
      if (activeContent) {
        activeContent.style.display = 'block';
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const activeTabContent = document.querySelector('.tab-content:not([style*="display: none"])');
      if (activeTabContent) {
        const textToCopy = activeTabContent.textContent.trim();
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        } catch (err) {
          console.error('Copy failed', err);
        }
      }
    });
  }
}

/**
 * Smart Theme Switcher: CompanyBook Light vs Deep Space Dark
 * Inverts based on user interaction and system preference (prefers-color-scheme)
 */
function initThemeSwitcher() {
  const desktopBtn = document.getElementById('theme-toggle-btn');
  const mobileBtn = document.getElementById('mobile-theme-toggle-btn');

  function getActiveTheme() {
    const saved = localStorage.getItem('openbalancer_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Explicitly purge legacy green matrix theme if previously saved
    if (saved === 'matrix' || saved === 'theme-matrix') {
      try { localStorage.removeItem('openbalancer_theme'); } catch (e) {}
    }
    // Normal / default theme is strictly white (light)
    return 'light';
  }

  function updateButtonLabels(theme) {
    const isDark = theme === 'dark';
    const isBg = (document.documentElement.lang || localStorage.getItem('openbalancer_lang') || 'bg') === 'bg';
    
    // In Light mode, button prompts to switch to Dark ("Тъмна" / "Dark")
    // In Dark mode, button prompts to switch to Light ("Светла" / "Light")
    const label = isDark 
      ? (isBg ? 'Светла' : 'Light') 
      : (isBg ? 'Тъмна' : 'Dark');

    const title = isDark
      ? (isBg ? 'Превключи към светла тема' : 'Switch to Light Theme')
      : (isBg ? 'Превключи към тъмна тема' : 'Switch to Dark Theme');

    document.querySelectorAll('.theme-btn-text').forEach(el => {
      el.textContent = label;
      el.style.display = 'inline-block';
    });

    [desktopBtn, mobileBtn].forEach(btn => {
      if (btn) {
        btn.setAttribute('title', title);
        btn.setAttribute('aria-label', title);
      }
    });
  }

  function applyTheme(theme, save = false) {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light', 'theme-matrix', 'matrix');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark', 'theme-matrix', 'matrix');
    }

    updateButtonLabels(theme);

    if (save) {
      try {
        localStorage.setItem('openbalancer_theme', theme);
      } catch (e) {}
    }
  }

  let currentTheme = getActiveTheme();
  applyTheme(currentTheme, false);

  function toggle() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme, true);
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) {
      SoundFX.playClick();
    }
  }

  if (desktopBtn) desktopBtn.addEventListener('click', toggle);
  if (mobileBtn) mobileBtn.addEventListener('click', toggle);

  // Expose global helper so i18n switcher can refresh button labels
  window.updateThemeButtonLabels = () => updateButtonLabels(currentTheme);
}

/**
 * Interactive Load Balancer Simulator with HTML5 Canvas Live Topology Map,
 * Protocol Stream Selector (HTTP/1.1, SSE LLM Stream, WebSockets, gRPC),
 * and Real-Time Circuit Breaker Particle Flow.
 */
function initLoadBalancerSimulator() {
  const sendBtn = document.getElementById('sim-send-req-btn');
  const outageBtn = document.getElementById('sim-toggle-outage-btn');
  const latencyBtn = document.getElementById('sim-latency-spike-btn');
  const surgeBtn = document.getElementById('sim-traffic-surge-btn');
  const resetBtn = document.getElementById('sim-reset-cluster-btn');
  const latencyDisplay = document.getElementById('sim-avg-latency');
  const reqCountDisplay = document.getElementById('sim-req-count');
  const activeBackendDisplay = document.getElementById('sim-active-node');
  const protoIndicator = document.getElementById('sim-protocol-indicator');
  const protoActiveBadge = document.getElementById('protocol-active-badge');
  const sseInspector = document.getElementById('sse-token-inspector');
  const sseTokensContainer = document.getElementById('sse-tokens-container');
  const sseTtftVal = document.getElementById('sse-ttft-val');
  const sseRateVal = document.getElementById('sse-rate-val');
  const eventBanner = document.getElementById('sim-event-banner');
  const eventText = document.getElementById('sim-event-text');
  const eventIndicator = document.getElementById('sim-event-indicator');
  const canvas = document.getElementById('topology-canvas');
  const stage = document.getElementById('topology-stage');

  const backends = [
    { id: 1, name: 'srv-us-east-1', weight: 2, latency: 12, status: 'UP', count: 0 },
    { id: 2, name: 'srv-eu-west-1', weight: 1, latency: 18, status: 'UP', count: 0 },
    { id: 3, name: 'srv-ap-southeast-1', weight: 1, latency: 45, status: 'UP', count: 0 }
  ];

  let currentIdx = 0;
  let totalRequests = 142850;
  let activeProtocol = 'http1'; // 'http1' | 'sse' | 'ws' | 'grpc'
  let sseStreamInterval = null;
  let ambientEmitterInterval = null;

  const simHeatmap = createLatencyHeatmapEngine('sim-latency-heatmap-canvas', 'sim-flamegraph-view', { idPrefix: 'sim', height: 120 });

  // View Switcher (Heatmap vs Flamegraph)
  const viewHeatmapBtn = document.getElementById('sim-view-heatmap-btn');
  const viewFlamegraphBtn = document.getElementById('sim-view-flamegraph-btn');
  const heatmapView = document.getElementById('sim-heatmap-view');
  const flamegraphView = document.getElementById('sim-flamegraph-view');

  if (viewHeatmapBtn && viewFlamegraphBtn && heatmapView && flamegraphView) {
    viewHeatmapBtn.addEventListener('click', () => {
      viewHeatmapBtn.classList.add('active');
      viewHeatmapBtn.setAttribute('aria-selected', 'true');
      viewFlamegraphBtn.classList.remove('active');
      viewFlamegraphBtn.setAttribute('aria-selected', 'false');
      heatmapView.style.display = 'block';
      flamegraphView.style.display = 'none';
      SoundFX.playClick();
    });

    viewFlamegraphBtn.addEventListener('click', () => {
      viewFlamegraphBtn.classList.add('active');
      viewFlamegraphBtn.setAttribute('aria-selected', 'true');
      viewHeatmapBtn.classList.remove('active');
      viewHeatmapBtn.setAttribute('aria-selected', 'false');
      heatmapView.style.display = 'none';
      flamegraphView.style.display = 'block';
      SoundFX.playClick();
    });
  }

  // SSE Token generation dictionary
  const llmTokens = [
    'OpenBalancer', ' handles', ' async', ' non-blocking', ' socket',
    ' streams', ' with', ' sub-ms', ' zero', '-copy', ' kernel',
    ' piping', ' and', ' dynamic', ' failover', ' circuit', '-breaking',
    ' for', ' AI', ' inference', ' clusters', ' at', ' scale.'
  ];
  let tokenIdx = 0;

  function setBanner(status, text) {
    if (!eventBanner || !eventText || !eventIndicator) return;
    eventBanner.className = `sim-event-banner ${status}`;
    eventIndicator.className = `event-indicator ${status}`;
    eventText.textContent = text;
  }

  // Protocol Stream Selector
  function setProtocol(protocol) {
    activeProtocol = protocol;
    SoundFX.playClick();
    document.querySelectorAll('.protocol-pill').forEach(btn => {
      const p = btn.getAttribute('data-protocol');
      if (p === protocol) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    const isBg = (document.documentElement.lang || 'en') === 'bg';
    let badgeText = 'HTTP/1.1 (Keep-Alive)';
    let indicatorText = 'HTTP/1.1';
    let indicatorColor = '#60a5fa';

    if (protocol === 'sse') {
      badgeText = isBg ? 'SSE LLM Поток (0ms Буфер)' : 'SSE LLM Stream (Bufferless)';
      indicatorText = 'SSE Stream';
      indicatorColor = '#34d399';
      if (sseInspector) sseInspector.style.display = 'block';
      startSseTokenStream();
    } else {
      if (sseInspector) sseInspector.style.display = 'none';
      stopSseTokenStream();
      if (protocol === 'ws') {
        badgeText = isBg ? 'WebSockets (Duplex Socket)' : 'WebSockets (Duplex Sync)';
        indicatorText = 'WebSockets';
        indicatorColor = '#a78bfa';
      } else if (protocol === 'grpc') {
        badgeText = isBg ? 'gRPC HTTP/2 Multiplexing' : 'gRPC (HTTP/2 Multiplexed)';
        indicatorText = 'gRPC (HTTP/2)';
        indicatorColor = '#38bdf8';
      }
    }

    if (protoActiveBadge) protoActiveBadge.textContent = badgeText;
    if (protoIndicator) {
      protoIndicator.textContent = indicatorText;
      protoIndicator.style.color = indicatorColor;
    }

    restartAmbientEmitter();
  }

  document.querySelectorAll('.protocol-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-protocol');
      if (p) setProtocol(p);
    });
  });

  // SSE Token Stream Inspector Logic
  function startSseTokenStream() {
    stopSseTokenStream();
    if (!sseTokensContainer) return;
    sseTokensContainer.innerHTML = '';

    sseStreamInterval = setInterval(() => {
      const tok = llmTokens[tokenIdx % llmTokens.length];
      tokenIdx++;

      const chip = document.createElement('span');
      chip.className = 'sse-token-chip';
      chip.textContent = tok;
      sseTokensContainer.appendChild(chip);

      if (sseTokensContainer.children.length > 12) {
        sseTokensContainer.removeChild(sseTokensContainer.firstChild);
      }

      if (sseTtftVal) {
        sseTtftVal.textContent = (7.8 + Math.random() * 2.2).toFixed(1) + ' ms';
      }
      if (sseRateVal) {
        sseRateVal.textContent = Math.floor(128 + Math.random() * 16) + ' tok/s';
      }

      // Spawn SSE particle on canvas
      spawnParticle({ type: 'sse', tokenText: tok });
      SoundFX.playTokenTick();
    }, 140);
  }

  function stopSseTokenStream() {
    if (sseStreamInterval) {
      clearInterval(sseStreamInterval);
      sseStreamInterval = null;
    }
  }

  // Ambient particle flow emitter
  function restartAmbientEmitter() {
    if (ambientEmitterInterval) {
      clearInterval(ambientEmitterInterval);
    }
    const intervalMs = activeProtocol === 'sse' ? 220 : activeProtocol === 'ws' ? 500 : activeProtocol === 'grpc' ? 650 : 900;
    ambientEmitterInterval = setInterval(() => {
      if (activeProtocol !== 'sse') {
        spawnParticle({ type: activeProtocol });
      }
    }, intervalMs);
  }

  restartAmbientEmitter();

  // Core Request Dispatcher
  function dispatchRequest(customJitter = 0, specificNodeId = null) {
    const availableNodes = backends.filter(b => b.status === 'UP');
    if (availableNodes.length === 0) {
      setBanner('outage', 'Error 503: No healthy upstream nodes available in cluster!');
      spawnParticle({ targetNodeId: 2, forcedDrop: true });
      SoundFX.playFailover();
      if (simHeatmap) simHeatmap.injectOutage();
      return;
    }

    let targetNode = null;
    if (specificNodeId) {
      targetNode = backends.find(b => b.id === specificNodeId);
      if (!targetNode || targetNode.status !== 'UP') {
        targetNode = availableNodes[currentIdx % availableNodes.length];
      }
    } else {
      targetNode = availableNodes[currentIdx % availableNodes.length];
      currentIdx++;
    }

    totalRequests++;
    targetNode.count++;

    // Spawn canvas particle towards target node
    spawnParticle({ targetNodeId: targetNode.id, forcedDrop: targetNode.status !== 'UP' });

    // Highlight active card
    backends.forEach(b => {
      const el = document.getElementById(`backend-card-${b.id}`);
      if (el) {
        if (b.id === targetNode.id && b.status === 'UP') {
          el.classList.add('active');
          setTimeout(() => el.classList.remove('active'), 320);
        }
      }
    });

    if (reqCountDisplay) {
      reqCountDisplay.textContent = totalRequests.toLocaleString();
    }
    const jitter = Math.floor(Math.random() * 4) - 2 + customJitter;
    const currentLat = Math.max(8, targetNode.latency + jitter);
    if (latencyDisplay) {
      latencyDisplay.textContent = `${currentLat} ms`;
      if (currentLat > 200) {
        latencyDisplay.className = 'stat-value degraded';
      } else {
        latencyDisplay.className = 'stat-value healthy';
      }
    }
    if (activeBackendDisplay) {
      activeBackendDisplay.textContent = targetNode.name;
    }

    if (simHeatmap) {
      simHeatmap.record(currentLat);
    }
    SoundFX.playRouting(currentLat);
  }

  // Buttons Event Bindings
  if (sendBtn) {
    sendBtn.addEventListener('click', () => dispatchRequest(0));
  }

  if (outageBtn) {
    outageBtn.addEventListener('click', () => {
      const node2 = backends.find(b => b.id === 2);
      const card2 = document.getElementById('backend-card-2');
      const pill2 = document.getElementById('status-pill-2');
      const dot2 = document.getElementById('dot-2');

      if (node2.status === 'UP') {
        node2.status = 'DOWN';
        if (card2) card2.classList.add('down');
        if (dot2) {
          dot2.className = 'node-indicator-dot down';
        }
        if (pill2) {
          pill2.textContent = 'TRIPPED (503)';
          pill2.className = 'backend-status-pill down';
        }
        outageBtn.textContent = 'Restore Node 2';
        setBanner('outage', 'Chaos Alert: Node 2 crashed (503 Service Unavailable). Circuit breaker tripped — traffic auto-rerouted to Node 1 & 3 with 0 dropped packets.');
        spawnParticle({ targetNodeId: 2, forcedDrop: true });
        SoundFX.playFailover();
        if (simHeatmap) simHeatmap.injectOutage();
      } else {
        node2.status = 'UP';
        if (card2) card2.classList.remove('down');
        if (dot2) {
          dot2.className = 'node-indicator-dot online';
        }
        if (pill2) {
          pill2.textContent = 'HEALTHY';
          pill2.className = 'backend-status-pill up';
        }
        outageBtn.textContent = 'Crash Node 2 (Failover)';
        setBanner('healthy', 'Health Check: Node 2 probe returned 200 OK. Node restored to active balancing pool.');
        SoundFX.playRecovery();
        dispatchRequest(0, 2);
      }
    });
  }

  if (latencyBtn) {
    latencyBtn.addEventListener('click', () => {
      const node1 = backends.find(b => b.id === 1);
      const pill1 = document.getElementById('status-pill-1');
      const card1 = document.getElementById('backend-card-1');
      const dot1 = document.getElementById('dot-1');

      if (node1.latency < 200) {
        node1.latency = 520;
        if (card1) card1.classList.add('degraded');
        if (dot1) dot1.className = 'node-indicator-dot degraded';
        if (pill1) {
          pill1.textContent = 'DEGRADED (520ms)';
          pill1.className = 'backend-status-pill degraded';
        }
        latencyBtn.textContent = 'Normalize Node 1 Latency';
        setBanner('degraded', 'Circuit Breaker: High latency detected on Node 1 (520ms). Shedding traffic to healthy peers.');
        SoundFX.playSpike();
        if (simHeatmap) simHeatmap.injectSpike();
      } else {
        node1.latency = 12;
        if (card1) card1.classList.remove('degraded');
        if (dot1) dot1.className = 'node-indicator-dot online';
        if (pill1) {
          pill1.textContent = 'HEALTHY';
          pill1.className = 'backend-status-pill up';
        }
        latencyBtn.textContent = 'Inject 500ms Spike (Node 1)';
        setBanner('healthy', 'Latency Normalized: Node 1 responding in 12ms baseline.');
        SoundFX.playRecovery();
      }
      dispatchRequest(0, 1);
    });
  }

  if (surgeBtn) {
    surgeBtn.addEventListener('click', () => {
      setBanner('healthy', 'Stress Test: 1,000 req/sec burst ingested. Asynchronous queue depth optimal.');
      totalRequests += 1000;
      if (reqCountDisplay) reqCountDisplay.textContent = totalRequests.toLocaleString();
      SoundFX.playSurge();
      if (simHeatmap) simHeatmap.recordBatch(18, 14, 5);
      let burstCount = 0;
      const burstInterval = setInterval(() => {
        dispatchRequest(0);
        burstCount++;
        if (burstCount >= 18) clearInterval(burstInterval);
      }, 35);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      backends.forEach((b, idx) => {
        b.status = 'UP';
        b.latency = idx === 0 ? 12 : idx === 1 ? 18 : 45;
        const card = document.getElementById(`backend-card-${b.id}`);
        const pill = document.getElementById(`status-pill-${b.id}`);
        const dot = document.getElementById(`dot-${b.id}`);
        if (card) card.className = 'backend-card';
        if (dot) dot.className = 'node-indicator-dot online';
        if (pill) {
          pill.textContent = 'HEALTHY';
          pill.className = 'backend-status-pill up';
        }
      });
      if (outageBtn) outageBtn.textContent = 'Crash Node 2 (Failover)';
      if (latencyBtn) latencyBtn.textContent = 'Inject 500ms Spike (Node 1)';
      if (latencyDisplay) latencyDisplay.className = 'stat-value healthy';
      setBanner('healthy', 'Cluster Status: All nodes restored to healthy baseline (12ms latency).');
      SoundFX.playRecovery();
      if (simHeatmap) simHeatmap.reset();
      dispatchRequest(0);
    });
  }

  // Click on backend cards
  backends.forEach(b => {
    const card = document.getElementById(`backend-card-${b.id}`);
    if (card) {
      card.addEventListener('click', () => {
        dispatchRequest(0, b.id);
      });
    }
  });

  // ==========================================================================
  // HTML5 Canvas Live Topology Map Engine
  // ==========================================================================
  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  const particles = [];
  const ripples = [];
  let animFrameId = null;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 50);

  function getAnchorPositions() {
    const stageRect = stage.getBoundingClientRect();
    const ingressEl = document.getElementById('sim-ingress-node');
    const coreEl = document.getElementById('sim-core-node');
    const card1El = document.getElementById('backend-card-1');
    const card2El = document.getElementById('backend-card-2');
    const card3El = document.getElementById('backend-card-3');

    function getCenter(el, defaultX, defaultY) {
      if (!el) return { x: width * defaultX, y: height * defaultY };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - stageRect.left + r.width / 2,
        y: r.top - stageRect.top + r.height / 2,
        right: r.right - stageRect.left,
        left: r.left - stageRect.left,
        width: r.width,
        height: r.height
      };
    }

    const ingress = getCenter(ingressEl, 0.16, 0.5);
    const core = getCenter(coreEl, 0.5, 0.5);
    const b1 = getCenter(card1El, 0.84, 0.22);
    const b2 = getCenter(card2El, 0.84, 0.5);
    const b3 = getCenter(card3El, 0.84, 0.78);

    return { ingress, core, b1, b2, b3 };
  }

  // Cubic Bezier interpolation
  function getCubicBezierPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
    };
  }

  // Spawn Particle Helper
  function spawnParticle(opts = {}) {
    const anchors = getAnchorPositions();
    const available = backends.filter(b => b.status === 'UP');
    let targetNode = null;

    if (opts.targetNodeId) {
      targetNode = backends.find(b => b.id === opts.targetNodeId) || backends[0];
    } else if (available.length > 0) {
      targetNode = available[Math.floor(Math.random() * available.length)];
    } else {
      targetNode = backends[0];
    }

    let pColor = '#10b981'; // Emerald Green (200 OK)
    let pType = opts.type || activeProtocol;
    let baseSpeed = 0.016;

    if (targetNode.id === 1 && targetNode.latency > 200) {
      pColor = '#f59e0b'; // Amber (500ms latency spike)
      baseSpeed = 0.009;
    }

    if (targetNode.status === 'DOWN' || opts.forcedDrop) {
      pColor = '#ef4444'; // Red (Node Outage / Circuit breaker drop)
    }

    if (pType === 'sse') {
      baseSpeed = 0.024;
    } else if (pType === 'ws') {
      baseSpeed = 0.018;
    }

    particles.push({
      id: Math.random(),
      phase: 1, // 1: Ingress->Core, 2: Core->Backend, 3: Return/Deflect
      t: 0,
      speed: baseSpeed,
      color: pColor,
      radius: pType === 'sse' ? 3 : pType === 'grpc' ? 4 : 4.5,
      type: pType,
      targetId: targetNode.id,
      isDegraded: targetNode.latency > 200,
      isDown: targetNode.status === 'DOWN' || opts.forcedDrop,
      tokenText: opts.tokenText || '',
      trail: [],
      deflected: false
    });

    // For WebSockets, spawn a reverse response particle
    if (pType === 'ws' && Math.random() > 0.4) {
      particles.push({
        id: Math.random(),
        phase: 2,
        t: 1,
        speed: -baseSpeed,
        color: '#38bdf8',
        radius: 3.5,
        type: 'ws',
        targetId: targetNode.id,
        isDegraded: false,
        isDown: false,
        tokenText: '',
        trail: [],
        deflected: false
      });
    }
  }

  function addRipple(x, y, color) {
    ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: 28,
      color: color || '#3b82f6',
      alpha: 0.8
    });
  }

  // Click on Canvas to burst particles
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    addRipple(clickX, clickY, '#3b82f6');
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnParticle();
      }, i * 40);
    }
  });

  let dashOffset = 0;

  // Main Render Loop
  function render(timestamp) {
    ctx.clearRect(0, 0, width, height);
    dashOffset -= 0.65;

    const anchors = getAnchorPositions();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Draw Connecting Bus Bezier Lines
    const isMobile = window.innerWidth <= 992;
    
    let pIngress, pCoreIn, pCoreOut, pB1, pB2, pB3;
    
    if (isMobile) {
      // Vertical Flow (Top to Bottom)
      pIngress = { x: anchors.ingress.x, y: anchors.ingress.y + (anchors.ingress.height / 2) };
      pCoreIn = { x: anchors.core.x, y: anchors.core.y - (anchors.core.height / 2) };
      pCoreOut = { x: anchors.core.x, y: anchors.core.y + (anchors.core.height / 2) };
      pB1 = { x: anchors.b1.x, y: anchors.b1.y - (anchors.b1.height / 2) };
      pB2 = { x: anchors.b2.x, y: anchors.b2.y - (anchors.b2.height / 2) };
      pB3 = { x: anchors.b3.x, y: anchors.b3.y - (anchors.b3.height / 2) };
    } else {
      // Horizontal Flow (Left to Right)
      pIngress = { x: anchors.ingress.right || anchors.ingress.x + 50, y: anchors.ingress.y };
      pCoreIn = { x: anchors.core.left || anchors.core.x - 60, y: anchors.core.y };
      pCoreOut = { x: anchors.core.right || anchors.core.x + 60, y: anchors.core.y };
      pB1 = { x: anchors.b1.left || anchors.b1.x - 80, y: anchors.b1.y };
      pB2 = { x: anchors.b2.left || anchors.b2.x - 80, y: anchors.b2.y };
      pB3 = { x: anchors.b3.left || anchors.b3.x - 80, y: anchors.b3.y };
    }

    function drawBusLine(p0, p3, status = 'UP', isDegraded = false) {
      const dx = p3.x - p0.x;
      const dy = p3.y - p0.y;
      let p1, p2;
      if (Math.abs(dx) > Math.abs(dy)) {
        p1 = { x: p0.x + dx * 0.5, y: p0.y };
        p2 = { x: p3.x - dx * 0.5, y: p3.y };
      } else {
        p1 = { x: p0.x, y: p0.y + dy * 0.5 };
        p2 = { x: p3.x, y: p3.y - dy * 0.5 };
      }

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

      // Base glowing line
      ctx.lineWidth = 2.5;
      if (status === 'DOWN') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.setLineDash([6, 6]);
      } else if (isDegraded) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.35)';
        ctx.setLineDash([8, 6]);
      }
      ctx.lineDashOffset = dashOffset;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Ingress to Core line
    drawBusLine(pIngress, pCoreIn, 'UP', false);

    // Core to Backends lines
    drawBusLine(pCoreOut, pB1, backends[0].status, backends[0].latency > 200);
    drawBusLine(pCoreOut, pB2, backends[1].status, false);
    drawBusLine(pCoreOut, pB3, backends[2].status, false);

    // Draw Tripped Circuit Breaker Marker on Node 2 if DOWN
    if (backends[1].status === 'DOWN') {
      const breakerX = pB2.x - 30;
      const breakerY = pB2.y;
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(breakerX, breakerY, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = '9px monospace';
      ctx.fillText('⚡ 503', breakerX - 12, breakerY - 12);
      ctx.restore();
    }

    // 2. Update & Draw Ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 0.8;
      r.alpha -= 0.025;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = r.alpha;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // 3. Update & Draw Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.t += p.speed;

      let pStart, pEnd;
      if (p.phase === 1) {
        // Ingress -> Core
        pStart = pIngress;
        pEnd = pCoreIn;
      } else {
        // Core -> Upstream Backend
        pStart = pCoreOut;
        pEnd = p.targetId === 1 ? pB1 : p.targetId === 2 ? pB2 : pB3;
      }

      const dx = pEnd.x - pStart.x;
      const dy = pEnd.y - pStart.y;
      
      let cp1, cp2;
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal curve
        cp1 = { x: pStart.x + dx * 0.5, y: pStart.y };
        cp2 = { x: pEnd.x - dx * 0.5, y: pEnd.y };
      } else {
        // Vertical curve
        cp1 = { x: pStart.x, y: pStart.y + dy * 0.5 };
        cp2 = { x: pEnd.x, y: pEnd.y - dy * 0.5 };
      }
      const pos = getCubicBezierPoint(Math.min(1, Math.max(0, p.t)), pStart, cp1, cp2, pEnd);

      // Handle Red Deflection / Circuit Breaker Failover on Node 2 Outage
      if (p.phase === 2 && p.isDown && p.t >= 0.72 && !p.deflected) {
        p.deflected = true;
        addRipple(pos.x, pos.y, '#ef4444');
        // Reroute failover particle (Green) towards Node 1 or 3
        const fallbackTarget = Math.random() > 0.5 ? 1 : 3;
        particles.push({
          id: Math.random(),
          phase: 2,
          t: 0.1,
          speed: 0.022,
          color: isMatrix ? '#00ff66' : '#10b981',
          radius: p.radius,
          type: p.type,
          targetId: fallbackTarget,
          isDegraded: false,
          isDown: false,
          tokenText: 'failover_rerouted',
          trail: [],
          deflected: true
        });
      }

      // Record trail
      p.trail.push({ x: pos.x, y: pos.y });
      if (p.trail.length > 7) p.trail.shift();

      // Draw Trail
      if (p.trail.length > 1) {
        ctx.save();
        for (let k = 0; k < p.trail.length - 1; k++) {
          const pt1 = p.trail[k];
          const pt2 = p.trail[k + 1];
          const alpha = (k + 1) / p.trail.length * 0.6;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = p.radius * 1.2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Particle Head
      ctx.save();
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.radius * 2.2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Solid core
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Optional mini token tag floating for SSE
      if (p.type === 'sse' && p.tokenText && p.t > 0.3 && p.t < 0.8) {
        ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
        ctx.font = '8px monospace';
        ctx.fillText(p.tokenText.trim().substring(0, 8), pos.x + 6, pos.y - 4);
      }
      ctx.restore();

      // Phase Transition: Ingress -> Core -> Upstreams
      if (p.t >= 1) {
        if (p.phase === 1) {
          p.phase = 2;
          p.t = 0;
          addRipple(pCoreOut.x, pCoreOut.y, p.color);
        } else {
          // Arrived at Upstream Node
          addRipple(pEnd.x, pEnd.y, p.color);
          particles.splice(i, 1);
        }
      }
    }

    animFrameId = requestAnimationFrame(render);
  }

  animFrameId = requestAnimationFrame(render);
}

/**
 * Interactive Cluster Configuration Builder
 */
function initConfigBuilder() {
  const algoSelect = document.getElementById('cfg-algo');
  const portInput = document.getElementById('cfg-port');
  const probeSlider = document.getElementById('cfg-probe-interval');
  const probeVal = document.getElementById('cfg-probe-val');
  const cbSlider = document.getElementById('cfg-cb-threshold');
  const cbVal = document.getElementById('cfg-cb-val');
  const timeoutSlider = document.getElementById('cfg-timeout');
  const timeoutVal = document.getElementById('cfg-timeout-val');
  const upstreamsList = document.getElementById('cfg-upstreams-list');
  const addUpstreamBtn = document.getElementById('cfg-add-upstream-btn');
  const codePreview = document.getElementById('config-code-preview');
  const copyBtn = document.getElementById('cfg-copy-btn');
  const downloadBtn = document.getElementById('cfg-download-btn');

  if (!codePreview) return;

  let upstreams = [
    { id: 'srv-ai-1', url: 'http://10.0.1.10:8000', weight: 3 },
    { id: 'srv-ai-2', url: 'http://10.0.1.11:8000', weight: 2 },
    { id: 'srv-ai-3', url: 'http://10.0.1.12:8000', weight: 1 }
  ];

  function renderUpstreamInputs() {
    if (!upstreamsList) return;
    upstreamsList.innerHTML = '';
    upstreams.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'upstream-item';
      row.innerHTML = `
        <input type="text" class="u-id" value="${item.id}" style="width: 80px;" placeholder="ID" aria-label="Backend Node ID ${index + 1}">
        <input type="text" class="u-url" value="${item.url}" style="flex-grow: 1;" placeholder="URL" aria-label="Backend Node URL ${index + 1}">
        <span style="color: var(--text-dim);">W:</span>
        <input type="number" class="u-weight" value="${item.weight}" min="1" max="10" style="width: 45px;" aria-label="Backend Node Weight ${index + 1}">
        <button type="button" class="btn-remove-upstream" data-index="${index}" title="Remove Upstream" aria-label="Remove Backend Node ${index + 1}">&times;</button>
      `;
      upstreamsList.appendChild(row);
    });

    // Attach listeners to newly created input rows
    upstreamsList.querySelectorAll('.u-id').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => {
        upstreams[idx].id = e.target.value;
        updateConfigPreview();
      });
    });
    upstreamsList.querySelectorAll('.u-url').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => {
        upstreams[idx].url = e.target.value;
        updateConfigPreview();
      });
    });
    upstreamsList.querySelectorAll('.u-weight').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => {
        upstreams[idx].weight = parseInt(e.target.value) || 1;
        updateConfigPreview();
      });
    });
    upstreamsList.querySelectorAll('.btn-remove-upstream').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (upstreams.length > 1) {
          upstreams.splice(idx, 1);
          renderUpstreamInputs();
          updateConfigPreview();
        }
      });
    });
  }

  function generateConfigObject() {
    return {
      version: "1.4.0",
      server: {
        host: "0.0.0.0",
        port: parseInt(portInput?.value) || 8080,
        keep_alive_timeout_ms: parseInt(timeoutSlider?.value) || 250
      },
      router: {
        algorithm: algoSelect?.value || "weighted_round_robin",
        health_check: {
          interval_seconds: parseInt(probeSlider?.value) || 3,
          timeout_ms: 500,
          unhealthy_threshold: 2,
          healthy_threshold: 2
        },
        circuit_breaker: {
          consecutive_failures_threshold: parseInt(cbSlider?.value) || 5,
          reset_timeout_seconds: 30
        }
      },
      upstreams: upstreams.map(u => ({
        id: u.id,
        url: u.url,
        weight: u.weight
      }))
    };
  }

  function updateConfigPreview() {
    const configObj = generateConfigObject();
    const jsonStr = JSON.stringify(configObj, null, 2);
    if (codePreview) {
      codePreview.textContent = jsonStr;
    }
  }

  if (probeSlider && probeVal) {
    probeSlider.addEventListener('input', (e) => {
      probeVal.textContent = `${e.target.value}s`;
      updateConfigPreview();
    });
  }

  if (cbSlider && cbVal) {
    cbSlider.addEventListener('input', (e) => {
      cbVal.textContent = `${e.target.value} fails`;
      updateConfigPreview();
    });
  }

  if (timeoutSlider && timeoutVal) {
    timeoutSlider.addEventListener('input', (e) => {
      timeoutVal.textContent = `${e.target.value}ms`;
      updateConfigPreview();
    });
  }

  if (algoSelect) algoSelect.addEventListener('change', updateConfigPreview);
  if (portInput) portInput.addEventListener('input', updateConfigPreview);

  if (addUpstreamBtn) {
    addUpstreamBtn.addEventListener('click', () => {
      const nextNum = upstreams.length + 1;
      upstreams.push({
        id: `srv-ai-${nextNum}`,
        url: `http://10.0.1.${10 + nextNum}:8000`,
        weight: 1
      });
      renderUpstreamInputs();
      updateConfigPreview();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const textToCopy = codePreview.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = orig, 2000);
      } catch (e) {
        console.error('Copy error', e);
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const textToDownload = codePreview.textContent;
      const blob = new Blob([textToDownload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'openbalancer.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  renderUpstreamInputs();
  updateConfigPreview();
}

/**
 * Technical & B2B FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all other items
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/**
 * Interactive B2B Modal & Inquiry Handler
 */
function initContactModal() {
  const modal = document.getElementById('b2b-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const form = document.getElementById('b2b-inquiry-form');
  const successBox = document.getElementById('form-success-box');
  const successEmail = document.getElementById('success-email');
  const selectedPlanInput = document.getElementById('selected_plan');
  const modalTitle = document.getElementById('modal-title');
  const enterpriseButtons = document.querySelectorAll('[data-action="enterprise-inquiry"]');

  if (!modal) return;

  function openModal(planName) {
    if (selectedPlanInput && planName) {
      for (let option of selectedPlanInput.options) {
        if (option.value.includes(planName) || option.text.includes(planName)) {
          option.selected = true;
          break;
        }
      }
    }
    if (modalTitle && planName) {
      modalTitle.textContent = `Inquire: ${planName}`;
    }
    if (form) form.style.display = 'block';
    if (successBox) successBox.style.display = 'none';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  enterpriseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'B2B Pro SLA Retainer';
      openModal(plan);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  const paymentRadios = document.querySelectorAll('input[name="payment_pref"]');
  const submitBtn = document.getElementById('submit-inquiry-btn');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!submitBtn) return;
      if (radio.value === 'stripe_card') {
        submitBtn.textContent = 'Proceed to Stripe Card Checkout';
      } else {
        submitBtn.textContent = 'Submit B2B Inquiry & Request Invoicing';
      }
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const companyName = document.getElementById('company_name')?.value || '';
      const vatNumber = document.getElementById('vat_number')?.value || '';
      const workEmail = document.getElementById('work_email')?.value || '';
      const phoneNumber = document.getElementById('phone_number')?.value || '';
      const selectedPlan = document.getElementById('selected_plan')?.value || 'B2B Pro SLA Retainer';
      const inquiryMessage = document.getElementById('inquiry_message')?.value || '';
      const paymentPref = document.querySelector('input[name="payment_pref"]:checked')?.value || 'invoice';
      const lang = document.documentElement.lang || 'en';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = paymentPref === 'stripe_card' ? 'Connecting to Stripe Checkout...' : 'Submitting & Encrypting Inquiry...';
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: companyName,
            vat_number: vatNumber,
            work_email: workEmail,
            phone_number: phoneNumber,
            selected_plan: selectedPlan,
            inquiry_message: inquiryMessage,
            payment_preference: paymentPref,
            language: lang,
            source: 'website_b2b_modal'
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          form.style.display = 'none';
          if (successEmail) {
            successEmail.textContent = `${workEmail} (Ref ID: ${data.lead_id.slice(0, 8)})`;
          }
          if (successBox) successBox.style.display = 'block';
          form.reset();
        } else {
          alert(`Error submitting inquiry: ${data.message || 'Validation error'}`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        form.style.display = 'none';
        if (successEmail) successEmail.textContent = workEmail;
        if (successBox) successBox.style.display = 'block';
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit B2B Inquiry & Request Invoicing';
        }
      }
    });
  }
}

/**
 * Contact Page Dedicated Form
 */
function initContactPageForm() {
  const form = document.getElementById('contact-inquiry-form');
  const successBox = document.getElementById('c_success_box');
  const successEmail = document.getElementById('c_success_email');
  const submitBtn = document.getElementById('c_submit_btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const companyName = document.getElementById('c_company_name')?.value || '';
      const vatNumber = document.getElementById('c_vat_number')?.value || '';
      const workEmail = document.getElementById('c_work_email')?.value || '';
      const phoneNumber = document.getElementById('c_phone_number')?.value || '';
      const selectedPlan = document.getElementById('c_selected_plan')?.value || 'B2B Pro SLA Retainer';
      const inquiryMessage = document.getElementById('c_message')?.value || '';
      const lang = document.documentElement.lang || 'en';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: companyName,
            vat_number: vatNumber,
            work_email: workEmail,
            phone_number: phoneNumber,
            selected_plan: selectedPlan,
            inquiry_message: inquiryMessage,
            language: lang,
            source: 'contact_page_form'
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          form.style.display = 'none';
          if (successEmail) {
            successEmail.textContent = `${workEmail} (Ref ID: ${data.lead_id.slice(0, 8)})`;
          }
          if (successBox) successBox.style.display = 'block';
          form.reset();
        } else {
          alert(`Error: ${data.message || 'Failed to send'}`);
        }
      } catch (err) {
        form.style.display = 'none';
        if (successEmail) successEmail.textContent = workEmail;
        if (successBox) successBox.style.display = 'block';
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Inquiry to INCONTROL PLUS';
        }
      }
    });
  }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * GDPR Cookie Consent Banner Logic
 */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies-btn');
  const dismissBtn = document.getElementById('dismiss-cookies-btn');

  if (!banner) return;

  try {
    const cookieChoice = localStorage.getItem('openbalancer_cookie_consent');
    if (cookieChoice) {
      banner.classList.add('hidden');
      return;
    }
  } catch (e) {}

  function setConsent(type) {
    try {
      localStorage.setItem('openbalancer_cookie_consent', type);
    } catch (e) {}
    banner.style.opacity = '0';
    banner.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 300);
  }

  if (acceptBtn) acceptBtn.addEventListener('click', () => setConsent('all'));
  if (dismissBtn) dismissBtn.addEventListener('click', () => setConsent('essential'));
}

/**
 * ==========================================================================
 * Documentation Portal JavaScript Interactivity
 * ==========================================================================
 */

/**
 * Documentation Portal — Left Sidebar Scrollspy
 */
function initDocsScrollspy() {
  const sidebarLinks = document.querySelectorAll('.docs-sidebar .docs-nav-link');
  const sections = document.querySelectorAll('.docs-section');
  if (!sidebarLinks.length || !sections.length) return;

  function updateActiveSection() {
    const scrollPos = window.scrollY + 120;
    let currentSectionId = '';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (!currentSectionId && window.scrollY < 200 && sections[0]) {
      currentSectionId = sections[0].getAttribute('id');
    }

    if (currentSectionId) {
      sidebarLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
}

/**
 * Documentation Portal — Live Quick Search Filter
 */
function initDocsSearch() {
  const searchInput = document.getElementById('docs-search-input');
  const sidebarLinks = document.querySelectorAll('.docs-sidebar .docs-nav-link');
  const navGroups = document.querySelectorAll('.docs-sidebar .docs-nav-group');
  const sections = document.querySelectorAll('.docs-section');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      sidebarLinks.forEach(link => {
        link.style.display = 'flex';
        link.parentElement.style.display = 'list-item';
      });
      navGroups.forEach(grp => grp.style.display = 'flex');
      sections.forEach(sec => sec.style.display = 'block');
      return;
    }

    // Filter sidebar
    navGroups.forEach(grp => {
      let groupHasMatch = false;
      const links = grp.querySelectorAll('.docs-nav-link');
      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        const href = link.getAttribute('href').toLowerCase();
        const matches = text.includes(query) || href.includes(query);
        link.parentElement.style.display = matches ? 'list-item' : 'none';
        if (matches) groupHasMatch = true;
      });
      grp.style.display = groupHasMatch ? 'flex' : 'none';
    });

    // Highlight / Filter sections
    sections.forEach(sec => {
      const text = sec.textContent.toLowerCase();
      const id = sec.getAttribute('id').toLowerCase();
      if (text.includes(query) || id.includes(query)) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  });
}

/**
 * 1-Click Code Snippet Copy Buttons
 */
function initCopySnippetButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy-snippet');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      let textToCopy = btn.getAttribute('data-code');
      if (!textToCopy) {
        const pre = btn.closest('.docs-code-block')?.querySelector('pre code');
        if (pre) textToCopy = pre.textContent;
      }
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy error:', err);
      }
    });
  });
}

/**
 * Documentation Portal — Interactive JSON Config Builder
 */
function initDocsConfigBuilder() {
  const portInput = document.getElementById('d-cfg-port');
  const hostInput = document.getElementById('d-cfg-host');
  const algoSelect = document.getElementById('d-cfg-algo');
  const probeSlider = document.getElementById('d-cfg-probe');
  const probeVal = document.getElementById('d-cfg-probe-val');
  const cbSlider = document.getElementById('d-cfg-cb');
  const cbVal = document.getElementById('d-cfg-cb-val');
  const upstreamsList = document.getElementById('d-cfg-upstreams-list');
  const addNodeBtn = document.getElementById('d-cfg-add-node-btn');
  const jsonPreview = document.getElementById('d-config-json-preview');
  const copyBtn = document.getElementById('d-cfg-copy-btn');
  const downloadBtn = document.getElementById('d-cfg-download-btn');
  const presetPills = document.querySelectorAll('.preset-pill');

  if (!jsonPreview) return;

  let nodes = [
    { host: '10.0.1.10', port: 8000, weight: 3, health_path: '/health' },
    { host: '10.0.1.11', port: 8000, weight: 2, health_path: '/health' },
    { host: '10.0.1.12', port: 8000, weight: 1, health_path: '/health' }
  ];

  const presets = {
    'ai-cluster': {
      port: 8080,
      host: '0.0.0.0',
      algo: 'least_latency',
      probe: 2,
      cb: 3,
      nodes: [
        { host: 'ollama-node-gpu1', port: 11434, weight: 4, health_path: '/api/tags' },
        { host: 'vllm-cluster-node2', port: 8000, weight: 2, health_path: '/health' },
        { host: 'claude-proxy-node3', port: 8000, weight: 1, health_path: '/health' }
      ]
    },
    'microservices': {
      port: 8080,
      host: '0.0.0.0',
      algo: 'least_connections',
      probe: 5,
      cb: 5,
      nodes: [
        { host: 'api-service-prod-1', port: 9001, weight: 1, health_path: '/healthz' },
        { host: 'api-service-prod-2', port: 9002, weight: 1, health_path: '/healthz' },
        { host: 'api-service-prod-3', port: 9003, weight: 1, health_path: '/healthz' }
      ]
    },
    'sticky-session': {
      port: 8080,
      host: '0.0.0.0',
      algo: 'ip_hash',
      probe: 5,
      cb: 3,
      nodes: [
        { host: 'web-session-srv1', port: 3000, weight: 1, health_path: '/health' },
        { host: 'web-session-srv2', port: 3000, weight: 1, health_path: '/health' }
      ]
    },
    'dual-failover': {
      port: 8080,
      host: '0.0.0.0',
      algo: 'weighted',
      probe: 2,
      cb: 2,
      nodes: [
        { host: 'primary-node-eu-west', port: 8080, weight: 10, health_path: '/health' },
        { host: 'backup-node-eu-central', port: 8080, weight: 1, health_path: '/health' }
      ]
    }
  };

  function renderNodes() {
    if (!upstreamsList) return;
    upstreamsList.innerHTML = '';
    nodes.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'upstream-item';
      row.innerHTML = `
        <input type="text" class="d-u-host" value="${item.host}" style="flex: 2; min-width: 100px;" placeholder="Host" aria-label="Backend Host ${index + 1}">
        <input type="number" class="d-u-port" value="${item.port}" style="width: 65px;" placeholder="Port" aria-label="Backend Port ${index + 1}">
        <span style="color: var(--text-dim); font-size: 0.75rem;">W:</span>
        <input type="number" class="d-u-weight" value="${item.weight}" min="1" max="100" style="width: 45px;" aria-label="Backend Weight ${index + 1}">
        <input type="text" class="d-u-path" value="${item.health_path}" style="width: 70px;" placeholder="/health" aria-label="Health Check Path ${index + 1}">
        <button type="button" class="btn-remove-upstream d-u-remove" data-index="${index}" title="Remove Backend Node" aria-label="Remove Backend Node ${index + 1}">&times;</button>
      `;
      upstreamsList.appendChild(row);
    });

    upstreamsList.querySelectorAll('.d-u-host').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => { nodes[idx].host = e.target.value; updatePreview(); });
    });
    upstreamsList.querySelectorAll('.d-u-port').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => { nodes[idx].port = parseInt(e.target.value) || 80; updatePreview(); });
    });
    upstreamsList.querySelectorAll('.d-u-weight').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => { nodes[idx].weight = parseInt(e.target.value) || 1; updatePreview(); });
    });
    upstreamsList.querySelectorAll('.d-u-path').forEach((inp, idx) => {
      inp.addEventListener('input', (e) => { nodes[idx].health_path = e.target.value; updatePreview(); });
    });
    upstreamsList.querySelectorAll('.d-u-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (nodes.length > 1) {
          nodes.splice(idx, 1);
          renderNodes();
          updatePreview();
        }
      });
    });
  }

  function generateConfigObj() {
    return {
      host: hostInput?.value || "0.0.0.0",
      port: parseInt(portInput?.value) || 8080,
      algorithm: algoSelect?.value || "least_latency",
      health_interval: parseInt(probeSlider?.value) || 3,
      health_timeout_ms: 500,
      circuit_breaker_failures: parseInt(cbSlider?.value) || 3,
      bufferless_streaming: true,
      backends: nodes.map(n => ({
        host: n.host,
        port: n.port,
        weight: n.weight,
        health_path: n.health_path
      }))
    };
  }

  function updatePreview() {
    const config = generateConfigObj();
    jsonPreview.textContent = JSON.stringify(config, null, 2);
  }

  if (probeSlider && probeVal) {
    probeSlider.addEventListener('input', (e) => {
      probeVal.textContent = `${e.target.value}s`;
      updatePreview();
    });
  }

  if (cbSlider && cbVal) {
    cbSlider.addEventListener('input', (e) => {
      cbVal.textContent = `${e.target.value} failures`;
      updatePreview();
    });
  }

  [portInput, hostInput, algoSelect].forEach(el => {
    if (el) el.addEventListener('input', updatePreview);
  });

  if (addNodeBtn) {
    addNodeBtn.addEventListener('click', () => {
      const nextNum = nodes.length + 1;
      nodes.push({ host: `10.0.1.${10 + nextNum}`, port: 8000, weight: 1, health_path: '/health' });
      renderNodes();
      updatePreview();
    });
  }

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const presetKey = pill.getAttribute('data-preset');
      const preset = presets[presetKey];
      if (preset) {
        if (portInput) portInput.value = preset.port;
        if (hostInput) hostInput.value = preset.host;
        if (algoSelect) algoSelect.value = preset.algo;
        if (probeSlider) {
          probeSlider.value = preset.probe;
          if (probeVal) probeVal.textContent = `${preset.probe}s`;
        }
        if (cbSlider) {
          cbSlider.value = preset.cb;
          if (cbVal) cbVal.textContent = `${preset.cb} failures`;
        }
        nodes = JSON.parse(JSON.stringify(preset.nodes));
        renderNodes();
        updatePreview();
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = jsonPreview.textContent;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = '✓ Config Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy Config JSON'; }, 2000);
      } catch (e) {}
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const text = jsonPreview.textContent;
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  renderNodes();
  updatePreview();
}

/**
 * Documentation Portal — Live Interactive API Tester ("Try it Out")
 */
function initInteractiveApiTester() {
  const endpointSelect = document.getElementById('api-endpoint-choice');
  const executeBtn = document.getElementById('btn-api-execute') || document.getElementById('api-tester-execute-btn');
  const statusPill = document.getElementById('api-status-pill') || document.getElementById('api-status-badge');
  const latencyVal = document.getElementById('api-latency-val') || document.getElementById('api-timing');
  const contentTypeCode = document.getElementById('api-content-type') || document.getElementById('api-size');
  const responseOutput = document.getElementById('api-response-output');
  const tabButtons = document.querySelectorAll('.api-tester-tabs .api-tab-btn');
  const hostButtons = document.querySelectorAll('.api-host-pills .api-host-btn');

  if (!executeBtn || !responseOutput) return;

  let currentEp = '/openbalancer/status';
  let currentTab = 'formatted';
  let lastResponseData = {
    endpoint: '/openbalancer/status',
    status: 200,
    statusText: 'OK',
    latency: '1.18 ms',
    contentType: 'application/json; charset=utf-8',
    headers: {
      'server': 'OpenBalancer/1.5.0 (INCONTROL PLUS)',
      'content-type': 'application/json; charset=utf-8',
      'connection': 'close',
      'x-circuit-breaker': 'operational',
      'x-active-backends': '3'
    },
    json: {
      system: "OpenBalancer Core",
      operator: "INCONTROL PLUS EOOD",
      version: "1.5.0",
      license: "MIT",
      uptime_seconds: 14280,
      total_proxied_requests: 849200,
      algorithm: "least_latency",
      backends: [
        { url: "http://10.0.1.10:8000", healthy: true, weight: 3, total_requests: 424600, last_latency_ms: 1.18, circuit_trips: 0 },
        { url: "http://10.0.1.11:8000", healthy: true, weight: 2, total_requests: 283100, last_latency_ms: 1.42, circuit_trips: 0 },
        { url: "http://10.0.1.12:8000", healthy: true, weight: 1, total_requests: 141500, last_latency_ms: 1.85, circuit_trips: 0 }
      ]
    },
    rawText: ''
  };

  const mockPayloads = {
    '/openbalancer/status': {
      status: 200,
      statusText: 'OK',
      latencyMin: 0.9,
      latencyMax: 1.8,
      contentType: 'application/json; charset=utf-8',
      getJson: () => ({
        system: "OpenBalancer Core",
        operator: "INCONTROL PLUS EOOD",
        version: "1.5.0",
        license: "MIT",
        uptime_seconds: Math.floor(14280 + Math.random() * 500),
        total_proxied_requests: Math.floor(849200 + Math.random() * 1000),
        algorithm: "least_latency",
        backends: [
          { url: "http://10.0.1.10:8000", healthy: true, weight: 3, total_requests: 424600 + Math.floor(Math.random() * 500), last_latency_ms: parseFloat((1.1 + Math.random() * 0.3).toFixed(2)), circuit_trips: 0 },
          { url: "http://10.0.1.11:8000", healthy: true, weight: 2, total_requests: 283100 + Math.floor(Math.random() * 300), last_latency_ms: parseFloat((1.3 + Math.random() * 0.4).toFixed(2)), circuit_trips: 0 },
          { url: "http://10.0.1.12:8000", healthy: true, weight: 1, total_requests: 141500 + Math.floor(Math.random() * 200), last_latency_ms: parseFloat((1.7 + Math.random() * 0.5).toFixed(2)), circuit_trips: 0 }
        ]
      })
    },
    '/metrics': {
      status: 200,
      statusText: 'OK',
      latencyMin: 0.8,
      latencyMax: 1.4,
      contentType: 'text/plain; version=0.0.4; charset=utf-8',
      getText: () => `# HELP openbalancer_requests_total Total number of proxied HTTP requests
# TYPE openbalancer_requests_total counter
openbalancer_requests_total ${Math.floor(849200 + Math.random() * 1000)}

# HELP openbalancer_uptime_seconds OpenBalancer uptime in seconds
# TYPE openbalancer_uptime_seconds gauge
openbalancer_uptime_seconds ${Math.floor(14280 + Math.random() * 500)}

# HELP openbalancer_backend_health_status Health status of backend node (1=healthy, 0=down)
# TYPE openbalancer_backend_health_status gauge
openbalancer_backend_health_status{backend="http://10.0.1.10:8000",host="10.0.1.10",port="8000"} 1
openbalancer_backend_health_status{backend="http://10.0.1.11:8000",host="10.0.1.11",port="8000"} 1
openbalancer_backend_health_status{backend="http://10.0.1.12:8000",host="10.0.1.12",port="8000"} 1

# HELP openbalancer_backend_latency_ms Last probed health check latency in milliseconds
# TYPE openbalancer_backend_latency_ms gauge
openbalancer_backend_latency_ms{backend="http://10.0.1.10:8000",host="10.0.1.10",port="8000"} ${(1.1 + Math.random() * 0.3).toFixed(2)}
openbalancer_backend_latency_ms{backend="http://10.0.1.11:8000",host="10.0.1.11",port="8000"} ${(1.3 + Math.random() * 0.4).toFixed(2)}
openbalancer_backend_latency_ms{backend="http://10.0.1.12:8000",host="10.0.1.12",port="8000"} ${(1.7 + Math.random() * 0.5).toFixed(2)}

# HELP openbalancer_circuit_breaker_trips_total Total circuit breaker trip events
# TYPE openbalancer_circuit_breaker_trips_total counter
openbalancer_circuit_breaker_trips_total{backend="http://10.0.1.10:8000",host="10.0.1.10",port="8000"} 0
openbalancer_circuit_breaker_trips_total{backend="http://10.0.1.11:8000",host="10.0.1.11",port="8000"} 0
openbalancer_circuit_breaker_trips_total{backend="http://10.0.1.12:8000",host="10.0.1.12",port="8000"} 0`
    },
    '/health': {
      status: 200,
      statusText: 'OK',
      latencyMin: 0.4,
      latencyMax: 0.9,
      contentType: 'application/json; charset=utf-8',
      getJson: () => ({ status: "OK", cluster_health: "nominal", healthy_nodes: 3, total_nodes: 3 })
    },
    '/healthz': {
      status: 200,
      statusText: 'OK',
      latencyMin: 0.4,
      latencyMax: 0.9,
      contentType: 'text/plain; charset=utf-8',
      getText: () => `OK: OpenBalancer Cluster Healthy (3/3 Backends Online)`
    }
  };

  function renderResponse() {
    if (statusPill) {
      statusPill.textContent = `${lastResponseData.status} ${lastResponseData.statusText}`;
      statusPill.className = `api-status-badge ${lastResponseData.status === 200 ? 'api-status-200' : 'api-status-503'}`;
    }
    if (latencyVal) latencyVal.textContent = `Time: ${lastResponseData.latency}`;
    if (contentTypeCode) contentTypeCode.textContent = lastResponseData.contentType.includes('json') ? 'Size: 480 B' : 'Size: 720 B';

    if (lastResponseData.json) {
      responseOutput.textContent = JSON.stringify(lastResponseData.json, null, 2);
    } else {
      responseOutput.textContent = lastResponseData.rawText;
    }
  }

  async function executeApiRequest() {
    const ep = currentEp || endpointSelect?.value || '/openbalancer/status';
    executeBtn.disabled = true;
    executeBtn.innerHTML = '<span>Executing...</span>';

    const simulatedLatency = (Math.random() * 1.5 + 0.8).toFixed(2);

    setTimeout(() => {
      const mock = mockPayloads[ep] || mockPayloads['/openbalancer/status'];
      if (mock) {
        lastResponseData.endpoint = ep;
        lastResponseData.status = mock.status;
        lastResponseData.statusText = mock.statusText;
        lastResponseData.latency = `${simulatedLatency} ms`;
        lastResponseData.contentType = mock.contentType;
        lastResponseData.headers = {
          'server': 'OpenBalancer/1.5.0 (INCONTROL PLUS)',
          'content-type': mock.contentType,
          'date': new Date().toUTCString(),
          'connection': 'close',
          'x-circuit-breaker': 'operational',
          'x-active-backends': '3'
        };
        if (mock.getJson) {
          lastResponseData.json = mock.getJson();
          lastResponseData.rawText = JSON.stringify(lastResponseData.json);
        } else {
          lastResponseData.json = null;
          lastResponseData.rawText = mock.getText();
        }
      }

      renderResponse();
      executeBtn.disabled = false;
      executeBtn.innerHTML = '▶ Execute Request';
    }, 150);
  }

  if (executeBtn) executeBtn.addEventListener('click', executeApiRequest);
  if (endpointSelect) endpointSelect.addEventListener('change', executeApiRequest);

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const epKey = btn.getAttribute('data-ep');
      if (epKey === 'status') currentEp = '/openbalancer/status';
      else if (epKey === 'metrics') currentEp = '/metrics';
      else if (epKey === 'health') currentEp = '/health';
      executeApiRequest();
    });
  });

  hostButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      hostButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Initial execution render
  executeApiRequest();
}

/**
 * Interactive Latency Heatmap & Flamegraph in Documentation Portal
 */
function initDocsLatencyHeatmap() {
  const canvas = document.getElementById('docs-latency-heatmap-canvas');
  if (!canvas) return;

  const docsHeatmap = createLatencyHeatmapEngine('docs-latency-heatmap-canvas', 'docs-flamegraph-view', { idPrefix: 'docs', height: 120 });
  if (!docsHeatmap) return;

  // View Switcher (Heatmap vs Flamegraph)
  const viewHeatmapBtn = document.getElementById('docs-view-heatmap-btn');
  const viewFlamegraphBtn = document.getElementById('docs-view-flamegraph-btn');
  const heatmapView = document.getElementById('docs-heatmap-view');
  const flamegraphView = document.getElementById('docs-flamegraph-view');

  if (viewHeatmapBtn && viewFlamegraphBtn && heatmapView && flamegraphView) {
    viewHeatmapBtn.addEventListener('click', () => {
      viewHeatmapBtn.classList.add('active');
      viewHeatmapBtn.setAttribute('aria-selected', 'true');
      viewFlamegraphBtn.classList.remove('active');
      viewFlamegraphBtn.setAttribute('aria-selected', 'false');
      heatmapView.style.display = 'block';
      flamegraphView.style.display = 'none';
      SoundFX.playClick();
    });

    viewFlamegraphBtn.addEventListener('click', () => {
      viewFlamegraphBtn.classList.add('active');
      viewFlamegraphBtn.setAttribute('aria-selected', 'true');
      viewHeatmapBtn.classList.remove('active');
      viewHeatmapBtn.setAttribute('aria-selected', 'false');
      heatmapView.style.display = 'none';
      flamegraphView.style.display = 'block';
      SoundFX.playClick();
    });
  }

  // Interactive Test Triggers
  const batchBtn = document.getElementById('btn-docs-batch-req');
  const spikeBtn = document.getElementById('btn-docs-spike');
  const fallbackBtn = document.getElementById('btn-docs-fallback');
  const resetBtn = document.getElementById('btn-docs-reset-stream');

  if (batchBtn) {
    batchBtn.addEventListener('click', () => {
      docsHeatmap.recordBatch(50, 11, 4);
      SoundFX.playSurge();
    });
  }

  if (spikeBtn) {
    spikeBtn.addEventListener('click', () => {
      docsHeatmap.injectSpike();
      SoundFX.playSpike();
    });
  }

  if (fallbackBtn) {
    fallbackBtn.addEventListener('click', () => {
      docsHeatmap.injectOutage();
      SoundFX.playFailover();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      docsHeatmap.reset();
      SoundFX.playRecovery();
    });
  }
}

/**
 * Custom Error Page Studio (Interactive Tool)
 * Visual editor, live sandbox preview, countdown simulation, and ready-to-use HTML exporter.
 */
function initCustomErrorPageStudio() {
  const scenarioSelect = document.getElementById('err-scenario-select');
  const brandInput = document.getElementById('err-brand-name');
  const headlineInput = document.getElementById('err-headline');
  const messageInput = document.getElementById('err-message');
  const retrySecSelect = document.getElementById('err-retry-sec');
  const supportLinkInput = document.getElementById('err-support-link');
  const themeButtons = document.querySelectorAll('.studio-theme-btn');
  const copyBtn = document.getElementById('btn-err-copy-html');
  const downloadBtn = document.getElementById('btn-err-download-html');
  const testRetryBtn = document.getElementById('btn-err-test-retry');
  const previewRetryActionBtn = document.getElementById('err-preview-retry-action-btn');

  // Preview elements
  const previewFrame = document.getElementById('err-preview-frame');
  const previewHalo = document.getElementById('err-preview-halo');
  const previewBadge = document.getElementById('err-preview-badge');
  const previewTitle = document.getElementById('err-preview-title');
  const previewDesc = document.getElementById('err-preview-desc');
  const previewCountdownPill = document.getElementById('err-preview-countdown-pill');
  const previewSecondsDisplay = document.getElementById('err-live-seconds-display');
  const previewRay = document.getElementById('err-preview-ray');
  const previewBrandTag = document.getElementById('err-preview-brand-tag');
  const previewContactLink = document.getElementById('err-preview-contact-link');

  if (!previewFrame) return;

  let currentTheme = 'theme-cyber';
  let countdownTimer = null;
  let currentCountdownSec = 15;

  const presets = {
    '429': {
      codeText: 'HTTP 429 TOO MANY REQUESTS',
      headline: 'Rate Limit Exceeded (429)',
      desc: 'Too many concurrent requests were received. Your token bucket will automatically refill shortly.',
      icon: '🛡️',
      defaultTheme: 'theme-cyber',
      retrySec: 15
    },
    '502': {
      codeText: 'HTTP 502 BAD GATEWAY',
      headline: 'Bad Gateway (502)',
      desc: 'Upstream microservice node unreachable or connection reset by peer. Traffic is being rerouted.',
      icon: '⚡',
      defaultTheme: 'theme-matrix',
      retrySec: 10
    },
    '503': {
      codeText: 'HTTP 503 SERVICE UNAVAILABLE',
      headline: 'Service Temporarily Unavailable (503)',
      desc: 'Circuit breaker tripped. All redundant failover nodes are currently undergoing health probing.',
      icon: '⚠️',
      defaultTheme: 'theme-crimson',
      retrySec: 30
    }
  };

  function updatePreview() {
    const code = scenarioSelect ? scenarioSelect.value : '429';
    const brand = (brandInput && brandInput.value) ? brandInput.value : 'OpenBalancer AI Edge';
    const headline = (headlineInput && headlineInput.value) ? headlineInput.value : 'Rate Limit Exceeded (429)';
    const desc = (messageInput && messageInput.value) ? messageInput.value : 'Request limit reached.';
    const support = (supportLinkInput && supportLinkInput.value) ? supportLinkInput.value : 'support@openbalancer.com';
    const retrySec = retrySecSelect ? parseInt(retrySecSelect.value, 10) : 15;

    const preset = presets[code] || presets['429'];

    if (previewBadge) previewBadge.textContent = preset.codeText;
    if (previewHalo) previewHalo.textContent = preset.icon;
    if (previewTitle) previewTitle.textContent = headline;
    if (previewDesc) previewDesc.textContent = desc;
    if (previewBrandTag) previewBrandTag.textContent = brand;
    if (previewContactLink) {
      previewContactLink.textContent = support;
      previewContactLink.href = support.includes('@') ? `mailto:${support}` : support;
    }

    if (previewCountdownPill) {
      previewCountdownPill.style.display = retrySec > 0 ? 'inline-flex' : 'none';
    }

    resetCountdown(retrySec);
  }

  function resetCountdown(sec) {
    if (countdownTimer) clearInterval(countdownTimer);
    currentCountdownSec = sec;
    if (previewSecondsDisplay) previewSecondsDisplay.textContent = currentCountdownSec;
    if (sec <= 0) return;

    countdownTimer = setInterval(() => {
      currentCountdownSec--;
      if (previewSecondsDisplay) previewSecondsDisplay.textContent = currentCountdownSec;
      if (currentCountdownSec <= 0) {
        currentCountdownSec = sec;
        if (previewSecondsDisplay) previewSecondsDisplay.textContent = sec;
        triggerSimulatedReconnect();
      }
    }, 1000);
  }

  function triggerSimulatedReconnect() {
    SoundFX.playClick();
    if (previewTitle) {
      const orig = previewTitle.textContent;
      previewTitle.textContent = '🔄 Reconnecting to Cluster...';
      setTimeout(() => {
        previewTitle.textContent = orig;
        SoundFX.playRecovery();
      }, 600);
    }
  }

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', () => {
      const code = scenarioSelect.value;
      const preset = presets[code];
      if (preset) {
        if (headlineInput) headlineInput.value = preset.headline;
        if (messageInput) messageInput.value = preset.desc;
        if (retrySecSelect) retrySecSelect.value = preset.retrySec.toString();
        setTheme(preset.defaultTheme);
      }
      updatePreview();
    });
  }

  [brandInput, headlineInput, messageInput, retrySecSelect, supportLinkInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updatePreview);
  });

  function setTheme(theme) {
    currentTheme = theme;
    if (previewFrame) {
      previewFrame.className = `error-preview-frame ${theme}`;
    }
    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-theme');
      if (t) {
        setTheme(t);
        SoundFX.playClick();
      }
    });
  });

  if (testRetryBtn) {
    testRetryBtn.addEventListener('click', triggerSimulatedReconnect);
  }
  if (previewRetryActionBtn) {
    previewRetryActionBtn.addEventListener('click', triggerSimulatedReconnect);
  }

  function generateStandaloneHtml() {
    const code = scenarioSelect ? scenarioSelect.value : '429';
    const brand = brandInput ? brandInput.value : 'OpenBalancer AI Edge';
    const headline = headlineInput ? headlineInput.value : 'Rate Limit Exceeded (429)';
    const desc = messageInput ? messageInput.value : 'Too many requests.';
    const support = supportLinkInput ? supportLinkInput.value : 'support@openbalancer.com';
    const retrySec = retrySecSelect ? parseInt(retrySecSelect.value, 10) : 15;
    const preset = presets[code] || presets['429'];

    let themeColors = {
      bg: 'radial-gradient(circle at center, #0f172a 0%, #030712 100%)',
      accent: '#06b6d4',
      accentGlow: 'rgba(6, 182, 212, 0.4)',
      btnBg: '#06b6d4',
      btnColor: '#020617'
    };

    if (currentTheme === 'theme-matrix') {
      themeColors = {
        bg: '#010402',
        accent: '#00ff66',
        accentGlow: 'rgba(0, 255, 102, 0.4)',
        btnBg: '#00ff66',
        btnColor: '#000000'
      };
    } else if (currentTheme === 'theme-crimson') {
      themeColors = {
        bg: 'radial-gradient(circle at center, #1e0d16 0%, #080306 100%)',
        accent: '#f43f5e',
        accentGlow: 'rgba(244, 63, 94, 0.4)',
        btnBg: '#f43f5e',
        btnColor: '#ffffff'
      };
    } else if (currentTheme === 'theme-clean') {
      themeColors = {
        bg: '#0f172a',
        accent: '#3b82f6',
        accentGlow: 'rgba(59, 130, 246, 0.4)',
        btnBg: '#3b82f6',
        btnColor: '#ffffff'
      };
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline} — ${brand}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: ${themeColors.bg};
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .err-card {
      max-width: 520px;
      width: 100%;
      text-align: center;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    .err-halo {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid ${themeColors.accent};
      box-shadow: 0 0 25px ${themeColors.accentGlow};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    .err-badge {
      font-family: monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: ${themeColors.accent};
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid ${themeColors.accent};
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      letter-spacing: 0.05em;
      display: inline-block;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.75rem; margin-bottom: 0.75rem; font-weight: 700; color: #fff; }
    p { font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem; }
    .countdown-pill {
      font-family: monospace;
      font-size: 0.85rem;
      color: #cbd5e1;
      background: rgba(0, 0, 0, 0.4);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 1.5rem;
    }
    .retry-btn {
      background: ${themeColors.btnBg};
      color: ${themeColors.btnColor};
      border: none;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 0.75rem 1.75rem;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 15px ${themeColors.accentGlow};
      transition: opacity 0.2s;
    }
    .retry-btn:hover { opacity: 0.9; }
    .footer-meta {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-family: monospace;
      font-size: 0.75rem;
      color: #64748b;
    }
    .footer-meta a { color: ${themeColors.accent}; text-decoration: none; }
  </style>
</head>
<body>
  <div class="err-card">
    <div class="err-halo">${preset.icon}</div>
    <div class="err-badge">${preset.codeText}</div>
    <h1>${headline}</h1>
    <p>${desc}</p>
    ${retrySec > 0 ? `<div class="countdown-pill">⏱️ Auto-reconnecting in <strong id="countdown">${retrySec}</strong>s</div>` : ''}
    <div>
      <button class="retry-btn" onclick="location.reload()">🔄 Retry Connection Now</button>
    </div>
    <div class="footer-meta">
      <div>Incident ID: ray_${Math.random().toString(16).substring(2, 10)} • ${brand}</div>
      <div style="margin-top: 0.35rem;">Need support? <a href="${support.includes('@') ? `mailto:${support}` : support}">${support}</a></div>
    </div>
  </div>
  ${retrySec > 0 ? `<script>
    let sec = ${retrySec};
    const el = document.getElementById('countdown');
    setInterval(() => {
      sec--;
      if (el) el.textContent = sec;
      if (sec <= 0) location.reload();
    }, 1000);
  </script>` : ''}
</body>
</html>`;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const html = generateStandaloneHtml();
      navigator.clipboard.writeText(html).then(() => {
        SoundFX.playClick();
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied to Clipboard!';
        setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
      });
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const code = scenarioSelect ? scenarioSelect.value : '429';
      const html = generateStandaloneHtml();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `openbalancer-error-${code}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SoundFX.playClick();
    });
  }

  updatePreview();
}


