import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../app';
import { openDb } from '../db';

describe('/api/exercises', () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    app = buildApp({ db: openDb(':memory:') });
  });

  it('starts empty and lists created exercises alphabetically', async () => {
    expect((await app.inject({ method: 'GET', url: '/api/exercises' })).json()).toEqual([]);

    const created = await app.inject({
      method: 'POST',
      url: '/api/exercises',
      payload: { name: '  Kniebeuge ', muscleGroup: 'legs' },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({ name: 'Kniebeuge', muscleGroup: 'legs', equipment: null });

    await app.inject({ method: 'POST', url: '/api/exercises', payload: { name: 'Bankdrücken' } });

    const list = (await app.inject({ method: 'GET', url: '/api/exercises' })).json();
    expect(list.map((e: { name: string }) => e.name)).toEqual(['Bankdrücken', 'Kniebeuge']);
  });

  it('rejects an empty name', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/exercises', payload: { name: '   ' } });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: 'Name fehlt' });
  });

  it('rejects an unknown muscle group', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/exercises', payload: { name: 'X', muscleGroup: 'ears' } });
    expect(res.statusCode).toBe(400);
  });

  it('rejects duplicate names regardless of case', async () => {
    await app.inject({ method: 'POST', url: '/api/exercises', payload: { name: 'Klimmzug' } });
    const res = await app.inject({ method: 'POST', url: '/api/exercises', payload: { name: 'klimmzug' } });
    expect(res.statusCode).toBe(409);
  });
});
