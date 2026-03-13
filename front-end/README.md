# TaskPro Dashboard (React)

This Vite + React app ports the rich TaskPro interface from the provided Next.js project, keeping the same gradients, motion, and Kanban interactions while running in a lightweight React environment.

## Features
- Animated sidebar with tab switching between Dashboard, Task Board, Projects, Analytics, and Settings.
- Dashboard overview with stat cards, project list, and hover/scroll effects powered by Tailwind utilities.
- Full Kanban board with drag-and-drop cards, live column counts, and a glassy task detail modal.
- Premium-style login and signup screens with validation, password strength hints, and localStorage-backed session stubs.
- Tailwind CSS v4 pipeline (via `@tailwindcss/postcss`) plus `tw-animate-css` for the custom animation utilities used in the original UI.

## Getting Started
1. Install dependencies
	```bash
	npm install
	```
2. Start the development server with HMR
	```bash
	npm run dev
	```
3. Create a production build
	```bash
	npm run build
	```

## Project Structure
- `src/components/Sidebar.jsx` – Animated navigation with mobile toggle and profile block.
- `src/components/DashboardHeader.jsx` – Sticky top bar with search and quick actions.
- `src/components/DashboardView.jsx` – Quick stats grid + project list powered by `AnalyticsCard` and `ProjectList`.
- `src/components/KanbanBoard.jsx` – Column layout, drag/drop, and modal wiring (`KanbanColumn`, `TaskCard`, `TaskModal`).
- `src/screens/Login.jsx` and `src/screens/Signup.jsx` – Auth flows mirroring the Next.js experience with glassmorphism styling.
- `src/index.css` – Tailwind entry point plus the color tokens and utility layers copied from the Next.js build.

## Notes & Customization
- Tailwind tokens map to the same CSS variables as the Next.js source, so tweaking the palette in `src/index.css` will update every utility (`bg-card`, `text-muted-foreground`, etc.).
- `Sidebar` accepts `activeTab`, `onTabChange`, and `user` / `onLogout` props, which now connect to the sample auth state in `App.jsx`.
- Extend the board by editing the `defaultTasks` object inside `KanbanBoard.jsx` or swap in data from an API when ready.
