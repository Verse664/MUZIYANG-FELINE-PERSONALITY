"use client"

import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  onEggTrigger: () => void
  scrollY: number
}

export default function HeroSection({ onEggTrigger, scrollY }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [tagVisible, setTagVisible] = useState(false)
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Staggered entrance
  useEffect(() => {
    if (!mounted) return
    const t1 = setTimeout(() => setTitleVisible(true), 400)
    const t2 = setTimeout(() => setSubtitleVisible(true), 900)
    const t3 = setTimeout(() => setTagVisible(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [mounted])

  // Random blink — only after mount to avoid hydration mismatch
  useEffect(() => {
    if (!mounted) return
    let timeoutId: ReturnType<typeof setTimeout>
    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 5000
      timeoutId = setTimeout(() => {
        setBlinking(true)
        timeoutId = setTimeout(() => {
          setBlinking(false)
          scheduleBlink()
        }, 600)
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(timeoutId)
  }, [mounted])

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #F4E2E5 0%, #FAF7F5 40%, #E8D3D8 75%, #EDD5D9 100%)",
      }}
    >
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
        style={{ transform: "translateY(0)" }}
      >
        {/* 情报局接入标识 */}
        <div
          className="mb-8 flex items-center gap-3 border border-[#D4AF37]/40 bg-[#1C1C1E]/5 px-5 py-2.5 backdrop-blur-sm"
          style={{
            opacity: tagVisible ? 1 : 0,
            transform: tagVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#D4AF37",
              boxShadow: "0 0 8px 2px #D4AF3788",
              display: "inline-block",
              animation: "glow-pulse 1.8s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.38em",
              color: "#D4AF37",
              fontWeight: 700,
            }}
          >
            FELINE INTELLIGENCE BUREAU
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "#8E8E93",
            }}
          >
            · 木子猫情报局
          </span>
        </div>

        {/* Cat eye SVG */}
        <div
          className="relative mb-16"
          style={{ background: "none", border: "none" }}
        >
          <CatEyeSVG blinking={blinking} />
        </div>

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
            猫探长情报档案
          </span>
          <span
            style={{
              display: "block",
              fontSize: "clamp(0.65rem, 1.4vw, 1rem)",
              letterSpacing: "0.35em",
              color: "#8E8E93",
              fontWeight: 400,
              marginTop: "0.5em",
              fontFamily: "var(--font-sans)",
            }}
          >
            FELINE INTELLIGENCE DOSSIER · CASE NO. 2026-YANG
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
          本局已运营八周年 · 猫探长现身情报大厅
        </p>

        {/* Archive tag */}
        <div
          className="group flex items-center gap-3 border border-[#D8A7B1]/40 px-6 py-2.5 transition-all duration-700"
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
            [ 情报局 · 公开情报 · 翻阅档案 ]
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
            SCROLL · ENTER BUREAU
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
    <div className="relative" style={{ width: 550, height: 200 }}>
      {/* Ambient glow，保留原来的氛围光晕效果 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(216,167,177,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
          animation: "glow-pulse 3s ease-in-out infinite",
        }}
      />

      {/* 睁眼图 */}
      <img
        src="/eyes/eye-open.png"
        alt="睁眼"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter: "drop-shadow(0 0 18px rgba(216,167,177,0.5))",
          opacity: blinking ? 0 : 1,
          transition: "opacity 0.6s ease-out",
        }}
      />

      {/* 闭眼图 */}
      <img
        src="/eyes/eye-close.png"
        alt="闭眼"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter: "drop-shadow(0 0 18px rgba(216,167,177,0.5))",
          opacity: blinking ? 1 : 0,
          transition: "opacity 0.6s ease-in",
        }}
      />
    </div>
  )
}
