import { historyInit, historyPush, historyRedo, historyUndo, HistoryStack } from './historyStack';
import { BaseMatchState, MatchEvent, SportEngine, SportId } from './rules';
import { validateEvent } from './validators';

export type MatchMachine<S extends BaseMatchState = BaseMatchState> = {
  getState(): HistoryStack<S>;
  dispatch(event: MatchEvent): void;
};

export function setsNeeded(bestOf: 3 | 5) {
  return Math.ceil(bestOf / 2);
}

export function createMatchMachine(
  engines: Record<SportId, SportEngine<any>>,
  initial: BaseMatchState
): MatchMachine<any> {
  let history = historyInit(initial);

  const dispatch = (event: MatchEvent) => {
    validateEvent(event);

    if (event.type === 'UNDO') {
      history = historyUndo(history);
      return;
    }

    if (event.type === 'REDO') {
      history = historyRedo(history);
      return;
    }

    const state = history.present;

    if (event.type === 'START_MATCH') {
      const engine = engines[event.payload.sport];
      const next = engine.getInitialState({
        player1: event.payload.player1,
        player2: event.payload.player2,
        format: { bestOf: event.payload.bestOf },
      });
      history = historyPush(history, next);
      return;
    }

    if (state.status !== 'playing') return;

    if (event.type === 'END_MATCH') {
      history = historyPush(history, { ...state, status: 'finished' });
      return;
    }

    const engine = engines[state.sport];
    const next = engine.reduce(state, event);
    history = historyPush(history, next);
  };

  return {
    getState: () => history,
    dispatch,
  };
}

