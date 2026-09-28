import { memo, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { renameColumn, deleteColumn } from '../store/boardSlice';
import Card from './Card';

function Column({ id, filter, dragDisabled, onAdd, onEdit }) {
  const dispatch = useDispatch();
  const column = useSelector((s) => s.board.columns[id]);
  const cards = useSelector((s) => s.board.cards);
  const { setNodeRef, isOver } = useDroppable({ id });
  const [editing, setEditing] = useState(false);

  const visible = useMemo(() => {
    const q = filter.q.trim().toLowerCase();
    return column.cardIds.filter((cid) => {
      const c = cards[cid];
      return (filter.priority === 'all' || c.priority === filter.priority) &&
        (!q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    });
  }, [column.cardIds, cards, filter]);

  return (
    <section className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-[#dde3ea] p-3 dark:bg-[#1c222b]">
      <div className="mb-3 flex items-center gap-2">
        {editing ? (
          <input
            autoFocus
            defaultValue={column.title}
            onBlur={(e) => {
              const title = e.target.value.trim();
              if (title) dispatch(renameColumn({ id, title }));
              setEditing(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            className="min-w-0 flex-1 rounded bg-white px-2 py-1 text-sm font-semibold dark:bg-slate-800"
          />
        ) : (
          <h2 onDoubleClick={() => setEditing(true)} title="Double-click to rename" className="flex-1 truncate text-sm font-semibold">
            {column.title}
          </h2>
        )}
        <span className="rounded-full bg-white/70 px-2 text-xs dark:bg-slate-700">{column.cardIds.length}</span>
        <button
          aria-label={`Delete column ${column.title}`}
          onClick={() => window.confirm(`Delete "${column.title}" and its cards?`) && dispatch(deleteColumn(id))}
          className="text-slate-500 hover:text-red-600"
        >
          ✕
        </button>
      </div>

      <div ref={setNodeRef} className={`flex min-h-12 flex-col gap-2 overflow-y-auto rounded-lg ${isOver ? 'bg-teal-600/10' : ''}`}>
        <SortableContext items={visible} strategy={verticalListSortingStrategy}>
          {visible.map((cid) => (
            <Card key={cid} card={cards[cid]} columnId={id} disabled={dragDisabled} onEdit={onEdit} />
          ))}
        </SortableContext>
        {visible.length === 0 && <p className="px-1 py-3 text-xs text-slate-500">No cards here. Add one or drop a card in.</p>}
      </div>

      <button onClick={() => onAdd(id)} className="mt-3 rounded-lg py-2 text-left text-sm font-medium text-teal-700 hover:bg-white/60 dark:text-teal-400 dark:hover:bg-slate-700/50">
        + Add card
      </button>
    </section>
  );
}

export default memo(Column);
