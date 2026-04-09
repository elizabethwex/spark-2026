/**
 * Ensures `import … from "canvas-confetti"` type-checks when `compilerOptions.types`
 * is limited (e.g. only `vite/client`), so `@types/canvas-confetti` is not auto-loaded.
 * Aligns with canvas-confetti’s runtime API.
 */
declare module "canvas-confetti" {
  export interface Options {
    particleCount?: number
    angle?: number
    spread?: number
    startVelocity?: number
    decay?: number
    gravity?: number
    drift?: number
    ticks?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
    shapes?: Array<"square" | "circle">
    scalar?: number
    zIndex?: number
    disableForReducedMotion?: boolean
  }

  function confetti(options?: Options): Promise<null | undefined> | null
  export default confetti
}
