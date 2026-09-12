import React, { useRef, useEffect } from 'react';
import { RefreshCw, Trash2, Edit3, Sparkles } from 'lucide-react';
import CharCounter from '../common/CharCounter';
import GenerateButton from './GenerateButton';

export const ContentEditor = ({
  content,
  onContentChange,
  onRegenerate,
  onDiscard,
  isGenerating = false,
  disabled = false,
}) => {
  const textareaRef = useRef(null);

  // Auto-expand textarea height to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(220, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header with Title and Regenerate Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-50 text-[#0077B5]">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Post Copy Editor</h3>
            <p className="text-xs text-slate-500">
              Refine your copy below. Unicode formatting is preserved directly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GenerateButton
            onGenerate={onRegenerate}
            isLoading={isGenerating}
            isRegenerate={true}
            disabled={disabled}
            className="text-xs py-1.5 px-3"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          disabled={disabled}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write or review your post content here..."
          className="w-full min-h-[220px] p-4 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0077B5] rounded-xl text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0077B5]/20 transition-all font-sans resize-y"
        />
      </div>

      {/* Character Counters */}
      <div className="pt-1">
        <CharCounter text={content} pageLimit={3000} groupLimit={1300} />
      </div>

      {/* Discard Action */}
      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onDiscard}
          disabled={disabled || !content}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Discard Draft</span>
        </button>
      </div>
    </div>
  );
};

export default ContentEditor;
