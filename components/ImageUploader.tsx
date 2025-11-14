
import React, { useState, useCallback, useRef } from 'react';
import { UploadedFile } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ImageUploaderProps {
  onFileUpload: (file: UploadedFile) => void;
  onFileRemove: () => void;
  title: string;
  description: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileUpload, onFileRemove, title, description }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        onFileUpload({ base64, mimeType, name: file.name });
        setPreview(URL.createObjectURL(file));
        setFileName(file.name);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process file.");
      }
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        try {
            const { base64, mimeType } = await fileToBase64(file);
            onFileUpload({ base64, mimeType, name: file.name });
            setPreview(URL.createObjectURL(file));
            setFileName(file.name);
        } catch (error) {
            console.error("Error processing file:", error);
            alert("Failed to process file.");
        }
    }
  }, [onFileUpload]);

  const handleRemoveImage = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    onFileRemove();
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="text-center p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md shadow-lg" />
          <p className="mt-2 text-sm text-gray-400 truncate">{fileName}</p>
          <button onClick={handleRemoveImage} className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            Remove Image
          </button>
        </div>
      ) : (
        <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">{title}</span> or drag and drop</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
