"use client"

import { useEffect, useState } from "react"

interface HeroSectionProps {
  onEggTrigger: () => void
  scrollY: number
}

export default function HeroSection({ onEggTrigger, scrollY }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [tagVisible, setTagVisible] = useState(false)

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

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 30%, #3B1826 0%, #2A1219 55%, #1C0D13 100%)",
      }}
    >
      {/* 板面颗粒纹理，呼应终端动画/角色档案深色背景的质感 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #F6DCE3 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      {/* Subtle grid lines（浅色改暗，避免在深色底上过亮） */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#F6DCE3 1px, transparent 1px), linear-gradient(90deg, #F6DCE3 1px, transparent 1px)",
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
          className="mb-8 flex items-center gap-3 border border-[#D4AF37]/40 bg-[#F6DCE3]/5 px-5 py-2.5 backdrop-blur-sm"
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
              color: "#B98A99",
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
          <CatEyeVideo />
        </div>

        {/* Main title */}
        <h1
          className="mb-5 text-center leading-tight transition-all duration-1000 ease-out"
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(1.6rem, 5.5vw, 4rem)",
            letterSpacing: "0.12em",
            color: "#F6DCE3",
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
              color: "#F4A6B8",
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
              color: "#B98A99",
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
          <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #F4A6B8)" }} />
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
          <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, #F4A6B8, transparent)" }} />
        </div>

        {/* Subtitle */}
        <p
          className="mb-10 transition-all duration-1000 ease-out"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.75rem, 1.8vw, 1rem)",
            letterSpacing: "0.22em",
            color: "#B98A99",
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          本局已运营八周年 · 猫探长现身情报大厅
        </p>

        {/* Archive tag */}
        <div
          className="group flex items-center gap-3 border border-[#F4A6B8]/30 px-6 py-2.5 transition-all duration-700"
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
              color: "#C7A0AC",
            }}
          >
            [ 情报局 · 公开情报 · 翻阅档案 ]
          </span>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-24 flex flex-col items-center gap-2 transition-all duration-1000"
          style={{ opacity: tagVisible ? 0.5 : 0 }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              color: "#C7A0AC",
            }}
          >
            SCROLL · ENTER BUREAU
          </span>
          <div
            style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, #F4A6B8, transparent)",
              animation: "float-petal 2.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

    </section>
  )
}

function CatEyeVideo() {
  return (
    <div className="relative" style={{ width: 550, height: 200 }}>
      {/* Ambient glow：在深色底上改用暖粉更浓郁的光晕，帮助视频边缘"融进"背景而不是漂浮在上面 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(244,166,184,0.25) 0%, rgba(212,175,55,0.08) 45%, transparent 72%)",
          filter: "blur(28px)",
          animation: "glow-pulse 3s ease-in-out infinite",
        }}
      />

      <video
        autoPlay
        loop
        muted
        playsInline
        aria-label="猫探长眼部影像"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter: "brightness(1.15) contrast(1.1) drop-shadow(0 0 24px rgba(244,166,184,0.35))",
          mixBlendMode: "screen",
          maskImage: "radial-gradient(ellipse 68% 74% at center, #000 42%, rgba(0,0,0,0.55) 62%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse 68% 74% at center, #000 42%, rgba(0,0,0,0.55) 62%, transparent 92%)",
        }}
      >
        <source src="/eyes/eyes.mp4" type="video/mp4" />
      </video>
    </div>
  )
}