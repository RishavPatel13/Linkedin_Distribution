import React from 'react';
import { Building2, Users, CheckSquare, Square, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const TargetSelector = ({
  selectedPages = [],
  selectedGroups = [],
  onPagesChange,
  onGroupsChange,
  disabled = false,
}) => {
  const { pages, groups } = useApp();

  const handleTogglePage = (pageId) => {
    if (disabled) return;
    if (selectedPages.includes(pageId)) {
      onPagesChange(selectedPages.filter((id) => id !== pageId));
    } else {
      onPagesChange([...selectedPages, pageId]);
    }
  };

  const handleToggleGroup = (groupId) => {
    if (disabled) return;
    if (selectedGroups.includes(groupId)) {
      onGroupsChange(selectedGroups.filter((id) => id !== groupId));
    } else {
      onGroupsChange([...selectedGroups, groupId]);
    }
  };

  const handleSelectAllPages = () => {
    if (disabled) return;
    if (selectedPages.length === pages.length) {
      onPagesChange([]);
    } else {
      onPagesChange(pages.map((p) => p.companyId || p.id));
    }
  };

  const handleSelectAllGroups = () => {
    if (disabled) return;
    if (selectedGroups.length === groups.length) {
      onGroupsChange([]);
    } else {
      onGroupsChange(groups.map((g) => g.groupId || g.id));
    }
  };

  const totalSelected = selectedPages.length + selectedGroups.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Select Publishing Targets</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose company pages and industry groups to distribute your post.
          </p>
        </div>
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          <span className="font-semibold text-[#0077B5] mr-1">{totalSelected}</span> targets selected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Pages Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Building2 className="w-4 h-4 text-[#0077B5]" />
              <span>Company Pages</span>
              <span className="text-xs text-slate-400 font-normal">
                ({selectedPages.length} of {pages.length})
              </span>
            </div>
            {pages.length > 0 && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleSelectAllPages}
                className="text-xs font-medium text-[#0077B5] hover:text-[#005f8d] disabled:opacity-50"
              >
                {selectedPages.length === pages.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {pages.length === 0 ? (
            <div className="p-4 rounded-lg border border-dashed border-slate-200 text-center bg-slate-50">
              <p className="text-xs text-slate-500 mb-2">No company pages configured yet.</p>
              <Link
                to="/settings/pages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B5] hover:underline"
              >
                Add Page in Settings <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {pages.map((page) => {
                const pageKey = page.companyId || page.id;
                const isSelected = selectedPages.includes(pageKey);
                return (
                  <label
                    key={page.id || pageKey}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0077B5] bg-sky-50/40 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => handleTogglePage(pageKey)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0077B5] focus:ring-[#0077B5]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{page.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        ID: {page.companyId || page.id}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Groups Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>LinkedIn Groups</span>
              <span className="text-xs text-slate-400 font-normal">
                ({selectedGroups.length} of {groups.length})
              </span>
            </div>
            {groups.length > 0 && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleSelectAllGroups}
                className="text-xs font-medium text-[#0077B5] hover:text-[#005f8d] disabled:opacity-50"
              >
                {selectedGroups.length === groups.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div className="p-4 rounded-lg border border-dashed border-slate-200 text-center bg-slate-50">
              <p className="text-xs text-slate-500 mb-2">No groups configured yet.</p>
              <Link
                to="/settings/groups"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B5] hover:underline"
              >
                Add Group in Settings <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {groups.map((group) => {
                const groupKey = group.groupId || group.id;
                const isSelected = selectedGroups.includes(groupKey);
                return (
                  <label
                    key={group.id || groupKey}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => handleToggleGroup(groupKey)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{group.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        ID: {group.groupId || group.id}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetSelector;
