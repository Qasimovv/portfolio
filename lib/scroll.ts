import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Smoothly scrolls to the bottom of the page (the contact card). */
export function scrollToContact(duration = 1500) {
  const target = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const lenis = window.__lenis;
  if (!lenis) {
    window.scrollTo({ top: target(), behavior: "smooth" });
    return;
  }

  // Drive Lenis frame-by-frame so the distance is covered in a fixed time
  // with an ease-out curve, even while lazy content changes page height.
  lenis.resize();
  const from = lenis.scroll;
  const start = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const max = target();
    const base = Math.min(from, max);
    lenis.scrollTo(base + (max - base) * easeOutCubic(t), { immediate: true });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
