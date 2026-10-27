import { z } from 'zod';

/** Stored as key in the DB, label is what the UI shows. */
export const MUSCLE_GROUPS = {
  chest: 'Brust',
  back: 'Rücken',
  shoulders: 'Schultern',
  biceps: 'Bizeps',
  triceps: 'Trizeps',
  legs: 'Beine',
  glutes: 'Gesäß',
  core: 'Bauch/Core',
  full_body: 'Ganzkörper',
  cardio: 'Cardio',
} as const;

export type MuscleGroup = keyof typeof MUSCLE_GROUPS;

const muscleGroupKeys = Object.keys(MUSCLE_GROUPS) as [MuscleGroup, ...MuscleGroup[]];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable()
    .default(null);

export const exerciseInputSchema = z.object({
  name: z
    .string({ error: 'Name fehlt' })
    .trim()
    .min(1, 'Name fehlt')
    .max(100, 'Name ist zu lang (max. 100 Zeichen)'),
  muscleGroup: z.enum(muscleGroupKeys, { error: 'Unbekannte Muskelgruppe' }).nullable().default(null),
  equipment: optionalText(100),
  notes: optionalText(1000),
});

/** What the client sends (optional fields may be omitted). */
export type ExerciseInput = z.input<typeof exerciseInputSchema>;

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: MuscleGroup | null;
  equipment: string | null;
  notes: string | null;
  createdAt: string;
}

/** Alphabetical, German collation (Ü next to U), case-insensitive. */
export const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
