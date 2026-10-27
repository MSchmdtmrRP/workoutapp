import type { FastifyPluginAsync } from 'fastify';
import { byName, exerciseInputSchema, type Exercise, type MuscleGroup } from '@workoutapp/shared';
import { isUniqueViolation, type Db } from '../db';

interface ExerciseRow {
  id: number;
  name: string;
  muscle_group: MuscleGroup | null;
  equipment: string | null;
  notes: string | null;
  created_at: string;
}

const toExercise = (row: ExerciseRow): Exercise => ({
  id: row.id,
  name: row.name,
  muscleGroup: row.muscle_group,
  equipment: row.equipment,
  notes: row.notes,
  createdAt: row.created_at,
});

export const exerciseRoutes: FastifyPluginAsync<{ db: Db }> = async (app, { db }) => {
  app.get('/', async () => {
    const rows = db.prepare('SELECT * FROM exercises').all() as unknown as ExerciseRow[];
    return rows.map(toExercise).sort(byName);
  });

  app.post('/', async (req, reply) => {
    const parsed = exerciseInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe' });
    }

    const { name, muscleGroup, equipment, notes } = parsed.data;
    try {
      const row = db
        .prepare('INSERT INTO exercises (name, muscle_group, equipment, notes) VALUES (?, ?, ?, ?) RETURNING *')
        .get(name, muscleGroup, equipment, notes) as unknown as ExerciseRow;
      return reply.code(201).send(toExercise(row));
    } catch (err) {
      if (isUniqueViolation(err)) {
        return reply.code(409).send({ error: `Die Übung „${name}“ gibt es schon.` });
      }
      throw err;
    }
  });
};
