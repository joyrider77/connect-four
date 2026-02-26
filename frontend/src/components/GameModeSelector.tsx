import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Sparkles, Gamepad2, Trophy } from 'lucide-react';
import { GameMode } from '../App';
import { useTranslation } from '../hooks/useTranslation';

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode) => void;
  onShowHighscores: () => void;
}

export function GameModeSelector({ onModeSelect, onShowHighscores }: GameModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-6xl px-2 sm:px-4">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <div className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
          <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mr-2 sm:mr-3 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t.selectGameMode}
          </h2>
          <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary ml-2 sm:ml-3 animate-pulse" />
        </div>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
          {t.selectGameModeSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <Card className="game-mode-card group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 hover:scale-105">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <div className="mx-auto w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
              <User className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t.singlePlayer}</CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              {t.singlePlayerDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t.perfectForTraining}</span>
              </div>
              <Button 
                onClick={() => onModeSelect('single')} 
                className="w-full game-button-primary"
                size="lg"
              >
                {t.playAgainstAI}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="game-mode-card group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-secondary/50 hover:scale-105">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <div className="mx-auto w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-secondary-foreground" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t.twoPlayer}</CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              {t.twoPlayerDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t.idealForTogether}</span>
              </div>
              <Button 
                onClick={() => onModeSelect('two-player')} 
                className="w-full game-button-secondary"
                size="lg"
              >
                {t.startLocalGame}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="game-mode-card group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-accent/50 hover:scale-105 md:col-span-2 lg:col-span-1">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <div className="mx-auto w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-accent-foreground" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t.highscores}</CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              {t.highscoresDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t.trackProgress}</span>
              </div>
              <Button 
                onClick={onShowHighscores} 
                className="w-full game-button-accent"
                size="lg"
              >
                {t.showHighscores}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 sm:mt-10 md:mt-12">
        <p className="text-xs sm:text-sm text-muted-foreground px-2">
          {t.gameInstructions}
        </p>
      </div>
    </div>
  );
}
