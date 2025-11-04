
import React from 'react';
import type { HistoryItem } from '../types';
import { TrashIcon, ClockIcon } from './Icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClearHistory }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">History</h2>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
            <ClockIcon className="w-12 h-12 mb-2"/>
            <p>Your generated images will appear here.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
          {history.map((item) => (
            <div key={item.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <img src={item.originalImage} alt="Original" className="rounded object-cover aspect-square" />
                <img src={item.generatedImage} alt="Generated" className="rounded object-cover aspect-square" />
              </div>
              <p className="text-xs text-gray-400 italic truncate" title={item.prompt}>
                &quot;{item.prompt}&quot;
              </p>
              <p className="text-right text-xs text-gray-500 mt-1">{item.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
