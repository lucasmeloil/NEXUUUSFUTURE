
import React, { useState, useCallback, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import type { HistoryItem } from '../types';
import { UploadIcon, SparklesIcon, AlertTriangleIcon, WandIcon, DownloadIcon } from './Icons';
import { presetPrompts } from '../data/presets';
import { ImageModal } from './ImageModal';


interface ImageEditorProps {
  onGenerate: (item: HistoryItem) => void;
}

const placeholderPrompt = `Descreva o estilo que você deseja ou escolha uma inspiração abaixo...`;

export const ImageEditor: React.FC<ImageEditorProps> = ({ onGenerate }) => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null | undefined) => {
    if (!file) {
        return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini Flash
      setError("Image size should be less than 4MB.");
      return;
    }
    setError(null);
    setOriginalImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileSelect(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImageUrl(null);

    try {
      const resultUrl = await editImageWithGemini(prompt, originalImageFile);
      setGeneratedImageUrl(resultUrl);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        originalImage: originalImageUrl!,
        prompt: prompt,
        generatedImage: resultUrl,
        timestamp: new Date().toLocaleString()
      };
      onGenerate(newHistoryItem);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, originalImageUrl, prompt, onGenerate]);
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  return (
    <>
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 space-y-4">
        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">
            <span className="font-semibold text-purple-400">Clique para enviar</span> ou arraste e solte
          </p>
          <p className="text-xs text-gray-500">PNG, JPG até 4MB</p>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholderPrompt}
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
        />

        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <WandIcon className="w-5 h-5 text-purple-400"/>
                Inspiração de Prompts
            </h3>
            <div className="max-h-36 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-2">
                {presetPrompts.map((p, index) => (
                    <button 
                        key={index}
                        onClick={() => setPrompt(p)}
                        className="text-left text-xs bg-gray-700/50 p-2 rounded-md hover:bg-purple-500/20 border border-gray-600 hover:border-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                        title={p}
                    >
                       {p.split('.')[0]}
                    </button>
                ))}
            </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !originalImageFile || !prompt}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Gerar
            </>
          )}
        </button>
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md flex items-center gap-3">
               <AlertTriangleIcon className="w-5 h-5"/>
               <span className="text-sm">{error}</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">Original</h3>
            <div className="aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
                {originalImageUrl ? (
                    <img src={originalImageUrl} alt="Original" className="object-contain w-full h-full" />
                ) : (
                    <p className="text-gray-500">Envie uma imagem para vê-la aqui</p>
                )}
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-300">Gerada</h3>
                {generatedImageUrl && (
                     <a
                        href={generatedImageUrl}
                        download={`nexus-future-${Date.now()}.png`}
                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        aria-label="Download generated image"
                     >
                        <DownloadIcon className="w-5 h-5"/>
                        Baixar
                    </a>
                )}
            </div>
            <div className="aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden relative">
                {isLoading && <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-purple-400 border-gray-600 rounded-full animate-spin"></div></div>}
                {generatedImageUrl ? (
                    <button onClick={() => setIsModalOpen(true)} className="w-full h-full">
                        <img src={generatedImageUrl} alt="Generated" className="object-contain w-full h-full" />
                    </button>
                ) : (
                    <p className="text-gray-500">Sua imagem gerada aparecerá aqui</p>
                )}
            </div>
        </div>
      </div>
    </div>
    {isModalOpen && generatedImageUrl && (
        <ImageModal 
            imageUrl={generatedImageUrl} 
            prompt={prompt} 
            onClose={() => setIsModalOpen(false)} 
        />
    )}
    </>
  );
};
