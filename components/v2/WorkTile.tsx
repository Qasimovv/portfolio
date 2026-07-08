import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { AppProject } from "@/data/site";
import { gradientFor } from "@/lib/gradient";

// -------------------- Work poster tile (v2) --------------------
//  Poster-forward card; store links + name reveal on hover.

export default function WorkTile({ app }: { app: AppProject }) {
  const poster = app.poster ?? app.poster2;
  const stores: { label: string; href: string }[] = [];
  if (app.appStoreUrl) stores.push({ label: "App Store", href: app.appStoreUrl });
  if (app.playStoreUrl) stores.push({ label: "Google Play", href: app.playStoreUrl });

  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-zinc-200/70 dark:ring-white/10">
      {/* Poster (or gradient placeholder) */}
      {poster ? (
        <Image
          src={poster}
          alt={app.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: gradientFor(app.id) }}
        >
          <span className="text-5xl font-bold text-white/90">
            {app.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Retired badge */}
      {app.retired && (
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          Retired
        </span>
      )}

      {/* Hover overlay: name + company + store links */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-base font-semibold text-white">{app.name}</h3>
        {app.company && (
          <p className="text-xs text-white/60">{app.company}</p>
        )}
        {stores.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {stores.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/25"
              >
                {s.label}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Always-visible name strip when there is no hover (touch) — subtle */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 transition-opacity duration-300 group-hover:opacity-0 md:opacity-100">
        <span className="text-sm font-semibold text-white">{app.name}</span>
      </div>
    </div>
  );
}
