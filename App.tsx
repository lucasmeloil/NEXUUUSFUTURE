
import React, { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from './types';
import { Header } from './components/Header';
import { ImageEditor } from './components/ImageEditor';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutPage } from './components/AboutPage';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';

type MobileView = 'editor' | 'history';

// Limit the number of items in history to prevent exceeding localStorage quota.
const MAX_HISTORY_ITEMS = 15;

const resizeImage = (base64Str: string, maxWidth = 256, maxHeight = 256): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      // Use JPEG for smaller file size, quality 0.8 is a good compromise
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = (err) => reject(err);
  });
};


const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('editor');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('nexus-future-history');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // Also apply the limit when loading, in case old data is too large.
        setHistory(parsedHistory.slice(0, MAX_HISTORY_ITEMS));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      // If loading fails, clear the potentially corrupted item.
      try {
        localStorage.removeItem('nexus-future-history');
      } catch (removeError) {
        console.error("Failed to remove corrupted history from localStorage:", removeError);
      }
    }
  }, []);

  const handleNewGeneration = useCallback(async (item: HistoryItem) => {
    try {
      // Create thumbnails to save to localStorage to avoid quota issues
      const [thumbOriginal, thumbGenerated] = await Promise.all([
        resizeImage(item.originalImage),
        resizeImage(item.generatedImage),
      ]);

      const itemForStorage: HistoryItem = {
        ...item,
        originalImage: thumbOriginal,
        generatedImage: thumbGenerated,
      };

      setHistory(prevHistory => {
        const updatedHistory = [itemForStorage, ...prevHistory];
        const newHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
        try {
          localStorage.setItem('nexus-future-history', JSON.stringify(newHistory));
        } catch (error) {
          console.error("Failed to save history to localStorage:", error);
        }
        return newHistory;
      });
    } catch (resizeError) {
      console.error("Failed to resize images for history, item not saved:", resizeError);
    }
    
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
