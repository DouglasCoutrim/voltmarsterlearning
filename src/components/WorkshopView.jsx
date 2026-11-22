import React from 'react';
import { CHECKLIST_DATA, PRICING_SERVICES } from '../data/modules';

export default function WorkshopView({
  lang,
  checklist,
  toggleChecklist,
  selectedServices,
  toggleService,
  resetQuote,
  copyWhatsAppQuote,
  t,
}) {
  const total = Object.values(selectedServices).reduce(
    (acc, checked, idx) => (checked ? acc + PRICING_SERVICES[idx].price : acc),
    0
  );

  return (
    <section id="view-workshop" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="chk-title" className="text-lg font-extrabold text-white">
                {t('chkTitle')}
              </h2>
              <p id="chk-subtitle" className="text-xs text-slate-400">
                {t('chkSubtitle')}
              </p>
            </div>
            <span id="chk-score" className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold bg-slate-800 text-emerald-400">
              {checklist.filter(c => c).length}/8
            </span>
          </div>
          <div id="checklist-items" className="space-y-2.5">
            {CHECKLIST_DATA.map((item, i) => {
              const on = checklist[i];
              return (
                <button
                  key={i}
                  onClick={() => toggleChecklist(i)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 transition ${
                    on
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-100'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{on ? '✅' : '⬜'}</span>
                  <span>
                    <strong className="font-mono-tech text-emerald-400 mr-1">
                      {i + 1}.
                    </strong>
                    {item[lang]}
                  </span>
                </button>
              );
            })}
          </div>
          <div id="chk-release-banner" className="mt-4 p-3.5 rounded-xl border text-xs sm:text-sm font-bold text-center"></div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 id="calc-title" className="text-lg font-extrabold text-white mb-1">
              {t('calcTitle')}
            </h2>
            <p id="calc-subtitle" className="text-xs text-slate-400 mb-4">
              {t('calcSubtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label id="lbl-client-name" className="block text-xs font-semibold text-slate-400 mb-1">
                  {t('clientName')}
                </label>
                <input
                  id="quote-client"
                  type="text"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
                  placeholder={t('clientName')}
                />
              </div>
              <div>
                <label id="lbl-battery-model" className="block text-xs font-semibold text-slate-400 mb-1">
                  {t('batteryModel')}
                </label>
                <select
                  id="quote-model"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
                >
                  <option value="DJI Agras T20P">DJI Agras T20P</option>
                  <option value="DJI Agras T30">DJI Agras T30</option>
                  <option value="DJI Agras T40" selected>DJI Agras T40</option>
                  <option value="DJI Agras T50">DJI Agras T50</option>
                </select>
              </div>
            </div>
            <div id="pricing-services-list">
              {PRICING_SERVICES.map((s) => {
                const checked = !!selectedServices[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                      checked
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span>{checked ? '☑️' : '⬜'}</span>
                      <span className="text-xs font-semibold truncate">{s.names[lang]}</span>
                    </div>
                    <span className="text-xs font-mono-tech font-bold text-emerald-400 shrink-0">
                      {s.range}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span id="lbl-total-est" className="text-sm font-bold text-slate-300">
                {t('totalEst')}
              </span>
              <span id="quote-total-value" className="text-xl font-black font-mono-tech text-emerald-400">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                id="btn-copy-quote"
                onClick={copyWhatsAppQuote}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition"
              >
                {t('copyQuote')}
              </button>
              <button
                id="btn-reset-quote"
                onClick={resetQuote}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold transition"
              >
                {t('resetQuote')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}