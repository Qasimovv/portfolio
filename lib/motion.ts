// Shared entry-animation presets (blur-up fade used across all sections).

export const EASE: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/** Scroll-triggered blur-up entry, staggered by index within a row. */
export function fadeUp(index: number, perRow = 4) {
  return {
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: VIEWPORT,
    transition: { duration: 0.55, ease: EASE, delay: (index % perRow) * 0.07 },
  };
}
