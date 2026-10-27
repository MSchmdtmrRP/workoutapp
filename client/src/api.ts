import type { ApiErrorBody, Exercise, ExerciseInput } from '@workoutapp/shared';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = init.body ? { 'Content-Type': 'application/json' } : undefined;
  const res = await fetch(`/api${path}`, { ...init, headers });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError((body as ApiErrorBody | null)?.error ?? `Serverfehler (${res.status})`, res.status);
  }
  return body as T;
}

export const api = {
  exercises: {
    list: () => request<Exercise[]>('/exercises'),
    create: (input: ExerciseInput) =>
      request<Exercise>('/exercises', { method: 'POST', body: JSON.stringify(input) }),
  },
};
