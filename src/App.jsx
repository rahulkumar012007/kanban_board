import { useEffect, useState } from 'react';
import Header from './components/Header';
import Board from './components/Board';

export default function App() {
  const [filter, setFilter] = useState({ q: '', priority: 'all' });
  const [dark, setDark] = useState(() => localStorage.getItem('kanban-dark') === '1');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('kanban-dark', dark ? '1' : '0');
  }, [dark]);

  return (
    <div className="flex h-screen flex-col">
      <Header filter={filter} setFilter={setFilter} dark={dark} toggleDark={() => setDark((d) => !d)} />
      <Board filter={filter} />
    </div>
  );
}
