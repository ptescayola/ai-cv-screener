# CV Screener

Monorepo with a React frontend (chat over CVs) and an Express backend. CV PDFs are generated offline, then ingested into a local vector index for RAG.

```
cv-screener/
├── backend/     Express API + CV generation pipeline (CLI)
└── frontend/    Vite + React chat UI
```

## Frontend layout (`frontend/src`)

```
modules/chat/
  model/           ChatMessage, createMessage
  application/     outgoing message rules, thread key, scroll metrics
  infrastructure/  chatClient, cvDownloadUrl, datasetClient
components/
  Chat.tsx         composer, message list, empty states
  layout/          AppLayout, AppHeader, AppFooter
  shadcn/          shadcn/ui primitives (button, badge, textarea, …)
  ui/              app-facing re-exports (Button, Badge, …)
  ui/chat/         ChatBubble, ChatTextarea, ChatMessageContent, ChatEmptyNoDataset, …
hooks/             useChat, useChatScroll, useTheme, useDatasetStatus
constants/         prompt suggestions, generate-cvs command copy
utils/             string (lists, PDF names), date (message timestamps)
styles/            global.css, layout.css
index.css          Tailwind v4 + shadcn theme tokens (light / `.dark`)
```

## Backend layout

```
domain/agents/   LLM agent definitions (prompts, temperature, buildUserMessage)
application/     generateCv, ingestCvs, searchCvChunks, answerCvQuestion, getDatasetStatus
infrastructure/  openAi/runAgents (runChatAgent, runImageAgent), PDF, Vectra
composition/     Express app wiring
scripts/         generateCvs, ingestCvs CLIs
api/             HTTP routes (`POST /chat`, `GET /dataset/status`, `GET /cvs/:fileName`)
```

## CV generation (offline dataset)

This is **data prep**, not part of the live chat demo. Run once from the terminal:

```bash
npm run generate:cvs
```

That generates PDFs and then runs **ingest** (text → chunks → embeddings → Vectra index). To rebuild the index from existing PDFs only:

```bash
npm run ingest:cvs
```

Optional count (1–30):

```bash
npm run generate:cvs -- 28
# or
CV_GENERATION_COUNT=28 npm run generate:cvs --workspace=backend
```


### Pipeline

1. **Blueprint** — random role, language, seniority, industry  
   `createRandomCvBlueprint()` in `domain/cvBlueprint.ts`

2. **Text** — fictional CV content as structured JSON  
   Prompts in `domain/agents/cvProfileAgent.ts` → `generateCvProfile()` in `infrastructure/openAiClient.ts`

3. **Photo** — AI headshot for the PDF  
   `domain/agents/cvPhotoAgent.ts` → `generateCvPhoto()`

4. **PDF** — layout (text + photo, no overlap)  
   `renderCvPdf(profile, photo)` in `infrastructure/pdfCvRender.ts`

5. **Disk** — save under `backend/data/cvs/`  
   `saveCvPdf(pdf, profile, outputDir)` in `infrastructure/fsCvStorage.ts`

## RAG ingestion

`ingestCvs()` in `application/ingestCvs.ts`:

1. List PDFs → read embedded text (`pdfTextReader.ts`, pdf.js).
2. Split into chunks (`utils/text.ts`, ~900 chars).
3. Embed with OpenAI (`embedTexts` in `openAiClient.ts`).
4. Store in a local **Vectra** index (`vectorIndex.ts` → `backend/data/vector-index/`).

**Vectra** keeps the MVP simple: no Postgres, Docker, or cloud vector DB—just JSON on disk, fine for dozens of CVs.

## Chat API

`POST /chat` with JSON body `{ "message": "your question" }` runs RAG via `application/answerCvQuestion.ts` (retrieve chunks → OpenAI answer grounded on excerpts). Response:

```json
{ "answer": "…", "sources": [{ "fileName": "ada-lovelace-abc123.pdf" }] }
```

The Vite dev server proxies `/api/*` to the backend (e.g. frontend calls `/api/chat`, `/api/dataset/status`).

`GET /dataset/status` returns `{ "ready": true | false }` depending on whether the Vectra index exists. The chat UI uses this for the empty state (generate-CVs hint vs prompt suggestions) and to avoid hard errors when no data is indexed.

## OpenAI models

All models are configured via `.env` at the repository root.

