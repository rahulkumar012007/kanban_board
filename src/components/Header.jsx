import { useDispatch } from 'react-redux';
import { resetBoard } from '../store/boardSlice';

const field = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800';

export default function Header({ filter, setFilter, dark, toggleDark }) {
  const dispatch = useDispatch();
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-300 px-5 py-3 dark:border-slate-700">
      <h1 className="mr-auto text-lg font-bold tracking-tight">Kanban Board</h1>
      <input
        aria-label="Search cards"
        placeholder="Search cards"
        value={filter.q}
        onChange={(e) => setFilter({ ...filter, q: e.target.value })}
        className={`${field} w-48`}
      />
      <select
        aria-label="Filter by priority"
        value={filter.priority}
        onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        className={field}
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button onClick={toggleDark} className={field}>{dark ? 'Light mode' : 'Dark mode'}</button>
      <button
        onClick={() => window.confirm('Reset the board to the sample data?') && dispatch(resetBoard())}
        className={field}
      >
        Reset board
      </button>
    </header>
  );
}
