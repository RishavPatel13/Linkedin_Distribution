import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Users,
  ExternalLink,
  X,
  Share2,
} from 'lucide-react';

export const ResultsPopup = ({
  isOpen,
  onClose,
  results = [],
  title = 'Publishing Results',
  onResetForm,
}) => {
  if (!isOpen) return null;

  const successResults = results.filter(
    (r) => r.status === 200 || r.status === 'success' || r.status === '200'
  );
  const totalCount = results.length;
  const successCount = successResults.length;
  const isAllSuccess = totalCount > 0 && successCount === totalCount;
  const isPartial = successCount > 0 && successCount < totalCount;

  const handleDone = () => {
    if (onResetForm) {
      onResetForm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              isAllSuccess ? 'bg-emerald-100 text-emerald-700' : isPartial ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">Distribution execution summary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {results.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No results recorded.</p>
          ) : (
            results.map((item, index) => {
              const isSuccess = item.status === 200 || item.status === 'success' || item.status === '200';
              const isPage = item.type === 'page';

              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                    isSuccess
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : 'bg-red-50/40 border-red-200/80'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">
                      {isSuccess ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 truncate">
                        {isPage ? (
                          <Building2 className="w-3.5 h-3.5 text-[#0077B5] shrink-0" />
                        ) : (
                          <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">{item.target}</span>
                      </div>
                      <div className="text-xs mt-0.5 text-slate-600">
                        {isSuccess ? (
                          <span className="text-emerald-700 font-medium">
                            {item.message || 'Posted successfully'}
                          </span>
                        ) : (
                          <span className="text-red-700 font-medium">
                            {item.error || 'Submission failed'}
                          </span>
                        )}
                      </div>
                      {item.postUrn && (
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                          URN: {item.postUrn}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider shrink-0 ${
                      isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isSuccess ? 'Success' : 'Failed'}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-700">
            {successCount} of {totalCount} targets succeeded
            {isAllSuccess && ' 🎉'}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
            >
              <span>View on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleDone}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0077B5] hover:bg-[#005f8d] rounded-lg transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPopup;
