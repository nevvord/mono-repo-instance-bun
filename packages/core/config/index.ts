// Configuration module entry point - re-exports only

import { validateConfig } from "./validate-config";

// Export singleton config instance
export const config = validateConfig();

// Re-export types
export type { Config } from "./types/config";
