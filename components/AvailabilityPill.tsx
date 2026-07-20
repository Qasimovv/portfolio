"use client";

import { usePathname } from "next/navigation";
import { scrollToContact } from "@/lib/scroll";

// -------------------- "Available for work" pill --------------------

export default function AvailabilityPill() {
  const pathname = usePathname();
  // Hidden on utility pages like the quiz trainer
  if (pathname?.startsWith("/quiz")) return null;
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <button
        type="button"
        onClick={() => scrollToContact()}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm shadow-sm ring-1 ring-zinc-200/50 backdrop-blur-xl transition-colors hover:bg-white dark:bg-zinc-900/80 dark:ring-zinc-800/50 dark:hover:bg-zinc-900"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-zinc-900 dark:text-zinc-100">
          Available for work
        </span>
      </button>
    </div>
  );
}
