import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { AppProject } from "@/data/site";
import { gradientFor } from "@/lib/gradient";

// -------------------- Work card (v2) --------------------
//  Two-poster card (falls back to one / gradient). Uniform size in any
//  grid column, so a 3-card row matches a 4-card row and the extra
//  space stays empty on the right.

export default function WorkTile({ app }: { app: AppProject }) {
  const posters = [app.poster, app.poster2].filter(Boolean) as string[];
  const stores: { label: string; href: string }[] = [];
  if (app.appStoreUrl) stores.push({ label: "App Store", href: app.appStoreUrl });
  if (app.playStoreUrl) stores.push({ label: "Google Play", href: app.playStoreUrl });

  return (
    <div className="flex flex-col rounded-3xl bg-white p-4 ring-1 ring-zinc-200/70 dark:bg-white/[0.04] dark:ring-white/10">
      {/* Posters */}
      {posters.length >= 2 ? (
        <div className="grid grid-cols-2 gap-2">
          {posters.slice(0, 2).map((p) => (
            <div key={p} className="aspect-[1/2] overflow-hidden rounded-2xl">
              <Image
                src={p}
                alt={app.name}
                width={400}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      ) : posters.length === 1 ? (
        <div className="aspect-[1/1] overflow-hidden rounded-2xl">
          <Image
            src={posters[0]}
            alt={app.name}
            width={400}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[1/1] items-center justify-center rounded-2xl"
          style={{ background: gradientFor(app.id) }}
        >
          <span className="text-4xl font-bold text-white/90">
            {app.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Name + retired badge */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {app.name}
          </h3>
          {app.company && (
            <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
              {app.company}
            </p>
          )}
        </div>
        {app.retired && (
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
            Retired
          </span>
        )}
      </div>

      {/* Store links (only where the app is actually published) */}
      {stores.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {stores.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/20"
            >
              {s.label}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
