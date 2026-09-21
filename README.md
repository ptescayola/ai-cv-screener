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
  model/           ChatMessage, ChatRole
  infrastructure/  chatClient, cvDownloadUrl
utils/             string (stripPdfExtension), date (formatMessageTime)
hooks/             useChat (state + send), useChatScroll (message list)
components/        AppLayout, AppHeader, AppFooter, Chat
ui/                ChatBubble, ChatTextarea, SourceChips, …
styles/            global.css (tokens, scroll-area)
```

## Backend layout

```
domain/agents/   LLM agent definitions (prompts, temperature, buildUserMessage)
application/     generateCv, ingestCvs, searchCvChunks, answerCvQuestion
infrastructure/  openAi/runAgents (runChatAgent, runImageAgent), PDF, Vectra
composition/     Express app wiring
scripts/         generateCvs, ingestCvs CLIs
api/             HTTP routes (`POST /chat`, `GET /cvs/:fileName`)
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

`scripts/generateCvs.ts` loops and calls `application/generateCv.ts` for each PDF.

### Pipeline (same order as `generateCv()`)

Use this flow when explaining the project in the video:

1. **Blueprint** — random role, language, seniority, industry  
   `createRandomCvBlueprint()` in `domain/cvBlueprint.ts`

2. **Texto** — fictional CV content as structured JSON  
   Prompts in `domain/agents/cvProfileAgent.ts` → `generateCvProfile()` in `infrastructure/openAiClient.ts`

3. **Foto** — AI headshot for the PDF  
   `domain/agents/cvPhotoAgent.ts` → `generateCvPhoto()`

4. **PDF** — layout (text + photo, no overlap)  
   `renderCvPdf(profile, photo)` in `infrastructure/pdfCvRender.ts`

5. **Disco** — save under `backend/data/cvs/`  
   `saveCvPdf(pdf, profile, outputDir)` in `infrastructure/fsCvStorage.ts`

For deliverables: walk through `generateCv.ts` + run the script + show PDFs on disk. Optional samples in `backend/data/cvs/examples/`; bulk PDFs are gitignored.

## RAG ingestion

`ingestCvs()` in `application/ingestCvs.ts` (also runs at the end of `generate:cvs`):

1. List PDFs → read embedded text (`pdfTextReader.ts`, pdf.js).
2. Split into chunks (`utils/text.ts`, ~900 chars).
3. Embed with OpenAI (`embedTexts` in `openAiClient.ts`).
4. Store in a local **Vectra** index (`vectorIndex.ts` → `backend/data/vector-index/`).

For retrieval: `searchCvChunks(query)` embeds the question and returns the closest chunks.

**Vectra** keeps the MVP simple: no Postgres, Docker, or cloud vector DB—just JSON on disk, fine for dozens of CVs.

## Chat API

`POST /chat` with JSON body `{ "message": "your question" }` runs RAG via `application/answerCvQuestion.ts` (retrieve chunks → OpenAI answer grounded on excerpts). Response:

```json
{ "answer": "…", "sources": [{ "fileName": "ada-lovelace-abc123.pdf" }] }
```

The Vite dev server proxies `/api/*` to the backend (e.g. frontend calls `/api/chat`).

## OpenAI models

All models are configured via `backend/.env` (see `backend/src/config/env.ts`).

| Env variable | Default | Where it is used |
|--------------|---------|------------------|
| `OPENAI_API_KEY` | — | Required for every OpenAI call |
| `OPENAI_TEXT_MODEL` | `gpt-4o-mini` | **Chat completions:** fictional CV JSON (`cvProfileAgent`), RAG answers (`cvChatAgent`) via `runChatAgent` |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | **Embeddings:** chunk vectors on ingest + query vectors on search (`embedTexts`) |
| `OPENAI_IMAGE_MODEL` | `gpt-image-2.5-flare` | **Images:** CV headshots (`cvPhotoAgent`) via `runImageAgent` |
| `OPENAI_IMAGE_QUALITY` | `low` | Image generation quality |
| `OPENAI_IMAGE_SIZE` | `816x816` | Headshot dimensions in the PDF |

Example `backend/.env`:

```env
OPENAI_API_KEY=sk-...
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_IMAGE_MODEL=gpt-image-2.5-flare
OPENAI_IMAGE_QUALITY=low
OPENAI_IMAGE_SIZE=816x816
```

## Setup

```bash
npm install
cp backend/.env.example backend/.env
```

Set `OPENAI_API_KEY` and adjust models if needed (see **OpenAI models** above).

## Develop

```bash
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:5173
npm run test          # backend unit tests (Node test runner)
```

Health: [http://localhost:3001/health](http://localhost:3001/health) → `{"status":"ok"}`.
