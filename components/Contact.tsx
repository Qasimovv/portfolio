"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { contact, profile, socials, type SocialKey } from "@/data/site";
import { EASE, VIEWPORT } from "@/lib/motion";

// -------------------- Socials config --------------------

const SOCIAL_ROWS: { key: SocialKey; label: string; color: string; icon: LucideIcon }[] = [
  { key: "linkedin", label: "Connect on LinkedIn", color: "#0A66C2", icon: Linkedin },
  { key: "github", label: "See my open source", color: "#24292F", icon: Github },
  { key: "x", label: "Follow me on X", color: "#1DA1F2", icon: Twitter },
  { key: "youtube", label: "Subscribe on YouTube", color: "#FF0000", icon: Youtube },
  { key: "instagram", label: "Follow me on Instagram", color: "#E4405F", icon: Instagram },
];

// -------------------- Contact card --------------------

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard API unavailable (e.g. non-secure context) — still show feedback.
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-white p-8 dark:bg-zinc-900 sm:p-12"
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="text-center">
        <h2 className="font-hand text-3xl text-[#04AAFB]">{contact.heading}</h2>

        <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          {contact.blurb.map((part, i) =>
            part.bold ? (
              <strong
                key={i}
                className="font-semibold text-zinc-800 dark:text-zinc-200"
              >
                {part.text}
              </strong>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>

        {/* Copy email */}
        <button
          type="button"
          onClick={copyEmail}
          className="relative mt-6 inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {/* Invisible copy keeps the button width stable while states swap */}
          <span className="invisible inline-flex items-center gap-1.5">
            <Copy className="h-4 w-4" />
            Copy my email
          </span>
          <span className="absolute inset-0 flex items-center justify-center gap-1.5">
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5]" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy my email
              </>
            )}
          </span>
        </button>

        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          {profile.email}
        </p>

        {/* Links */}
        <div className="mt-6 space-y-1 text-left">
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            >
              <FileText className="h-[18px] w-[18px] shrink-0 text-zinc-500 dark:text-zinc-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Download my résumé
              </span>
              <Download className="ml-auto h-4 w-4 text-zinc-300 transition-all group-hover:translate-y-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
            </a>
          )}

          {SOCIAL_ROWS.filter(({ key }) => socials[key]).map(
            ({ key, label, color, icon: Icon }) => (
              <a
                key={key}
                href={socials[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                style={{ "--brand": color } as React.CSSProperties}
              >
                <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--brand)]" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {label}
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
              </a>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}
