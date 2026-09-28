# Kanban Board

Trello-style task board built with React, Redux Toolkit, Tailwind CSS and dnd-kit.

## Features
- Drag and drop cards within and across columns (mouse, touch and keyboard)
- Add, edit and delete cards (title, description, priority, due date)
- Add, rename (double-click) and delete columns
- Search and priority filter
- Dark mode, responsive layout
- State persists in localStorage (debounced)

## Performance notes
- Normalized Redux state (cards map + column id lists), so moves are O(1)
- `React.memo` on Column and Card, so only affected columns re-render
- Drag handlers read fresh state from the store instead of subscribing to it
- Debounced localStorage writes

## Run
```
npm install
npm run dev
```
Deploy: push to GitHub and import the repo on Vercel or Netlify (build: `npm run build`, output: `dist`).
