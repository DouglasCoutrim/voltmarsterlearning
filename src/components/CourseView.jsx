import React, { useEffect } from 'react';
import { MODULES, PHOTO_COMPONENTS } from '../data/modules';
import { t } from '../data/languages';

function CourseView({
  lang,
  currentMod,
  currentSlide,
  isPlaying,
  voiceEnabled,
  visualMode,
  completedModules,
  photos,
  t,
  selectModule,
  toggleCurrentModuleComplete,
  togglePlayLesson,
  stopLesson,
  toggleVoiceNarration,
  nextSlide,
  prevSlide,
  setPlayerVisualMode,
  triggerQuickPhotoUpload,
  focusComponentInPlayer,
  lab0Step,
  lab1Pattern,
  lab2FixedFuses,
  lab3Delta,
  lab4Wired,
  lab5Checked,
  lab6Timer,
  lab6Running,
  lab7Cutoff,
  clickLab0,
  setLab1Pattern,
  testSmdFuse,
  runEqualizerPulse,
  setLab4Wired,
  toggleLab5,
  toggleLab6Timer,
  setLab7Cutoff,
  switchView,
  showToast,
}) {
  const m = MODULES[currentMod];
  const done = completedModules.includes(m.id);

  useEffect(() => {
    document.documentElement.lang = LANG_META[lang].htmlLang;
  }, [lang]);

  const updatePlayerControlsUI = () => {
    document.getElementById('btn-play-pause').textContent = isPlaying ? t('pause') : t('play');
    const vBtn = document.getElementById('btn-toggle-voice');
    vBtn.textContent = voiceEnabled ? t('voiceOn') : t('voiceOff');
    vBtn.className = voiceEnabled
      ? 'px-3 py-2 rounded-xl text-xs font-bold border transition bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
      : 'px-3 py-2 rounded-xl text-xs font-bold border transition bg-slate-800 text-slate-400 border-slate-700';
  };

  const updatePlayerVisual = () => {
    const slides = m.slides[lang];
    const el = document.getElementById('player-subtitle-text');
    if (el) el.textContent = slides[currentSlide] || slides[0];

    const stepEl = document.getElementById('player-step-indicator');
    if (stepEl) stepEl.textContent = `${currentSlide + 1}/${slides.length}`;

    const pct = ((currentSlide + 1) / slides.length) * 100;
    const fillEl = document.getElementById('player-progress-fill');
    if (fillEl) fillEl.style.width = pct + '%';

    // Choose photo or SVG
    const availablePhotos = m.photos.filter(id => !!photos[id]);
    if (visualMode === 'photo' && availablePhotos.length > 0) {
      const targetId = availablePhotos[currentSlide % availablePhotos.length];
      renderPlayerPhotoById(targetId);
    } else {
      hidePlayerPhotoLayer();
      const svgLayer = document.getElementById('player-svg-layer');
      if (svgLayer) {
        svgLayer.classList.remove('hidden');
        svgLayer.innerHTML = buildModuleSVG(currentMod);
      }
      updateVisualModeButtons();
    }
  };

  const renderPlayerPhotoById = (cid) => {
    const comp = PHOTO_COMPONENTS.find(c => c.id === cid);
    const src = photos[cid];
    const photoLayer = document.getElementById('player-photo-layer');
    const svgLayer = document.getElementById('player-svg-layer');
    if (src) {
      const img = document.getElementById('player-real-img');
      if (img) img.src = src;
      img.classList.toggle('animate-kenburns', isPlaying);
      const capEl = document.getElementById('player-photo-caption');
      if (capEl && comp) capEl.textContent = `#${comp.num} • ${comp.labels[lang]}`;
      showPlayerPhotoLayer();
      hideSvgLayer();
    } else {
      hidePlayerPhotoLayer();
      showSvgLayer();
      if (svgLayer) svgLayer.innerHTML = buildModuleSVG(currentMod);
    }
    updateVisualModeButtons();
  };

  const showPlayerPhotoLayer = () => {
    const layer = document.getElementById('player-photo-layer');
    if (layer) layer.classList.remove('hidden');
  };

  const hidePlayerPhotoLayer = () => {
    const layer = document.getElementById('player-photo-layer');
    if (layer) layer.classList.add('hidden');
  };

  const showSvgLayer = () => {
    const layer = document.getElementById('player-svg-layer');
    if (layer) layer.classList.remove('hidden');
  };

  const hideSvgLayer = () => {
    const layer = document.getElementById('player-svg-layer');
    if (layer) layer.classList.add('hidden');
  };

  const updateVisualModeButtons = () => {
    const photoBtn = document.getElementById('btn-mode-photo');
    const svgBtn = document.getElementById('btn-mode-svg');
    if (!photoBtn || !svgBtn) return;
    const showingPhoto = !document.getElementById('player-photo-layer').classList.contains('hidden');
    photoBtn.className = showingPhoto
      ? 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-emerald-600 text-white'
      : 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-800 text-slate-300 hover:bg-slate-700';
    svgBtn.className = !showingPhoto
      ? 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-emerald-600 text-white'
      : 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-800 text-slate-300 hover:bg-slate-700';
  };

  const buildModuleSVG = (modId) => {
    const svgs = {
      0: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="40" y="35" width="520" height="250" rx="18" fill="#0f172a" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="8 6"/>
        <text x="300" y="65" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">⚠ PERIMETER EDGES = GND (TERRA) — SHORT > 300A ⚠</text>
        <rect x="75" y="95" width="130" height="65" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="140" y="123" fill="#4ade80" font-size="13" font-weight="bold" text-anchor="middle">14S PACK</text>
        <text x="140" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">58.80V (4.20V/cell)</text>
        <rect x="235" y="95" width="130" height="65" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="300" y="123" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">STORAGE</text>
        <text x="300" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">51.8V – 53.2V</text>
        <rect x="395" y="95" width="130" height="65" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="460" y="123" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">POWER RULE</text>
        <text x="460" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">MAX 5 PRESSES</text>
        <rect x="75" y="185" width="450" height="70" rx="10" fill="#064e3b" fill-opacity="0.4" stroke="#10b981"/>
        <text x="300" y="213" fill="#6ee7b7" font-size="13" font-weight="bold" text-anchor="middle">REASSEMBLY: [6 & 5] → WAIT 5s → [4] → [BAT+] → [BAT-]</text>
        <text x="300" y="237" fill="#a7f3d0" font-size="11" text-anchor="middle">DISASSEMBLY: [BAT-] → [BAT+] → [4] → [5] → [6]</text>
      </svg>`,
      1: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="90" y="65" width="420" height="120" rx="45" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
        ${Array.from({length:10}).map((_,i)=`<rect x="${125 + i*36}" y="88" width="22" height="74" rx="4" fill="#090d16" stroke="#eab308" stroke-width="2"/><line x1="${136 + i*36}" y1="96" x2="${136 + i*36}" y2="154" stroke="#facc15" stroke-width="3"/>`).join('')}
        <text x="300" y="220" fill="#facc15" font-size="14" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">10-SLOT GOLD INTERFACE CONNECTOR (T30 / T40 / T50)</text>
        <text x="300" y="246" fill="#94a3b8" font-size="12" text-anchor="middle">PSU WAKE-UP: 54.0V / 1.5A–2.0A → 52.5V</text>
      </svg>`,
      2: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="45" y="55" width="510" height="205" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        ${Array.from({length:7}).map((_,i)=>
          `<rect x="${68 + i*68}" y="108" width="52" height="26" rx="4" fill="#475569"/><rect x="${80 + i*68}" y="146" width="28" height="18" rx="3" fill="#16a34a" stroke="#4ade80"/><text x="${94 + i*68}" y="159" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">F${i*2+1}</text><rect x="${68 + i*68}" y="176" width="52" height="26" rx="4" fill="#475569"/>`
        ).join('')}
        <text x="300" y="236" fill="#4ade80" font-size="12" text-anchor="middle">NO BEEP = OPEN FUSE → SOLDER JUMPER AT 320°C</text>
      </svg>`,
      3: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="70" y="45" width="460" height="225" rx="16" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
        <rect x="105" y="70" width="390" height="145" rx="8" fill="#090d16" stroke="#22c55e" stroke-width="2"/>
        <text x="300" y="96" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">24S515A ACTIVE EQUALIZER — 14S</text>
        <text x="140" y="132" fill="#e2e8f0" font-size="12" font-family="JetBrains Mono">CURR: 4.000 A</text>
        <text x="140" y="156" fill="#e2e8f0" font-size="12" font-family="JetBrains Mono">PACK: 56.87 V</text>
        <text x="140" y="180" fill="#4ade80" font-size="13" font-weight="bold" font-family="JetBrains Mono">DELTA: 0.015 V</text>
        <text x="340" y="132" fill="#38bdf8" font-size="12" font-family="JetBrains Mono">MAX: 4.070 V</text>
        <text x="340" y="156" fill="#38bdf8" font-size="12" font-family="JetBrains Mono">MIN: 4.055 V</text>
        <text x="340" y="180" fill="#fbbf24" font-size="12" font-family="JetBrains Mono">SERIES: 14S OK</text>
        <text x="300" y="246" fill="#cbd5e1" font-size="12" text-anchor="middle">Single-Cell Recovery: 1.0A → 3.30V | 2.0A → 3.80V</text>
      </svg>`,
      4: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="65" y="75" width="120" height="165" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
        <text x="125" y="155" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">CYCLE CHIP</text>
        <text x="125" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">T20 / T30 / T40</text>
        <rect x="410" y="55" width="130" height="205" rx="12" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
        <text x="475" y="82" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">BMS PADS</text>
        <line x1="185" y1="105" x2="410" y2="105" stroke="#ef4444" stroke-width="4"/>
        <text x="475" y="110" fill="#f87171" font-size="12" font-weight="bold" text-anchor="middle">VCC_A (RED)</text>
        <line x1="185" y1="142" x2="410" y2="142" stroke="#94a3b8" stroke-width="4"/>
        <text x="475" y="147" fill="#cbd5e1" font-size="12" font-weight="bold" text-anchor="middle">GND/VC0 (BLK)</text>
        <line x1="185" y1="179" x2="410" y2="179" stroke="#22c55e" stroke-width="4"/>
        <text x="475" y="184" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">SDA_A (GRN)</text>
        <line x1="185" y1="216" x2="410" y2="216" stroke="#3b82f6" stroke-width="4"/>
        <text x="475" y="221" fill="#60a5fa" font-size="12" font-weight="bold" text-anchor="middle">SCL_A (BLU)</text>
      </svg>`,
      5: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <path d="M210 45 H390 V95 H535 V265 H65 V95 H210 Z" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        <rect x="95" y="120" width="115" height="45" rx="6" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>
        <text x="152" y="147" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">MEGA 300A</text>
        <rect x="245" y="135" width="75" height="75" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="282" y="177" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">MCU</text>
        <rect x="445" y="195" width="72" height="52" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
        <text x="481" y="225" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">CAPS SMD</text>
        <text x="300" y="295" fill="#94a3b8" font-size="12" text-anchor="middle">RESIN: 150°C | UNLOCK: 0-CYCLE MCU + P100</text>
      </svg>`,
      6: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="130" y="135" width="340" height="120" rx="18" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
        <rect x="165" y="155" width="270" height="55" rx="8" fill="#94a3b8" stroke="#f97316" stroke-width="3"/>
        <text x="300" y="188" fill="#090d16" font-size="15" font-weight="900" text-anchor="middle" font-family="JetBrains Mono">MOLTEN TIN — 280°C</text>
        <rect x="210" y="65" width="180" height="50" rx="12" fill="#0f172a" stroke="#facc15" stroke-width="2"/>
        <text x="300" y="95" fill="#facc15" font-size="12" font-weight="bold" text-anchor="middle">10-PIN CONNECTOR</text>
        <text x="300" y="285" fill="#fb923c" font-size="13" font-weight="bold" text-anchor="middle">REMOVE: 4–5 SEC MAX | SOLDER NEW: 3 SEC</text>
      </svg>`,
      7: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <rect x="35" y="75" width="115" height="110" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="92" y="125" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">14S PACK</text>
        <text x="92" y="145" fill="#94a3b8" font-size="11" text-anchor="middle">58.8V MAX</text>
        <rect x="200" y="75" width="140" height="110" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="270" y="120" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SSR-40DD</text>
        <text x="270" y="142" fill="#a855f7" font-size="11" font-weight="bold" text-anchor="middle">+ XH-M609</text>
        <rect x="395" y="75" width="165" height="110" rx="10" fill="#451a03" stroke="#f97316" stroke-width="2"/>
        <text x="477" y="118" fill="#fdba74" font-size="12" font-weight="bold" text-anchor="middle">4x 20Ω / 150W</text>
        <text x="477" y="140" fill="#fb923c" font-size="11" text-anchor="middle">Req = 5Ω (~10A)</text>
        <line x1="150" y1="130" x2="200" y2="130" stroke="#ef4444" stroke-width="3"/>
        <line x1="340" y1="130" x2="395" y2="130" stroke="#ef4444" stroke-width="3"/>
        <text x="300" y="240" fill="#4ade80" font-size="13" font-weight="bold" text-anchor="middle">STORAGE: 52.0V | CAPACITY TEST: 47.0V | NEVER < 42.0V</text>
      </svg>`,
      8: `<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl">
        <circle cx="300" cy="135" r="78" fill="#064e3b" fill-opacity="0.45" stroke="#22c55e" stroke-width="4"/>
        <path d="M262 135 L288 162 L342 106" fill="none" stroke="#4ade80" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="300" y="250" fill="#fff" font-size="16" font-weight="900" text-anchor="middle">8-POINT FLIGHT RELEASE PROTOCOL</text>
        <text x="300" y="276" fill="#4ade80" font-size="12" text-anchor="middle">DELTA < 0.030V • 58.8V FULL CHARGE • 14S VERIFIED</text>
      </svg>`,
    };
    return svgs[modId] || svgs[0];
  };

  const focusComponentInPlayer = (cid) => {
    if (photos[cid]) {
      setPlayerVisualMode('photo');
      renderPlayerPhotoById(cid);
    } else {
      triggerQuickPhotoUpload(cid);
    }
  };

  return (
    <section id="view-course" className="hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <aside className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 lg:sticky lg:top-32">
            <div className="flex items-center justify-between mb-3">
              <h2 id="txt-modules-heading" className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {t('modulesHeading')}
              </h2>
              <span id="sidebar-completed-badge" className="text-xs font-mono-tech text-emerald-400 font-bold">
                {completedModules.length}/{MODULES.length}
              </span>
            </div>
            <div id="module-list" className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
              {MODULES.map((m, idx) => {
                const active = idx === currentMod;
                const done = completedModules.includes(m.id);
                const btn = document.createElement('button');
                btn.onclick = () => selectModule(idx);
                btn.className = `w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 ${
                  active
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`;
                btn.innerHTML = `
                  <span class="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    done ? 'bg-emerald-500 text-slate-950' : active ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400' : 'bg-slate-800 text-slate-400'
                  }">${done ? '✓' : m.badge}</span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider ${
                        active ? 'text-emerald-400' : 'text-slate-500'
                      }">${m.badge}</span>
                      <span class="text-[10px] font-mono-tech text-slate-500">${m.duration}</span>
                    </div>
                    <p class="text-xs font-bold leading-snug mt-0.5 line-clamp-2">${m.title[lang]}</p>
                  </div>
                `;
                return btn;
              })}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span id="lesson-badge" className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {m.badge}
                </span>
                <span id="lesson-duration" className="text-xs text-slate-400 font-mono-tech">⏱ {m.duration}</span>
              </div>
              <h1 id="lesson-title" className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
                {m.title[lang]}
              </h1>
              <p id="lesson-subtitle" className="text-xs sm:text-sm text-slate-400">
                {m.subtitle[lang]}
              </p>
            </div>
            <button
              id="btn-mark-complete"
              onclick={toggleCurrentModuleComplete}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border shrink-0"
            >
              {done ? t('completedBtn') : t('markComplete')}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-mode-photo"
                  onclick={() => setPlayerVisualMode('photo')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  {t('modePhoto')}
                </button>
                <button
                  id="btn-mode-svg"
                  onclick={() => setPlayerVisualMode('svg')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  {t('modeSvg')}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-quick-upload"
                  onclick={() => triggerQuickPhotoUpload()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition"
                >
                  ⚡ {t('quickUpload')}
                </button>
                <input
                  type="file"
                  id="quick-photo-input"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-[#0d1526] to-slate-950 overflow-hidden flex items-center justify-center">
              <div id="player-photo-layer" className="hidden absolute inset-0 w-full h-full">
                <img
                  id="player-real-img"
                  src=""
                  alt=""
                  className="w-full h-full object-contain bg-black/70"
                />
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-emerald-500/40 text-[11px] font-bold text-emerald-300"
                  id="player-photo-caption"
                >
                </div>
              </div>

              <div id="player-svg-layer" className="w-full h-full flex items-center justify-center p-4"></div>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md border border-slate-700/70 rounded-xl px-4 py-2.5 text-center shadow-xl">
                  <p
                    id="player-subtitle-text"
                    className="text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-snug"
                  >
                    {m.slides[lang][currentSlide]}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-3 bg-slate-900 border-t border-slate-800 space-y-2.5">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer" id="player-seek-bar">
                <div
                  id="player-progress-fill"
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                  style={{ width: '0%' }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    id="btn-play-pause"
                    onclick={togglePlayLesson}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5"
                  >
                    {isPlaying ? t('pause') : t('play')}
                  </button>
                  <button
                    id="btn-stop-lesson"
                    onclick={stopLesson}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    ⏹
                  </button>
                  <button
                    id="btn-toggle-voice"
                    onclick={toggleVoiceNarration}
                    className="px-3 py-2 rounded-xl text-xs font-bold border transition"
                  >
                    {voiceEnabled ? t('voiceOn') : t('voiceOff')}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    id="player-step-indicator"
                    className="text-xs font-mono-tech text-slate-400"
                  >
                    {currentSlide + 1}/{m.slides[lang].length}
                  </span>
                  <button
                    onclick={prevSlide}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                  >
                    ◀
                  </button>
                  <button
                    onclick={nextSlide}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 id="txt-lesson-components" className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {t('lessonComponents')}
              </h3>
              <button
                onclick="switchView('photos')"
                id="btn-open-studio-inline"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Abrir Estúdio Completo →
              </button>
            </div>
            <div
              id="lesson-components-strip"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5"
            >
              {m.photos.map((cid) => {
                const comp = PHOTO_COMPONENTS.find((c) => c.id === cid);
                const imgSrc = photos[cid];
                return React.createElement('div', {
                  className: `cursor-pointer rounded-xl bg-slate-950 border ${
                    imgSrc ? 'border-emerald-500/40' : 'border-slate-800'
                  } overflow-hidden hover:border-emerald-400 transition`,
                  onClick: () => focusComponentInPlayer(cid),
                }, React.createElement('div', {
                  className: `aspect-video bg-slate-900 flex items-center justify-center overflow-hidden relative`,
                }, imgSrc ? React.createElement('img', {
                  src: imgSrc,
                  alt: comp ? comp.labels[lang] : '',
                  className: "w-full h-full object-cover group-hover:scale-105 transition duration-300",
                }) : React.createElement('span', {
                  className: "text-[11px] text-slate-500 font-mono-tech",
                }, `#${comp.num} SVG`),
                React.createElement('div', {
                  className: "p-2",
                }, React.createElement('p', {
                  className: "text-[11px] font-semibold text-slate-200 line-clamp-2",
                }, comp ? comp.labels[lang] : '')));
              })}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h3 id="txt-tech-summary-title" className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 mb-3">
              {t('techSummary')}
            </h3>
            <div id="lesson-tech-points" className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
              {m.points[lang].map((p) => React.createElement('div', {
                className: "flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800",
              }, React.createElement('span', {
                className: "text-emerald-400 font-black mt-0.5",
              }, "⚡"), React.createElement('span', null, p)))}
            </div>
          </div>

          <div className="bg-gradient-to-b from-slate-900 to-[#0d1526] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-slate-800">
              <div>
                <span id="lab-tag" className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  LABORATÓRIO INTERATIVO DE BANCADA
                </span>
                <h3 id="lab-title" className="text-base sm:text-lg font-extrabold text-white">
                  {t(`labTag${lab0Step > 0 ? lab0Step : ''}`)}
                </h3>
              </div>
            </div>
            <div id="lab-container">
              {renderLab()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  function renderLab() {
    if (lab0Step > 0) {
      return React.createElement('div', { className: "space-y-3" }, React.createElement('div', { className: "flex flex-wrap gap-2" }, [
        React.createElement('button', {
          key: 0,
          onclick: () => clickLab0(0),
          className: `px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
            lab0Step === 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 opacity-75' : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
          }`,
        }, '1. Cabos 6 (NTC) e 5 (Células 1–7)'),
        React.createElement('button', {
          key: 1,
          onClick: () => clickLab0(1),
          disabled: lab0Step >= 1,
          className: `px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
            lab0Step >= 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 opacity-75' : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
          }`,
        }, '2. PAUSA OBRIGATÓRIA DE 5 SEGUNDOS'),
        React.createElement('button', {
          key: 2,
          onClick: () => clickLab0(2),
          disabled: lab0Step >= 2,
          className: `px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
            lab0Step >= 2 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 opacity-75' : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
          }`,
        }, '3. Cabo 4 (Células 8–14)'),
        React.createElement('button', {
          key: 3,
          onClick: () => clickLab0(3),
          disabled: lab0Step >= 3,
          className: `px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
            lab0Step >= 3 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 opacity-75' : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
          }`,
        }, '4. Terminal Positivo (BAT+)'),
        React.createElement('button', {
          key: 4,
          onClick: () => clickLab0(4),
          disabled: lab0Step >= 4,
          className: `px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
            lab0Step >= 4 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 opacity-75' : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
          }`,
        }, '5. Terminal Negativo (BAT-)'),
      ]));
    }

    if (lab1Pattern) {
      const titles = {
        pt: 'Simulador Interativo de Códigos de LEDs DJI',
        es: 'Simulador Interactivo de Códigos LED DJI',
        en: 'Interactive DJI 4-LED Fault Simulator',
        fr: 'Simulateur Interactif des 4 LEDs DJI',
        tr: 'Etkileşimli DJI 4 LED Hata Simülatörü',
      };
      const patterns = {
        led2: {
          leds: [0, 1, 0, 0],
          label: 'LED 2',
          desc: {
            pt: 'Sobretensão ou falha na placa BMS (testar capacitores e MOSFETs).',
            es: 'Sobretensión o falla en placa BMS (probar capacitores y MOSFETs).',
            en: 'Overvoltage or BMS fault (test ceramic capacitors & MOSFETs).',
            fr: 'Surtension ou panne BMS (tester condensateurs et MOSFETs).',
            tr: 'Aşırı voltaj veya BMS arızası (kondansatör ve MOSFET testi).',
          },
        },
        led3: {
          leds: [0, 0, 1, 0],
          label: 'LED 3',
          desc: {
            pt: 'Subtensão crítica (<52V) ou curto-circuito na linha de potência.',
            es: 'Subtensión crítica (<52V) o cortocircuito en potencia.',
            en: 'Critical undervoltage (<52V) or power rail short circuit.',
            fr: 'Sous-tension critique (<52V) ou court-circuit puissance.',
            tr: 'Kritik düşük voltaj (<52V) veya güç hattı kısa devresi.',
          },
        },
        led4: {
          leds: [0, 0, 0, 1],
          label: 'LED 4',
          desc: {
            pt: 'Temperatura anormal no conector (sensor NTC ou placa de interface).',
            es: 'Temperatura anormal en conector (sensor NTC ou placa interfaz).',
            en: 'Abnormal connector temperature (NTC sensor or interface board).',
            fr: 'Température anormale connecteur (NTC ou carte d’interface).',
            tr: 'Anormal konnektör sıcaklığı (NTC veya arayüz kartı).',
          },
        },
        led23: {
          leds: [0, 1, 1, 0],
          label: 'LEDs 2 + 3',
          desc: {
            pt: 'Desbalanceamento severo ou fusível SMD aberto na placa lateral.',
            es: 'Desbalanceo severo o fusible SMD abierto en placa lateral.',
            en: 'Severe imbalance or blown SMD fuse on cell side board.',
            fr: 'Déséquilibre sévère ou fusible SMD coupé sur carte latérale.',
            tr: 'Ciddi dengesizlik veya yan kartta açık SMD sigorta.',
          },
        },
        led34: {
          leds: [0, 0, 1, 1],
          label: 'LEDs 3 + 4',
          desc: {
            pt: 'Falha de autenticação / certificação (conector oxidado ou Chip de Ciclo).',
            es: 'Fallo de autenticación / certificación (conector o Chip de Ciclo).',
            en: 'Authentication failure (corroded connector or Cycle Chip).',
            fr: 'Échec d’authentification (connecteur oxydé ou Puce de Cycle).',
            tr: 'Doğrulama hatası (oksitli konnektör veya Döngü Çipi).',
          },
        },
        ledAll: {
          leds: [1, 1, 1, 1],
          label: '4 LEDs',
          desc: {
            pt: 'Bloqueio definitivo do MCU (>5 toques no Power). Trocar MCU 0 ciclos.',
            es: 'Bloqueo definitivo del MCU (>5 toques). Cambiar MCU 0 ciclos.',
            en: 'Permanent MCU lock (>5 Power presses). Swap 0-cycle MCU + P100.',
            fr: 'Verrouillage MCU (>5 appuis Power). Remplacer MCU 0 cycle.',
            tr: 'Kalıcı MCU kilidi (>5 Güç basma). 0 döngü MCU değişimi.',
          },
        },
      };

      const cur = patterns[lab1Pattern];
      return React.createElement('div', { className: "flex flex-col sm:flex-row items-center gap-6" }, React.createElement('div', {
        className: "bg-slate-950 border border-slate-700 rounded-2xl px-6 py-5 flex items-center gap-3 shrink-0",
      }, React.createElement('div', null, cur.leds.map((on, i) =>
        React.createElement('div', {
          className: `w-5 h-10 rounded-full ${on ? 'led-blink' : 'led-off'} title={`LED ${i+1}`}`,
        })
      ), React.createElement('div', {
        className: "ml-2 w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-bold text-xs",
      }, "⏻"))), React.createElement('div', {
        className: "flex-1 space-y-3 w-full",
      }, React.createElement('div', {
        className: "flex flex-wrap gap-1.5",
      }, Object.keys(patterns).map((k) =>
        React.createElement('button', {
          key: k,
          onClick: () => setLab1Pattern(k),
          className: `px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
            lab1Pattern === k ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
          }`,
        }, patterns[k].label)
      ))));
    }

    if (lab2FixedFuses.length > 0 || lab2FixedFuses.length === 0) {
      const titles = {
        pt: 'Bancada Multímetro (Bip): Encontre e Jumpeie os 2 Fusíveis SMD Abertos',
        es: 'Banco Multímetro (Bip): Encuentra y Puentea los 2 Fusibles SMD Abiertos',
        en: 'Multimeter Continuity Bench: Find & Bridge the 2 Blown SMD Fuses',
        fr: 'Banc Multimètre (Bip) : Trouvez et Pontez les 2 Fusibles SMD Ouverts',
        tr: 'Multimetre Tezgahı: Açık 2 SMD Sigortayı Bulun ve Köprüleyin',
      };
      const openFuses = [4, 11];
      const seriesCount = 12 + lab2FixedFuses.length;
      return React.createElement('div', { className: "space-y-4" }, React.createElement('div', {
        className: "flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-3",
      }, React.createElement('span', { className: "text-xs font-mono-tech text-slate-400" }, "24S515A READOUT:"), React.createElement('span', {
        className: `text-lg font-black font-mono-tech ${seriesCount === 14 ? 'text-emerald-400' : 'text-amber-400'}`,
      }, `${seriesCount}S ${seriesCount === 14 ? '✓ OK' : '⚠ MISSING'}`)), React.createElement('div', {
        className: "grid grid-cols-4 sm:grid-cols-7 gap-2",
      }, Array.from({ length: 13 }).map((_, idx) => {
        const n = idx + 1;
        const isOpen = openFuses.includes(n) && !lab2FixedFuses.includes(n);
        const isFixed = lab2FixedFuses.includes(n);
        return React.createElement('button', {
          key: n,
          onClick: () => testSmdFuse(n),
          className: `p-2.5 rounded-xl border text-center transition ${isFixed ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-950 border-slate-700 hover:border-amber-400 text-slate-200'}`,
        }, React.createElement('div', { className: "text-[10px] font-mono-tech text-slate-400" }, `B${n}`), React.createElement('div', {
          className: "text-xs font-black mt-0.5",
        }, isFixed ? 'JUMPER ✓' : 'F' + n));
      })), React.createElement('div', {
        className: "flex justify-end",
      }, React.createElement('button', {
        onClick: () => { lab2FixedFuses.length = 0; setLab2FixedFuses([]); },
        className: "px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold",
      }, t('reset'))));
    }

    if (lab3Delta !== undefined) {
      const titles = {
        pt: 'Simulador Equalizadora 24S515A (Meta: Delta < 0,015V)',
        es: 'Simulador Ecualizadora 24S515A (Meta: Delta < 0,015V)',
        en: '24S515A Equalizer Simulator (Target: Delta < 0.015V)',
        fr: 'Simulateur Équilibreuse 24S515A (Cible : Delta < 0,015V)',
        tr: '24S515A Dengeleyici Simülatörü (Hedef: Delta < 0,015V)',
      };
      const ok = lab3Delta <= 0.015;
      return React.createElement('div', { className: "flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4" }, React.createElement('div', {
        className: "space-y-1",
      }, React.createElement('div', { className: "text-xs font-mono-tech text-slate-400" }, "DELTA ATUAL (MAX - MIN):"), React.createElement('div', {
        className: `text-3xl font-black font-mono-tech ${ok ? 'text-emerald-400' : 'text-amber-400'}`,
      }, lab3Delta.toFixed(3) + " V"), React.createElement('div', {
        className: `${ok ? 'text-emerald-300' : 'text-slate-400'}`,
      }, ok ? '✅ PACK EQUALIZADO (< 0,015V)' : '⚡ 3.5A Active Balancing'))), React.createElement('div', {
        className: "flex flex-wrap gap-2",
      }, React.createElement('button', {
        onClick: runEqualizerPulse,
        className: "px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold",
      }, "⚡ Equalizar (3.5A)"), React.createElement('button', {
        onClick: () => { setLab3Delta(0.240); },
        className: "px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold",
      }, t('reset'))));
    }

    if (lab4Wired && Object.keys(lab4Wired).length > 0) {
      const titles = {
        pt: 'Pinagem Clicável: 4 Vias do Chip de Ciclo na Placa-Mãe',
        es: 'Pinout Interactivo: 4 Vías del Chip de Ciclo en la BMS',
        en: 'Interactive Pinout: 4-Wire Cycle Chip on BMS',
        fr: 'Brochage Interactif : 4 Fils de la Puce de Cycle',
        tr: 'Etkileşimli Pin Dizilimi: 4 Kablolu Döngü Çipi',
      };
      const pairs = [
        { color: 'RED', hex: 'bg-red-600', pad: 'VCC_A' },
        { color: 'BLACK', hex: 'bg-slate-700', pad: 'GND / VC0' },
        { color: 'GREEN', hex: 'bg-emerald-600', pad: 'SDA_A' },
        { color: 'BLUE', hex: 'bg-blue-600', pad: 'SCL_A' },
      ];
      return React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, pairs.map((p) => {
        const wired = !!lab4Wired[p.color];
        return React.createElement('button', {
          key: p.color,
          onClick: () => { lab4Wired[p.color] = !lab4Wired[p.color]; setLab4Wired({ ...lab4Wired }); },
          className: `p-3.5 rounded-xl border flex items-center justify-between transition ${wired ? 'bg-emerald-500/15 border-emerald-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`,
        }, React.createElement('span', { className: "flex items-center gap-2.5" },
          React.createElement('span', { className: `w-4 h-4 rounded-full ${p.hex}` }),
          React.createElement('span', { className: "text-xs font-bold text-white" }, p.color)),
          React.createElement('span', {
            className: `font-mono-tech text-xs font-bold ${wired ? 'text-emerald-400' : 'text-slate-400'}`,
          }, `→ ${p.pad} ${wired ? '✓' : ''}`),
        );
      }));
    }

    if (lab5Checked && lab5Checked.length > 0) {
      const titles = {
        pt: 'Checklist de Curto na BMS (LED 2 Piscando)',
        es: 'Checklist de Corto en BMS (LED 2 Parpadeando)',
        en: 'BMS Short-Circuit Checklist (Blinking LED 2)',
        fr: 'Checklist Court-Circuit BMS (LED 2 Clignotante)',
        tr: 'BMS Kısa Devre Kontrol Listesi (LED 2)',
      };
      const checks = [
        '1. Remover resina a 150°C (espátula plástica)',
        '2. Continuidade Fusível MEGA 300A',
        '3. Teste diodo nos MOSFETs de potência',
        '4. Capacitores cerâmicos (canto inferior direito)',
      ];
      return React.createElement('div', { className: "space-y-2" }, checks.map((c, i) => {
        const on = lab5Checked.includes(i);
        return React.createElement('button', {
          key: i,
          onClick: () => toggleLab5(i),
          className: `w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-3 transition ${on ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'}`,
        }, React.createElement('span', null, on ? '✅' : '⬜'), React.createElement('span', null, c));
      }));
    }

    if (lab6Timer !== undefined) {
      const titles = {
        pt: 'Cronômetro Térmico da Banheira de Estanho (280°C • Alvo: 4,0s a 5,0s)',
        es: 'Cronómetro Térmico del Baño de Estaño (280°C • Meta: 4,0s–5,0s)',
        en: 'Solder Pot Thermal Timer (280°C • Target: 4.0s–5.0s)',
        fr: 'Chronomètre Thermique Bain d’Étain (280°C • Cible : 4,0s–5,0s)',
        tr: 'Lehim Potası Termal Zamanlayıcı (280°C • Hedef: 4,0–5,0 sn)',
      };
      const sec = lab6Timer.toFixed(1);
      const statusColor = lab6Timer === 0 ? 'text-slate-300' : (lab6Timer >= 4 && lab6Timer <= 5) ? 'text-emerald-400' : lab6Timer > 5 ? 'text-rose-400' : 'text-amber-400';
      return React.createElement('div', { className: "flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4" }, React.createElement('div', null, React.createElement('div', { className: "text-xs font-mono-tech text-orange-400" }, "TEMP: 280°C"), React.createElement('div', {
        id: "lab6-display",
        className: `text-3xl font-black font-mono-tech ${statusColor}`,
      }, sec + " s")), React.createElement('div', {
        className: "flex gap-2",
      }, React.createElement('button', {
        onClick: toggleLab6Timer,
        className: `px-4 py-2.5 rounded-xl ${lab6Running ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold'}`,
      }, lab6Running ? '⏹ Retirar Placa' : '🔥 Mergulhar Pinos'), React.createElement('button', {
        onClick: () => { setLab6Timer(0); },
        className: "px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold",
      }, t('reset'))));
    }

    if (lab7Cutoff !== undefined) {
      const titles = {
        pt: 'Simulador Digital XH-M609 — Ajuste de Tensão de Corte',
        es: 'Simulador Digital XH-M609 — Ajuste de Tensión de Corte',
        en: 'XH-M609 Digital Cutoff Simulator',
        fr: 'Simulateur Digital XH-M609 — Tension de Coupure',
        tr: 'XH-M609 Dijital Kesme Voltajı Simülatörü',
      };
      const v = lab7Cutoff;
      const msg = v < 42
        ? '🚨 PERIGO: Abaixo de 42,0V (<3,0V/célula) causa dano permanente!'
        : v === 52
          ? '✅ MODO STORAGE (52,0V) — Ideal para armazenamento seguro.'
          : v === 47
            ? '✅ TESTE DE CAPACIDADE SOB CARGA (47,0V) — Revela queda de células.'
            : '⚡ Faixa segura operacional (42,0V a 58,8V).';
      return React.createElement('div', { className: "space-y-4 bg-slate-950 border border-slate-800 rounded-xl p-4" }, React.createElement('div', {
        className: "flex flex-wrap items-center justify-between gap-3",
      }, React.createElement('div', { className: "px-5 py-2.5 rounded-xl bg-black border-2 border-red-500/60 font-mono-tech text-3xl font-black text-red-500" }, v.toFixed(1) + " V"), React.createElement('div', {
        className: "flex flex-wrap gap-2",
      }, React.createElement('button', {
        onClick: () => { setLab7Cutoff(52.0); },
        className: "px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold",
      }, "Storage (52.0V)"), React.createElement('button', {
        onClick: () => { setLab7Cutoff(47.0); },
        className: "px-3 py-2 rounded-lg bg-sky-600/20 border border-sky-500/50 text-sky-300 text-xs font-bold",
      }, "Load Test (47.0V)"), React.createElement('button', {
        onClick: () => { setLab7Cutoff(39.0); },
        className: "px-3 py-2 rounded-lg bg-rose-600/20 border border-rose-500/50 text-rose-300 text-xs font-bold",
      }, "Danger (39.0V)"))), React.createElement('input', {
        type: "range",
        min: "36",
        max: "56",
        step: "0.5",
        value: lab7Cutoff,
        onChange: (e) => { setLab7Cutoff(parseFloat(e.target.value)); },
        className: "w-full accent-emerald-500",
      }), React.createElement('p', {
        className: `text-xs sm:text-sm font-bold ${lab7Cutoff < 42 ? 'text-rose-400' : 'text-emerald-300'}`,
      }, msg)));
    }

    // Final validation
    const titles = {
      pt: 'Validação Final e Emissão do Certificado',
      es: 'Validación Final y Emisión del Certificado',
      en: 'Final Validation & Certificate Issuance',
      fr: 'Validation Finale et Certificat',
      tr: 'Son Doğrulama ve Sertifika',
    };
    return React.createElement('div', { className: "flex flex-wrap gap-3" }, React.createElement('button', {
      onClick: () => switchView('workshop'),
      className: "px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold",
    }, t('navWorkshop')), React.createElement('button', {
      onClick: () => switchView('certificate'),
      className: "px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold border border-slate-700",
    }, t('navCert')));
  }
}