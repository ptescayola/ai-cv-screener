# CV Screener

Monorepo with a React frontend (chat over CVs) and an Express backend. CV PDFs are generated offline as a data-prep step; RAG ingestion comes later.

```
cv-screener/
├── backend/     Express API + CV generation pipeline (CLI)
└── frontend/    Vite + React chat shell
```

## Backend layout

```
domain/          types and domain helpers
application/     CV generation pipeline (`generateCv.ts`)
infrastructure/  OpenAI, PDFKit, filesystem
composition/     Express app wiring
scripts/         offline data generation CLI
api/             Express app (health check for now)
```

## CV generation (offline dataset)

This is **data prep**, not part of the live chat demo. Run once from the terminal:

```bash
npm run generate:cvs
```

Optional count (1–30):

```bash
npm run generate:cvs -- 28
# or
CV_GENERATION_COUNT=28 npm run generate:cvs --workspace=backend
```

`scripts/generateCvs.ts` loops and calls `application/generateCv.ts` for each PDF.

### Pipeline (same order as `generateCv()`)

Use this flow when explaining the project in the video:

1. **Blueprint** — random role, language, seniority, industry  
   `createRandomCvBlueprint()` in `domain/cvBlueprint.ts`

2. **Texto** — fictional CV content as structured JSON  
   `generateCvProfile(blueprint)` in `infrastructure/openAiClient.ts`

3. **Foto** — AI headshot for the PDF  
   `generateCvPhoto(profile)` in `infrastructure/openAiClient.ts`

4. **PDF** — layout (text + photo, no overlap)  
   `renderCvPdf(profile, photo)` in `infrastructure/pdfCvRender.ts`

5. **Disco** — save under `backend/data/cvs/`  
   `saveCvPdf(pdf, profile, outputDir)` in `infrastructure/fsCvStorage.ts`

For deliverables: walk through `generateCv.ts` + run the script + show PDFs on disk. Optional samples in `backend/data/cvs/examples/`; bulk PDFs are gitignored.

## Setup

```bash
npm install
cp backend/.env.example backend/.env
```

Set `OPENAI_API_KEY` in `backend/.env`. Image defaults: `gpt-image-2.5-flare`, quality `low`, size `816x816`.

## Develop

```bash
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:5173
npm run test          # backend unit tests (Node test runner)
```

Health: [http://localhost:3001/health](http://localhost:3001/health) → `{"status":"ok"}`.
