import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RotateCcw, Home, Volume2, VolumeX, Trophy, Music, VolumeOff, RefreshCw } from 'lucide-react';
import { GameState, Player } from '../App';
import { checkWinner, isValidMove, makeMove, getAIMove } from '../lib/gameLogic';
import { playSound } from '../lib/soundEffects';
import { playBackgroundMusic, stopBackgroundMusic, setMusicVolume, getMusicVolume, muteBackgroundMusic, unmuteBackgroundMusic, isMusicMuted } from '../lib/backgroundMusic';
import { Timer } from './Timer';
import { useAddHighscore } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { formatTimeWithTranslation } from '../lib/i18n';

interface GameBoardProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onReset: () => void;
  onShowHighscores: () => void;
  onStartNextGame: () => void;
}

export function GameBoard({ gameState, setGameState, onReset, onShowHighscores, onStartNextGame }: GameBoardProps) {
  const { t } = useTranslation();
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [droppingPiece, setDroppingPiece] = useState<{ col: number; player: Player } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicMuted, setMusicMuted] = useState(isMusicMuted());
  const [musicVolume, setMusicVolumeState] = useState(getMusicVolume());
  const [gameTime, setGameTime] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [showPlayAgainDialog, setShowPlayAgainDialog] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [finalTime, setFinalTime] = useState(0);

  const addHighscoreMutation = useAddHighscore();

  // Start background music when game starts
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      // Add a small delay to ensure user interaction has occurred
      const timer = setTimeout(() => {
        playBackgroundMusic();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopBackgroundMusic();
    }

    // Cleanup on unmount
    return () => {
      stopBackgroundMusic();
    };
  }, [gameState.gameStatus]);

  // Show play again dialog when game ends
  useEffect(() => {
    if (gameState.gameStatus === 'won' || gameState.gameStatus === 'draw') {
      // For single player mode, only show highscore dialog if player wins
      if (gameState.mode === 'single' && gameState.gameStatus === 'won' && gameState.winner === 1) {
        setFinalTime(gameTime);
        setShowWinDialog(true);
      } else {
        // For two player mode or AI wins, show play again dialog directly
        setShowPlayAgainDialog(true);
      }
    }
  }, [gameState.gameStatus, gameState.winner, gameState.mode, gameTime]);

  const handleColumnClick = async (col: number) => {
    if (gameState.gameStatus !== 'playing' || !isValidMove(gameState.board, col) || droppingPiece) {
      return;
    }

    // Play drop sound
    if (soundEnabled) {
      playSound('drop');
    }

    // Start drop animation
    setDroppingPiece({ col, player: gameState.currentPlayer });

    // Wait for animation to complete
    setTimeout(() => {
      // Make player move
      const newBoard = makeMove(gameState.board, col, gameState.currentPlayer);
      const { winner, winningCells } = checkWinner(newBoard);
      const isBoardFull = newBoard.every(row => row.every(cell => cell !== null));

      let newGameState: GameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
        gameStatus: winner ? 'won' : (isBoardFull ? 'draw' : 'playing'),
        winner,
        winningCells
      };

      setGameState(newGameState);
      setDroppingPiece(null);

      // Handle game end
      if (winner) {
        if (soundEnabled) {
          playSound('win');
        }
      } else if (isBoardFull && soundEnabled) {
        playSound('draw');
      }

      // If single player mode and game is still playing, make AI move
      if (gameState.mode === 'single' && !winner && !isBoardFull) {
        setIsAIThinking(true);
        
        // Add delay for better UX
        setTimeout(() => {
          const aiCol = getAIMove(newBoard, gameState.aiDifficulty || 3);
          if (aiCol !== -1) {
            if (soundEnabled) {
              playSound('drop');
            }

            setDroppingPiece({ col: aiCol, player: 2 });

            setTimeout(() => {
              const aiBoardState = makeMove(newBoard, aiCol, 2);
              const { winner: aiWinner, winningCells: aiWinningCells } = checkWinner(aiBoardState);
              const aiIsBoardFull = aiBoardState.every(row => row.every(cell => cell !== null));

              setGameState({
                ...newGameState,
                board: aiBoardState,
                currentPlayer: 1,
                gameStatus: aiWinner ? 'won' : (aiIsBoardFull ? 'draw' : 'playing'),
                winner: aiWinner,
                winningCells: aiWinningCells
              });

              setDroppingPiece(null);
              setIsAIThinking(false);

              // Play AI win/draw sound
              if (aiWinner && soundEnabled) {
                playSound('win');
              } else if (aiIsBoardFull && soundEnabled) {
                playSound('draw');
              }
            }, 600);
          } else {
            setIsAIThinking(false);
          }
        }, 800);
      }
    }, 600);
  };

  const restartGame = () => {
    setGameState({
      ...gameState,
      board: Array(6).fill(null).map(() => Array(7).fill(null)),
      currentPlayer: 1,
      gameStatus: 'playing',
      winner: null,
      winningCells: undefined
    });
    setDroppingPiece(null);
    setGameTime(0);
    setResetTrigger(prev => prev + 1);
    setShowWinDialog(false);
    setShowPlayAgainDialog(false);
    setPlayerName('');
  };

  const handleSaveHighscore = async () => {
    if (playerName.trim() && finalTime > 0) {
      try {
        await addHighscoreMutation.mutateAsync({
          playerName: playerName.trim(),
          time: finalTime
        });
        setShowWinDialog(false);
        setPlayerName('');
        setShowPlayAgainDialog(true);
      } catch (error) {
        console.error('Failed to save highscore:', error);
      }
    }
  };

  const handleSkipHighscore = () => {
    setShowWinDialog(false);
    setPlayerName('');
    setShowPlayAgainDialog(true);
  };

  const handlePlayAgain = () => {
    setShowPlayAgainDialog(false);
    onStartNextGame();
    setGameTime(0);
    setResetTrigger(prev => prev + 1);
  };

  const handleEndSession = () => {
    setShowPlayAgainDialog(false);
    onReset();
  };

  const toggleMusicMute = () => {
    if (musicMuted) {
      unmuteBackgroundMusic();
      setMusicMuted(false);
    } else {
      muteBackgroundMusic();
      setMusicMuted(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setMusicVolumeState(newVolume);
    setMusicVolume(newVolume);
  };

  const getPlayerName = (player: Player) => {
    if (gameState.mode === 'single') {
      return player === 1 ? t.playerYou : t.playerAI;
    }
    return `${t.player} ${player}`;
  };

  const getStatusMessage = () => {
    if (gameState.gameStatus === 'won') {
      return `${getPlayerName(gameState.winner!)} ${t.hasWon}`;
    }
    if (gameState.gameStatus === 'draw') {
      return t.draw;
    }
    if (isAIThinking) {
      return t.aiThinking;
    }
    return `${getPlayerName(gameState.currentPlayer)} ${t.isYourTurn}`;
  };

  const isWinningCell = (row: number, col: number) => {
    return gameState.winningCells?.some(cell => cell.row === row && cell.col === col) || false;
  };

  const getDropAnimation = (col: number, row: number) => {
    if (droppingPiece && droppingPiece.col === col) {
      // Find the target row for this column
      let targetRow = -1;
      for (let r = 5; r >= 0; r--) {
        if (gameState.board[r][col] === null) {
          targetRow = r;
          break;
        }
      }
      
      if (targetRow === row) {
        return 'animate-drop-piece';
      }
    }
    return '';
  };

  const getDifficultyText = () => {
    if (gameState.mode !== 'single') return '';
    const difficulty = gameState.aiDifficulty || 3;
    const difficultyNames = ['', 'Sehr einfach', 'Einfach', 'Mittel', 'Schwer', 'Experte'];
    return difficultyNames[difficulty] || 'Mittel';
  };

  return (
    <div className="w-full max-w-4xl px-2 sm:px-4">
      <Card className="mb-4 sm:mb-6 game-card">
        <CardHeader className="text-center px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-muted-foreground hover:text-foreground p-1 sm:p-2"
              >
                {soundEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMusicMute}
                className="text-muted-foreground hover:text-foreground p-1 sm:p-2"
                title={musicMuted ? t.unmuteMusic : t.muteMusic}
              >
                {musicMuted ? <VolumeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Music className="w-3 h-3 sm:w-4 sm:h-4" />}
              </Button>
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold game-title">{t.gameTitle}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHighscores}
              className="text-muted-foreground hover:text-foreground p-1 sm:p-2"
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Music Volume Control */}
          <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
            <Music className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <div className="flex items-center space-x-2 w-24 sm:w-32">
              <Slider
                value={[musicVolume]}
                onValueChange={handleVolumeChange}
                max={1}
                min={0}
                step={0.1}
                className="flex-1"
                disabled={musicMuted}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
            <Badge 
              variant={gameState.gameStatus === 'playing' ? 'default' : 'secondary'}
              className="text-sm sm:text-base md:text-lg px-3 py-1 sm:px-4 sm:py-2 game-status-badge"
            >
              {getStatusMessage()}
            </Badge>
            {gameState.mode === 'single' && (
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="outline" className="game-mode-badge text-xs sm:text-sm">{t.singlePlayerMode}</Badge>
                {gameState.aiDifficulty && gameState.aiDifficulty >= 3 && (
                  <Badge variant="secondary" className="text-xs">
                    KI: {getDifficultyText()}
                  </Badge>
                )}
              </div>
            )}
            {gameState.mode === 'two-player' && (
              <Badge variant="outline" className="game-mode-badge text-xs sm:text-sm">{t.twoPlayerMode}</Badge>
            )}
            {gameState.gamesInSession && gameState.gamesInSession > 1 && (
              <Badge variant="outline" className="text-xs">
                Spiel {gameState.gamesInSession}
              </Badge>
            )}
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <Timer 
              isRunning={gameState.gameStatus === 'playing'} 
              onTimeUpdate={setGameTime}
              resetTrigger={resetTrigger}
            />
          </div>

          {/* Current Player Indicator */}
          {gameState.gameStatus === 'playing' && (
            <div className="flex flex-col sm:flex-row items-center justify-center mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="text-sm sm:text-base md:text-lg font-semibold">{t.currentPlayer}</div>
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 sm:border-3 shadow-lg ${
                    gameState.currentPlayer === 1 
                      ? 'bg-player1 border-player1-dark animate-pulse-gentle' 
                      : 'bg-player2 border-player2-dark animate-pulse-gentle'
                  }`}
                />
                <span className="font-bold text-sm sm:text-base md:text-lg">
                  {getPlayerName(gameState.currentPlayer)}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="px-2 sm:px-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="game-board-container">
              {/* Column hover indicators - perfectly aligned with columns */}
              <div className="absolute -top-8 sm:-top-10 md:-top-12 left-0 right-0 flex justify-center">
                <div className="game-board-hover-grid">
                  {Array.from({ length: 7 }, (_, col) => (
                    <div
                      key={`hover-${col}`}
                      className={`game-hover-indicator ${
                        gameState.gameStatus === 'playing' && 
                        !isAIThinking && 
                        !droppingPiece &&
                        isValidMove(gameState.board, col)
                          ? 'active'
                          : 'inactive'
                      }`}
                      onClick={() => handleColumnClick(col)}
                    >
                      {gameState.gameStatus === 'playing' && 
                       !isAIThinking && 
                       !droppingPiece &&
                       isValidMove(gameState.board, col) && (
                        <div 
                          className={`game-hover-piece ${
                            gameState.currentPlayer === 1 
                              ? 'player1' 
                              : 'player2'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Game board with perfect alignment */}
              <div className="game-board">
                <div className="game-board-grid">
                  {Array.from({ length: 7 }, (_, col) => (
                    <div key={`col-${col}`} className="game-column">
                      {Array.from({ length: 6 }, (_, row) => {
                        const actualRow = 5 - row;
                        const cell = gameState.board[actualRow][col];
                        const isWinning = isWinningCell(actualRow, col);
                        const dropAnim = getDropAnimation(col, actualRow);
                        
                        return (
                          <button
                            key={`${actualRow}-${col}`}
                            onClick={() => handleColumnClick(col)}
                            disabled={
                              gameState.gameStatus !== 'playing' || 
                              isAIThinking || 
                              !!droppingPiece ||
                              !isValidMove(gameState.board, col)
                            }
                            className={`
                              game-piece-slot
                              ${cell === null 
                                ? 'empty' 
                                : cell === 1 
                                  ? `player1 ${isWinning ? 'winning' : ''}` 
                                  : `player2 ${isWinning ? 'winning' : ''}`
                              }
                              ${gameState.gameStatus === 'playing' && 
                                !isAIThinking && 
                                !droppingPiece &&
                                isValidMove(gameState.board, col) 
                                ? 'clickable' 
                                : 'disabled'
                              }
                              ${dropAnim}
                            `}
                          >
                            {/* Piece shine effect */}
                            {cell !== null && (
                              <div className="piece-shine" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={restartGame} variant="outline" size="lg" className="game-button w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.newGame}
            </Button>
            <Button onClick={onShowHighscores} variant="outline" size="lg" className="game-button w-full sm:w-auto">
              <Trophy className="w-4 h-4 mr-2" />
              {t.highscores}
            </Button>
            <Button onClick={onReset} variant="secondary" size="lg" className="game-button w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              {t.mainMenu}
            </Button>
          </div>
        </CardContent>
      </Card>

      {gameState.gameStatus !== 'playing' && !showWinDialog && !showPlayAgainDialog && (
        <Card className="text-center game-result-card">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
              {gameState.gameStatus === 'won' ? '🎉' : '🤝'}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 game-result-title">
              {gameState.gameStatus === 'won' 
                ? `${t.congratulations} ${getPlayerName(gameState.winner!)}!` 
                : t.wellPlayed
              }
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {gameState.gameStatus === 'won' 
                ? t.youConnectedFour
                : t.boardFull
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Win Dialog for Highscore Entry */}
      <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              {t.newRecord}
            </DialogTitle>
            <DialogDescription>
              {t.congratulationsTime.replace('{time}', formatTimeWithTranslation(finalTime))} {t.enterHighscore}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playerName">{t.yourName}</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t.enterNamePlaceholder}
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && playerName.trim()) {
                    handleSaveHighscore();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
            <Button 
              variant="outline" 
              onClick={handleSkipHighscore}
              className="w-full sm:w-auto"
            >
              {t.skip}
            </Button>
            <Button 
              onClick={handleSaveHighscore}
              disabled={!playerName.trim() || addHighscoreMutation.isPending}
              className="w-full sm:w-auto"
            >
              {addHighscoreMutation.isPending ? t.saving : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Play Again Dialog */}
      <Dialog open={showPlayAgainDialog} onOpenChange={setShowPlayAgainDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 text-primary mr-2" />
              Noch einmal spielen?
            </DialogTitle>
            <DialogDescription>
              {gameState.gameStatus === 'won' 
                ? `${getPlayerName(gameState.winner!)} hat gewonnen! Möchtest du noch eine Runde spielen?`
                : 'Das Spiel endete unentschieden! Möchtest du noch eine Runde spielen?'
              }
              {gameState.mode === 'single' && gameState.aiDifficulty && gameState.aiDifficulty < 5 && (
                <span className="block mt-2 text-sm text-muted-foreground">
                  Die KI wird beim nächsten Spiel noch schwieriger.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
            <Button 
              variant="outline" 
              onClick={handleEndSession}
              className="w-full sm:w-auto"
            >
              Nein, zum Hauptmenü
            </Button>
            <Button 
              onClick={handlePlayAgain}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Ja, noch einmal!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
