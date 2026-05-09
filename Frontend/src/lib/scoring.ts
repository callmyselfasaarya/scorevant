import { Sport } from '../types/match';

type ScoreResult = {
  p1Points: number;
  p2Points: number;
  server: 1 | 2;
  gameWon: 1 | 2 | null;
  matchWon?: 1 | 2 | null;
};

export const TENNIS_SCORES = [0, 15, 30, 40];

export function getTennisScoreDisplay(p1: number, p2: number): [string, string] {
  if (p1 >= 3 && p2 >= 3) {
    if (p1 === p2) return ['Deuce', 'Deuce'];
    if (p1 > p2) return ['Ad', ''];
    return ['', 'Ad'];
  }
  return [TENNIS_SCORES[p1]?.toString() ?? '0', TENNIS_SCORES[p2]?.toString() ?? '0'];
}

export function scorePoint(
  sport: Sport,
  p1: number,
  p2: number,
  scorer: 1 | 2,
  currentServer: 1 | 2,
  p1Games: number,
  p2Games: number,
  bestOf: 3 | 5
): ScoreResult {
  const isP1 = scorer === 1;
  const newP1 = isP1 ? p1 + 1 : p1;
  const newP2 = isP1 ? p2 : p2 + 1;

  if (sport === 'tennis') {
    // Tiebreak
    if (p1Games === 6 && p2Games === 6) {
      const isWin = (newP1 >= 7 || newP2 >= 7) && Math.abs(newP1 - newP2) >= 2;
      const totalPoints = newP1 + newP2;
      // In tiebreak, server changes after point 1, then every 2 points
      const newServer = (totalPoints % 2 !== 0) ? (currentServer === 1 ? 2 : 1) : currentServer;
      return {
        p1Points: newP1,
        p2Points: newP2,
        server: newServer,
        gameWon: isWin ? scorer : null
      };
    }

    // Normal game
    const isWin = (newP1 >= 4 || newP2 >= 4) && Math.abs(newP1 - newP2) >= 2;
    return {
      p1Points: newP1,
      p2Points: newP2,
      server: isWin ? (currentServer === 1 ? 2 : 1) : currentServer, // Switch server on new game
      gameWon: isWin ? scorer : null
    };
  }

  // Rally scoring sports
  let winTo = 11;
  let winBy = 2;
  let cap = Infinity;

  if (sport === 'badminton') {
    winTo = 21;
    cap = 30;
  }

  let isWin = false;
  if ((newP1 >= winTo || newP2 >= winTo) && Math.abs(newP1 - newP2) >= winBy) {
    isWin = true;
  } else if (newP1 === cap || newP2 === cap) {
    isWin = true;
  }

  let newServer = currentServer;
  if (sport === 'table-tennis') {
    // In table tennis, server changes every 2 points, unless 10-10, then every 1 point
    const isDeuce = newP1 >= 10 && newP2 >= 10;
    const totalPoints = newP1 + newP2;
    if (isDeuce) {
      newServer = currentServer === 1 ? 2 : 1;
    } else if (totalPoints > 0 && totalPoints % 2 === 0) {
      newServer = currentServer === 1 ? 2 : 1;
    }
  } else {
    // Squash, Badminton, Pickleball: point winner serves
    newServer = scorer;
  }

  return {
    p1Points: newP1,
    p2Points: newP2,
    server: isWin ? newServer : newServer,
    gameWon: isWin ? scorer : null
  };
}
