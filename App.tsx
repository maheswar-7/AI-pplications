
import React, { useState, useCallback } from 'react';
import { AppTab, Product, UploadedFile } from './types';
import { PRODUCTS } from './constants';
import { generateImageWithPrompt } from './services/geminiService';

import Header from './components/Header';
import TabSwitcher from './components/TabSwitcher';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MOCKUP);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadedLogo, setUploadedLogo] = useState<UploadedFile | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [imageToEdit, setImageToEdit] = useState<UploadedFile | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGeneration = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let base64Image: string | undefined;
      let mimeType: string | undefined;
      let prompt: string | undefined;
      
      if (activeTab === AppTab.MOCKUP && uploadedLogo && selectedProduct) {
        base64Image = uploadedLogo.base64;
        mimeType = uploadedLogo.mimeType;
        prompt = `Generate a realistic, high-quality product mockup of ${selectedProduct.description} with this logo prominently and realistically placed on it. The logo should look natural on the product's material.`;
      } else if (activeTab === AppTab.EDITOR && imageToEdit && editPrompt) {
        base64Image = imageToEdit.base64;
        mimeType = imageToEdit.mimeType;
        prompt = editPrompt;
      } else {
        throw new Error("Missing required information for generation.");
      }

      if (base64Image && mimeType && prompt) {
        const result = await generateImageWithPrompt(base64Image, mimeType, prompt);
        setGeneratedImage(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, uploadedLogo, selectedProduct, imageToEdit, editPrompt]);
  
  const clearState = () => {
    setUploadedLogo(null);
    setSelectedProduct(null);
    setImageToEdit(null);
    setEditPrompt('');
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  }

  const handleTabChange = (tab: AppTab) => {
    clearState();
    setActiveTab(tab);
  };
  
  const renderMockupGenerator = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-200 mb-2">1. Upload Your Logo</h3>
        <ImageUploader 
          onFileUpload={setUploadedLogo} 
          onFileRemove={() => setUploadedLogo(null)}
          title="Click to upload logo" 
          description="PNG, JPG, WEBP (max 4MB)"
        />
      </div>
      
      {uploadedLogo && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium text-gray-200 mb-2">2. Select a Product</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRODUCTS.map(product => (
              <button 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`p-2 border-2 rounded-lg transition-all duration-200 ${selectedProduct?.id === product.id ? 'border-indigo-500 bg-indigo-900/50 ring-2 ring-indigo-500' : 'border-gray-700 hover:border-indigo-600 bg-gray-800'}`}
              >
                <img src={product.thumbnail} alt={product.name} className="w-full h-auto object-cover rounded-md aspect-square" />
                <p className="mt-2 text-sm font-medium text-center text-gray-300">{product.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          onClick={handleGeneration}
          disabled={!uploadedLogo || !selectedProduct || isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? 'Generating...' : '✨ Generate Mockup'}
        </button>
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">1. Upload Image to Edit</h3>
            <ImageUploader 
              onFileUpload={setImageToEdit} 
              onFileRemove={() => setImageToEdit(null)}
              title="Click to upload image" 
              description="PNG, JPG, WEBP (max 4MB)"
            />
        </div>
        
        {imageToEdit && (
            <div className="animate-fade-in">
                <h3 className="text-lg font-medium text-gray-200 mb-2">2. Describe Your Edit</h3>
                <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g., 'Add a retro filter', 'Remove the person in the background', 'Make the sky look like a sunset'"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    rows={3}
                />
            </div>
        )}

        <div className="pt-4">
            <button 
              onClick={handleGeneration}
              disabled={!imageToEdit || !editPrompt.trim() || isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? 'Editing...' : '🪄 Apply Edit'}
            </button>
        </div>
    </div>
  );
  
  const getOriginalFileName = () => {
    if (activeTab === AppTab.MOCKUP && uploadedLogo) return uploadedLogo.name;
    if (activeTab === AppTab.EDITOR && imageToEdit) return imageToEdit.name;
    return 'generated-image.png';
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
            <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
                {activeTab === AppTab.MOCKUP ? renderMockupGenerator() : renderImageEditor()}
            </div>
            
            <div className="relative w-full aspect-square lg:aspect-auto lg:min-h-[500px] bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 flex items-center justify-center p-4">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <div className="text-center text-red-400 p-4">
                        <h3 className="text-lg font-bold">An Error Occurred</h3>
                        <p className="text-sm mt-1">{error}</p>
                        <button onClick={clearState} className="mt-4 px-4 py-2 bg-red-500/20 text-red-300 rounded-md text-sm hover:bg-red-500/40">Try Again</button>
                    </div>
                ) : generatedImage ? (
                    <ResultDisplay 
                      generatedImage={generatedImage} 
                      originalFileName={getOriginalFileName()}
                      onClear={clearState}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-300">Your masterpiece awaits</h3>
                        <p className="mt-1">Generated images will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        <footer className="text-center py-8 text-gray-500 text-sm">
            <p>Powered by Gemini 2.5 Flash Image. Created for you.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