| Env variable | Default | Where it is used |
|--------------|---------|------------------|
| `OPENAI_API_KEY` | — | Required for every OpenAI call |
| `OPENAI_TEXT_MODEL` | `gpt-4o-mini` | **Chat completions:** fictional CV JSON (`cvProfileAgent`), RAG answers (`cvChatAgent`) via `runChatAgent` |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | **Embeddings:** chunk vectors on ingest + query vectors on search (`embedTexts`) |
| `OPENAI_IMAGE_MODEL` | `gpt-image-2.5-flare` | **Images:** CV headshots (`cvPhotoAgent`) via `runImageAgent` |
| `OPENAI_IMAGE_QUALITY` | `low` | Image generation quality |
| `OPENAI_IMAGE_SIZE` | `816x816` | Headshot dimensions in the PDF |



## Setup

```bash
npm install
cp .env
```

Set `.env`:

```env
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_IMAGE_MODEL=gpt-image-2.5-flare
OPENAI_IMAGE_QUALITY=low
OPENAI_IMAGE_SIZE=816x816
PORT=3001
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CV_OUTPUT_DIR=./data/cvs
CV_GENERATION_COUNT=25
VECTOR_INDEX_DIR=./data/vector-index
VITE_GITHUB_URL=https://github.com/ptescayola
VITE_LINKEDIN_URL=https://www.linkedin.com/in/ptescayola
VITE_OPENAI_URL=https://openai.com
```

## Frontend UI (shadcn)

[shadcn/ui](https://ui.shadcn.com/) is set up in `frontend/` (`components.json`, Tailwind v4). Theme colors and radii live on shadcn CSS variables in `index.css` (`--background`, `--primary`, `--chat-bubble-user`, etc.), with dark mode via the `dark` class on `<html>` (`useTheme`).

- **Components:** primitives under `components/shadcn/`, consumed through `components/ui/` where the app imports them.
- **Chat:** source PDFs appear as download badges inside `ChatBubble` (not a separate chips component). Lists in answers are rendered in `ChatMessageContent`.
- **Empty state:** if the vector index is missing, `ChatEmptyNoDataset` shows `npm run generate:cvs` with a copy button; otherwise suggestions from `CHAT_PROMPT_SUGGESTIONS`.

## Quick demo (~5 minutes)

1. **Install & env** (once): `npm install` and set `OPENAI_API_KEY` in `.env` (see [Setup](#setup)).
2. **Generate data** (once per machine; uses OpenAI for text, images, and embeddings):

   ```bash
   npm run generate:cvs
   ```

   Default count is **25** CVs (1–30). PDFs → `backend/data/cvs/`, index → `backend/data/vector-index/`.

3. **Run** (two terminals): `npm run dev:backend` and `npm run dev:frontend` → open Vite (usually [http://127.0.0.1:5173](http://127.0.0.1:5173)).
4. **Optional:** rebuild index from existing PDFs only: `npm run ingest:cvs`.

## Develop

```bash
npm run dev:backend
npm run dev:frontend
```

Health: [http://localhost:3001/health](http://localhost:3001/health) → `{"status":"ok"}`.

## Tests

All unit tests use Node’s built-in [`node:test`](https://nodejs.org/api/test.html) runner with TypeScript via `tsx`. E2E uses [Playwright](https://playwright.dev/) in the browser.

| Layer | Location | What it covers |
|-------|----------|----------------|
| **Backend unit** | `backend/src/**/*.test.ts` | Application use cases with injected deps (`generateCv`, `ingestCvs`, `resolveChatSources`) and small utilities (`string`, `text`, `number`). No OpenAI or disk I/O in tests. |
| **Frontend unit** | `frontend/src/**/*.test.ts` | Chat module (messages, thread key, scroll metrics, `chatClient`, download URLs) and shared utils (`string`, `date`). |
| **E2E** | `frontend/e2e/*.spec.ts` | One happy path: type a question, send, assert the assistant reply in the chat log. **`/api/chat` and `/api/dataset/status` are mocked** so no API key or vector index is required. Playwright starts the Vite dev server automatically. |

From the repo root:

```bash
npm run test              # backend unit + frontend unit
npm run test:backend
npm run test:frontend
npm run test:e2e          # Playwright (Chromium)
```

First time on a machine, install Playwright browsers:

```bash
cd frontend && npx playwright install
```

**CI:** GitHub Actions (`.github/workflows/ci.yml`) runs `test:backend`, `test:frontend`, and `test:e2e` on push/PR to `main` or `master`.
