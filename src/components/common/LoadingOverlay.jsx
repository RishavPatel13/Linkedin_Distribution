import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Clock, CheckCircle2, Radio } from 'lucide-react';

export const LoadingOverlay = ({
  isOpen = false,
  title = 'Publishing in Progress...',
  subtitle = 'Sequential distribution with anti-detection pacing',
  progress = {},
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { currentTarget, completedCount = 0, totalCount = 0, statusText } = progress;
  const percentage = totalCount > 0 ? Math.min(Math.round(((completedCount + 0.5) / totalCount) * 100), 95) : 35;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-6 relative overflow-hidden">
        {/* Animated Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0077B5] to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Center Spinner Icon */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 animate-pulse" />
          <Loader2 className="w-10 h-10 text-[#0077B5] animate-spin" />
        </div>

        {/* Text Header */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Status Callout Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Distribution Status:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#0077B5]">
              <Radio className="w-3 h-3 animate-pulse text-emerald-500" />
              Active
            </span>
          </div>

          {statusText ? (
            <div className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
              {statusText}
            </div>
          ) : currentTarget ? (
            <div className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
              Posting to: <span className="text-[#0077B5]">{currentTarget}</span>
            </div>
          ) : null}

          {/* Timing Note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Elapsed: <strong className="text-slate-700 font-semibold">{elapsedSeconds}s</strong>{' '}
              (Typical response window: 30–90+ seconds | Safe timeout: 3 mins)
            </span>
          </div>
        </div>

        {/* LinkedIn Safe Pacing Notice */}
        <div className="flex items-start gap-2 text-left p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Human Pacing Active:</strong> The backend is publishing with randomized 10–30s
            cooldown delays to strictly abide by LinkedIn rate limits and protect your accounts.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
