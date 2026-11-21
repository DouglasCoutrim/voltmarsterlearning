import React from 'react';
import { PHOTO_COMPONENTS, MODULES } from '../data/modules';

export default function PhotosView({
  lang,
  photos,
  photoFilter,
  setPhotoFilter,
  t,
  handlePhotoUploadForComponent,
  requestRemovePhoto,
  openLightbox,
  exportPhotosJSON,
  exportStandaloneHTML,
}) {
  const uploadedCount = Object.keys(photos).filter(k => !!photos[k]).length;

  const filters = [
    { id: 'all', label: t('filterAll') },
    ...MODULES.slice(0, 8).map(m => ({ id: String(m.id), label: m.badge })),
  ];

  const items = photoFilter === 'all'
    ? PHOTO_COMPONENTS
    : PHOTO_COMPONENTS.filter(c => String(c.mod) === photoFilter);

  return (
    <section id="view-photos" className="hidden space-y-5">
      <div className="bg-gradient-to-r from-slate-900 via-[#0f1c2e] to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span id="photos-badge" className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {t('photosBadge')}
            </span>
            <h1 id="photos-title" className="text-xl sm:text-2xl font-black text-white">
              {t('photosTitle')}
            </h1>
            <p id="photos-desc" className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {t('photosDesc')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-html"
              onClick={exportStandaloneHTML}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition"
            >
              {t('exportHtml')}
            </button>
            <button
              id="btn-backup-json"
              onClick={exportPhotosJSON}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              {t('backupJson')}
            </button>
            <button
              id="btn-restore-json"
              onClick={() => document.getElementById('restore-json-input').click()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              {t('restoreJson')}
            </button>
            <input
              type="file"
              id="restore-json-input"
              accept="application/json"
              className="hidden"
            />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-40 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                id="photos-progress-bar"
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.round((uploadedCount / PHOTO_COMPONENTS.length) * 100)}%` }}
              ></div>
            </div>
            <span id="photos-count-text" className="text-xs font-mono-tech text-emerald-400 font-bold">
              {uploadedCount} / {PHOTO_COMPONENTS.length}
            </span>
          </div>
          <div id="photos-filter-bar" className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setPhotoFilter(f.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  photoFilter === f.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="photos-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => {
          const src = photos[c.id];
          const modBadge = MODULES[c.mod] ? MODULES[c.mod].badge : 'GERAL';
          const label = c.labels[lang];
          return (
            <div
              key={c.id}
              className={`bg-slate-900/90 border rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg ${
                src ? 'border-emerald-500/40' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-tech font-bold text-emerald-400">#{c.num}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                    {modBadge}
                  </span>
                </div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('ring-2', 'ring-emerald-400');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('ring-2', 'ring-emerald-400');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('ring-2', 'ring-emerald-400');
                    if (e.dataTransfer.files[0]) {
                      handlePhotoUploadForComponent(c.id, e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => {
                    if (src) {
                      openLightbox(src, `#${c.num} — ${label}`);
                    } else {
                      document.getElementById(`file-${c.id}`).click();
                    }
                  }}
                  className="aspect-video bg-slate-950 flex flex-col items-center justify-center p-3 cursor-pointer relative overflow-hidden group"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="text-center space-y-1.5">
                      <div className="text-2xl">📷</div>
                      <p className="text-[11px] text-slate-500 px-4">{t('noPhotoYet')}</p>
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">{label}</h3>
                </div>
              </div>
              <div className="px-3.5 pb-3.5 flex items-center gap-2">
                <input
                  type="file"
                  id={`file-${c.id}`}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handlePhotoUploadForComponent(c.id, e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById(`file-${c.id}`).click()}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    src ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {src ? t('replaceBtn') : t('uploadBtn')}
                </button>
                {src && (
                  <button
                    onClick={() => openLightbox(src, `#${c.num} — ${label}`)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    🔍
                  </button>
                )}
                {src && (
                  <button
                    onClick={() => requestRemovePhoto(c.id)}
                    className="px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-xs font-bold text-rose-300 border border-rose-500/30"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}