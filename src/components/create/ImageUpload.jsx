import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageUpload = ({ image, onImageChange, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (file) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      toast.error('Please upload an image file (PNG, JPG, WebP) or PDF document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange({
        dataUrl: e.target.result,
        mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        filename: file.name || (isPdf ? 'document.pdf' : 'photo.jpg'),
        isPdf: isPdf,
        fileSize: file.size,
      });
      toast.success(`${isPdf ? 'Document' : 'Image'} attached successfully.`);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewSrc = typeof image === 'string' ? image : image?.dataUrl;
  const isPdf = typeof image === 'object' ? Boolean(image?.isPdf || image?.mimeType === 'application/pdf') : false;
  const fileName = typeof image === 'object' ? image?.filename : 'Attached media';
  const fileSizeKb = typeof image === 'object' && image?.fileSize ? Math.round(image.fileSize / 1024) : null;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        Attach Media (Image or PDF)
      </label>

      {image ? (
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 group">
          {isPdf ? (
            <div className="p-4 rounded-lg bg-sky-50/70 border border-sky-100 flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800 truncate">{fileName}</div>
                <div className="text-xs text-slate-500">
                  PDF Document {fileSizeKb ? `• ${fileSizeKb} KB` : ''}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-56 overflow-hidden rounded-lg flex items-center justify-center bg-slate-100">
              <img
                src={previewSrc}
                alt={fileName}
                className="w-full h-auto max-h-56 object-cover"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors shadow-md"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#0077B5] bg-sky-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, application/pdf"
            disabled={disabled}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFiles(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0077B5] flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#0077B5]">Click to upload</span>
              <span className="text-xs text-slate-500"> or drag and drop</span>
            </div>
            <p className="text-[11px] text-slate-400">PNG, JPG, WebP or PDF document up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
