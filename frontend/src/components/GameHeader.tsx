import { Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSelector } from './LanguageSelector';

export function GameHeader() {
  const { t } = useTranslation();

  return (
    <header className="text-center mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4 relative">
      {/* Language Selector - positioned prominently in top right */}
      <div className="absolute top-0 right-0 sm:right-4">
        <LanguageSelector />
      </div>
      
      <div className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-500 mr-2 sm:mr-3 md:mr-4 animate-bounce" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t.gameTitle}
        </h1>
        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-500 ml-2 sm:ml-3 md:ml-4 animate-bounce" />
      </div>
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary mr-1 sm:mr-2 animate-pulse" />
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
          {t.gameSubtitle}
        </p>
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary ml-1 sm:ml-2 animate-pulse" />
      </div>
      <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
    </header>
  );
}
