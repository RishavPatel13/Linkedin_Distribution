import React, { useState } from 'react';
import { Link2, Search, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { isValidPostUrl } from '../../utils/linkedin';

export const UrlInput = ({
  url,
  onUrlChange,
  onLoadPreview,
  isLoading = false,
  disabled = false,
}) => {
  const isValid = isValidPostUrl(url);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onLoadPreview();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Paste LinkedIn Post URL <span className="text-red-500">*</span>
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            value={url}
            disabled={disabled || isLoading}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://www.linkedin.com/feed/update/urn:li:activity:7503860108951445504"
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] disabled:bg-slate-100 transition-colors shadow-sm"
          />
          <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />

          {url.trim() && (
            <div className="absolute right-3 top-3 pointer-events-none">
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!isValid || isLoading || disabled}
          onClick={onLoadPreview}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0077B5] hover:bg-[#005f8d] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Load Preview</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>Must contain <code>linkedin.com</code> and <code>urn:li:activity:</code></span>
        {url && !isValid && (
          <span className="text-amber-600 font-medium">Please enter a valid LinkedIn activity URL</span>
        )}
      </div>
    </form>
  );
};

export default UrlInput;
