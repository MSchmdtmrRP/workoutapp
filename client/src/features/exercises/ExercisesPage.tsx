import { useEffect, useState } from 'react';
import { byName, MUSCLE_GROUPS, type Exercise } from '@workoutapp/shared';
import { api } from '../../api';
import { ExerciseForm } from './ExerciseForm';

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    api.exercises.list().then(setExercises, (err: Error) => setLoadError(err.message));
  }, []);

  function handleCreated(exercise: Exercise) {
    setExercises((current) => [...(current ?? []), exercise].sort(byName));
  }

  return (
    <section className="stack">
      <h1>Übungen</h1>

      <ExerciseForm onCreated={handleCreated} />

      {loadError && <p className="error" role="alert">Übungen konnten nicht geladen werden: {loadError}</p>}
      {!exercises && !loadError && <p className="muted">Lade …</p>}
      {exercises?.length === 0 && (
        <div className="empty">
          <p>Noch keine Übungen angelegt.</p>
          <p className="muted">Leg oben deine erste Übung an, z. B. „Kniebeuge“.</p>
        </div>
      )}
      {exercises && exercises.length > 0 && (
        <ul className="list" aria-label="Übungen">
          {exercises.map((exercise) => (
            <li key={exercise.id} className="list-item">
              <span className="list-item-title">{exercise.name}</span>
              {exercise.muscleGroup && <span className="tag">{MUSCLE_GROUPS[exercise.muscleGroup]}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
