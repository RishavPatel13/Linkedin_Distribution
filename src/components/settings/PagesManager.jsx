import React, { useState } from 'react';
import { Building2, Plus, Trash2, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePages } from '../../hooks/usePages';
import { extractCompanyId, isValidCompanyUrl } from '../../utils/linkedin';
import ConfirmDialog from '../common/ConfirmDialog';

export const PagesManager = () => {
  const { pages, isLoading, addPage, deletePage, fetchPages } = usePages();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [pageToDelete, setPageToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-extracted ID
  const extractedId = extractCompanyId(url);
  const isUrlValid = isValidCompanyUrl(url);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a company page name.');
      return;
    }
    if (!isUrlValid) {
      toast.error('Please enter a valid LinkedIn company URL containing linkedin.com/company/ID');
      return;
    }

    setIsSubmitting(true);
    const success = await addPage(name.trim(), url.trim(), extractedId);
    setIsSubmitting(false);

    if (success) {
      setName('');
      setUrl('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    await deletePage(pageToDelete.id);
    setPageToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">LinkedIn Company Pages</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization pages where original and reshare posts are published.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchPages()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Existing Pages List */}
      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-300 bg-white text-center">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No company pages added yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first LinkedIn company page using the form below to begin distributing content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#0077B5] flex items-center justify-center font-bold shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {page.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {page.status || 'Active'}
                      </span>
                    </div>

                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0077B5] truncate mt-1"
                    >
                      <span className="truncate">{page.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>

                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Company ID: <span className="font-semibold text-slate-600">{page.companyId || page.id}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPageToDelete(page)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Delete page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Page Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-sky-50 text-[#0077B5]">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Add New Company Page</h3>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Page Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. GTechIB or Kivocare"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Company URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.linkedin.com/company/103355214/"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] transition-colors"
              />
            </div>
          </div>

          {/* Auto-extracted confirmation box */}
          {url && (
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
              isUrlValid
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/60 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                {isUrlValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>
                  {isUrlValid ? (
                    <>
                      Auto-detected Company ID: <strong>{extractedId}</strong>
                    </>
                  ) : (
                    'URL should follow: https://www.linkedin.com/company/YOUR_COMPANY_ID/'
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !isUrlValid}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0077B5] hover:bg-[#005f8d] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-[#0077B5]/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding Page...' : '+ Add Company Page'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(pageToDelete)}
        title="Remove Company Page?"
        message={`Are you sure you want to remove "${pageToDelete?.name}" from your managed targets?`}
        confirmLabel="Remove Page"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPageToDelete(null)}
      />
    </div>
  );
};

export default PagesManager;
