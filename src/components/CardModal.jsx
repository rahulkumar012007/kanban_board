import { useState, useEffect } from 'react';

const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900';

export default function CardModal({ card, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', ...card });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (form.title.trim()) onSave({ ...form, title: form.title.trim() });
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={card ? 'Edit card' : 'Add card'}
        className="w-full max-w-md space-y-3 rounded-xl bg-white p-5 shadow-2xl dark:bg-slate-800"
      >
        <h2 className="text-base font-bold">{card ? 'Edit card' : 'Add card'}</h2>
        <input autoFocus required placeholder="Title" value={form.title} onChange={set('title')} className={input} />
        <textarea rows={3} placeholder="Description (optional)" value={form.description} onChange={set('description')} className={input} />
        <div className="flex gap-3">
          <select value={form.priority} onChange={set('priority')} className={input} aria-label="Priority">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input type="date" value={form.dueDate} onChange={set('dueDate')} className={input} aria-label="Due date" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm">Cancel</button>
          <button className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
            {card ? 'Save changes' : 'Add card'}
          </button>
        </div>
      </form>
    </div>
  );
}
