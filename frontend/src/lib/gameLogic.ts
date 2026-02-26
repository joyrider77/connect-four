import { Player } from '../App';

export function isValidMove(board: (Player | null)[][], col: number): boolean {
  return col >= 0 && col < 7 && board[0][col] === null;
}

export function makeMove(board: (Player | null)[][], col: number, player: Player): (Player | null)[][] {
  const newBoard = board.map(row => [...row]);
  
  // Find the lowest empty row in the column
  for (let row = 5; row >= 0; row--) {
    if (newBoard[row][col] === null) {
      newBoard[row][col] = player;
      break;
    }
  }
  
  return newBoard;
}

export function checkWinner(board: (Player | null)[][]): { winner: Player | null; winningCells?: { row: number; col: number }[] } {
  const rows = 6;
  const cols = 7;

  // Check horizontal
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const player = board[row][col];
      if (player && 
          board[row][col + 1] === player &&
          board[row][col + 2] === player &&
          board[row][col + 3] === player) {
        return {
          winner: player,
          winningCells: [
            { row, col },
            { row, col: col + 1 },
            { row, col: col + 2 },
            { row, col: col + 3 }
          ]
        };
      }
    }
  }

  // Check vertical
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols; col++) {
      const player = board[row][col];
      if (player && 
          board[row + 1][col] === player &&
          board[row + 2][col] === player &&
          board[row + 3][col] === player) {
        return {
          winner: player,
          winningCells: [
            { row, col },
            { row: row + 1, col },
            { row: row + 2, col },
            { row: row + 3, col }
          ]
        };
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const player = board[row][col];
      if (player && 
          board[row + 1][col + 1] === player &&
          board[row + 2][col + 2] === player &&
          board[row + 3][col + 3] === player) {
        return {
          winner: player,
          winningCells: [
            { row, col },
            { row: row + 1, col: col + 1 },
            { row: row + 2, col: col + 2 },
            { row: row + 3, col: col + 3 }
          ]
        };
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 3; col < cols; col++) {
      const player = board[row][col];
      if (player && 
          board[row + 1][col - 1] === player &&
          board[row + 2][col - 2] === player &&
          board[row + 3][col - 3] === player) {
        return {
          winner: player,
          winningCells: [
            { row, col },
            { row: row + 1, col: col - 1 },
            { row: row + 2, col: col - 2 },
            { row: row + 3, col: col - 3 }
          ]
        };
      }
    }
  }

  return { winner: null };
}

export function getAIMove(board: (Player | null)[][], difficulty: number = 3): number {
  // Enhanced AI strategy with higher starting difficulty:
  // Level 1-2: Basic strategies (not used by default anymore)
  // Level 3: Smart strategic play with center preference and threat detection (NEW DEFAULT)
  // Level 4: Advanced strategy with multiple threat analysis
  // Level 5: Expert level with deep lookahead

  const validMoves: number[] = [];
  for (let col = 0; col < 7; col++) {
    if (isValidMove(board, col)) {
      validMoves.push(col);
    }
  }

  if (validMoves.length === 0) return -1;

  // Always check if AI can win first (all difficulty levels)
  for (const col of validMoves) {
    const testBoard = makeMove(board, col, 2);
    if (checkWinner(testBoard).winner === 2) {
      return col;
    }
  }

  // Always block player from winning (all difficulty levels)
  for (const col of validMoves) {
    const testBoard = makeMove(board, col, 1);
    if (checkWinner(testBoard).winner === 1) {
      return col;
    }
  }

  // Level 1-2: Basic strategies (legacy, rarely used)
  if (difficulty <= 2) {
    // Check for creating two in a row
    for (const col of validMoves) {
      const testBoard = makeMove(board, col, 2);
      if (countConsecutive(testBoard, 2, 2) > 0) {
        return col;
      }
    }

    // Prefer center columns
    if (validMoves.includes(3)) return 3;
    if (validMoves.includes(2)) return 2;
    if (validMoves.includes(4)) return 4;
    
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Level 3+: Advanced strategic analysis
  const moveScores: { col: number; score: number }[] = [];
  
  for (const col of validMoves) {
    let score = 0;
    const testBoard = makeMove(board, col, 2);
    
    // Strong center preference for strategic control
    if (col === 3) score += 8;
    else if (col === 2 || col === 4) score += 5;
    else if (col === 1 || col === 5) score += 2;
    
    // Analyze potential threats and opportunities
    score += analyzeThreats(testBoard, 2) * 4; // AI threats
    score -= analyzeThreats(testBoard, 1) * 3; // Player threats to avoid
    
    // Level 3+: Check for creating multiple winning opportunities
    if (difficulty >= 3) {
      let threats = 0;
      for (let nextCol = 0; nextCol < 7; nextCol++) {
        if (isValidMove(testBoard, nextCol)) {
          const nextBoard = makeMove(testBoard, nextCol, 2);
          if (checkWinner(nextBoard).winner === 2) {
            threats++;
          }
        }
      }
      score += threats * 6; // Heavily favor moves that create multiple threats
      
      // Avoid moves that give opponent immediate winning opportunities
      for (let nextCol = 0; nextCol < 7; nextCol++) {
        if (isValidMove(testBoard, nextCol)) {
          const nextBoard = makeMove(testBoard, nextCol, 1);
          if (checkWinner(nextBoard).winner === 1) {
            score -= 8; // Heavy penalty for giving opponent a win
          }
        }
      }
    }
    
    // Level 4+: Advanced positional analysis
    if (difficulty >= 4) {
      score += evaluatePosition(testBoard, 2, 2) * 2; // Look ahead 2 moves
      score += countConsecutive(testBoard, 2, 2) * 3; // Favor building sequences
      score += countConsecutive(testBoard, 2, 3) * 5; // Heavily favor three in a row
      
      // Penalize moves that help opponent build sequences
      score -= countConsecutive(testBoard, 1, 2) * 2;
      score -= countConsecutive(testBoard, 1, 3) * 4;
    }
    
    // Level 5: Expert level with deep analysis
    if (difficulty >= 5) {
      score += evaluatePosition(testBoard, 2, 3) * 1.5; // Look ahead 3 moves
      score += analyzeVerticalThreats(testBoard, col, 2) * 3;
      score -= analyzeVerticalThreats(testBoard, col, 1) * 2;
    }
    
    moveScores.push({ col, score });
  }
  
  // Sort by score
  moveScores.sort((a, b) => b.score - a.score);
  
  // Level 5: Always pick the absolute best move
  if (difficulty >= 5) {
    return moveScores[0].col;
  }
  
  // Level 4: Pick from top 2 moves with slight randomness
  if (difficulty >= 4) {
    const topMoves = moveScores.slice(0, Math.min(2, moveScores.length));
    const randomIndex = Math.floor(Math.random() * topMoves.length);
    return topMoves[randomIndex].col;
  }
  
  // Level 3: Pick from top 3 moves with some randomness
  const topMoves = moveScores.slice(0, Math.min(3, moveScores.length));
  const randomIndex = Math.floor(Math.random() * topMoves.length);
  return topMoves[randomIndex].col;
}

// Helper function to count consecutive pieces
function countConsecutive(board: (Player | null)[][], player: Player, length: number): number {
  let count = 0;
  const rows = 6;
  const cols = 7;

  // Check horizontal sequences
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= cols - length; col++) {
      let consecutive = 0;
      for (let i = 0; i < length; i++) {
        if (board[row][col + i] === player) {
          consecutive++;
        }
      }
      if (consecutive === length) count++;
    }
  }

  // Check vertical sequences
  for (let row = 0; row <= rows - length; row++) {
    for (let col = 0; col < cols; col++) {
      let consecutive = 0;
      for (let i = 0; i < length; i++) {
        if (board[row + i][col] === player) {
          consecutive++;
        }
      }
      if (consecutive === length) count++;
    }
  }

  // Check diagonal sequences (both directions)
  for (let row = 0; row <= rows - length; row++) {
    for (let col = 0; col <= cols - length; col++) {
      let consecutive1 = 0, consecutive2 = 0;
      for (let i = 0; i < length; i++) {
        if (board[row + i][col + i] === player) consecutive1++;
        if (board[row + i][col + length - 1 - i] === player) consecutive2++;
      }
      if (consecutive1 === length) count++;
      if (consecutive2 === length) count++;
    }
  }

  return count;
}

