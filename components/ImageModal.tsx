
import React from 'react';
import { XIcon } from './Icons';

interface ImageModalProps {
  imageUrl: string;
  prompt: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, prompt, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col p-4 border border-purple-500/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close image view"
        >
          <XIcon className="w-8 h-8" />
        </button>
        <div className="flex-grow overflow-auto">
          <img src={imageUrl} alt={prompt} className="w-full h-auto object-contain rounded-md" />
        </div>
        <p className="text-sm text-gray-400 italic mt-4 text-center p-2 bg-gray-800/50 rounded-md">
          {prompt}
        </p>
      </div>
    </div>
  );
};
