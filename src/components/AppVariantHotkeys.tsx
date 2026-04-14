import { useEffect } from "react";
import { useAppVariant, type AppVariant } from "@/context/AppVariantContext";

/**
 * Prototype: keys 1–3 switch account variant (HSA+LPFSA / FSA+DCFSA / HSA-only).
 * Ignores shortcuts while typing in inputs and when modifier keys are held.
 */
export function AppVariantHotkeys() {
  const { setVariant } = useAppVariant();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      if (t instanceof HTMLElement && t.isContentEditable) return;
      if (e.key !== "1" && e.key !== "2" && e.key !== "3") return;
      e.preventDefault();
      setVariant(Number(e.key) as AppVariant);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setVariant]);

  return null;
}
