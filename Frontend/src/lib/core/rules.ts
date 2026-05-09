export type PlayerId = 1 | 2;

export type MatchStatus = 'setup' | 'playing' | 'finished';

export type MatchFormat = {
  bestOf: 3 | 5;
};

export type SetScore = { p1: number; p2: number };

export type BaseMatchState = {
  sport: SportId;
  player1: string;
  player2: string;
  format: MatchFormat;
  status: MatchStatus;
  winner: PlayerId | null;

  // Completed sets (games for tennis; points for others)
  sets: SetScore[];

  // Live scoreboard values (points-in-game for tennis; points-in-set for others)
  currentGame: {
    p1Points: number;
    p2Points: number;
    server: PlayerId;
  };

  // Sets won
  p1Sets: number;
  p2Sets: number;
};

export type SportId = 'tennis' | 'badminton' | 'table-tennis';

export type MatchEvent =
  | { type: 'START_MATCH'; payload: { sport: SportId; player1: string; player2: string; bestOf: 3 | 5 } }
  | { type: 'POINT_WON'; payload: { player: PlayerId } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'END_MATCH' };

export type SportEngine<S extends BaseMatchState = BaseMatchState> = {
  sport: SportId;
  getInitialState(input: { player1: string; player2: string; format: MatchFormat }): S;
  reduce(state: S, event: Exclude<MatchEvent, { type: 'START_MATCH' | 'UNDO' | 'REDO' }>): S;
};

