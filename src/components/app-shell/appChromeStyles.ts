import type { CSSProperties } from "react";

/**
 * Shared top chrome (status + nav): frosted layer over an **opaque** lavender base.
 * Without the base, backdrop-filter behind the status row samples the phone bezel /
 * Dynamic Island (near-white) and reads as solid white; the nav sits over app
 * content and looks correctly tinted — this aligns both.
 */
export const APP_TOP_LIQUID_GLASS: CSSProperties = {
  backdropFilter: "blur(20px) saturate(200%)",
  WebkitBackdropFilter: "blur(20px) saturate(200%)",
  background: [
    "linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.12) 100%)",
    "linear-gradient(180deg, #eef2ff 0%, #e8ecff 42%, rgba(255, 255, 255, 0.88) 100%)",
  ].join(", "),
};