// Analyze potential threats (sequences that could become wins)
function analyzeThreats(board: (Player | null)[][], player: Player): number {
  let threats = 0;
  const rows = 6;
  const cols = 7;

  // Look for 3-in-a-row with one empty space that could become a win
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const sequence = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
      const playerCount = sequence.filter(cell => cell === player).length;
      const emptyCount = sequence.filter(cell => cell === null).length;
      
      if (playerCount === 3 && emptyCount === 1) {
        threats++;
      }
    }
  }

  // Check vertical threats
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols; col++) {
      const sequence = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      const playerCount = sequence.filter(cell => cell === player).length;
      const emptyCount = sequence.filter(cell => cell === null).length;
      
      if (playerCount === 3 && emptyCount === 1) {
        threats++;
      }
    }
  }

  // Check diagonal threats
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const sequence1 = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
      const sequence2 = [board[row][col + 3], board[row + 1][col + 2], board[row + 2][col + 1], board[row + 3][col]];
      
      for (const sequence of [sequence1, sequence2]) {
        const playerCount = sequence.filter(cell => cell === player).length;
        const emptyCount = sequence.filter(cell => cell === null).length;
        
        if (playerCount === 3 && emptyCount === 1) {
          threats++;
        }
      }
    }
  }

  return threats;
}

// Analyze vertical threats (stacking opportunities)
function analyzeVerticalThreats(board: (Player | null)[][], col: number, player: Player): number {
  let threats = 0;
  
  // Find the row where the piece would land
  let targetRow = -1;
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === null) {
      targetRow = row;
      break;
    }
  }
  
  if (targetRow === -1) return 0; // Column is full
  
  // Check if placing here creates vertical threats
  let consecutiveBelow = 0;
  for (let row = targetRow + 1; row < 6; row++) {
    if (board[row][col] === player) {
      consecutiveBelow++;
    } else {
      break;
    }
  }
  
  if (consecutiveBelow >= 2) {
    threats += consecutiveBelow; // More consecutive pieces = higher threat
  }
  
  return threats;
}

// Helper function for advanced AI evaluation
function evaluatePosition(board: (Player | null)[][], player: Player, depth: number): number {
  if (depth === 0) return 0;
  
  let score = 0;
  const validMoves: number[] = [];
  
  for (let col = 0; col < 7; col++) {
    if (isValidMove(board, col)) {
      validMoves.push(col);
    }
  }
  
  for (const col of validMoves) {
    const testBoard = makeMove(board, col, player);
    const { winner } = checkWinner(testBoard);
    
    if (winner === player) {
      score += 15; // High value for winning moves
    } else if (winner === (player === 1 ? 2 : 1)) {
      score -= 15; // High penalty for losing moves
    } else {
      // Recursively evaluate opponent's response
      score -= evaluatePosition(testBoard, player === 1 ? 2 : 1, depth - 1) * 0.7;
    }
  }
  
  return score;
}
