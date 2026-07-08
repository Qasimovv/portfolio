"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// -------------------- Dark / light theme toggle --------------------
//  The initial class is set by an inline script in the layout (before
//  paint) to avoid a flash. This button just flips it and persists.

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable — theme still applies for this session
    }
  };

  // Render nothing until mounted so the icon matches the resolved theme.
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-zinc-200/50 backdrop-blur-xl transition-colors hover:bg-white dark:bg-zinc-900/80 dark:ring-zinc-800/50 dark:hover:bg-zinc-900"
    >
      {dark ? (
        <Sun className="h-[18px] w-[18px] text-zinc-300" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-zinc-600" />
      )}
    </button>
  );
}
