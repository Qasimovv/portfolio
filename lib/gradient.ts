// Deterministic gradient from a string, so every app without a poster
// still gets a stable, distinct colour instead of a grey box.

const PALETTES: [string, string][] = [
  ["#6ee7b7", "#3b82f6"],
  ["#f472b6", "#8b5cf6"],
  ["#fbbf24", "#f97316"],
  ["#34d399", "#0ea5e9"],
  ["#a78bfa", "#ec4899"],
  ["#f87171", "#fb923c"],
  ["#22d3ee", "#6366f1"],
  ["#4ade80", "#16a34a"],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function gradientFor(seed: string): string {
  const [a, b] = PALETTES[hash(seed) % PALETTES.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}
