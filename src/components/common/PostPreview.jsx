import React from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe, Building2, User, MoreHorizontal, Sparkles, FileText } from 'lucide-react';

export const PostPreview = ({
  author,
  text,
  image,
  companyName,
  subtitle,
  isReshare = false,
  commentary = '',
}) => {
  const displayAuthor = author || companyName || 'LinkedIn Member';
  const displaySubtitle = subtitle || (companyName ? 'Company Page • 12,450 followers' : 'Executive & Tech Contributor');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto">
      {/* Top Banner Tag */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#0077B5]" />
          <span>LinkedIn Feed Live Preview</span>
        </span>
        <span className="text-[11px] text-slate-400">Preview Mode</span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Optional Commentary if Reshare */}
        {isReshare && commentary && (
          <div className="pb-3 border-b border-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs">
                {companyName ? companyName[0] : 'U'}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  {companyName || 'Your Account'}
                </div>
                <div className="text-[11px] text-slate-400">Reshared with thoughts • Just now</div>
              </div>
            </div>
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {commentary}
            </p>
          </div>
        )}

        {/* Post Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#0077B5] to-sky-400 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {companyName ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-900 leading-tight hover:underline cursor-pointer">
                  {displayAuthor}
                </span>
                <span className="text-xs text-slate-400">• 1st</span>
              </div>
              <div className="text-xs text-slate-500 leading-tight mt-0.5">
                {displaySubtitle}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content Body */}
        <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
          {text || <span className="text-slate-400 italic">Post content will preview here...</span>}
        </div>

        {/* Post Media (Image or Document) */}
        {image && (() => {
          const previewSrc = typeof image === 'string' ? image : image?.dataUrl;
          const isPdf = typeof image === 'object' ? Boolean(image?.isPdf || image?.mimeType === 'application/pdf') : false;
          const fileName = typeof image === 'object' ? image?.filename : 'Attached media';
          const fileSizeKb = typeof image === 'object' && image?.fileSize ? Math.round(image.fileSize / 1024) : null;

          if (isPdf) {
            return (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 truncate">{fileName}</div>
                  <div className="text-xs text-slate-500">
                    LinkedIn Document (PDF){fileSizeKb ? ` • ${fileSizeKb} KB` : ''}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-96 flex items-center justify-center">
              <img
                src={previewSrc}
                alt={fileName}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          );
        })()}

        {/* Reactions Counter Bar */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">👍</span>
              <span className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-[9px] text-white">❤️</span>
              <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[9px] text-white">💡</span>
            </div>
            <span>48 reactions</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>12 comments</span>
            <span>•</span>
            <span>6 reposts</span>
          </div>
        </div>

        {/* LinkedIn Bottom Action Bar */}
        <div className="pt-1 border-t border-slate-100 grid grid-cols-4 gap-1 text-slate-600 text-xs font-semibold">
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-50 rounded-md transition-colors text-slate-600 hover:text-[#0077B5]">
            <ThumbsUp className="w-4 h-4" />
            <span className="hidden sm:inline">Like</span>
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-50 rounded-md transition-colors text-slate-600">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comment</span>
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-50 rounded-md transition-colors text-slate-600">
            <Repeat2 className="w-4 h-4" />
            <span className="hidden sm:inline">Repost</span>
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-50 rounded-md transition-colors text-slate-600">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
