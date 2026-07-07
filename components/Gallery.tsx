"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gallery, socials, type GalleryPhoto } from "@/data/site";

// -------------------- Infinite draggable photo marquee --------------------

const CARD_W = 165; // px
const OVERLAP = 8; // -ml-2
const STEP = CARD_W - OVERLAP; // horizontal distance between cards
const DRIFT = 0.5; // idle auto-scroll px/frame
const FRICTION = 0.93; // momentum decay after release
const ROTATIONS = [-6, 3, -4, 7, -3, 5, -5, 4, -2, 6];

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(gallery);
  const [mounted, setMounted] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const velocity = useRef(0);
  const hovering = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const moved = useRef(0);
  const suppressClick = useRef(false);
  const frame = useRef(0);

  // Shuffle once on mount (also gates rendering to avoid hydration mismatch).
  useEffect(() => {
    setPhotos([...gallery].sort(() => Math.random() - 0.5));
    setMounted(true);
  }, []);

  const loopWidth = STEP * gallery.length;

  const wrap = useCallback(
    (x: number) => {
      if (loopWidth <= 0) return x;
      while (x <= -loopWidth) x += loopWidth;
      while (x > 0) x -= loopWidth;
      return x;
    },
    [loopWidth],
  );

  const tick = useCallback(() => {
    frame.current = requestAnimationFrame(tick);
    const track = trackRef.current;
    if (!track || dragging.current) return;

    if (Math.abs(velocity.current) > 0.3) {
      offset.current = wrap(offset.current + velocity.current);
      velocity.current *= FRICTION;
    } else {
      velocity.current = 0;
      if (!hovering.current) offset.current = wrap(offset.current - DRIFT);
    }
    track.style.transform = `translateX(${offset.current}px)`;
  }, [wrap]);

  useEffect(() => {
    if (!mounted) return;
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [mounted, tick]);

  if (!mounted || gallery.length === 0) return null;

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      wrapRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // pointer capture may already be released
    }
  };

  const tripled = [...photos, ...photos, ...photos];
  const link = socials.instagram;

  return (
    <div
      ref={wrapRef}
      className="relative cursor-grab touch-pan-y select-none overflow-hidden py-8 active:cursor-grabbing"
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        moved.current = 0;
        suppressClick.current = false;
        velocity.current = 0;
        wrapRef.current?.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current || !trackRef.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        moved.current += Math.abs(dx);
        if (moved.current > 6) suppressClick.current = true;
        offset.current = wrap(offset.current + dx);
        velocity.current = dx;
        trackRef.current.style.transform = `translateX(${offset.current}px)`;
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div ref={trackRef} className="flex will-change-transform">
        {tripled.map((photo, i) => {
          const Card = link ? "a" : "div";
          return (
            <Card
              key={`${photo.src}-${i}`}
              {...(link
                ? { href: link, target: "_blank", rel: "noopener noreferrer" }
                : {})}
              draggable={false}
              onClick={(e: React.MouseEvent) => {
                if (suppressClick.current) e.preventDefault();
              }}
              className="gallery-photo relative -ml-2 h-[220px] w-[165px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-white/20 ring-inset first:ml-0 dark:bg-zinc-800"
              style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.location}
                draggable={false}
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <span className="gallery-photo-label absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-center opacity-0 transition-opacity duration-300">
                <span className="block text-xs font-semibold text-white">
                  {photo.location}
                </span>
                {photo.subtitle && (
                  <span className="block text-xs text-white/70">
                    {photo.subtitle}
                  </span>
                )}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
