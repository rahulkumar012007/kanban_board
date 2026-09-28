import { createSlice, nanoid } from '@reduxjs/toolkit';

// Normalized state: cards live in one map, columns only hold ordered ids.
// This keeps moves O(1) and avoids re-rendering unrelated cards.
export const initialState = {
  cards: {
    a1: { id: 'a1', title: 'Design landing page', description: 'Wireframe + hero section', priority: 'high', dueDate: '' },
    a2: { id: 'a2', title: 'Set up Redux store', description: '', priority: 'medium', dueDate: '' },
    a3: { id: 'a3', title: 'Write README', description: 'Add screenshots and live link', priority: 'low', dueDate: '' },
    a4: { id: 'a4', title: 'Deploy on Vercel', description: '', priority: 'medium', dueDate: '' },
  },
  columns: {
    todo: { id: 'todo', title: 'To Do', cardIds: ['a1', 'a3'] },
    doing: { id: 'doing', title: 'In Progress', cardIds: ['a2'] },
    done: { id: 'done', title: 'Done', cardIds: ['a4'] },
  },
  columnOrder: ['todo', 'doing', 'done'],
};

const slice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addColumn(state, { payload }) {
      const id = nanoid();
      state.columns[id] = { id, title: payload, cardIds: [] };
      state.columnOrder.push(id);
    },
    renameColumn(state, { payload: { id, title } }) {
      state.columns[id].title = title;
    },
    deleteColumn(state, { payload: id }) {
      state.columns[id].cardIds.forEach((c) => delete state.cards[c]);
      delete state.columns[id];
      state.columnOrder = state.columnOrder.filter((c) => c !== id);
    },
    addCard: {
      reducer(state, { payload: { columnId, card } }) {
        state.cards[card.id] = card;
        state.columns[columnId].cardIds.push(card.id);
      },
      prepare(columnId, card) {
        return { payload: { columnId, card: { ...card, id: nanoid() } } };
      },
    },
    updateCard(state, { payload }) {
      Object.assign(state.cards[payload.id], payload);
    },
    deleteCard(state, { payload: { id, columnId } }) {
      const ids = state.columns[columnId].cardIds;
      ids.splice(ids.indexOf(id), 1);
      delete state.cards[id];
    },
    moveCard(state, { payload: { cardId, from, to, index } }) {
      const src = state.columns[from].cardIds;
      src.splice(src.indexOf(cardId), 1);
      state.columns[to].cardIds.splice(index, 0, cardId);
    },
    resetBoard: () => initialState,
  },
});

export const { addColumn, renameColumn, deleteColumn, addCard, updateCard, deleteCard, moveCard, resetBoard } = slice.actions;
export default slice.reducer;
