"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { AppProject } from "@/data/site";
import { gradientFor } from "@/lib/gradient";
import { fadeUp } from "@/lib/motion";

// -------------------- Apps grid --------------------

export default function AppsGrid({ apps }: { apps: AppProject[] }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-8">
        {apps.map((app, i) => (
          <motion.div
            key={app.id}
            className="overflow-hidden rounded-3xl bg-white p-5 dark:bg-zinc-900"
            {...fadeUp(i, 5)}
          >
            {/* Poster (or gradient placeholder until real one is added) */}
            {app.poster ? (
              <div className="mb-4 overflow-hidden rounded-[23.75px]">
                <Image
                  src={app.poster}
                  alt={app.name}
                  width={400}
                  height={800}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            ) : (
              <div
                className="mb-4 flex aspect-[1/2] items-center justify-center rounded-[23.75px]"
                style={{ background: gradientFor(app.id) }}
              >
                <span className="text-4xl font-bold text-white/90">
                  {app.name.charAt(0)}
                </span>
              </div>
            )}

            <h3 className="text-center text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {app.name}
            </h3>

            {/* Store badges */}
            <div className="mt-3 flex justify-center gap-2">
              <StoreBadge
                href={app.appStoreUrl}
                src="/logo/app-store.svg"
                available="Download on App Store"
                unavailable="Not available on App Store"
              />
              <StoreBadge
                href={app.playStoreUrl}
                src="/logo/play-store.svg"
                available="Get it on Google Play"
                unavailable="Not available on Google Play"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom fade into the page background */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[60%] bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950" />
    </div>
  );
}

// -------------------- Store badge --------------------

function StoreBadge({
  href,
  src,
  available,
  unavailable,
}: {
  href?: string;
  src: string;
  available: string;
  unavailable: string;
}) {
  /* eslint-disable @next/next/no-img-element */
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <img src={src} alt={available} width={88} height={30} />
      </a>
    );
  }
  return (
    <span className="cursor-not-allowed opacity-30 grayscale">
      <img src={src} alt={unavailable} width={88} height={30} />
    </span>
  );
  /* eslint-enable @next/next/no-img-element */
}
