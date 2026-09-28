import { configureStore } from '@reduxjs/toolkit';
import board from './boardSlice';

const KEY = 'kanban-board-v1';

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { board: JSON.parse(raw) } : undefined;
  } catch {
    return undefined;
  }
};

const store = configureStore({ reducer: { board }, preloadedState: load() });

// Debounced persistence so dragging doesn't hit localStorage on every event.
let timer;
store.subscribe(() => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(store.getState().board)); } catch { /* storage full or blocked */ }
  }, 300);
});

export default store;
