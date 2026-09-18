import React, { useState } from 'react';
import { Users, Plus, Trash2, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGroups } from '../../hooks/useGroups';
import { extractGroupId, isValidGroupUrl } from '../../utils/linkedin';
import ConfirmDialog from '../common/ConfirmDialog';

export const GroupsManager = () => {
  const { groups, isLoading, addGroup, deleteGroup, fetchGroups } = useGroups();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-extracted group ID
  const extractedId = extractGroupId(url);
  const isUrlValid = isValidGroupUrl(url);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a group name.');
      return;
    }
    if (!isUrlValid) {
      toast.error('Please enter a valid LinkedIn group URL containing linkedin.com/groups/ID');
      return;
    }

    setIsSubmitting(true);
    const success = await addGroup(name.trim(), url.trim(), extractedId);
    setIsSubmitting(false);

    if (success) {
      setName('');
      setUrl('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    await deleteGroup(groupToDelete.id);
    setGroupToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">LinkedIn Discussion Groups</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure niche professional groups where posts will be sequentially broadcasted.
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            const ok = await fetchGroups();
            if (ok) toast.success('Groups synced from Google Sheet.');
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh from Sheet</span>
        </button>
      </div>

      {/* Existing Groups List */}
      <div className="space-y-3">
        {groups.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-300 bg-white text-center">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No groups added yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first LinkedIn professional group below to start expanding your distribution reach.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {group.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {group.status || 'Active'}
                      </span>
                    </div>

                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 truncate mt-1"
                    >
                      <span className="truncate">{group.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>

                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Group ID: <span className="font-semibold text-slate-600">{group.groupId || group.id}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGroupToDelete(group)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Delete group"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Group Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Add New LinkedIn Group</h3>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Marketer Connection"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Group URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.linkedin.com/groups/4493185/"
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
                      Auto-detected Group ID: <strong>{extractedId}</strong>
                    </>
                  ) : (
                    'URL should follow: https://www.linkedin.com/groups/YOUR_GROUP_ID/'
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !isUrlValid}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding Group...' : '+ Add LinkedIn Group'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(groupToDelete)}
        title="Remove Group Target?"
        message={`Are you sure you want to remove "${groupToDelete?.name}" from your group targets?`}
        confirmLabel="Remove Group"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setGroupToDelete(null)}
      />
    </div>
  );
};

export default GroupsManager;
