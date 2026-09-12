import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export const CharCounter = ({
  text = '',
  pageLimit = 3000,
  groupLimit = 1300,
}) => {
  const count = text.length;

  const getStatus = (current, limit) => {
    const ratio = current / limit;
    if (ratio > 1) {
      return {
        color: 'text-red-600 font-semibold',
        badgeBg: 'bg-red-50 text-red-700 border-red-200',
        icon: '❌',
        status: 'danger',
      };
    }
    if (ratio >= 0.8) {
      return {
        color: 'text-amber-600 font-medium',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: '⚠️',
        status: 'warning',
      };
    }
    return {
      color: 'text-emerald-600 font-medium',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '✅',
      status: 'safe',
    };
  };

  const pageStatus = getStatus(count, pageLimit);
  const groupStatus = getStatus(count, groupLimit);

  const isGroupExceeded = count > groupLimit;
  const isPageExceeded = count > pageLimit;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          {/* Pages limit indicator */}
          <div className="flex items-center gap-1.5 transition-colors duration-200">
            <span className="text-slate-500 font-medium">Pages limit:</span>
            <span className={pageStatus.color}>
              {count} / {pageLimit}
            </span>
            <span className="text-xs">{pageStatus.icon}</span>
          </div>

          <span className="text-slate-300">|</span>

          {/* Groups limit indicator */}
          <div className="flex items-center gap-1.5 transition-colors duration-200">
            <span className="text-slate-500 font-medium">Groups limit:</span>
            <span className={groupStatus.color}>
              {count} / {groupLimit}
            </span>
            <span className="text-xs">{groupStatus.icon}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          LinkedIn counts unicode characters & newlines
        </div>
      </div>

      {/* Warning callout for group limit overflow */}
      {isGroupExceeded && !isPageExceeded && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Warning:</strong> Content exceeds group character limit ({groupLimit}). It will be automatically trimmed for group submissions while publishing in full to company pages.
          </span>
        </div>
      )}

      {/* Error callout if page limit is exceeded */}
      {isPageExceeded && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>
            <strong>Attention:</strong> Content exceeds maximum LinkedIn post limit ({pageLimit} characters). Please shorten your post to avoid publication rejection.
          </span>
        </div>
      )}
    </div>
  );
};

export default CharCounter;
