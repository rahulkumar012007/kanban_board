import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { deleteCard } from '../store/boardSlice';

const PRIORITY = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export function CardView({ card, overlay, onEdit, onDelete }) {
  const overdue = card.dueDate && new Date(card.dueDate) < new Date(new Date().toDateString());
  return (
    <article className={`rounded-lg bg-white p-3 text-sm shadow-sm dark:bg-slate-800 ${overlay ? 'rotate-2 shadow-xl' : ''}`}>
      <div className="flex items-start gap-2">
        <h3 className="flex-1 font-medium leading-snug">{card.title}</h3>
        {!overlay && (
          <>
            <button aria-label="Edit card" onClick={() => onEdit(card)} className="text-slate-400 hover:text-teal-600">✎</button>
            <button aria-label="Delete card" onClick={onDelete} className="text-slate-400 hover:text-red-600">✕</button>
          </>
        )}
      </div>
      {card.description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.description}</p>}
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY[card.priority]}`}>{card.priority}</span>
        {card.dueDate && (
          <span className={overdue ? 'font-medium text-red-600' : 'text-slate-500'}>
            {overdue ? 'Overdue: ' : 'Due '}{card.dueDate}
          </span>
        )}
      </div>
    </article>
  );
}

function Card({ card, columnId, disabled, onEdit }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      className={disabled ? '' : 'cursor-grab active:cursor-grabbing'}
      {...attributes}
      {...listeners}
    >
      <CardView card={card} onEdit={onEdit} onDelete={() => dispatch(deleteCard({ id: card.id, columnId }))} />
    </div>
  );
}

export default memo(Card);
