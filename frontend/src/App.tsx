import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameModeSelector } from './components/GameModeSelector';
import { HighscoreList } from './components/HighscoreList';
import { GameHeader } from './components/GameHeader';
import { GameFooter } from './components/GameFooter';

export type GameMode = 'single' | 'two-player' | null;
export type Player = 1 | 2;
export type GameStatus = 'playing' | 'won' | 'draw';
export type AppView = 'menu' | 'game' | 'highscores';

export interface GameState {
  board: (Player | null)[][];
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  mode: GameMode;
  winningCells?: { row: number; col: number }[];
  aiDifficulty?: number; // Track AI difficulty level
  gamesInSession?: number; // Track games played in current session
}

const ROWS = 6;
const COLS = 7;

function createEmptyBoard(): (Player | null)[][] {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 1,
    gameStatus: 'playing',
    winner: null,
    mode: null,
    aiDifficulty: 3, // Start with higher difficulty for more challenging experience
    gamesInSession: 0
  });

  const startNewGame = (mode: GameMode) => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      gameStatus: 'playing',
      winner: null,
      mode,
      winningCells: undefined,
      aiDifficulty: 3, // Start at level 3 for immediate challenge
      gamesInSession: 1
    });
    setCurrentView('game');
  };

  const startNextGame = () => {
    const newDifficulty = gameState.mode === 'single' 
      ? Math.min((gameState.aiDifficulty || 3) + 1, 5) // Cap at level 5, start from 3
      : 3;
    
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      gameStatus: 'playing',
      winner: null,
      mode: gameState.mode,
      winningCells: undefined,
      aiDifficulty: newDifficulty,
      gamesInSession: (gameState.gamesInSession || 0) + 1
    });
  };

  const resetGame = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      gameStatus: 'playing',
      winner: null,
      mode: null,
      winningCells: undefined,
      aiDifficulty: 3, // Reset to level 3
      gamesInSession: 0
    });
    setCurrentView('menu');
  };

  const showHighscores = () => {
    setCurrentView('highscores');
  };

  const backToMenu = () => {
    setCurrentView('menu');
  };

  const backToGame = () => {
    setCurrentView('game');
  };

  return (
    <div className="min-h-screen bg-game-gradient">
      <div className="container mx-auto px-4 py-8">
        <GameHeader />
        
        <main className="flex flex-col items-center justify-center space-y-8">
          {currentView === 'menu' && (
            <GameModeSelector 
              onModeSelect={startNewGame} 
              onShowHighscores={showHighscores}
            />
          )}
          
          {currentView === 'game' && (
            <GameBoard 
              gameState={gameState} 
              setGameState={setGameState}
              onReset={resetGame}
              onShowHighscores={showHighscores}
              onStartNextGame={startNextGame}
            />
          )}

          {currentView === 'highscores' && (
            <HighscoreList 
              onBack={gameState.mode ? backToGame : backToMenu}
            />
          )}
        </main>

        <GameFooter />
      </div>
    </div>
  );
}

export default App;
