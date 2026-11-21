import React from 'react';

export default function LightboxModal({ lightbox, closeLightbox }) {
  if (!lightbox.open) return null;

  return (
    <div
      id="lightbox-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target.id === 'lightbox-modal') closeLightbox();
      }}
    >
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h3 id="lightbox-title" className="text-sm sm:text-base font-bold text-white truncate">
            {lightbox.title}
          </h3>
          <button
            id="lightbox-close"
            onClick={closeLightbox}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
          >
            ✕
          </button>
        </div>
        <div className="p-4 flex items-center justify-center bg-black/50 max-h-[75vh] overflow-auto">
          <img
            id="lightbox-img"
            src={lightbox.src}
            alt={lightbox.title}
            className="max-w-full max-h-[68vh] rounded-xl object-contain"
          />
        </div>
      </div>
    </div>
  );
}