/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_MDI_ID: string;
    readonly [key: string]: string;
  };
}