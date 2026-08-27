"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Droplets,
  Pause,
  Play,
  ShieldCheck,
  Waves,
} from "lucide-react";

import { useLanguage } from "@/components/jjm/language-provider";

export function Hero() {
  const { t } = useLanguage();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  function toggleVideo() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <section className="relative isolate min-h-[780px] overflow-hidden bg-[#063b4d] text-white">
      {/* =========================================================
          BACKGROUND VIDEO
         ========================================================= */}

      <div className="absolute inset-0 -z-30">
        <video
          ref={videoRef}
          className="
            h-full
            w-full
            object-cover
            object-center
            brightness-[0.90]
            contrast-[1.08]
            saturate-[0.96]
          "
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/hero-water.mp4" type="video/mp4" />
        </video>
      </div>

      {/* =========================================================
          VIDEO OVERLAYS
         ========================================================= */}

      <div className="absolute inset-0 -z-20 bg-[#06384a]/28" />

      <div
        className="
          absolute
          inset-0
          -z-20
          bg-gradient-to-r
          from-[#033044]/78
          via-[#06465a]/48
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-x-0
          top-0
          -z-20
          h-44
          bg-gradient-to-b
          from-[#063346]/45
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          -z-20
          h-52
          bg-gradient-to-t
          from-[#063346]/65
          to-transparent
        "
      />

      {/* =========================================================
          VIDEO LABEL
         ========================================================= */}

      <div
        className="
          absolute
          right-6
          top-6
          z-30
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/30
          bg-[#06394b]/55
          px-4
          py-2
          text-xs
          font-semibold
          text-white
          backdrop-blur-sm
          lg:right-10
          lg:top-8
        "
      >
        <span className="h-2 w-2 rounded-full bg-[#29c5dc]" />
        {t.hero.waterMotion}
      </div>

      {/* =========================================================
          VIDEO CONTROL
         ========================================================= */}

      <button
        type="button"
        onClick={toggleVideo}
        aria-label={
          isPlaying ? "Pause background video" : "Play background video"
        }
        className="
          absolute
          right-6
          top-[4.6rem]
          z-30
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/30
          bg-[#06394b]/55
          text-white
          backdrop-blur-sm
          transition
          hover:bg-white/15
          lg:right-10
          lg:top-[5.5rem]
        "
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" />
        )}
      </button>

      {/* =========================================================
          HERO CONTENT
         ========================================================= */}

      <div className="mx-auto min-h-[780px] w-full max-w-[1280px] px-6 pb-24 pt-40 sm:px-8 lg:px-10">
        <div className="grid min-h-[600px] items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* =====================================================
              LEFT CONTENT
             ===================================================== */}

          <div className="max-w-[650px]">

            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2ac6dd]" />

              <span className="text-[12px] font-bold uppercase tracking-[0.26em] text-[#63d7e8]">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* =================================================
                HEADLINE
               ================================================= */}

            <h1
              className="
                max-w-[620px]
                text-[clamp(4rem,6.8vw,6.5rem)]
                font-extrabold
                leading-[0.91]
                tracking-[-0.065em]
                text-white
              "
            >
              <span className="block">Tap water</span>

              <span className="block">for every</span>

              <span className="block text-[#b4cbd3]">
                rural home.
              </span>
            </h1>

            {/* =================================================
                DESCRIPTION — FIXED ALIGNMENT
               ================================================= */}

            <div className="mt-8 max-w-[570px]">
              <p
                className="
                  text-[17px]
                  font-medium
                  leading-[1.65]
                  text-white/90
                  sm:text-[18px]
                  sm:leading-[1.65]
                "
              >
                See water supply, household connections and water
                quality in your village — clearly and in one place.
              </p>
            </div>

            {/* =================================================
                BUTTONS
               ================================================= */}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#village-finder"
                className="
                  inline-flex
                  h-14
                  items-center
                  justify-center
                  gap-3
                  rounded-md
                  bg-white
                  px-7
                  text-[15px]
                  font-bold
                  text-[#07394d]
                  shadow-[0_8px_25px_rgba(0,0,0,0.16)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#f1fafc]
                "
              >
                Check My Village

                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#report-problem"
                className="
                  inline-flex
                  h-14
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-white/40
                  bg-[#073d51]/50
                  px-7
                  text-[15px]
                  font-bold
                  text-white
                  backdrop-blur-sm
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#0b4a5f]/65
                "
              >
                Report a Water Problem
              </a>
            </div>

            {/* =================================================
                SERVICE STRIP
               ================================================= */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                items-center
                gap-x-8
                gap-y-4
                border-t
                border-white/25
                pt-6
              "
            >
              <Feature
                icon={<ShieldCheck className="h-4 w-4" />}
                text={t.hero.safeWater}
              />

              <Feature
                icon={<Waves className="h-4 w-4" />}
                text={t.hero.ruralSupply}
              />

              <Feature
                icon={<Droplets className="h-4 w-4" />}
                text={t.hero.waterQuality}
              />
            </div>
          </div>

          {/* =====================================================
              RIGHT INFORMATION
             ===================================================== */}

          <div className="hidden lg:flex lg:justify-end">
            <div className="w-[390px] border-l border-white/35 pl-8">

              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[#65d9e9]">
                HAR GHAR JAL
              </p>

              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/30
                    bg-[#06445a]/55
                  "
                >
                  <Droplets className="h-5 w-5 text-[#52d2e3]" />
                </div>

                <div>
                  <h2 className="text-[27px] font-extrabold tracking-[-0.035em] text-white">
                    Household tap water
                  </h2>

                  <p className="mt-3 text-[15px] font-medium leading-6 text-white/80">
                    Connecting rural households to reliable
                    drinking water.
                  </p>
                </div>
              </div>

              <div className="my-7 h-px w-full bg-white/25" />

              <p className="max-w-[340px] text-[15px] font-medium leading-7 text-white/75">
                Explore village-level information on supply,
                connections and water quality.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#32c9de]" />

                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  Rural drinking water
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
    </section>
  );
}

/* ===============================================================
   FEATURE COMPONENT
   =============================================================== */

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[14px] font-semibold text-white/85">
      <span
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-white/25
          bg-[#073d50]/55
          text-[#55d4e5]
        "
      >
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}