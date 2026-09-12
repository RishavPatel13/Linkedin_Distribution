import React from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, KeyRound, Info, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConnectionStatus = () => {
  const { connectionStatus, connectionError, lastTested, isTestingConnection, testLinkedInConnection } = useApp();

  const formattedDate = lastTested
    ? new Date(lastTested).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    : 'Not tested yet';

  const isConnected = connectionStatus === 'active';

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">LinkedIn Backend Connection Health</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify whether n8n backend cookies are authenticated and authorized to broadcast updates.
        </p>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {isConnected ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  {isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      isConnected ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  ></span>
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {isConnected ? 'LinkedIn Connection Active' : 'LinkedIn Connection Inactive or Expired'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Last checked: <span className="font-semibold text-slate-700">{formattedDate}</span>
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isConnected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isConnected ? 'Healthy' : 'Needs Attention'}
          </span>
        </div>

        {/* Error Diagnostic Box when connection is inactive */}
        {!isConnected && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-900 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Diagnostic: LinkedIn Session Rejected</span>
            </div>
            {connectionError ? (
              <div className="p-2.5 rounded-lg bg-white/90 border border-red-200 font-mono text-[11px] text-red-700 break-words">
                Backend error: {connectionError}
              </div>
            ) : (
              <p className="text-red-700">
                LinkedIn rejected the connection test because the session cookies (<code>li_at</code> and <code>JSESSIONID</code>) are either missing or failed LinkedIn's CSRF security check.
              </p>
            )}
            <p className="text-red-800 leading-relaxed">
              <strong>Action required:</strong> In your n8n workflow, update both the <code>li_at</code> and <code>JSESSIONID</code> cookies from an active LinkedIn browser session, and verify the workflow is switched to <strong>Active</strong>.
            </p>
          </div>
        )}

        {/* Informational Guidance Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Info className="w-4 h-4 text-[#0077B5]" />
            <span>n8n Webhook & Cookie Configuration</span>
          </div>

          <div className="space-y-1.5 leading-relaxed">
            <p>
              Current Base URL: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">{import.meta.env.VITE_API_BASE || 'https://n8n.gcbservicesit.com/webhook'}</code>
            </p>
            <p>
              <strong>Production vs Test Webhook:</strong> The production <code className="text-slate-800 font-mono">/webhook</code> endpoint functions once the workflow is toggled <strong>Activated</strong> in n8n. The <code className="text-slate-800 font-mono">/webhook-test</code> path is single-use and only listens while "Execute workflow" is active in the n8n editor.
            </p>
            <p className="text-slate-500">
              LinkedIn session cookies (<code>li_at</code>, <code>JSESSIONID</code>) are encrypted and managed directly in n8n. Request timeout is set to 3 minutes to accommodate human-mimicking delay intervals.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-slate-400">
            Executes a read test against the n8n webhook
          </div>

          <button
            type="button"
            onClick={testLinkedInConnection}
            disabled={isTestingConnection}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0077B5] hover:bg-[#005f8d] disabled:opacity-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
            <span>{isTestingConnection ? 'Testing Connection...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
