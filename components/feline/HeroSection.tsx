"use client"

import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  onEggTrigger: () => void
  scrollY: number
}

export default function HeroSection({ onEggTrigger, scrollY }: HeroSectionProps) {
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [tagVisible, setTagVisible] = useState(false)
  const [blinking, setBlinking] = useState(false)

  // Staggered entrance
  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 400)
    const t2 = setTimeout(() => setSubtitleVisible(true), 900)
    const t3 = setTimeout(() => setTagVisible(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Random blink
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 4000
      return setTimeout(() => {
        setBlinking(true)
        setTimeout(() => {
          setBlinking(false)
          scheduleBlink()
        }, 180)
      }, delay)
    }
    const t = scheduleBlink()
    return () => clearTimeout(t)
  }, [])

  const parallaxY = scrollY * 0.4

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #F4E2E5 0%, #FAF7F5 40%, #E8D3D8 75%, #EDD5D9 100%)",
      }}
    >
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
          animation: "glow-pulse 5s ease-in-out infinite",
        }}
      />

      {/* Subtle grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1E 1px, transparent 1px), linear-gradient(90deg, #1C1C1E 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Parallax content wrapper */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        {/* Archive number top */}
        <div
          className="mb-8 flex items-center gap-3 rounded-full border border-[#D8A7B1]/40 bg-white/50 px-4 py-2 shadow-[0_8px_24px_rgba(216,167,177,0.12)] backdrop-blur-sm"
          style={{
            opacity: tagVisible ? 1 : 0,
            transform: tagVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              color: "#D4AF37",
              fontWeight: 700,
            }}
          >
            08
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "#8E8E93",
            }}
          >
            出道八周年 · 8TH ANNIVERSARY
          </span>
        </div>

        <div
          className="mb-12 font-mono text-xs tracking-[0.35em] text-[#8E8E93] opacity-0 transition-all duration-1000"
          style={{
            opacity: tagVisible ? 0.6 : 0,
            transform: tagVisible ? "translateY(0)" : "translateY(12px)",
            fontFamily: "var(--font-sans), monospace",
          }}
        >
          PRIVATE COLLECTION · SPECIMEN STUDY · RESTRICTED ACCESS
        </div>

        {/* Cat eye SVG — clickable Easter Egg trigger */}
        <button
          onClick={onEggTrigger}
          data-clickable
          aria-label="打开洋洋的秘密档案"
          className="relative mb-16 outline-none focus-visible:ring-2 focus-visible:ring-[#D8A7B1]"
          style={{ background: "none", border: "none" }}
        >
          <CatEyeSVG blinking={blinking} />
        </button>

        {/* Main title */}
        <h1
          className="mb-5 text-center leading-tight transition-all duration-1000 ease-out"
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(1.6rem, 5.5vw, 4rem)",
            letterSpacing: "0.12em",
            color: "#1C1C1E",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(28px)",
            maxWidth: "820px",
            fontWeight: 700,
          }}
        >
          木子洋 KWIN
          <span
            style={{
              display: "block",
              fontSize: "clamp(1rem, 3vw, 2.2rem)",
              letterSpacing: "0.28em",
              color: "#D8A7B1",
              fontWeight: 400,
              marginTop: "0.3em",
            }}
          >
            PERSONALITY ARCHIVE
          </span>
        </h1>

        {/* Divider */}
        <div
          className="mb-8 flex items-center gap-4 transition-all duration-700"
          style={{ opacity: subtitleVisible ? 1 : 0 }}
        >
          <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #D8A7B1)" }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "#D4AF37",
            }}
          >
            ◆
          </span>
          <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, #D8A7B1, transparent)" }} />
        </div>

        {/* Subtitle */}
        <p
          className="mb-10 transition-all duration-1000 ease-out"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.75rem, 1.8vw, 1rem)",
            letterSpacing: "0.22em",
            color: "#8E8E93",
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          关于一只猫如何成为自己的观察记录
        </p>

        {/* Archive tag */}
        <div
          className="group flex cursor-pointer items-center gap-3 border border-[#D8A7B1]/40 px-6 py-2.5 transition-all duration-700 hover:border-[#D8A7B1] hover:bg-[#E8D3D8]/20"
          onClick={onEggTrigger}
          data-clickable
          style={{
            opacity: tagVisible ? 1 : 0,
            transform: tagVisible ? "translateY(0)" : "translateY(16px)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D4AF37",
              boxShadow: "0 0 8px 2px #D4AF3766",
              animation: "glow-pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#8E8E93",
            }}
          >
            [ EIGHTH ANNIVERSARY · 2026-YANG ]
          </span>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-24 flex flex-col items-center gap-2 transition-all duration-1000"
          style={{ opacity: tagVisible ? 0.45 : 0 }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              color: "#8E8E93",
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <div
            style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, #D8A7B1, transparent)",
              animation: "float-petal 2.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Bottom edge fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #FAF7F5)" }}
      />
    </section>
  )
}

function CatEyeSVG({ blinking }: { blinking: boolean }) {
  return (
    <div className="relative" style={{ width: 160, height: 100 }}>
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(216,167,177,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
          animation: "glow-pulse 3s ease-in-out infinite",
        }}
      />
      <svg
        viewBox="0 0 160 100"
        width="160"
        height="100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 0 18px rgba(216,167,177,0.5))",
          transform: blinking ? "scaleY(0.08)" : "scaleY(1)",
          transformOrigin: "center",
          transition: blinking ? "transform 0.08s ease-in" : "transform 0.12s ease-out",
        }}
      >
        {/* Eye white / iris base */}
        <ellipse cx="80" cy="50" rx="72" ry="44" fill="#F4E2E5" opacity="0.9" />
        {/* Iris gradient */}
        <ellipse cx="80" cy="50" rx="58" ry="36">
          <animate attributeName="fill" values="#E8D3D8;#D8A7B1;#E8D3D8" dur="5s" repeatCount="indefinite" />
        </ellipse>
        {/* Pupil — vertical slit with breathe animation */}
        <ellipse cx="80" cy="50" rx="18" ry="38" fill="#1C1C1E">
          <animate
            attributeName="rx"
            values="18;12;18"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </ellipse>
        {/* Pupil sheen */}
        <ellipse cx="72" cy="40" rx="7" ry="11" fill="white" opacity="0.18" />
        {/* Gold ring */}
        <ellipse cx="80" cy="50" rx="72" ry="44" stroke="#D4AF37" strokeWidth="0.8" opacity="0.6" />
        {/* Outer subtle line */}
        <ellipse cx="80" cy="50" rx="76" ry="47" stroke="#D8A7B1" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  )
}
