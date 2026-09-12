import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  ExternalLink,
  Repeat2,
  PenSquare,
} from 'lucide-react';

export const ActivityItem = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    timestamp,
    mode = 'create',
    contentPreview = '',
    fullContent = '',
    targets = [],
    status = 'success',
    resolvedUrn,
  } = activity;

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    : 'Recently';

  const getStatusBadge = () => {
    if (status === 'success') {
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        label: 'Success',
      };
    }
    if (status === 'partial') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        label: 'Partial',
      };
    }
    return {
      icon: <XCircle className="w-5 h-5 text-red-600 shrink-0" />,
      badgeClass: 'bg-red-50 text-red-800 border-red-200',
      label: 'Failed',
    };
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all overflow-hidden">
      {/* Clickable Header Row */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3 select-none"
      >
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="mt-0.5">{statusInfo.icon}</div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {formattedDate}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {mode === 'reshare' ? (
                  <>
                    <Repeat2 className="w-3 h-3 text-[#0077B5]" />
                    Reshared
                  </>
                ) : (
                  <>
                    <PenSquare className="w-3 h-3 text-[#0077B5]" />
                    Original Post
                  </>
                )}
              </span>

              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
              >
                {statusInfo.label}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
              "{contentPreview || (fullContent ? fullContent.slice(0, 80) + '...' : 'LinkedIn publication')}"
            </p>

            {/* Target names pill list */}
            <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">→</span>
              {targets.length === 0 ? (
                <span>No targets specified</span>
              ) : (
                targets.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700 font-medium"
                  >
                    {t.type === 'page' ? (
                      <Building2 className="w-3 h-3 text-[#0077B5]" />
                    ) : (
                      <Users className="w-3 h-3 text-emerald-600" />
                    )}
                    <span>{t.name}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg shrink-0 mt-0.5"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-4 animate-in fade-in duration-200">
          {/* Full content */}
          <div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Post Content
            </div>
            <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {fullContent || contentPreview || 'No content available'}
            </div>
          </div>

          {/* Target Status Breakdown */}
          <div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Distribution Status
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {targets.map((target, idx) => {
                const isTargetSuccess = target.status === 'success' || target.status === 200;
                return (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isTargetSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 truncate">{target.name}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isTargetSuccess
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {target.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* URN if present */}
          {resolvedUrn && (
            <div className="text-[11px] text-slate-500 font-mono">
              Resolved URN: <span className="text-slate-800">{resolvedUrn}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
