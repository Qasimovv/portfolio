"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { profile, socials, type SocialKey } from "@/data/site";
import { gradientFor } from "@/lib/gradient";
import { scrollToContact } from "@/lib/scroll";
import { EASE } from "@/lib/motion";

// -------------------- Socials config --------------------

const SOCIAL_ORDER: SocialKey[] = [
  "instagram",
  "x",
  "linkedin",
  "youtube",
  "github",
];

const SOCIAL_ICONS: Record<SocialKey, LucideIcon> = {
  instagram: Instagram,
  x: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
};

const SOCIAL_HOVER_COLORS: Record<SocialKey, string> = {
  instagram: "#E4405F",
  x: "#1DA1F2",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  github: "#333333",
};

// -------------------- Hero header --------------------

export default function Header() {
  const entry = (delay: number) => ({
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <header className="flex flex-col items-center pb-16 pt-8 text-center">
      {/* Avatar */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={156}
            height={156}
            className="rounded-full"
            priority
          />
        ) : (
          <div
            className="flex h-39 w-39 items-center justify-center rounded-full text-4xl font-bold text-white"
            style={{ background: gradientFor(profile.name) }}
          >
            {profile.name.charAt(0)}
          </div>
        )}
      </motion.div>

      {/* Role */}
      <motion.h1
        className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100"
        {...entry(0.1)}
      >
        {profile.role}
      </motion.h1>

      {/* Handwritten tagline */}
      <motion.p className="font-hand mt-3 text-2xl text-[#04AAFB]" {...entry(0.2)}>
        {profile.tagline}
      </motion.p>

      {/* CTA */}
      <motion.div
        className="mt-7"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        <motion.button
          type="button"
          onClick={() => scrollToContact()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex cursor-pointer items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Work With Me
        </motion.button>
      </motion.div>

      {/* Social icons */}
      <motion.div
        className="mt-6 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
      >
        {SOCIAL_ORDER.filter((key) => socials[key]).map((key) => {
          const Icon = SOCIAL_ICONS[key];
          return (
            <a
              key={key}
              href={socials[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-full"
              style={{ "--hover-color": SOCIAL_HOVER_COLORS[key] } as React.CSSProperties}
            >
              <Icon className="h-[18px] w-[18px] text-zinc-400 transition-colors duration-300 group-hover:text-[var(--hover-color)]" />
            </a>
          );
        })}
      </motion.div>
    </header>
  );
}
