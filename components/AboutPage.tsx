
import React from 'react';
import { XIcon, ZapIcon, ExternalLinkIcon, UploadIcon, WandIcon, SparklesIcon, DownloadIcon } from './Icons';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col border border-purple-500/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <ZapIcon className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Sobre o Nexus Future</h1>
              <p className="text-sm text-purple-300">AI Image Stylizer</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close about page"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto text-gray-300">
          <section>
            <h2 className="text-lg font-semibold text-purple-400 mb-2">O Que é o Nexus Future?</h2>
            <p>
              Nexus Future é uma ferramenta criativa que permite transformar suas fotos em obras de arte únicas usando o poder da inteligência artificial. Basta enviar uma imagem, descrever o estilo que você imagina com um texto (prompt), e a IA irá gerar uma nova imagem estilizada para você.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-purple-400 mb-2">Tutorial Rápido</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full p-2">
                  <UploadIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold text-white">1. Envie uma Imagem</h3>
                  <p className="text-sm text-gray-400">Clique na área de upload ou arraste e solte um arquivo (JPG ou PNG, até 4MB). Esta será a base para sua criação.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full p-2">
                  <WandIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold text-white">2. Descreva sua Visão</h3>
                  <p className="text-sm text-gray-400">Na caixa de texto, escreva o que você quer ver. Seja detalhado: fale sobre cores, iluminação e estilo. Use a seção "Inspiração de Prompts" para ter ideias!</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full p-2">
                  <SparklesIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold text-white">3. Gere a Magia</h3>
                  <p className="text-sm text-gray-400">Clique em "Gerar". A IA vai processar seu pedido e criar uma imagem totalmente nova em segundos.</p>
                </div>
              </li>
               <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full p-2">
                  <DownloadIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold text-white">4. Salve e Compartilhe</h3>
                  <p className="text-sm text-gray-400">Sua arte aparecerá na seção "Gerada". Clique nela para ver em tela cheia ou use o botão "Baixar" para salvá-la no seu dispositivo.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-purple-400 mb-2">Tecnologia</h2>
            <p>
              Este aplicativo utiliza o modelo de IA generativa <strong>Gemini 2.5 Flash Image</strong> do Google para realizar a edição de imagens. A combinação da sua imagem original com o prompt de texto permite que o modelo crie resultados visuais impressionantes e contextualmente relevantes.
            </p>
             <a 
              href="https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mt-2 text-sm"
            >
              Saiba mais sobre o Gemini <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};