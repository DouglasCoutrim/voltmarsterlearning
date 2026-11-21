import React from 'react';

export default function ToastContainer({ toasts }) {
  return (
    <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[92vw] sm:w-auto pointer-events-none">
      {toasts.map((toast) => {
        const colors =
          toast.tone === 'rose'
            ? 'bg-rose-950/95 border-rose-500/50 text-rose-100'
            : toast.tone === 'amber'
            ? 'bg-amber-950/95 border-amber-500/50 text-amber-100'
            : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl border shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${colors}`}
          >
            {toast.msg}
          </div>
        );
      })}
    </div>
  );
}