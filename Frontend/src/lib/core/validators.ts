import { MatchEvent } from './rules';

export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}

export function validateEvent(event: MatchEvent) {
  switch (event.type) {
    case 'START_MATCH':
      if (!event.payload.player1 || !event.payload.player2) {
        throw new Error('Players are required');
      }
      return;
    case 'POINT_WON':
      return;
    case 'UNDO':
    case 'REDO':
    case 'END_MATCH':
      return;
    default:
      assertNever(event);
  }
}

