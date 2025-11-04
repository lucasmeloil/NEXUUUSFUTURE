
import React from 'react';
import { PencilIcon, ClockIcon } from './Icons';

type MobileView = 'editor' | 'history';

interface MobileNavProps {
  activeView: MobileView;
  onViewChange: (view: MobileView) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { view: 'editor', label: 'Editar', icon: PencilIcon },
    { view: 'history', label: 'Histórico', icon: ClockIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-purple-500/30 z-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view as MobileView)}
                className={`flex-1 flex flex-col items-center justify-center py-3 text-sm transition-colors ${
                  isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-purple-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};