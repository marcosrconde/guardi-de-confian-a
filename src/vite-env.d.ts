/// <reference types="vite/client" />

// Extend Vite env types with our custom feature flag
interface ImportMetaEnv {
  readonly VITE_ENABLE_GIFT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
