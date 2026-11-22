import React from 'react';
import { MODULES, PHOTO_COMPONENTS } from '../data/modules';

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

  const buildModuleSVG = (modId) => {
    const svgs = {
      0: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="40" y="35" width="520" height="250" rx="18" fill="#0f172a" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="8 6"/><text x="300" y="65" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">⚠ PERIMETER EDGES = GND (TERRA) — SHORT > 300A ⚠</text><rect x="75" y="95" width="130" height="65" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="140" y="123" fill="#4ade80" font-size="13" font-weight="bold" text-anchor="middle">14S PACK</text><text x="140" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">58.80V (4.20V/cell)</text><rect x="235" y="95" width="130" height="65" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="300" y="123" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">STORAGE</text><text x="300" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">51.8V – 53.2V</text><rect x="395" y="95" width="130" height="65" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/><text x="460" y="123" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">POWER RULE</text><text x="460" y="145" fill="#cbd5e1" font-size="12" text-anchor="middle">MAX 5 PRESSES</text><rect x="75" y="185" width="450" height="70" rx="10" fill="#064e3b" fill-opacity="0.4" stroke="#10b981"/><text x="300" y="213" fill="#6ee7b7" font-size="13" font-weight="bold" text-anchor="middle">REASSEMBLY: [6 &amp; 5] → WAIT 5s → [4] → [BAT+] → [BAT-]</text><text x="300" y="237" fill="#a7f3d0" font-size="11" text-anchor="middle">DISASSEMBLY: [BAT-] → [BAT+] → [4] → [5] → [6]</text></svg>',
      1: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="90" y="65" width="420" height="120" rx="45" fill="#1e293b" stroke="#64748b" stroke-width="4"/>' + Array.from({length:10}, (_,i) => '<rect x="'+(125 + i*36)+'" y="88" width="22" height="74" rx="4" fill="#090d16" stroke="#eab308" stroke-width="2"/><line x1="'+(136 + i*36)+'" y1="96" x2="'+(136 + i*36)+'" y2="154" stroke="#facc15" stroke-width="3"/>').join('')+'<text x="300" y="220" fill="#facc15" font-size="14" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">10-SLOT GOLD INTERFACE CONNECTOR (T30 / T40 / T50)</text><text x="300" y="246" fill="#94a3b8" font-size="12" text-anchor="middle">PSU WAKE-UP: 54.0V / 1.5A–2.0A → 52.5V</text></svg>',
      2: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="45" y="55" width="510" height="205" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>' + Array.from({length:7}, (_,i) => '<rect x="'+(68 + i*68)+'" y="108" width="52" height="26" rx="4" fill="#475569"/><rect x="'+(80 + i*68)+'" y="146" width="28" height="18" rx="3" fill="#16a34a" stroke="#4ade80"/><text x="'+(94 + i*68)+'" y="159" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">F'+(i*2+1)+'</text><rect x="'+(68 + i*68)+'" y="176" width="52" height="26" rx="4" fill="#475569"/>').join('')+'<text x="300" y="236" fill="#4ade80" font-size="12" text-anchor="middle">NO BEEP = OPEN FUSE → SOLDER JUMPER AT 320°C</text></svg>',
      3: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="70" y="45" width="460" height="225" rx="16" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/><rect x="105" y="70" width="390" height="145" rx="8" fill="#090d16" stroke="#22c55e" stroke-width="2"/><text x="300" y="96" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">24S515A ACTIVE EQUALIZER — 14S</text><text x="140" y="132" fill="#e2e8f0" font-size="12" font-family="JetBrains Mono">CURR: 4.000 A</text><text x="140" y="156" fill="#e2e8f0" font-size="12" font-family="JetBrains Mono">PACK: 56.87 V</text><text x="140" y="180" fill="#4ade80" font-size="13" font-weight="bold" font-family="JetBrains Mono">DELTA: 0.015 V</text><text x="340" y="132" fill="#38bdf8" font-size="12" font-family="JetBrains Mono">MAX: 4.070 V</text><text x="340" y="156" fill="#38bdf8" font-size="12" font-family="JetBrains Mono">MIN: 4.055 V</text><text x="340" y="180" fill="#fbbf24" font-size="12" font-family="JetBrains Mono">SERIES: 14S OK</text><text x="300" y="246" fill="#cbd5e1" font-size="12" text-anchor="middle">Single-Cell Recovery: 1.0A → 3.30V | 2.0A → 3.80V</text></svg>',
      4: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="65" y="75" width="120" height="165" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/><text x="125" y="155" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">CYCLE CHIP</text><text x="125" y="175" fill="#94a3b8" font-size="10" text-anchor="middle">T20 / T30 / T40</text><rect x="410" y="55" width="130" height="205" rx="12" fill="#0f172a" stroke="#22c55e" stroke-width="2"/><text x="475" y="82" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">BMS PADS</text><line x1="185" y1="105" x2="410" y2="105" stroke="#ef4444" stroke-width="4"/><text x="475" y="110" fill="#f87171" font-size="12" font-weight="bold" text-anchor="middle">VCC_A (RED)</text><line x1="185" y1="142" x2="410" y2="142" stroke="#94a3b8" stroke-width="4"/><text x="475" y="147" fill="#cbd5e1" font-size="12" font-weight="bold" text-anchor="middle">GND/VC0 (BLK)</text><line x1="185" y1="179" x2="410" y2="179" stroke="#22c55e" stroke-width="4"/><text x="475" y="184" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">SDA_A (GRN)</text><line x1="185" y1="216" x2="410" y2="216" stroke="#3b82f6" stroke-width="4"/><text x="475" y="221" fill="#60a5fa" font-size="12" font-weight="bold" text-anchor="middle">SCL_A (BLU)</text></svg>',
      5: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><path d="M210 45 H390 V95 H535 V265 H65 V95 H210 Z" fill="#0f172a" stroke="#475569" stroke-width="3"/><rect x="95" y="120" width="115" height="45" rx="6" fill="#334155" stroke="#cbd5e1" stroke-width="2"/><text x="152" y="147" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">MEGA 300A</text><rect x="245" y="135" width="75" height="75" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="282" y="177" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">MCU</text><rect x="445" y="195" width="72" height="52" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="2"/><text x="481" y="225" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">CAPS SMD</text><text x="300" y="295" fill="#94a3b8" font-size="12" text-anchor="middle">RESIN: 150°C | UNLOCK: 0-CYCLE MCU + P100</text></svg>',
      6: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="130" y="135" width="340" height="120" rx="18" fill="#1e293b" stroke="#64748b" stroke-width="3"/><rect x="165" y="155" width="270" height="55" rx="8" fill="#94a3b8" stroke="#f97316" stroke-width="3"/><text x="300" y="188" fill="#090d16" font-size="15" font-weight="900" text-anchor="middle" font-family="JetBrains Mono">MOLTEN TIN — 280°C</text><rect x="210" y="65" width="180" height="50" rx="12" fill="#0f172a" stroke="#facc15" stroke-width="2"/><text x="300" y="95" fill="#facc15" font-size="12" font-weight="bold" text-anchor="middle">10-PIN CONNECTOR</text><text x="300" y="285" fill="#fb923c" font-size="13" font-weight="bold" text-anchor="middle">REMOVE: 4–5 SEC MAX | SOLDER NEW: 3 SEC</text></svg>',
      7: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><rect x="35" y="75" width="115" height="110" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="92" y="125" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">14S PACK</text><text x="92" y="145" fill="#94a3b8" font-size="11" text-anchor="middle">58.8V MAX</text><rect x="200" y="75" width="140" height="110" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><text x="270" y="120" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SSR-40DD</text><text x="270" y="142" fill="#a855f7" font-size="11" font-weight="bold" text-anchor="middle">+ XH-M609</text><rect x="395" y="75" width="165" height="110" rx="10" fill="#451a03" stroke="#f97316" stroke-width="2"/><text x="477" y="118" fill="#fdba74" font-size="12" font-weight="bold" text-anchor="middle">4x 20Ω / 150W</text><text x="477" y="140" fill="#fb923c" font-size="11" text-anchor="middle">Req = 5Ω (~10A)</text><line x1="150" y1="130" x2="200" y2="130" stroke="#ef4444" stroke-width="3"/><line x1="340" y1="130" x2="395" y2="130" stroke="#ef4444" stroke-width="3"/><text x="300" y="240" fill="#4ade80" font-size="13" font-weight="bold" text-anchor="middle">STORAGE: 52.0V | CAPACITY TEST: 47.0V | NEVER &lt; 42.0V</text></svg>',
      8: '<svg viewBox="0 0 600 320" class="w-full h-full max-w-2xl"><circle cx="300" cy="135" r="78" fill="#064e3b" fill-opacity="0.45" stroke="#22c55e" stroke-width="4"/><path d="M262 135 L288 162 L342 106" fill="none" stroke="#4ade80" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="250" fill="#fff" font-size="16" font-weight="900" text-anchor="middle">8-POINT FLIGHT RELEASE PROTOCOL</text><text x="300" y="276" fill="#4ade80" font-size="12" text-anchor="middle">DELTA &lt; 0.030V • 58.8V FULL CHARGE • 14S VERIFIED</text></svg>',
    };
    return svgs[modId] || svgs[0];
  };

  const renderLab = () => {
    if (currentMod === 0) {
      const steps = [
        { id: 0, label: '1. Cabos 6 (NTC) e 5 (Células 1–7)' },
        { id: 1, label: '2. PAUSA OBRIGATÓRIA DE 5 SEGUNDOS' },
        { id: 2, label: '3. Cabo 4 (Células 8–14)' },
        { id: 3, label: '4. Terminal Positivo (BAT+)' },
        { id: 4, label: '5. Terminal Negativo (BAT-)' }
      ];
      const shuffled = [steps[3], steps[0], steps[4], steps[2], steps[1]];
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {shuffled.map((s) => {
              const stepDone = s.id < lab0Step;
              return (
                <button
                  key={s.id}
                  onClick={() => clickLab0(s.id)}
                  disabled={stepDone}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition ${
                    stepDone
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 opacity-75'
                      : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
                  }`}
                >
                  {stepDone ? '✓ ' : ''}{s.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className={`text-xs font-mono-tech ${lab0Step === 5 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              {lab0Step === 5 ? t('correct') + ' (5/5)' : `Step: ${lab0Step}/5`}
            </span>
            <button
              onClick={() => showToast(t('reset'), 'amber')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
            >
              {t('reset')}
            </button>
          </div>
        </div>
      );
    }

    if (currentMod === 1) {
      const patterns = {
        led2: { leds: [0,1,0,0], label: 'LED 2', desc: { pt: 'Sobretensão ou falha na placa BMS (testar capacitores e MOSFETs).', es: 'Sobretensión o falla en placa BMS (probar capacitores y MOSFETs).', en: 'Overvoltage or BMS fault (test ceramic capacitors & MOSFETs).', fr: 'Surtension ou panne BMS (tester condensateurs et MOSFETs).', tr: 'Aşırı voltaj veya BMS arızası (kondansatör ve MOSFET testi).' } },
        led3: { leds: [0,0,1,0], label: 'LED 3', desc: { pt: 'Subtensão crítica (<52V) ou curto-circuito na linha de potência.', es: 'Subtensión crítica (<52V) o cortocircuito en potencia.', en: 'Critical undervoltage (<52V) or power rail short circuit.', fr: 'Sous-tension critique (<52V) ou court-circuit puissance.', tr: 'Kritik düşük voltaj (<52V) veya güç hattı kısa devresi.' } },
        led4: { leds: [0,0,0,1], label: 'LED 4', desc: { pt: 'Temperatura anormal no conector (sensor NTC ou placa de interface).', es: 'Temperatura anormal en conector (sensor NTC o placa interfaz).', en: 'Abnormal connector temperature (NTC sensor or interface board).', fr: 'Température anormale connecteur (NTC ou carte d’interface).', tr: 'Anormal konnektör sıcaklığı (NTC veya arayüz kartı).' } },
        led23: { leds: [0,1,1,0], label: 'LEDs 2 + 3', desc: { pt: 'Desbalanceamento severo ou fusível SMD aberto na placa lateral.', es: 'Desbalanceo severo o fusible SMD aberto en placa lateral.', en: 'Severe imbalance or blown SMD fuse on cell side board.', fr: 'Déséquilibre sévère ou fusible SMD coupé sur carte latérale.', tr: 'Ciddi dengesizlik veya yan kartta açık SMD sigorta.' } },
        led34: { leds: [0,0,1,1], label: 'LEDs 3 + 4', desc: { pt: 'Falha de autenticação / certificação (conector oxidado ou Chip de Ciclo).', es: 'Fallo de autenticación / certificación (conector o Chip de Ciclo).', en: 'Authentication failure (corroded connector or Cycle Chip).', fr: 'Échec d’authentification (connecteur oxydé ou Puce de Cycle).', tr: 'Doğrulama hatası (oksitli konnektör veya Döngü Çipi).' } },
        ledAll: { leds: [1,1,1,1], label: '4 LEDs', desc: { pt: 'Bloqueio definitivo do MCU (>5 toques no Power). Trocar MCU 0 ciclos.', es: 'Bloqueo definitivo del MCU (>5 toques). Cambiar MCU 0 ciclos.', en: 'Permanent MCU lock (>5 Power presses). Swap 0-cycle MCU + P100.', fr: 'Verrouillage MCU (>5 appuis Power). Remplacer MCU 0 cycle.', tr: 'Kalıcı MCU kilidi (>5 Güç basma). 0 döngü MCU değişimi.' } },
      };
      const cur = patterns[lab1Pattern];
      return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl px-6 py-5 flex items-center gap-3 shrink-0">
            {cur.leds.map((on, i) => (
              <div key={i} className={`w-5 h-10 rounded-full ${on ? 'led-blink' : 'led-off'}`} title={`LED ${i+1}`} />
            ))}
            <div className="ml-2 w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-bold text-xs">⏻</div>
          </div>
          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(patterns).map((k) => (
                <button
                  key={k}
                  onClick={() => setLab1Pattern(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                    lab1Pattern === k ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {patterns[k].label}
                </button>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200 font-medium">
              {cur.desc[lang]}
            </div>
          </div>
        </div>
      );
    }

    if (currentMod === 2) {
      const openFuses = [4, 11];
      const seriesCount = 12 + lab2FixedFuses.length;
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
            <span className="text-xs font-mono-tech text-slate-400">24S515A READOUT:</span>
            <span className={`text-lg font-black font-mono-tech ${seriesCount === 14 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {seriesCount}S {seriesCount === 14 ? '✓ OK' : '⚠ MISSING'}
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {Array.from({length:13}, (_, idx) => {
              const n = idx + 1;
              const isFixed = lab2FixedFuses.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => testSmdFuse(n)}
                  className={`p-2.5 rounded-xl border text-center transition ${isFixed ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-950 border-slate-700 hover:border-amber-400 text-slate-200'}`}
                >
                  <div className="text-[10px] font-mono-tech text-slate-400">B{n}</div>
                  <div className="text-xs font-black mt-0.5">{isFixed ? 'JUMPER ✓' : 'F' + n}</div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (currentMod === 3) {
      const ok = lab3Delta <= 0.015;
      return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-tech text-slate-400">DELTA ATUAL (MAX - MIN):</div>
            <div className={`text-3xl font-black font-mono-tech ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>
              {lab3Delta.toFixed(3)} V
            </div>
            <div className={`${ok ? 'text-emerald-300' : 'text-slate-400'}`}>
              {ok ? '✅ PACK EQUALIZADO (< 0,015V)' : '⚡ 3.5A Active Balancing'}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={runEqualizerPulse}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold"
            >
              ⚡ Equalizar (3.5A)
            </button>
          </div>
        </div>
      );
    }

    if (currentMod === 4) {
      const pairs = [
        { color: 'RED', hex: 'bg-red-600', pad: 'VCC_A' },
        { color: 'BLACK', hex: 'bg-slate-700', pad: 'GND / VC0' },
        { color: 'GREEN', hex: 'bg-emerald-600', pad: 'SDA_A' },
        { color: 'BLUE', hex: 'bg-blue-600', pad: 'SCL_A' },
      ];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pairs.map((p) => {
            const wired = !!lab4Wired[p.color];
            return (
              <button
                key={p.color}
                onClick={() => setLab4Wired({ ...lab4Wired, [p.color]: !wired })}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${wired ? 'bg-emerald-500/15 border-emerald-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`w-4 h-4 rounded-full ${p.hex}`} />
                  <span className="text-xs font-bold text-white">{p.color}</span>
                </span>
                <span className={`font-mono-tech text-xs font-bold ${wired ? 'text-emerald-400' : 'text-slate-400'}`}>
                  → {p.pad} {wired ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    if (currentMod === 5) {
      const checks = [
        '1. Remover resina a 150°C (espátula plástica)',
        '2. Continuidade Fusível MEGA 300A',
        '3. Teste diodo nos MOSFETs de potência',
        '4. Capacitores cerâmicos (canto inferior direito)',
      ];
      return (
        <div className="space-y-2">
          {checks.map((c, i) => {
            const on = lab5Checked.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleLab5(i)}
                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-3 transition ${on ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'}`}
              >
                <span>{on ? '✅' : '⬜'}</span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (currentMod === 6) {
      const sec = lab6Timer.toFixed(1);
      const statusColor = lab6Timer === 0 ? 'text-slate-300' : (lab6Timer >= 4 && lab6Timer <= 5) ? 'text-emerald-400' : lab6Timer > 5 ? 'text-rose-400' : 'text-amber-400';
      return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div>
            <div className="text-xs font-mono-tech text-orange-400">TEMP: 280°C</div>
            <div id="lab6-display" className={`text-3xl font-black font-mono-tech ${statusColor}`}>
              {sec} s
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleLab6Timer}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold"
            >
              {lab6Running ? '⏹ Retirar Placa' : '🔥 Mergulhar Pinos'}
            </button>
          </div>
        </div>
      );
    }

    if (currentMod === 7) {
      const v = lab7Cutoff;
      const msg = v < 42
        ? '🚨 PERIGO: Abaixo de 42,0V (<3,0V/célula) causa dano permanente!'
        : v === 52
          ? '✅ MODO STORAGE (52,0V) — Ideal para armazenamento seguro.'
          : v === 47
            ? '✅ TESTE DE CAPACIDADE SOB CARGA (47,0V) — Revela queda de células.'
            : '⚡ Faixa segura operacional (42,0V a 58,8V).';
      return (
        <div className="space-y-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="px-5 py-2.5 rounded-xl bg-black border-2 border-red-500/60 font-mono-tech text-3xl font-black text-red-500">
              {v.toFixed(1)} V
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLab7Cutoff(52.0)}
                className="px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold"
              >
                Storage (52.0V)
              </button>
              <button
                onClick={() => setLab7Cutoff(47.0)}
                className="px-3 py-2 rounded-lg bg-sky-600/20 border border-sky-500/50 text-sky-300 text-xs font-bold"
              >
                Load Test (47.0V)
              </button>
              <button
                onClick={() => setLab7Cutoff(39.0)}
                className="px-3 py-2 rounded-lg bg-rose-600/20 border border-rose-500/50 text-rose-300 text-xs font-bold"
              >
                Danger (39.0V)
              </button>
            </div>
          </div>
          <input
            type="range"
            min="36"
            max="56"
            step="0.5"
            value={lab7Cutoff}
            onChange={(e) => setLab7Cutoff(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <p className={`text-xs sm:text-sm font-bold ${lab7Cutoff < 42 ? 'text-rose-400' : 'text-emerald-300'}`}>
            {msg}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => switchView('workshop')}
          className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold"
        >
          {t('navWorkshop')}
        </button>
        <button
          onClick={() => switchView('certificate')}
          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold border border-slate-700"
        >
          {t('navCert')}
        </button>
      </div>
    );
  };

  return (
    <section id="view-course">
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
              {MODULES.map((mod, idx) => {
                const active = idx === currentMod;
                const isDone = completedModules.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => selectModule(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 ${
                      active
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isDone ? 'bg-emerald-500 text-slate-950' : active ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? '✓' : mod.badge}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {mod.badge}
                        </span>
                        <span className="text-[10px] font-mono-tech text-slate-500">{mod.duration}</span>
                      </div>
                      <p className="text-xs font-bold leading-snug mt-0.5 line-clamp-2">{mod.title[lang]}</p>
                    </div>
                  </button>
                );
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
              onClick={toggleCurrentModuleComplete}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border shrink-0 ${
                done
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {done ? t('completedBtn') : t('markComplete')}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-mode-photo"
                  onClick={() => setPlayerVisualMode('photo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    visualMode === 'photo' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t('modePhoto')}
                </button>
                <button
                  id="btn-mode-svg"
                  onClick={() => setPlayerVisualMode('svg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    visualMode === 'svg' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t('modeSvg')}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-quick-upload"
                  onClick={() => triggerQuickPhotoUpload()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition"
                >
                  ⚡ {t('quickUpload')}
                </button>
              </div>
            </div>

            <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-[#0d1526] to-slate-950 overflow-hidden flex items-center justify-center">
              <div id="player-svg-layer" className="w-full h-full flex items-center justify-center p-4">
                <div dangerouslySetInnerHTML={{ __html: buildModuleSVG(currentMod) }} />
              </div>

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
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden" id="player-seek-bar">
                <div
                  id="player-progress-fill"
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / m.slides[lang].length) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    id="btn-play-pause"
                    onClick={togglePlayLesson}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5"
                  >
                    {isPlaying ? t('pause') : t('play')}
                  </button>
                  <button
                    id="btn-stop-lesson"
                    onClick={stopLesson}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    ⏹
                  </button>
                  <button
                    id="btn-toggle-voice"
                    onClick={toggleVoiceNarration}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                      voiceEnabled
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
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
                    onClick={prevSlide}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                  >
                    ◀
                  </button>
                  <button
                    onClick={nextSlide}
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
                onClick={() => switchView('photos')}
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
                return (
                  <div
                    key={cid}
                    className={`cursor-pointer rounded-xl bg-slate-950 border ${
                      imgSrc ? 'border-emerald-500/40' : 'border-slate-800'
                    } overflow-hidden hover:border-emerald-400 transition`}
                    onClick={() => focusComponentInPlayer(cid)}
                  >
                    <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden relative">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={comp ? comp.labels[lang] : ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono-tech">#{comp ? comp.num : ''} SVG</span>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-slate-200 line-clamp-2">
                        {comp ? comp.labels[lang] : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h3 id="txt-tech-summary-title" className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 mb-3">
              {t('techSummary')}
            </h3>
            <div id="lesson-tech-points" className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
              {m.points[lang].map((p) => (
                <div key={p} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-emerald-400 font-black mt-0.5">⚡</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-b from-slate-900 to-[#0d1526] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-slate-800">
              <div>
                <span id="lab-tag" className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  LABORATÓRIO INTERATIVO DE BANCADA
                </span>
                <h3 id="lab-title" className="text-base sm:text-lg font-extrabold text-white">
                  Lab {currentMod + 1}
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
}

export default CourseView;
