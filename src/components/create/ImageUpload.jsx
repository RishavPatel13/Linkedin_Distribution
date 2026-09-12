import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageUpload = ({ image, onImageChange, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target.result);
      toast.success('Image attached successfully.');
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

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        Attach Media (Optional)
      </label>

      {image ? (
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 group">
          <div className="max-h-56 overflow-hidden rounded-lg flex items-center justify-center bg-slate-100">
            <img
              src={image}
              alt="Uploaded preview"
              className="w-full h-auto max-h-56 object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors shadow-md"
            title="Remove image"
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
            accept="image/png, image/jpeg, image/webp"
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
            <p className="text-[11px] text-slate-400">PNG, JPG or WebP up to 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
