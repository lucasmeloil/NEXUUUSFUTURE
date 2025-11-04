
import React, { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from './types';
import { Header } from './components/Header';
import { ImageEditor } from './components/ImageEditor';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutPage } from './components/AboutPage';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';

type MobileView = 'editor' | 'history';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('editor');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('nexus-future-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  const handleNewGeneration = useCallback((item: HistoryItem) => {
    setHistory(prevHistory => {
      const newHistory = [item, ...prevHistory];
      try {
        localStorage.setItem('nexus-future-history', JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
      return newHistory;
    });
    // Switch to history view on mobile after generation to show the result
    if (window.innerWidth < 1024) {
        setMobileView('history');
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('nexus-future-history');
    } catch (error) {
      console.error("Failed to clear history in localStorage:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header onShowAbout={() => setShowAboutPage(true)} />
      <main className="flex-grow p-4 sm:p-6 md:p-8 pb-24 lg:pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Editor View */}
            <div className={`lg:col-span-2 ${mobileView === 'editor' ? 'block' : 'hidden'} lg:block`}>
              <ImageEditor onGenerate={handleNewGeneration} />
            </div>
            
            {/* History View */}
            <div className={`lg:col-span-1 ${mobileView === 'history' ? 'block' : 'hidden'} lg:block`}>
              <HistoryPanel history={history} onClearHistory={handleClearHistory} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <MobileNav activeView={mobileView} onViewChange={setMobileView} />
      {showAboutPage && <AboutPage onClose={() => setShowAboutPage(false)} />}
    </div>
  );
};

export default App;