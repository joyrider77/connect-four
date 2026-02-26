// Internationalization system for the Connect Four game
export interface Translations {
  // Game title and header
  gameTitle: string;
  gameSubtitle: string;
  
  // Menu
  selectGameMode: string;
  selectGameModeSubtitle: string;
  singlePlayer: string;
  singlePlayerDesc: string;
  twoPlayer: string;
  twoPlayerDesc: string;
  highscores: string;
  highscoresDesc: string;
  playAgainstAI: string;
  startLocalGame: string;
  showHighscores: string;
  perfectForTraining: string;
  idealForTogether: string;
  trackProgress: string;
  gameInstructions: string;
  
  // Game board
  currentPlayer: string;
  playerYou: string;
  playerAI: string;
  player: string;
  aiThinking: string;
  hasWon: string;
  draw: string;
  isYourTurn: string;
  newGame: string;
  backToMenu: string;
  mainMenu: string;
  
  // Game modes
  singlePlayerMode: string;
  twoPlayerMode: string;
  
  // Game results
  congratulations: string;
  wellPlayed: string;
  youConnectedFour: string;
  boardFull: string;
  
  // Timer
  time: string;
  
  // Highscores
  highscoreList: string;
  fastestWins: string;
  noEntries: string;
  noEntriesDesc: string;
  backToGame: string;
  back: string;
  
  // Win dialog
  newRecord: string;
  congratulationsTime: string;
  enterHighscore: string;
  yourName: string;
  enterNamePlaceholder: string;
  skip: string;
  save: string;
  saving: string;
  
  // Audio controls
  musicVolume: string;
  muteMusic: string;
  unmuteMusic: string;
  
  // Footer
  builtWith: string;
  using: string;
  
  // Language selector
  language: string;
  selectLanguage: string;
}

