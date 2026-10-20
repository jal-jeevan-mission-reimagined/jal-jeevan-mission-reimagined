"use client";

import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-[12px]">
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-label="Switch to Hindi"
        className={`
          transition-colors
          ${
            language === "hi"
              ? "font-semibold text-white"
              : "text-white/55 hover:text-white"
          }
        `}
      >
        हिंदी
      </button>

      <span className="text-white/25">
        |
      </span>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch to English"
        className={`
          transition-colors
          ${
            language === "en"
              ? "font-semibold text-white"
              : "text-white/55 hover:text-white"
          }
        `}
      >
        English
      </button>
    </div>
  );
}