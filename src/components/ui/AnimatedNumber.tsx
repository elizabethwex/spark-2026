import { useEffect, useState } from "react";

export function AnimatedNumber({
  value,
  format = (v) => v.toString(),
  durationMs = 1000,
}: {
  value: number;
  format?: (val: number) => string;
  durationMs?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let rafId: number;

    const easeOutQuad = (t: number) => t * (2 - t);

    const step = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      
      const easedProgress = easeOutQuad(progress);
      setDisplayValue(easedProgress * value);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, durationMs]);

  return <span>{format(displayValue)}</span>;
}
