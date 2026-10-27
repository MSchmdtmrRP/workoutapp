# Workout

Persönliche Workout-App, die komplett lokal auf dem eigenen Rechner läuft: Übungen pflegen, Trainingspläne anlegen, Workouts loggen und den Fortschritt verfolgen. Keine Cloud, kein Account – alle Daten liegen in einer einzigen SQLite-Datei.

## Voraussetzungen

- [Node.js](https://nodejs.org/) **24 oder neuer** (bringt SQLite bereits mit, kein Compiler nötig)

## Installation

```bash
npm install
```

## Starten

```bash
npm run dev
```

Danach im Browser öffnen: **http://localhost:5173**

Der Befehl startet Frontend (Vite) und Backend (API auf Port 3001) gemeinsam; Codeänderungen werden sofort übernommen. Beenden mit `Strg + C`.

### Alltagsbetrieb ohne Entwicklungsserver

```bash
npm run build
npm start
```

Die App läuft dann komplett über das Backend unter **http://localhost:3001**.

## Daten & Backup

Alle Trainingsdaten liegen in `data/workoutapp.db` (wird beim ersten Start angelegt, ist nicht im Git-Repository).

**Backup:** App beenden, Datei `data/workoutapp.db` kopieren. Zum Wiederherstellen die Kopie an dieselbe Stelle zurücklegen.

Anderer Speicherort: Umgebungsvariable `DB_PATH` setzen, z. B. in PowerShell `$env:DB_PATH = "D:\Backup\workout.db"; npm run dev`.

## Weitere Befehle

| Befehl              | Zweck                                       |
| ------------------- | ------------------------------------------- |
| `npm test`          | API-Tests ausführen (Vitest)                |
| `npm run typecheck` | TypeScript-Prüfung für alle Projektteile    |
| `npm run build`     | Frontend für den Alltagsbetrieb bauen       |

## Projektstruktur

```
client/   Frontend (React, TypeScript, Vite) – mobile-first, als PWA ausgelegt
server/   Backend (Fastify, TypeScript) inkl. SQLite-Zugriff und Migrationen
shared/   Gemeinsame Typen und Validierungsregeln (Zod) für Frontend und Backend
data/     Lokale Datenbank (wird automatisch angelegt, nicht versioniert)
```

Details zu Architektur, Konventionen und Roadmap: [CLAUDE.md](CLAUDE.md).