const translations: Record<string, Translations> = {
  en: {
    gameTitle: "Connect Four",
    gameSubtitle: "The classic strategy game - connect four pieces in a row to win!",
    
    selectGameMode: "Choose Game Mode",
    selectGameModeSubtitle: "Select your preferred game mode and start the adventure!",
    singlePlayer: "Single Player",
    singlePlayerDesc: "Play against a clever AI and test your strategies",
    twoPlayer: "Two Player",
    twoPlayerDesc: "Play with a friend on the same device and have fun together",
    highscores: "Highscores",
    highscoresDesc: "View the fastest wins and record times",
    playAgainstAI: "Play vs AI",
    startLocalGame: "Start Local Game",
    showHighscores: "Show Highscores",
    perfectForTraining: "Perfect for training and fun",
    idealForTogether: "Ideal for playing together",
    trackProgress: "Track your progress",
    gameInstructions: "Connect four pieces in a row - horizontal, vertical or diagonal!",
    
    currentPlayer: "Current Player:",
    playerYou: "You",
    playerAI: "AI",
    player: "Player",
    aiThinking: "AI is thinking...",
    hasWon: "has won!",
    draw: "Draw!",
    isYourTurn: "is your turn",
    newGame: "New Game",
    backToMenu: "Main Menu",
    mainMenu: "Main Menu",
    
    singlePlayerMode: "Single Player",
    twoPlayerMode: "Two Player",
    
    congratulations: "Congratulations,",
    wellPlayed: "Well played!",
    youConnectedFour: "You connected four in a row!",
    boardFull: "The board is full - it's a draw!",
    
    time: "Time",
    
    highscoreList: "Highscores",
    fastestWins: "The fastest wins of all time",
    noEntries: "No entries yet",
    noEntriesDesc: "Win your first game to be added to the highscore list!",
    backToGame: "Back to Game",
    back: "Back",
    
    newRecord: "New Record!",
    congratulationsTime: "Congratulations! You won in {time}. Would you like to enter your name in the highscore list?",
    enterHighscore: "Would you like to enter your name in the highscore list?",
    yourName: "Your Name",
    enterNamePlaceholder: "Enter your name...",
    skip: "Skip",
    save: "Save",
    saving: "Saving...",
    
    musicVolume: "Music Volume",
    muteMusic: "Mute Music",
    unmuteMusic: "Unmute Music",
    
    builtWith: "Built with",
    using: "using",
    
    language: "Language",
    selectLanguage: "Select Language"
  },
  
  de: {
    gameTitle: "Connect Four",
    gameSubtitle: "Das klassische Strategiespiel - verbinde vier Steine in einer Reihe, um zu gewinnen!",
    
    selectGameMode: "Spielmodus wählen",
    selectGameModeSubtitle: "Wähle deinen bevorzugten Spielmodus aus und starte das Abenteuer!",
    singlePlayer: "Einzelspieler",
    singlePlayerDesc: "Spiele gegen eine clevere KI und teste deine Strategien",
    twoPlayer: "Zweispieler",
    twoPlayerDesc: "Spiele mit einem Freund am selben Gerät und habt Spaß zusammen",
    highscores: "Bestenliste",
    highscoresDesc: "Sieh dir die schnellsten Siege und Rekordzeiten an",
    playAgainstAI: "Gegen KI spielen",
    startLocalGame: "Lokales Spiel starten",
    showHighscores: "Bestenliste anzeigen",
    perfectForTraining: "Perfekt für Training und Spaß",
    idealForTogether: "Ideal für gemeinsame Spielrunden",
    trackProgress: "Verfolge deine Fortschritte",
    gameInstructions: "Verbinde vier Steine in einer Reihe - horizontal, vertikal oder diagonal!",
    
    currentPlayer: "Aktueller Spieler:",
    playerYou: "Du",
    playerAI: "KI",
    player: "Spieler",
    aiThinking: "KI denkt nach...",
    hasWon: "hat gewonnen!",
    draw: "Unentschieden!",
    isYourTurn: "ist am Zug",
    newGame: "Neues Spiel",
    backToMenu: "Hauptmenü",
    mainMenu: "Hauptmenü",
    
    singlePlayerMode: "Einzelspieler",
    twoPlayerMode: "Zweispieler",
    
    congratulations: "Glückwunsch,",
    wellPlayed: "Gut gespielt!",
    youConnectedFour: "Du hast vier in einer Reihe geschafft!",
    boardFull: "Das Spielfeld ist voll - Unentschieden!",
    
    time: "Zeit",
    
    highscoreList: "Bestenliste",
    fastestWins: "Die schnellsten Siege aller Zeiten",
    noEntries: "Noch keine Einträge",
    noEntriesDesc: "Gewinne dein erstes Spiel, um in die Bestenliste aufgenommen zu werden!",
    backToGame: "Zurück zum Spiel",
    back: "Zurück",
    
    newRecord: "Neuer Rekord!",
    congratulationsTime: "Glückwunsch! Du hast in {time} gewonnen. Möchtest du deinen Namen in die Bestenliste eintragen?",
    enterHighscore: "Möchtest du deinen Namen in die Bestenliste eintragen?",
    yourName: "Dein Name",
    enterNamePlaceholder: "Gib deinen Namen ein...",
    skip: "Überspringen",
    save: "Speichern",
    saving: "Speichere...",
    
    musicVolume: "Musik-Lautstärke",
    muteMusic: "Musik stumm schalten",
    unmuteMusic: "Musik einschalten",
    
    builtWith: "Built with",
    using: "using",
    
    language: "Sprache",
    selectLanguage: "Sprache auswählen"
  }
};

// Current language state - Default to German
let currentLanguage = 'de';

// Initialize language from localStorage or default to German
function initializeLanguage(): string {
  if (typeof window === 'undefined') return 'de';
  
  // Try to get saved language from localStorage
  const savedLanguage = localStorage.getItem('connect-four-language');
  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage;
  }
  
  // Default to German
  return 'de';
}

// Initialize the current language
currentLanguage = initializeLanguage();

// Get current translations
export function getTranslations(): Translations {
  return translations[currentLanguage] || translations.de;
}

// Get current language
export function getCurrentLanguage(): string {
  return currentLanguage;
}

// Set language and reload page
export function setLanguage(lang: string): void {
  if (translations[lang]) {
    currentLanguage = lang;
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('connect-four-language', lang);
      // Reload the page to apply the new language immediately
      window.location.reload();
    }
  }
}

// Get available languages (only English and German as requested)
export function getAvailableLanguages(): Array<{ code: string; name: string; nativeName: string }> {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' }
  ];
}

// Format time with translation
export function formatTimeWithTranslation(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}
