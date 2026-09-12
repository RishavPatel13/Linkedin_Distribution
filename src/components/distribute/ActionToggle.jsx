import React from 'react';
import { Repeat2, Copy, Sparkles, HelpCircle } from 'lucide-react';

export const ActionToggle = ({ action, onActionChange, disabled = false }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Distribution Method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Reshare Option */}
        <label
          className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
            action === 'reshare'
              ? 'border-[#0077B5] bg-sky-50/50 ring-1 ring-[#0077B5]'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="distributionAction"
            value="reshare"
            checked={action === 'reshare'}
            disabled={disabled}
            onChange={() => onActionChange('reshare')}
            className="mt-1 h-4 w-4 text-[#0077B5] border-slate-300 focus:ring-[#0077B5]"
          />
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <Repeat2 className="w-4 h-4 text-[#0077B5]" />
              <span>Reshare (Native Repost)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Maintains the original post authorship ("Reposted by your company"). Ideal for amplifying partner or executive content with optional added commentary.
            </p>
          </div>
        </label>

        {/* Copy as New Post Option */}
        <label
          className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
            action === 'copy'
              ? 'border-[#0077B5] bg-sky-50/50 ring-1 ring-[#0077B5]'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="distributionAction"
            value="copy"
            checked={action === 'copy'}
            disabled={disabled}
            onChange={() => onActionChange('copy')}
            className="mt-1 h-4 w-4 text-[#0077B5] border-slate-300 focus:ring-[#0077B5]"
          />
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <Copy className="w-4 h-4 text-emerald-600" />
              <span>Copy as New Post</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Extracts the text content into an editable draft to publish as your own 100% original post across selected targets.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ActionToggle;
