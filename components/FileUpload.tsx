
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (content: string, name: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileSelect(text, file.name);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .txt file.');
    }
  }, [onFileSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const labelClass = `flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'}`;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full"
    >
      <label htmlFor="dropzone-file" className={labelClass}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-4 text-slate-400" />
          <p className="mb-2 text-sm text-slate-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">Plain Text File (.txt)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default FileUpload;
