import React, { useState } from 'react';

export default function Header({
  lang,
  setLanguage,
  view,
  switchView,
  completedModules,
  user,
  signIn,
  signUp,
  signOut,
  t,
}) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    if (authMode === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password, fullName);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden shrink-0">
            <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-base sm:text-lg text-white truncate">VOLTMASTER</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">ACADEMY</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">DJI Agras T20P • T30 • T40 • T50</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 gap-0.5" role="group" aria-label="Language selector">
            {Object.entries({
              pt: '🇧🇷 PT',
              es: '🇪🇸 ES',
              en: '🇺🇸 EN',
              fr: '🇫🇷 FR',
              tr: '🇹🇷 TR',
            }).map(([code, label]) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                data-lang-btn={code}
                className={`lang-btn px-2 py-1 rounded-lg text-xs font-bold transition ${
                  lang === code
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.round((completedModules.length / 9) * 100)}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono-tech text-emerald-400 font-bold">
              {Math.round((completedModules.length / 9) * 100)}%
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{user.email}</span>
              <button
                onClick={signOut}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Entrar / Cadastrar
            </button>
          )}
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-3 sm:px-6 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'course', label: t('navCourse') },
          { id: 'photos', label: t('navPhotos') },
          { id: 'workshop', label: t('navWorkshop') },
          { id: 'certificate', label: t('navCert') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchView(tab.id)}
            data-nav={tab.id}
            className={`nav-tab shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              view === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {showAuth && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {authMode === 'signin' ? 'Entrar' : 'Cadastrar'}
              </h3>
              <button
                onClick={() => setShowAuth(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-emerald-500 outline-none"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold"
              >
                {authMode === 'signin' ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-slate-400">
              {authMode === 'signin'
                ? 'Não tem conta? '
                : 'Já tem conta? '}
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-emerald-400 hover:text-emerald-300 font-bold"
              >
                {authMode === 'signin' ? 'Cadastrar' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}