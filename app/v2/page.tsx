import type { Metadata } from "next";
import Image from "next/image";
import { Instrument_Serif } from "next/font/google";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  apps,
  appSections,
  contact,
  profile,
  retiredApps,
  socials,
} from "@/data/site";
import { gradientFor } from "@/lib/gradient";
import CopyEmail from "@/components/v2/CopyEmail";
import WorkTile from "@/components/v2/WorkTile";

// Editorial display serif — scoped to /v2 via the wrapper variable.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
});

export const metadata: Metadata = {
  title: `${profile.name} — Selected Work`,
  description: `${profile.role}. ${profile.tagline}. Based in ${profile.location}.`,
};

const CONTACT_LINKS: { key: keyof typeof socials; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "x", label: "X / Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
];

const TILE =
  "rounded-3xl bg-white p-6 ring-1 ring-zinc-200/70 dark:bg-white/[0.04] dark:ring-white/10";

export default function V2Page() {
  const solo = apps.filter((a) => !a.team);
  const team = apps.filter((a) => a.team);
  const links = CONTACT_LINKS.filter(({ key }) => socials[key]);

  return (
    <main
      className={`${serif.variable} v2-aurora relative min-h-screen font-[family-name:var(--font-inter-tight)] text-zinc-900 dark:text-zinc-100`}
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-24 sm:px-8">
        {/* ===================== Bento intro ===================== */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[10.5rem]">
          {/* Intro */}
          <div
            className={`${TILE} v2-rise flex flex-col justify-between sm:col-span-2 lg:row-span-2`}
          >
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for freelance &amp; contract work
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-serif-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
                {profile.role} ·{" "}
                <span className="font-[family-name:var(--font-serif-display)] italic text-[#6366f1]">
                  {profile.tagline}
                </span>
              </p>
            </div>
            <CopyEmail className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white" />
          </div>

          {/* Avatar */}
          <div className="v2-rise relative overflow-hidden rounded-3xl ring-1 ring-zinc-200/70 dark:ring-white/10 lg:col-span-2 lg:row-span-2 [animation-delay:60ms]">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="flex h-full min-h-56 w-full items-center justify-center"
                style={{ background: gradientFor(profile.name) }}
              >
                <span className="text-6xl font-bold text-white/90">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </div>
          </div>

          {/* Stat */}
          <div className={`${TILE} v2-rise flex flex-col justify-center [animation-delay:120ms]`}>
            <span className="font-[family-name:var(--font-serif-display)] text-5xl leading-none">
              30+
            </span>
            <span className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              apps &amp; games shipped
            </span>
          </div>

          {/* Now */}
          <div className={`${TILE} v2-rise flex flex-col justify-center sm:col-span-2 lg:col-span-1 [animation-delay:180ms]`}>
            <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Now
            </span>
            <span className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Senior iOS Engineer,{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                Rabitabank
              </span>{" "}
              — plus indie apps under OlaaSoft.
            </span>
          </div>

          {/* Stack */}
          <div className={`${TILE} v2-rise flex flex-col justify-center sm:col-span-2 [animation-delay:240ms]`}>
            <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Toolbox
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Swift", "SwiftUI", "Flutter", "Dart", "Firebase", "UIKit"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ===================== Selected work ===================== */}
        <section className="mt-20">
          <SectionHeading kicker="01 — Selected work" title="Apps I built solo" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {solo.map((app) => (
              <WorkTile key={app.id} app={app} />
            ))}
          </div>
        </section>

        {/* ===================== Team & company ===================== */}
        <section className="mt-20">
          <SectionHeading
            kicker="02 — Team & company"
            title="Shipped with teams"
          />
          <p className="mt-3 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
            Production apps built inside product teams at Bakcell, CityNet,
            Rabitabank, Azerconnect and Noacco.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {team.map((app) => (
              <WorkTile key={app.id} app={app} />
            ))}
          </div>

          {/* Retired */}
          {retiredApps.length > 0 && (
            <div className="mt-10">
              <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {appSections.retired}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {retiredApps.map((app) => (
                  <span
                    key={app.id}
                    className={`inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 shadow-sm ring-1 ring-zinc-200/60 dark:bg-white/[0.04] dark:ring-white/10 ${
                      app.logo ? "pl-1.5" : "pl-3.5"
                    }`}
                  >
                    {app.logo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={app.logo}
                        alt=""
                        className="h-6 w-auto max-w-12 rounded-md"
                      />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {app.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ===================== Contact ===================== */}
        <section className="mt-24 overflow-hidden rounded-[2rem] bg-zinc-900 p-8 text-white sm:p-14 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
          <span className="text-xs uppercase tracking-wider text-white/50">
            03 — Contact
          </span>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-serif-display)] text-4xl leading-tight sm:text-6xl">
            Let&rsquo;s build something{" "}
            <span className="italic text-[#8b93ff]">worth shipping.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            {contact.blurb.map((part, i) =>
              part.bold ? (
                <strong key={i} className="font-semibold text-white/90">
                  {part.text}
                </strong>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmail className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200" />
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
              >
                Download CV
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>

          {links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
              {links.map(({ key, label }) => (
                <a
                  key={key}
                  href={socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
                >
                  {label}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// -------------------- Section heading --------------------

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-[#6366f1]">
        {kicker}
      </span>
      <h2 className="mt-2 font-[family-name:var(--font-serif-display)] text-3xl tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
