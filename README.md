# CV Screener

Monorepo with a React + TypeScript frontend and an Express backend. The backend is a health-check stub for now — AI screening routes will land here later.

```
cv-screener/
├── backend/     Express API
└── frontend/    Vite + React
```

## Setup

```bash
npm install
cp backend/.env.example backend/.env
```

## Develop

```bash
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:5173
```

Health check: [http://localhost:3001/health](http://localhost:3001/health) → `{"status":"ok"}`.
