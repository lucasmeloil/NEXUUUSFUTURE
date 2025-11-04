
import React from 'react';
import { ZapIcon, InfoIcon } from './Icons';

interface HeaderProps {
    onShowAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowAbout }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-purple-500/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ZapIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Nexus Future</h1>
                <p className="text-xs sm:text-sm text-purple-300">AI Image Stylizer</p>
              </div>
            </div>
            <button 
                onClick={onShowAbout}
                className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="About this application"
            >
                <InfoIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};
