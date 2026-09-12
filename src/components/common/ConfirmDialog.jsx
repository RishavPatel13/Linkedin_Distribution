import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen = false,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDanger ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-[#0077B5]'
            }`}
          >
            {isDanger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors shadow-sm ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#0077B5] hover:bg-[#005f8d]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
