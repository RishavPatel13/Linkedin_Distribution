import React from 'react';
import { MessageSquareText } from 'lucide-react';

export const Commentary = ({
  commentary,
  onCommentaryChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
          <MessageSquareText className="w-3.5 h-3.5 text-[#0077B5]" />
          <span>Add your commentary (Optional)</span>
        </label>
        <span className="text-[11px] text-slate-400">
          {commentary.length} characters
        </span>
      </div>

      <textarea
        value={commentary}
        disabled={disabled}
        onChange={(e) => onCommentaryChange(e.target.value)}
        placeholder="Great insights on tech M&A trends and EBITDA multiples in 2026. Here is our perspective..."
        rows={3}
        className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-[#0077B5] disabled:bg-slate-100 transition-colors shadow-sm resize-y"
      />
      <p className="text-[11px] text-slate-400">
        This commentary will appear above the reshared LinkedIn card.
      </p>
    </div>
  );
};

export default Commentary;
