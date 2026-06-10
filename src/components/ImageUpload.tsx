import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  onClear?: () => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, onClear, label, className = "" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG, WEBP, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const rawBase64 = reader.result;
        
        // Compress the image using HTML5 Canvas
        const img = new Image();
        img.src = rawBase64;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG format with 0.7 quality factor
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
            onChange(compressedBase64);
          } else {
            onChange(rawBase64);
          }
        };
        img.onerror = () => {
          onChange(rawBase64);
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">{label}</label>}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {value ? (
        <div className="relative group border border-slate-200 bg-slate-50 p-2 flex items-center space-x-3.5">
          <div className="h-16 w-16 overflow-hidden border border-slate-100 bg-white flex items-center justify-center shrink-0">
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-500 truncate font-mono">Image size: {Math.round((value.length * 3) / 4 / 1024)} KB</p>
            <div className="flex space-x-2 mt-1.5">
              <button
                type="button"
                onClick={triggerSelect}
                className="text-[9px] font-sans font-bold uppercase tracking-wider text-navy hover:text-gold transition-colors"
              >
                Replace
              </button>
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-[9px] font-sans font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`border border-dashed p-5 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center space-y-2 ${
            isDragging
              ? "border-gold bg-gold/5"
              : "border-slate-200 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-300"
          }`}
        >
          <div className="p-2 bg-white rounded-full shadow-sm text-slate-400">
            <Upload className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-dark font-sans">
              Drag & drop image here or <span className="text-navy hover:text-gold">Browse Files</span>
            </p>
            <p className="text-[10px] text-slate-400 font-sans tracking-wide mt-0.5">
              Strictly local file storage. Limit: 1.5MB. PNG, JPEG, or WEBP.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
