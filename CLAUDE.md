# CLAUDE.md

## Projektziel

Persönliche Workout-App, die **ausschließlich lokal** auf einem Windows-11-Laptop läuft (später optional auch am Handy im selben WLAN). Kein Cloud-Backend, keine Accounts. Alle Daten liegen in einer SQLite-Datei, die sich einfach sichern lässt. Fokus: schnell im Training bedienbar, übersichtlicher Fortschritt.

## Stack

- **Frontend** (`client/`): React 19 + TypeScript, Vite. Mobile-first CSS mit CSS-Variablen in `src/styles.css` (Hell/Dunkel über `prefers-color-scheme`), kein UI-Framework. PWA-Manifest in `public/`.
- **Backend** (`server/`): Fastify 5 + TypeScript, ausgeführt mit `tsx` (kein Build-Schritt). Läuft auf `127.0.0.1:3001`.
- **Datenbank**: SQLite über das in Node 24 eingebaute `node:sqlite` (`DatabaseSync`, synchron). Datei: `data/workoutapp.db` (überschreibbar via `DB_PATH`).
- **Shared** (`shared/`): Zod-Schemas, Typen und Konstanten, die Frontend und Backend gemeinsam nutzen (Paket `@workoutapp/shared`, wird als TypeScript-Quelle importiert).
- **Tests**: Vitest im Backend, API-Tests über `app.inject()` gegen eine In-Memory-DB.
- npm-Workspaces; Node ≥ 24.

## Befehle

- `npm run dev` – Frontend (http://localhost:5173) + Backend starten; Vite proxied `/api` an das Backend
- `npm test` – Backend-Tests
- `npm run typecheck` – `tsc --noEmit` in allen Workspaces
- `npm run build` + `npm start` – gebautes Frontend wird vom Backend auf http://localhost:3001 ausgeliefert

## Architektur & Konventionen

- **Sprache**: UI-Texte und Fehlermeldungen für Nutzer auf Deutsch; Code, Bezeichner und Code-Kommentare auf Englisch. Doku (README, CLAUDE.md) auf Deutsch.
- **API**: REST unter `/api/<ressource>`, JSON in camelCase. Fehler immer als `{ "error": "<deutsche Meldung>" }` mit passendem Statuscode (400 Validierung, 404, 409 Konflikt).
- **Validierung**: Eingaben werden im Backend mit dem Zod-Schema aus `shared/` geprüft (`safeParse`); das Frontend nutzt dieselben Typen (`z.input<…>`) und Konstanten.
- **Datenbank**:
  - Tabellen und Spalten in snake_case; Zeitstempel als ISO-8601-UTC-Text; Gewichte in kg.
  - Schemaänderungen nur über eine **neue** Migration am Ende von `server/src/db/migrations.ts` – bestehende Migrationen nie ändern (Stand steht in `PRAGMA user_version`).
  - Mapping Row → API-Objekt explizit pro Route (`toExercise` o. ä.), SQL mit `?`-Platzhaltern.
- **Backend-Struktur**: `src/app.ts` baut die App (testbar ohne Netzwerk), `src/index.ts` startet sie; eine Datei pro Ressource in `src/routes/` als Fastify-Plugin, das `db` als Option bekommt. Tests liegen neben der Route (`*.test.ts`).
- **Frontend-Struktur**: Feature-Ordner unter `src/features/<feature>/`; alle HTTP-Aufrufe zentral in `src/api.ts`. State lokal mit React-Hooks, solange es reicht.
- **Mobile-first**: Touch-Ziele ≥ 44 px, Layout zuerst für schmale Screens, Inhaltsspalte max. 640 px.
- **Qualität vor jedem Commit**: `npm run typecheck` und `npm test` müssen grün sein; neue API-Endpunkte bekommen Tests.

## Arbeitsweise

- Features einzeln umsetzen: erst Plan-Modus (Plan mit dem User abstimmen), dann Umsetzung, dann **ein Commit pro Feature** auf `main`.
- Änderungen im Browser prüfen (`npm run dev`, http://localhost:5173).
- **Kein Push zu GitHub ohne ausdrückliche Zustimmung des Users.**

## Roadmap

### MVP

- [x] Grundgerüst: Frontend → API → SQLite-Durchstich (Übungsliste + „Übung anlegen“), DB-Schema für alle MVP-Entitäten
- [ ] **Übungskatalog**: Übungen bearbeiten/löschen, Equipment und Notizen, Filter nach Muskelgruppe, Suche; Navigation zwischen den Bereichen
- [ ] **Trainingspläne/Vorlagen**: Vorlage anlegen, Übungen hinzufügen und sortieren, Ziel-Sätze/-Wdh./-Gewicht und Pausenzeit je Übung
- [ ] **Workout loggen + Pausentimer**: Workout aus Vorlage oder frei starten, Sätze mit Wdh. und Gewicht erfassen (letzte Werte vorschlagen), Pausentimer nach jedem Satz, Workout abschließen
- [ ] **Verlauf + Fortschritt**: Liste vergangener Workouts mit Details, Fortschrittsdiagramm je Übung (z. B. Höchstgewicht, Volumen)

### Später

- [ ] PWA vollständig: Service Worker/Offline, installierbar am Handy, Zugriff im WLAN (Backend auf `0.0.0.0`, HTTPS für Service Worker nötig)
- [ ] Statistiken (Trainingsfrequenz, Volumen pro Muskelgruppe, persönliche Bestleistungen)
- [ ] Export/Import (CSV/JSON) und Backup-Funktion in der App
- [ ] Optional: Desktop-Wrapper (z. B. Tauri)
