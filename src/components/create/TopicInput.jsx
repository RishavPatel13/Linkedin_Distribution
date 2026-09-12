import React from 'react';
import { Building2, Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopicInput = ({
  company,
  onCompanyChange,
  topic,
  onTopicChange,
  notes = '',
  onNotesChange,
  tone,
  onToneChange,
  disabled = false,
}) => {
  const { pages } = useApp();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Company Page <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={company}
              disabled={disabled || pages.length === 0}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] disabled:bg-slate-100 disabled:opacity-75 transition-colors appearance-none cursor-pointer"
            >
              {pages.length === 0 ? (
                <option value="">No company pages found</option>
              ) : (
                pages.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.companyId || p.id})
                  </option>
                ))
              )}
            </select>
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <div className="absolute right-3 top-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-500 w-0 h-0" />
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Voice & Tone
          </label>
          <select
            value={tone}
            disabled={disabled}
            onChange={(e) => onToneChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] disabled:bg-slate-100 transition-colors cursor-pointer"
          >
            <option value="professional">Professional & Authoritative</option>
            <option value="thought-leadership">Thought Leadership & Visionary</option>
            <option value="storytelling">Narrative / Storytelling</option>
            <option value="concise">Direct & Punchy</option>
          </select>
        </div>
      </div>

      {/* Topic / Prompt */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Topic / Post Prompt <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={topic}
            disabled={disabled}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. Why mid-market tech companies are undervalued in today's M&A market"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] disabled:bg-slate-100 transition-colors shadow-sm"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Be specific about the core angle, key statistics, or audience takeaway you want highlighted.
        </p>
      </div>

      {/* Additional Context / Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Additional Context / Notes (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={notes}
            disabled={disabled}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="e.g. Mention 20-40% valuation gap, focus on organic distribution vs cold outreach"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] disabled:bg-slate-100 transition-colors shadow-sm"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Passed to LangGraph + GPT-4.1 to guide nuance and formatting.
        </p>
      </div>
    </div>
  );
};

export default TopicInput;
