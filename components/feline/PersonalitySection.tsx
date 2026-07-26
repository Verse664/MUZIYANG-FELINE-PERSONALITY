"use client"

import { useState } from "react"

const personalities = [
  {
    id: "graceful",
    number: "01",
    label: "曼妙猫",
    labelEn: "Graceful",
    keywords: ["优雅", "魅力", "表达"],
    keywordsEn: "Elegance · Charm · Expression",
    desc: "像丝绸般流动的存在。他知道如何在光影之间移动，舞台不是外界给予的，而是他抵达任何地方时自带的气场。",
    accent: "#D8A7B1",
    bg: "linear-gradient(135deg, #F4E2E5 0%, #E8D3D8 50%, #D8C4C8 100%)",
    visual: "丝绸 · 镜面 · 舞台光影",
    motif: (
      <img 
        src="/KWINmanmiao.jpg" 
        alt="曼妙猫 象征图案"
        style={{ width: 800, height: 350, objectFit: "contain" }}
        />
    ),
  },
  {
    id: "tender",
    number: "02",
    label: "温柔猫",
    labelEn: "Tender",
    keywords: ["陪伴", "治愈", "靠近"],
    keywordsEn: "Companionship · Healing · Closeness",
    desc: "他的存在本身就是一种治愈。不需要任何解释，只是在场，就能让空间变得温暖而安全。",
    accent: "#7C9B7E",
    bg: "linear-gradient(135deg, #EEF5EE 0%, #DDE8DC 50%, #C4D6C4 100%)",
    visual: "苔藓绿意 · 守护感",
    motif: (
      <img 
        src="/KWINwenrou.jpg" 
        alt="温柔猫 象征图案"
        style={{ width: 800, height: 350, objectFit: "contain" }}
        />
    ),
  },
  {
    id: "romantic",
    number: "03",
    label: "浪漫猫",
    labelEn: "Romantic",
    keywords: ["想象", "艺术", "自由"],
    keywordsEn: "Imagination · Art · Freedom",
    desc: "他活在比现实更深的地方。脑海中有无数平行宇宙，每一个都值得被描述，每一朵花都有故事。",
    accent: "#B0AEE0",
    bg: "linear-gradient(135deg, #EEE8F8 0%, #E0DAEE 50%, #CEC8E4 100%)",
    visual: "星空 · 花朵 · 梦境",
    motif: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const angle = (deg * Math.PI) / 180
          const x = 40 + 25 * Math.cos(angle)
          const y = 40 + 25 * Math.sin(angle)
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#B0AEE0" opacity="0.7" />
        })}
        <circle cx="40" cy="40" r="5" fill="#B0AEE0" opacity="0.4" />
        <circle cx="40" cy="40" r="2" fill="#D4AF37" opacity="0.8" />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const angle = (deg * Math.PI) / 180
          const x2 = 40 + 25 * Math.cos(angle)
          const y2 = 40 + 25 * Math.sin(angle)
          return <line key={i} x1="40" y1="40" x2={x2} y2={y2} stroke="#B0AEE0" strokeWidth="0.5" opacity="0.35" />
        })}
      </svg>
    ),
  },
  {
    id: "resilient",
    number: "04",
    label: "担当猫",
    labelEn: "Resilient",
    keywords: ["坚定", "守护", "责任"],
    keywordsEn: "Resolve · Protection · Responsibility",
    desc: "有时候软软的，有时候却是最稳定的锚。他不声张，但你总能在最重要的时刻感知到他的重量。",
    accent: "#5F7CA8",
    bg: "linear-gradient(135deg, #EAF2F8 0%, #D7E4F1 50%, #BDD2E8 100%)",
    visual: "海洋深蓝 · 坚韧感",
    motif: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <rect x="24" y="24" width="32" height="32" stroke="#5F7CA8" strokeWidth="0.8" opacity="0.5" transform="rotate(45 40 40)" />
        <rect x="30" y="30" width="20" height="20" stroke="#5F7CA8" strokeWidth="0.5" opacity="0.35" transform="rotate(45 40 40)" />
        <circle cx="40" cy="40" r="5" fill="#5F7CA8" opacity="0.3" />
        <circle cx="40" cy="40" r="2.5" fill="#314F75" opacity="0.7" />
      </svg>
    ),
  },
]

