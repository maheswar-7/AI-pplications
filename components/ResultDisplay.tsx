
import React from 'react';

interface ResultDisplayProps {
  generatedImage: string;
  originalFileName: string;
  onClear: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, originalFileName, onClear }) => {
  const imageUrl = `data:image/png;base64,${generatedImage}`;
  
  const getDownloadFileName = () => {
    const name = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    const extension = 'png'; // Output is always png from the model
    return `${name}-generated.${extension}`;
  }

  return (
    <div className="w-full p-4 bg-gray-800 rounded-lg flex flex-col items-center gap-4 animate-fade-in">
        <h3 className="text-xl font-semibold text-gray-200">Generation Complete!</h3>
        <img src={imageUrl} alt="Generated result" className="max-w-full max-h-[60vh] rounded-md shadow-lg" />
        <div className="flex gap-4 mt-2">
            <a
                href={imageUrl}
                download={getDownloadFileName()}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                Download Image
            </a>
            <button
                onClick={onClear}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
                Create Another
            </button>
        </div>
    </div>
  );
};

export default ResultDisplay;
