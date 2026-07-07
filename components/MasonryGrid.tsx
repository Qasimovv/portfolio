"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/motion";

// -------------------- Masonry cards (Packages / Other tabs) --------------------

type MasonryItem = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export default function MasonryGrid({
  items,
  mono = false,
}: {
  items: MasonryItem[];
  mono?: boolean;
}) {
  return (
    <div className="masonry">
      {items.map((item, i) => (
        <div key={item.id} className="masonry-item">
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            {...fadeUp(i)}
            className="group flex flex-col justify-between rounded-3xl bg-white p-6 dark:bg-zinc-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3
                  className={
                    mono
                      ? "font-mono text-base font-medium text-zinc-900 dark:text-zinc-100"
                      : "text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  }
                >
                  {item.name}
                </h3>
                <ArrowUpRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
              </div>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
              {item.link.replace("https://", "")}
            </p>
          </motion.a>
        </div>
      ))}
    </div>
  );
}
