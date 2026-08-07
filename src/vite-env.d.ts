/// <reference types="vite/client" />

// Extend Vite env types with our custom feature flag
interface ImportMetaEnv {
  readonly VITE_ENABLE_GIFT?: string;
  readonly VITE_PROMO_NAME?: string;
  readonly VITE_PROMO_START?: string; // ISO 8601 string with timezone if needed
  readonly VITE_PROMO_END?: string;   // ISO 8601 string with timezone if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
