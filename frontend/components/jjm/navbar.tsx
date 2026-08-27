"use client";

import { Search, Menu } from "lucide-react";
import { useLanguage } from "./language-provider";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-white/15 bg-[#063b55] text-white">
      <div
        className="
          mx-auto
          flex
          min-h-[92px]
          w-full
          max-w-[1240px]
          items-center
          justify-between
          gap-8
          px-5
          sm:px-7
          lg:px-10
        "
      >
        {/* Brand */}

        <a
          href="#home"
          className="flex min-w-0 items-center gap-4"
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#087fa4]
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M12 3.5C12 3.5 6 10.2 6 14.4a6 6 0 0 0 12 0C18 10.2 12 3.5 12 3.5Z" />
              <path d="M9.2 15.1c.3 1.4 1.3 2.3 2.8 2.6" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="truncate text-[19px] font-semibold leading-tight">
              {t.mission}
            </div>

            <div className="mt-1 hidden text-[11px] text-white/60 sm:block">
              {t.department}
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          <a
            href="#about"
            className="text-[13px] text-white/75 transition hover:text-white"
          >
            {t.nav.about}
          </a>

          <a
            href="#water-data"
            className="text-[13px] text-white/75 transition hover:text-white"
          >
            {t.nav.waterData}
          </a>

          <a
            href="#my-village"
            className="text-[13px] text-white/75 transition hover:text-white"
          >
            {t.nav.village}
          </a>

          <a
            href="#water-quality"
            className="text-[13px] text-white/75 transition hover:text-white"
          >
            {t.nav.quality}
          </a>

          <a
            href="#resources"
            className="text-[13px] text-white/75 transition hover:text-white"
          >
            {t.nav.resources}
          </a>

          <button
            type="button"
            aria-label="Search"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/25
              text-white
              transition
              hover:bg-white/10
            "
          >
            <Search size={17} strokeWidth={1.7} />
          </button>
        </nav>

        {/* Mobile menu */}

        <button
          type="button"
          aria-label="Open menu"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-md
            border
            border-white/20
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}