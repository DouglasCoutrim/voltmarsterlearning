import React from 'react';

export default function ConfirmModal({ confirmModal, closeConfirmModal, t }) {
  if (!confirmModal.open) return null;

  return (
    <div
      id="confirm-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <h3 id="confirm-title" className="text-lg font-bold text-white mb-2">
          {confirmModal.title}
        </h3>
        <p id="confirm-message" className="text-sm text-slate-300 mb-6">
          {confirmModal.message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            id="confirm-cancel"
            onClick={closeConfirmModal}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold"
          >
            {t('cancel')}
          </button>
          <button
            id="confirm-ok"
            onClick={() => {
              if (confirmModal.onConfirm) confirmModal.onConfirm();
              closeConfirmModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}