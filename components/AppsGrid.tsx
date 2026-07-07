"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Archive } from "lucide-react";
import { appSections, moreApps, type AppProject } from "@/data/site";
import { gradientFor } from "@/lib/gradient";
import { fadeUp } from "@/lib/motion";

// -------------------- Apps grid (solo + team groups) --------------------

export default function AppsGrid({ apps }: { apps: AppProject[] }) {
  const groups = [
    { key: "team", label: appSections.team, items: apps.filter((a) => a.team) },
    { key: "solo", label: appSections.solo, items: apps.filter((a) => !a.team) },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="relative space-y-12">
      {groups.map((group) => {
        // When every card is double-width, use even column counts so
        // col-span-2 cards tile without leftover columns.
        const allWide = group.items.every((a) => a.poster && a.poster2);
        const gridClass = allWide
          ? "grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8"
          : "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-8";
        return (
          <section key={group.key}>
            {groups.length > 1 && <GroupLabel text={group.label} />}
            <div className={gridClass}>
              {group.items.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} />
              ))}
            </div>
            {group.key === "team" && moreApps.length > 0 && <MoreAppChips />}
          </section>
        );
      })}

      {/* Bottom fade into the page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950" />
    </div>
  );
}

// -------------------- More apps (logo chips) --------------------

function MoreAppChips() {
  return (
    <div className="mt-10">
      <GroupLabel text={appSections.more} />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {moreApps.map((app, i) => (
          <motion.span
            key={app.id}
            {...fadeUp(i, 6)}
            className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-3.5 dark:bg-zinc-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.logo}
              alt={app.name}
              className="h-5 w-auto max-w-10 rounded-md"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {app.name}
            </span>
            {app.company && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {app.company}
              </span>
            )}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// -------------------- Group label --------------------

function GroupLabel({ text }: { text: string }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      <span className="h-px w-12 bg-zinc-300 dark:bg-zinc-700" />
      <span className="font-hand text-xl text-[#04AAFB]">{text}</span>
      <span className="h-px w-12 bg-zinc-300 dark:bg-zinc-700" />
    </div>
  );
}

// -------------------- App card --------------------

function AppCard({ app, index }: { app: AppProject; index: number }) {
  const posters = [app.poster, app.poster2].filter(Boolean) as string[];
  const wide = posters.length === 2;

  return (
    <motion.div
      className={`overflow-hidden rounded-3xl bg-white p-5 dark:bg-zinc-900 ${
        wide ? "col-span-2" : ""
      }`}
      {...fadeUp(index, 5)}
    >
      {/* Poster(s) — two images make the card double-width */}
      {wide ? (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {posters.map((poster) => (
            <div key={poster} className="aspect-[1/2] overflow-hidden rounded-2xl">
              <Image
                src={poster}
                alt={app.name}
                width={400}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : posters.length === 1 ? (
        <div className="mb-4 aspect-[1/2] overflow-hidden rounded-[23.75px]">
          <Image
            src={posters[0]}
            alt={app.name}
            width={400}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover"
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
      {app.company && (
        <p className="mt-0.5 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {app.company}
        </p>
      )}

      {/* Store badges — or a "retired" note for apps taken out of production */}
      {app.retired ? (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-zinc-100 px-3 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {app.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={app.logo}
                alt=""
                width={16}
                height={16}
                className="rounded-[4px]"
              />
            ) : (
              <Archive className="h-3.5 w-3.5" />
            )}
            No longer in production
          </span>
        </div>
      ) : (
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
      )}
    </motion.div>
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
