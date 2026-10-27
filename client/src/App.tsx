import { ExercisesPage } from './features/exercises/ExercisesPage';

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img src="/icon.svg" alt="" width={28} height={28} />
        <span>Workout</span>
      </header>
      <main className="app-main">
        <ExercisesPage />
      </main>
    </div>
  );
}
