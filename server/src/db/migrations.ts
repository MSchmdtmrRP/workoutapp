/**
 * Schema migrations, applied in order. `PRAGMA user_version` stores how many have run.
 * Append-only: never edit a migration that is already in use — add a new one instead.
 *
 * Conventions: snake_case columns, timestamps as ISO-8601 UTC text, weights in kg.
 */
const NOW = `(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

export const migrations: string[] = [
  // 1 – MVP schema: exercise catalogue, templates, workout log
  `
  CREATE TABLE exercises (
    id           INTEGER PRIMARY KEY,
    name         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    muscle_group TEXT,
    equipment    TEXT,
    notes        TEXT,
    created_at   TEXT    NOT NULL DEFAULT ${NOW}
  );

  -- Trainingspläne / Vorlagen
  CREATE TABLE templates (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    notes      TEXT,
    created_at TEXT NOT NULL DEFAULT ${NOW}
  );

  CREATE TABLE template_exercises (
    id               INTEGER PRIMARY KEY,
    template_id      INTEGER NOT NULL REFERENCES templates (id) ON DELETE CASCADE,
    exercise_id      INTEGER NOT NULL REFERENCES exercises (id) ON DELETE RESTRICT,
    position         INTEGER NOT NULL,
    target_sets      INTEGER,
    target_reps      INTEGER,
    target_weight_kg REAL,
    rest_seconds     INTEGER
  );
  CREATE INDEX idx_template_exercises_template ON template_exercises (template_id, position);

  -- Durchgeführte Trainings; template_id ist optional (freies Workout)
  CREATE TABLE workouts (
    id          INTEGER PRIMARY KEY,
    template_id INTEGER REFERENCES templates (id) ON DELETE SET NULL,
    name        TEXT,
    started_at  TEXT NOT NULL DEFAULT ${NOW},
    finished_at TEXT,
    notes       TEXT
  );
  CREATE INDEX idx_workouts_started_at ON workouts (started_at);

  CREATE TABLE workout_sets (
    id          INTEGER PRIMARY KEY,
    workout_id  INTEGER NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises (id) ON DELETE RESTRICT,
    position    INTEGER NOT NULL,
    reps        INTEGER,
    weight_kg   REAL,
    created_at  TEXT NOT NULL DEFAULT ${NOW}
  );
  CREATE INDEX idx_workout_sets_workout ON workout_sets (workout_id, position);
  CREATE INDEX idx_workout_sets_exercise ON workout_sets (exercise_id);
  `,
];
