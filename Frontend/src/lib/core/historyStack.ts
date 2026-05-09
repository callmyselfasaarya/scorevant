export type HistoryStack<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function historyInit<T>(present: T): HistoryStack<T> {
  return { past: [], present, future: [] };
}

export function historyCanUndo<T>(h: HistoryStack<T>) {
  return h.past.length > 0;
}

export function historyCanRedo<T>(h: HistoryStack<T>) {
  return h.future.length > 0;
}

export function historyPush<T>(h: HistoryStack<T>, next: T): HistoryStack<T> {
  if (Object.is(h.present, next)) return h;
  return { past: [...h.past, h.present], present: next, future: [] };
}

export function historyUndo<T>(h: HistoryStack<T>): HistoryStack<T> {
  if (h.past.length === 0) return h;
  const prev = h.past[h.past.length - 1];
  return {
    past: h.past.slice(0, -1),
    present: prev,
    future: [h.present, ...h.future],
  };
}

export function historyRedo<T>(h: HistoryStack<T>): HistoryStack<T> {
  if (h.future.length === 0) return h;
  const next = h.future[0];
  return {
    past: [...h.past, h.present],
    present: next,
    future: h.future.slice(1),
  };
}

