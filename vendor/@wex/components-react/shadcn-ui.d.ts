/**
 * Type declarations for shadcn/ui components
 * 
 * These modules are provided by consuming applications via the @/components/ui/* path alias.
 * This declaration file tells TypeScript these modules exist externally without needing
 * to resolve them at build time.
 * 
 * Consuming apps must:
 * 1. Install shadcn components via: npx shadcn@latest add <component>
 * 2. Configure path alias: "@/*": ["./src/*"] in their tsconfig.json
 * 3. Configure bundler alias to match
 */

// Declare @/lib/utils as external
declare module "@/lib/utils" {
  import { type ClassValue } from "clsx";
  export function cn(...inputs: ClassValue[]): string;
}

// Note: @/components/ui/* modules are resolved via tsconfig.json paths configuration
// The path alias "@/*": ["../src/*"] allows TypeScript to resolve these imports
// at development time in this monorepo. In consuming apps, they configure their
// own path aliases to point to their shadcn installation location.
