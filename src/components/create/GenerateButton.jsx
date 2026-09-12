import React from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

export const GenerateButton = ({
  onGenerate,
  isLoading = false,
  isRegenerate = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
        isRegenerate
          ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50'
          : 'bg-[#0077B5] hover:bg-[#005f8d] text-white disabled:bg-slate-300 disabled:cursor-not-allowed shadow-[#0077B5]/20'
      } ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{isRegenerate ? 'Regenerating...' : 'Generating via LangGraph AI...'}</span>
        </>
      ) : isRegenerate ? (
        <>
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Regenerate Content</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>Generate Content</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;
