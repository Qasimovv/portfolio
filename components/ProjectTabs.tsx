"use client";

import { useState } from "react";
import { apps, packages, other } from "@/data/site";
import AppsGrid from "@/components/AppsGrid";
import MasonryGrid from "@/components/MasonryGrid";

// -------------------- Apps / Packages / Other tabs --------------------

const TABS = ["Apps", "Packages", "Other"] as const;

export default function ProjectTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-8">
      {/* Tab bar */}
      <div className="flex items-center justify-center gap-6">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(i)}
            className={`relative cursor-pointer text-lg font-medium transition-colors ${
              active === i
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            {tab}
            {active === i && (
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-zinc-900 dark:bg-zinc-100" />
            )}
          </button>
        ))}
      </div>

      {/* Active tab content (keyed so entry animations replay) */}
      <div className="relative" key={active}>
        {active === 0 && <AppsGrid apps={apps} />}
        {active === 1 && <MasonryGrid items={packages} mono />}
        {active === 2 && <MasonryGrid items={other} />}
      </div>
    </div>
  );
}
