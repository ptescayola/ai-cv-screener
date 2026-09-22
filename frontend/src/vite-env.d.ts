/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_URL: string
  readonly VITE_LINKEDIN_URL: string
  readonly VITE_OPENAI_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