export default function PersonalitySection() {
  const [active, setActive] = useState(0)
  const current = personalities[active]

  return (
    <section className="relative py-32 px-6" style={{ backgroundColor: "#F4E2E5" }}>
      {/* Background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #1C1C1E 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20">
          <div className="reveal flex items-center gap-5 mb-3">
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                color: "#8E8E93",
              }}
            >
              03 — PERSONALITY DIMENSIONS
            </span>
            <span style={{ flex: 1, height: 1, backgroundColor: "#D8A7B1" }} />
          </div>
          <h2
            className="reveal delay-1"
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1C1C1E",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            猫格展厅
          </h2>
          <p
            className="reveal delay-2 mt-3"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              color: "#8E8E93",
            }}
          >
            THE PERSONALITY DIMENSIONS · GALLERY EXHIBITION
          </p>
        </div>

        {/* Tab navigation */}
        <div className="reveal mb-10 flex flex-wrap gap-3">
          {personalities.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
  console.log('点击了:', p.label, '索引:', i) 
  setActive(i)
}}
              data-clickable
              className="group relative overflow-hidden px-5 py-2.5 text-left transition-all duration-300"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: active === i ? "#1C1C1E" : "#8E8E93",
                border: `1px solid ${active === i ? p.accent : "#E8D3D8"}`,
                backgroundColor: active === i ? "rgba(250,247,245,0.9)" : "transparent",
                backdropFilter: "blur(8px)",
                outline: "none",
              }}
              aria-pressed={active === i}
            >
              <span style={{ color: p.accent, marginRight: "0.5em" }}>{p.number}</span>
              {p.label}
              <span className="ml-1.5 opacity-50">{p.labelEn}</span>
              {active === i && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: p.accent }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Main display card */}
        <div
          className="reveal delay-1 overflow-hidden transition-all duration-700"
          style={{
            background: current.bg,
            border: `1px solid ${current.accent}40`,
            boxShadow: `0 8px 60px ${current.accent}20, 0 2px 20px rgba(28,28,30,0.06)`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left: Motif panel */}
            <div
              className="flex flex-col items-center justify-center p-16"
              style={{ borderRight: `1px solid ${current.accent}30` }}
            >
              <div style={{ opacity: 0.7 }}>{current.motif}</div>

              <div className="mt-8 text-center">
                <div
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    color: "#1C1C1E",
                    fontWeight: 700,
                    opacity: 0.06,
                    lineHeight: 1,
                  }}
                >
                  {current.number}
                </div>
              </div>

              {/* Visual imagery tag */}
              <p
                className="mt-6 text-center"
                style={{
                  fontFamily: "var(--font-handwriting), cursive",
                  fontSize: "0.85rem",
                  color: current.accent,
                  opacity: 0.8,
                }}
              >
                {current.visual}
              </p>
            </div>

            {/* Center: Main content */}
            <div className="flex flex-col justify-between p-10 md:col-span-2">
              <div>
                {/* Personality title */}
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.45em",
                    color: current.accent,
                    marginBottom: "0.8rem",
                  }}
                >
                  PERSONALITY TYPE {current.number}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                    color: "#1C1C1E",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    lineHeight: 1.15,
                  }}
                >
                  {current.label}
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "0.4em",
                      fontSize: "0.45em",
                      fontWeight: 400,
                      color: "#8E8E93",
                      letterSpacing: "0.25em",
                      verticalAlign: "middle",
                    }}
                  >
                    {current.labelEn.toUpperCase()}
                  </span>
                </h3>

                {/* Keywords */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {current.keywords.map((kw) => (
                    <span
                      key={kw}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        color: current.accent,
                        border: `1px solid ${current.accent}50`,
                        padding: "0.25rem 0.75rem",
                        backgroundColor: `${current.accent}12`,
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* EN keywords */}
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.3em",
                    color: "#8E8E93",
                  }}
                >
                  {current.keywordsEn}
                </p>

                {/* Divider */}
                <div
                  className="my-8"
                  style={{ height: 1, background: `linear-gradient(90deg, ${current.accent}60, transparent)` }}
                />

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                    lineHeight: 2,
                    color: "#3C3C3E",
                    letterSpacing: "0.06em",
                    maxWidth: 480,
                  }}
                >
                  {current.desc}
                </p>
              </div>

              {/* Bottom note */}
              <div className="mt-10 flex items-center justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-handwriting), cursive",
                    fontSize: "0.9rem",
                    color: "#8E8E93",
                    opacity: 0.5,
                  }}
                >
                  dimension {current.number} of 04
                </span>
                <div className="flex gap-2">
                  {personalities.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      data-clickable
                      className="transition-all duration-300"
                      style={{
                        width: active === i ? 20 : 6,
                        height: 2,
                        backgroundColor: active === i ? current.accent : "#D8D3D5",
                        border: "none",
                        outline: "none",
                        cursor: "none",
                      }}
                      aria-label={`切换到 ${personalities[i].label}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
