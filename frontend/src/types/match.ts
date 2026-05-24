export type Sport = 'tennis' | 'badminton' | 'table-tennis' | 'squash' | 'pickleball';

export type MatchState = {
  matchId?: string | null;
  sport: Sport;
  player1: string;
  player2: string;
  format: { bestOf: 3 | 5 };
  sets: Array<{ p1: number; p2: number }>;
  currentGame: { p1Points: number; p2Points: number; server: 1 | 2 };
  p1Sets: number;
  p2Sets: number;
  p1Games: number;
  p2Games: number;
  status: 'setup' | 'playing' | 'finished';
  winner: 1 | 2 | null;
  history: Array<{ 
    currentGame: { p1Points: number; p2Points: number; server: 1 | 2 };
    sets: Array<{ p1: number; p2: number }>;
    p1Sets: number;
    p2Sets: number;
    p1Games: number;
    p2Games: number;
  }>;
};

export type CompletedMatch = {
  id: string;
  date: string;
  sport: Sport;
  player1: string;
  player2: string;
  format: { bestOf: 3 | 5 };
  sets: Array<{ p1: number; p2: number }>;
  winner: 1 | 2;
  p1Sets: number;
  p2Sets: number;
};
