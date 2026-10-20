"use client";

import { useRef, useState } from "react";
import {
  Droplets,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

export function WaterAtGlance() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section
      id="water-information"
      className="bg-[#f7f7f4] px-5 py-20 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* SECTION HEADER */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#11b9d5]" />

              <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#087f9f]">
                Water Information
              </span>
            </div>

            <h2 className="text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#172b33] sm:text-[52px] lg:text-[60px]">
              Water at a glance.
            </h2>

            <p className="mt-5 max-w-[720px] text-[17px] leading-7 text-[#617078] sm:text-[18px]">
              A clearer picture of drinking water access, household
              connections and service coverage across rural India.
            </p>
          </div>

          <div className="flex items-center gap-2 pb-2 text-sm font-medium text-[#68777d]">
            <span className="h-2 w-2 rounded-full bg-[#13b7d3]" />
            Updated regularly
          </div>
        </div>

        {/* MAIN VISUAL CARD */}
        <div className="overflow-hidden rounded-[24px] border border-[#d7e0e2] bg-[#063947] shadow-[0_20px_60px_rgba(12,40,48,0.12)]">
          {/* VIDEO AREA */}
          <div className="relative min-h-[480px] overflow-hidden sm:min-h-[540px] lg:min-h-[570px]">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/water-glance.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />

            {/* DARK GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#032b37]/95 via-[#063c49]/65 to-[#063c49]/20" />

            {/* BOTTOM GRADIENT */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#032b37]/85 to-transparent" />

            {/* TOP LABEL */}
            <div className="absolute right-6 top-6 z-10">
              <div className="flex items-center gap-2 rounded-full border border-white/25 bg-[#063b49]/65 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#16c2dc]" />
                Water coverage
              </div>
            </div>

            {/* VIDEO CONTROLS */}
            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#063b49]/70 text-white backdrop-blur-md transition hover:bg-[#075267]"
              >
                {muted ? (
                  <VolumeX size={17} />
                ) : (
                  <Volume2 size={17} />
                )}
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause video" : "Play video"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#063b49]/70 text-white backdrop-blur-md transition hover:bg-[#075267]"
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
              </button>
            </div>

            {/* TEXT OVER VIDEO */}
            <div className="absolute bottom-12 left-7 z-10 max-w-[650px] sm:left-10 lg:left-12">
              <div className="mb-5 flex items-center gap-3">
                <Droplets
                  size={18}
                  strokeWidth={2}
                  className="text-[#19c3dd]"
                />

                <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#45cfe3]">
                  Jal Jeevan Mission
                </span>
              </div>

              <h3 className="max-w-[680px] text-[38px] font-extrabold leading-[1.04] tracking-[-0.035em] text-white sm:text-[48px] lg:text-[58px]">
                Bringing tap water
                <br />
                closer to every home.
              </h3>

              <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-white/85 sm:text-[18px]">
                Track access, household connections and water service
                information in one place.
              </p>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {/* HOUSEHOLDS */}
            <div className="border-b border-white/10 px-7 py-8 sm:border-r lg:border-b-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7f9ca5]">
                Households
              </p>

              <p className="mt-3 text-[34px] font-extrabold tracking-[-0.03em] text-white">
                19.4 Cr
              </p>

              <p className="mt-2 text-sm leading-6 text-[#9eb2b8]">
                Rural households tracked
              </p>
            </div>

            {/* TAP CONNECTIONS */}
            <div className="border-b border-white/10 px-7 py-8 sm:border-r lg:border-b-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7f9ca5]">
                Tap connections
              </p>

              <p className="mt-3 text-[34px] font-extrabold tracking-[-0.03em] text-white">
                15.6 Cr
              </p>

              <p className="mt-2 text-sm leading-6 text-[#9eb2b8]">
                Household tap connections
              </p>
            </div>

            {/* COVERAGE */}
            <div className="border-b border-white/10 px-7 py-8 sm:border-r lg:border-b-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7f9ca5]">
                Coverage
              </p>

              <p className="mt-3 text-[34px] font-extrabold tracking-[-0.03em] text-white">
                80%
              </p>

              <p className="mt-2 text-sm leading-6 text-[#9eb2b8]">
                Rural household coverage
              </p>
            </div>

            {/* WATER QUALITY */}
            <div className="px-7 py-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7f9ca5]">
                Water quality
              </p>

              <p className="mt-3 text-[30px] font-extrabold tracking-[-0.03em] text-white">
                Monitored
              </p>

              <p className="mt-2 text-sm leading-6 text-[#9eb2b8]">
                Quality testing and surveillance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}