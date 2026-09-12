import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProgressToast = ({ currentTarget, index, total, isComplete = false }) => {
  return (
    <div className="flex items-center gap-3 py-1">
      {isComplete ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <Loader2 className="w-4 h-4 text-[#0077B5] animate-spin shrink-0" />
      )}
      <div className="text-xs">
        <span className="font-semibold text-slate-800">
          {isComplete ? 'Published to ' : 'Posting to '}
          {currentTarget}
        </span>
        {total > 1 && (
          <span className="text-slate-400 ml-1">
            ({index} of {total})
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressToast;
