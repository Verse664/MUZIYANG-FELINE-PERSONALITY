"use client"

import { useEffect, useRef, useState } from "react"

interface SelfConsistentSectionProps {
  onEggTrigger: () => void
}

export default function SelfConsistentSection({ onEggTrigger }: SelfConsistentSectionProps) {
  const [sigVisible, setSigVisible] = useState(false)
  const [stampVisible, setStampVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setSigVisible(true), 600)
          setTimeout(() => setStampVisible(true), 1200)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-40 px-6"
      style={{
        background: "linear-gradient(160deg, #FAF7F5 0%, #F4E2E5 30%, #E8D3D8 65%, #FAF7F5 100%)",
      }}
    >
      {/* Background ornament */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          style={{
            width: "min(600px, 80vw)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* Subtle radial lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025]">
        <svg viewBox="0 0 400 400" width="min(400px, 80vw)" height="min(400px, 80vw)">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180
            const x2 = parseFloat((200 + 200 * Math.cos(angle)).toFixed(4))
            const y2 = parseFloat((200 + 200 * Math.sin(angle)).toFixed(4))
            return (
              <line
                key={i}
                x1="200" y1="200"
                x2={x2}
                y2={y2}
                stroke="#1C1C1E"
                strokeWidth="0.5"
              />
            )
          })}
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Section label */}
        <div className="reveal mb-16 flex items-center justify-center gap-5">
          <span style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(90deg, transparent, #D8A7B1)" }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.4em",
              color: "#8E8E93",
            }}
          >
            04 — FINAL CHAPTER
          </span>
          <span style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(90deg, #D8A7B1, transparent)" }} />
        </div>

        {/* Title */}
        <h2
          className="reveal delay-1"
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            color: "#1C1C1E",
            fontWeight: 700,
            letterSpacing: "0.06em",
            lineHeight: 1.2,
          }}
        >
          自洽猫
        </h2>
        <p
          className="reveal delay-2 mt-2"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            letterSpacing: "0.35em",
            color: "#8E8E93",
          }}
        >
          THE SELF-CONSISTENT FELINE
        </p>

        {/* Fusion visual */}
        <div className="reveal delay-2 my-16 flex items-center justify-center">
          <FusionOrb />
        </div>

        {/* Concept description */}
        <p
          className="reveal delay-2 mx-auto mb-10"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
            lineHeight: 2.2,
            color: "#3C3C3E",
            letterSpacing: "0.08em",
            maxWidth: 560,
          }}
        >
          四种猫格并非分裂，而是同一个人格在不同维度的显现。曼妙是他的表达，温柔是他的回应，浪漫是他的内核，担当是他的选择。四者共存，才成为完整的洋洋。
        </p>

        {/* Gold quote */}
        <div
          className="reveal delay-3 mx-auto mb-16 px-8 py-8 relative"
          style={{
            maxWidth: 480,
            border: "1px solid rgba(212,175,55,0.35)",
            backgroundColor: "rgba(250,247,245,0.7)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 30px rgba(212,175,55,0.1)",
          }}
        >
          {/* Corner accents */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4`}
              style={{
                borderTop: i < 2 ? "1.5px solid #D4AF37" : undefined,
                borderBottom: i >= 2 ? "1.5px solid #D4AF37" : undefined,
                borderLeft: i % 2 === 0 ? "1.5px solid #D4AF37" : undefined,
                borderRight: i % 2 === 1 ? "1.5px solid #D4AF37" : undefined,
              }}
            />
          ))}

          <p
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              color: "#1C1C1E",
              fontStyle: "italic",
              lineHeight: 1.7,
              letterSpacing: "0.05em",
            }}
          >
            &ldquo;柔软但坚定，自由但深情。&rdquo;
          </p>
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "#D4AF37",
            }}
          >
            MUZIYANG · CORE ATTRIBUTE TAG
          </p>
        </div>

        {/* Handwritten signature */}
        <div
          className="mx-auto mb-10 text-center"
          style={{
            opacity: sigVisible ? 1 : 0,
            transform: sigVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 1.2s ease, transform 1s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-handwriting), cursive",
              fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
              color: "#D8A7B1",
              opacity: 0.75,
              letterSpacing: "0.08em",
            }}
          >
            MuZiyang · 木子洋
          </p>
          <div
            className="mx-auto mt-2"
            style={{
              width: "clamp(120px, 30%, 200px)",
              height: 1,
              background: "linear-gradient(90deg, transparent, #D8A7B1, transparent)",
            }}
          />
        </div>

        {/* Stamp — clickable Easter Egg */}
        <button
          onClick={onEggTrigger}
          data-clickable
          aria-label="点击查看自洽档案秘密寄语"
          className="mx-auto mt-4 flex items-center justify-center outline-none"
          style={{
            background: "none",
            border: "none",
            cursor: "none",
          }}
        >
          <div
            className={`relative ${stampVisible ? "stamp-animate" : "opacity-0"}`}
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: "2px solid rgba(216,167,177,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              backgroundColor: "rgba(232,211,216,0.08)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 0 0 6px rgba(216,167,177,0.06), 0 0 0 12px rgba(216,167,177,0.03)",
              transition: "box-shadow 0.3s",
            }}
          >
            {/* Inner ring */}
            <div
              className="absolute inset-2 rounded-full"
              style={{ border: "1px solid rgba(216,167,177,0.3)" }}
            />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#D8A7B1" }}>
              YANGYANG
            </p>
            <div style={{ width: 24, height: 0.5, backgroundColor: "#D8A7B1", opacity: 0.5 }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#D8A7B1", opacity: 0.7 }}>
              自洽猫
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.2em", color: "#8E8E93" }}>
              2026
            </p>
          </div>
        </button>

        <p
          className="mt-5"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.5rem",
            letterSpacing: "0.3em",
            color: "#8E8E93",
            opacity: 0.5,
          }}
        >
          ↑ 点击印章，解锁档案深层寄语
        </p>

        {/* Four color stripe */}
        <div className="mt-20 flex h-1 w-full overflow-hidden">
          <div style={{ flex: 1, backgroundColor: "#D8A7B1" }} />
          <div style={{ flex: 1, backgroundColor: "#E8C4B0" }} />
          <div style={{ flex: 1, backgroundColor: "#B0AEE0" }} />
          <div style={{ flex: 1, backgroundColor: "#9BA8A0" }} />
        </div>

        {/* Footer note */}
        <p
          className="mt-8"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            color: "#8E8E93",
            opacity: 0.35,
          }}
        >
          MUZIYANG FELINE PERSONALITY ARCHIVE · ARCHIVE NO. 2026-YANG · ALL DIMENSIONS DOCUMENTED
        </p>
      </div>
    </section>
  )
}

function FusionOrb() {
  const colors = ["#D8A7B1", "#E8C4B0", "#B0AEE0", "#9BA8A0"]
  const labels = ["曼妙", "温柔", "浪漫", "担当"]

  return (
    <div className="relative" style={{ width: "min(320px, 80vw)", height: "min(320px, 80vw)" }}>
      <svg
        viewBox="0 0 320 320"
        width="100%"
        height="100%"
        fill="none"
        style={{ overflow: "visible" }}
      >
        {/* Central glow */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FAF7F5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="100" fill="url(#centerGlow)" />

        {/* 4 colored arcs / petals */}
        {colors.map((color, i) => {
          const angle = (i * 90 * Math.PI) / 180
          const cx = parseFloat((160 + 70 * Math.cos(angle - Math.PI / 4)).toFixed(4))
          const cy = parseFloat((160 + 70 * Math.sin(angle - Math.PI / 4)).toFixed(4))
          const tx = parseFloat((160 + 120 * Math.cos(angle - Math.PI / 4)).toFixed(4))
          const ty = parseFloat((160 + 120 * Math.sin(angle - Math.PI / 4)).toFixed(4))
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="42" fill={color} opacity="0.2" />
              <circle cx={cx} cy={cy} r="32" fill={color} opacity="0.15" />
              <circle cx={cx} cy={cy} r="20" fill={color} opacity="0.25" />
              <line x1="160" y1="160" x2={cx} y2={cy} stroke={color} strokeWidth="0.8" opacity="0.4" />
              <text
                x={tx}
                y={ty + 4}
                textAnchor="middle"
                fill={color}
                fontSize="11"
                opacity="0.8"
                fontFamily="var(--font-serif), serif"
              >
                {labels[i]}
              </text>
            </g>
          )
        })}

        {/* Outer ring */}
        <circle cx="160" cy="160" r="130" stroke="#D4AF37" strokeWidth="0.6" opacity="0.3" strokeDasharray="6 4" />

        {/* Center diamond */}
        <polygon
          points="160,130 190,160 160,190 130,160"
          fill="#D4AF37"
          opacity="0.12"
        />
        <polygon
          points="160,140 180,160 160,180 140,160"
          stroke="#D4AF37"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />

        {/* Center dot */}
        <circle cx="160" cy="160" r="6" fill="#D4AF37" opacity="0.7" />
        <circle cx="160" cy="160" r="2.5" fill="#FAF7F5" opacity="0.8" />
      </svg>
    </div>
  )
}
