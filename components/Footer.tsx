
import React from 'react';
import { GitHubIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Nexus Future. Criado com IA.
          </p>
          <div className="flex items-center space-x-4">
             <a href="https://github.com/google/labs-prototypes" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <GitHubIcon className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};