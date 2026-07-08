"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { profile } from "@/data/site";
import { gradientFor } from "@/lib/gradient";
import { scrollToContact } from "@/lib/scroll";
import { EASE } from "@/lib/motion";

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

    </header>
  );
}
