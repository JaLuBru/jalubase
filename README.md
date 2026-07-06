# Personal Dashboard

A low-friction personal dashboard for broad capture, memory, resurfacing, and later planning.

The first version focuses on saving anything worth remembering:

- raw thoughts
- links
- quotes
- things to buy
- books, audiobooks, and movies
- person notes
- project and learning notes
- health notes

## Current Bucket

Bucket 2: project foundation.

This bucket creates:

- Next.js app foundation
- PostgreSQL schema
- quick capture screen
- memory inbox/search view
- Docker Compose setup for local or homelab deployment

## Local Development

Requirements:

- Node.js 22 or newer
- PostgreSQL 17 or compatible

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Install dependencies:

```powershell
npm install
```

Create the database tables:

```powershell
npm run db:init
```

Run the app:

```powershell
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Docker Mode

Requirements:

- Docker
- Docker Compose

Start the app and database:

```powershell
docker compose up --build
```

Then open:

```text
http://localhost:3000
```

PostgreSQL data is stored in the `dashboard_postgres` Docker volume.

If port `3000` is already in use on the host, choose another host port:

```powershell
$env:APP_PORT=3001
docker compose up --build
```

On Linux:

```bash
APP_PORT=3001 docker compose up --build -d
```

## Future Homelab Flow

The intended Proxmox flow:

1. Push changes to GitHub.
2. SSH into the server.
3. Pull the latest code.
4. Run `APP_PORT=3001 docker compose up --build -d` if port `3000` is already busy, otherwise run `docker compose up --build -d`.

Later, this can be automated with a deploy script or a small webhook service.

## Decision Log

- 2026-07-05: First version prioritizes broad capture and remembering everything.
- 2026-07-05: PostgreSQL is used from the start.
- 2026-07-05: Login/auth is deferred until before homelab exposure.
- 2026-07-05: The first screen is capture plus memory inbox, not a task dashboard.
