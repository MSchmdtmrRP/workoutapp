import { useState, type FormEvent } from 'react';
import { MUSCLE_GROUPS, type Exercise, type MuscleGroup } from '@workoutapp/shared';
import { api } from '../../api';

interface Props {
  onCreated: (exercise: Exercise) => void;
}

export function ExerciseForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      onCreated(await api.exercises.create({ name, muscleGroup: muscleGroup || null }));
      setName('');
      setMuscleGroup('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Bankdrücken"
          maxLength={100}
          required
        />
      </label>
      <label className="field">
        <span>Muskelgruppe</span>
        <select value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup | '')}>
          <option value="">– keine –</option>
          {Object.entries(MUSCLE_GROUPS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="button-primary" disabled={saving || !name.trim()}>
        {saving ? 'Speichere …' : 'Übung anlegen'}
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
