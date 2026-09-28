import { useState, useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor, closestCorners, useSensor, useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { addColumn, addCard, updateCard, moveCard } from '../store/boardSlice';
import Column from './Column';
import { CardView } from './Card';
import CardModal from './CardModal';

export default function Board({ filter }) {
  const dispatch = useDispatch();
  const store = useStore();
  const columnOrder = useSelector((s) => s.board.columnOrder);
  const [activeId, setActiveId] = useState(null);
  const [modal, setModal] = useState(null); // { columnId, card? }
  const [newCol, setNewCol] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Read fresh state inside handlers instead of subscribing, so drag events stay cheap.
  const findColumn = (id) => {
    const { columns } = store.getState().board;
    if (columns[id]) return id;
    return Object.keys(columns).find((c) => columns[c].cardIds.includes(id));
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;
    const from = findColumn(active.id);
    const to = findColumn(over.id);
    if (!from || !to || from === to) return;
    const { columns } = store.getState().board;
    const overIdx = columns[to].cardIds.indexOf(over.id);
    dispatch(moveCard({ cardId: active.id, from, to, index: overIdx < 0 ? columns[to].cardIds.length : overIdx }));
  };

  const onDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const from = findColumn(active.id);
    const to = findColumn(over.id);
    if (from && from === to) {
      const ids = store.getState().board.columns[to].cardIds;
      const index = ids.indexOf(over.id);
      if (index >= 0) dispatch(moveCard({ cardId: active.id, from, to, index }));
    }
  };

  const onSave = useCallback(
    (data) => {
      if (modal.card) dispatch(updateCard({ ...data, id: modal.card.id }));
      else dispatch(addCard(modal.columnId, data));
      setModal(null);
    },
    [modal, dispatch]
  );

  const openAdd = useCallback((columnId) => setModal({ columnId }), []);
  const openEdit = useCallback((card) => setModal({ card }), []);
  const closeModal = useCallback(() => setModal(null), []);
  const activeCard = useSelector((s) => (activeId ? s.board.cards[activeId] : null));
  const filtering = filter.q.trim() !== '' || filter.priority !== 'all';

  return (
    <main className="flex flex-1 items-start gap-4 overflow-x-auto p-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        {columnOrder.map((id) => (
          <Column key={id} id={id} filter={filter} dragDisabled={filtering} onAdd={openAdd} onEdit={openEdit} />
        ))}
        <DragOverlay>{activeCard && <CardView card={activeCard} overlay />}</DragOverlay>
      </DndContext>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newCol.trim()) dispatch(addColumn(newCol.trim()));
          setNewCol('');
        }}
        className="w-72 shrink-0"
      >
        <input
          aria-label="New column name"
          placeholder="Add a column (press Enter)"
          value={newCol}
          onChange={(e) => setNewCol(e.target.value)}
          className="w-full rounded-xl border border-dashed border-slate-400 bg-transparent px-3 py-2.5 text-sm dark:border-slate-600"
        />
      </form>

      {modal && <CardModal card={modal.card} onSave={onSave} onClose={closeModal} />}
    </main>
  );
}
