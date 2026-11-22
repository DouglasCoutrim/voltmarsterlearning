import React from 'react';
import { LANG_META } from '../data/languages';

export default function CertificateView({ lang, studentName, setStudentName, completedModules, t }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(LANG_META[lang].htmlLang);

  return (
    <section id="view-certificate" className="space-y-5">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 min-w-[220px]">
          <label id="lbl-cert-student" className="block text-xs font-bold text-slate-400 mb-1.5">
            {t('certStudentLbl')}
          </label>
          <input
            id="cert-student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
          />
        </div>
        <button
          id="btn-print-cert"
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition"
        >
          {t('printCert')}
        </button>
      </div>

      <div
        id="certificate-print-area"
        className="bg-gradient-to-br from-[#0b1324] via-[#0f172a] to-[#071510] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-3 border border-emerald-500/20 rounded-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div
            id="cert-logo-wrap"
            className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center overflow-hidden"
          >
            <svg className="w-9 h-9 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </div>
          <p id="cert-eyebrow" className="text-xs font-black tracking-[0.25em] uppercase text-emerald-400">
            {t('certEyebrow')}
          </p>
          <h2 id="cert-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t('certHeading')}
          </h2>
          <p id="cert-intro" className="text-xs sm:text-sm text-slate-300">
            {t('certIntro')}
          </p>
          <div
            id="cert-display-name"
            className="text-2xl sm:text-4xl font-black text-emerald-400 py-2 border-b border-emerald-500/30 inline-block px-6"
          >
            {studentName || 'Douglas Coutrim Silva'}
          </div>
          <p id="cert-body" className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t('certBody')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs">
            <div>
              <p className="font-bold text-white">Douglas Coutrim Silva</p>
              <p id="cert-role-instructor" className="text-slate-400">
                {t('certInstructor')}
              </p>
            </div>
            <div>
              <p id="cert-date-val" className="font-mono-tech font-bold text-emerald-400">
                {dateStr}
              </p>
              <p id="cert-role-date" className="text-slate-400">
                {t('certDateRole')}
              </p>
            </div>
            <div>
              <p className="font-bold text-white">VoltMaster Energia Agrícola</p>
              <p className="text-slate-400">Brasília - DF • (61) 9 8524-5726</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}