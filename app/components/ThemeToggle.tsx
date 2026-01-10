"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      disabled={true}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}