"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface SelfConsistentSectionProps {
  onEggTrigger: () => void
}

const fusionPersonalities = [
  { label: "曼妙", color: "#D8A7B1" },
  { label: "温柔", color: "#A77E91" },
  { label: "捣蛋", color: "#BA8FA0" },
  { label: "担当", color: "#9E7186" },
  { label: "傲娇", color: "#C0718A" },
]

export default function SelfConsistentSection({ onEggTrigger }: SelfConsistentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [sigVisible, setSigVisible] = useState(false)
  const [stampVisible, setStampVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          setTimeout(() => setSigVisible(true), 900)
          setTimeout(() => setStampVisible(true), 1500)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 px-6"
      style={{ backgroundColor: "#FAF7F5" }}
    >
      {/* 档案纸底纹 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1C1C1E 0px, transparent 1px, transparent 32px, #1C1C1E 32px, transparent 33px)",
        }}
      />
      {/* 金色光晕 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
      {/* 放射线纹理 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025]">
        <svg viewBox="0 0 400 400" width="min(400px, 80vw)" height="min(400px, 80vw)">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180
            const x2 = parseFloat((200 + 200 * Math.cos(angle)).toFixed(4))
            const y2 = parseFloat((200 + 200 * Math.sin(angle)).toFixed(4))
            return <line key={i} x1="200" y1="200" x2={x2} y2={y2} stroke="#1C1C1E" strokeWidth="0.5" />
          })}
        </svg>
      </div>

      <div
        className="relative z-10 mx-auto max-w-5xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        {/* 区块标识 */}
        <div className="mb-4 flex items-center gap-5">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#D4AF37" }}>
            BUREAU FILE · 04
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: "#D4AF37", opacity: 0.3 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8E8E93" }}>
            BUREAU CLOSURE · CASE FILED
          </span>
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#1C1C1E",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          情报归档
        </h2>
        <p className="mt-3" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.25em", color: "#8E8E93" }}>
          五份卷宗，最终归于同一坐标
        </p>

        {/* 主档案卡：黑色机密横幅 + 金色边框，与角色档案 / 情报交换区同一套皮肤 */}
        <div
          className="mt-12 overflow-hidden"
          style={{
            border: "1px solid #C8A87A",
            backgroundColor: "rgba(253,250,244,0.95)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 40px rgba(212,175,55,0.1), 4px 4px 0 rgba(212,175,55,0.08), inset 0 0 0 6px rgba(212,175,55,0.04)",
          }}
        >
          {/* 机密横幅 */}
          <div className="flex items-center justify-between px-6 py-2" style={{ backgroundColor: "#1C1C1E", borderBottom: "1px solid #D4AF37" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.5em", color: "#D4AF37", fontWeight: 700 }}>
              [ CASE CLOSED · FELINE INTELLIGENCE BUREAU ]
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8E8E93" }}>
              2026-YANG-FINAL
            </span>
          </div>

          <div className="relative px-8 py-12 text-center sm:px-12">
            {/* 四角金色括标 */}
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
              <div
                key={pos}
                className={`absolute ${pos} h-4 w-4`}
                style={{
                  borderTop: i < 2 ? "1.5px solid #D4AF37" : undefined,
                  borderBottom: i >= 2 ? "1.5px solid #D4AF37" : undefined,
                  borderLeft: i % 2 === 0 ? "1.5px solid #D4AF37" : undefined,
                  borderRight: i % 2 === 1 ? "1.5px solid #D4AF37" : undefined,
                }}
              />
            ))}

            {/* 结案正文 */}
            <div
              className="mx-auto"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
                lineHeight: 2.3,
                color: "#3C3C3E",
                letterSpacing: "0.08em",
                maxWidth: 560,
              }}
            >
              <span className="block" style={{ color: "#8E8E93", fontSize: "0.6rem", letterSpacing: "0.4em" }}>
                本局结案陈词——
              </span>
              <span className="block mt-4">五份卷宗，五种模样</span>
              <span className="block">曼妙、温柔、捣蛋、担当、傲娇</span>
              <span className="block">拆开看，是五段互不相同的侧写</span>
              <span className="block mt-6">合起来看</span>
              <span className="block">
                却只指向<span style={{ color: "#D8A7B1" }}>同一个坐标</span>
              </span>
              <span className="block mt-6" style={{ color: "#D8A7B1", fontFamily: "var(--font-serif), serif", fontSize: "1.05em" }}>
                万千猫格，皆是洋洋
              </span>
            </div>

            {/* 五格融合徽章 */}
            <div className="mx-auto my-12 flex justify-center">
              <FusionOrb />
            </div>

            {/* 核心标签卡 */}
            <div
              className="mx-auto mb-12 overflow-hidden"
              style={{
                maxWidth: 460,
                border: "1px solid rgba(212,175,55,0.35)",
                backgroundColor: "rgba(250,247,245,0.7)",
                boxShadow: "0 4px 30px rgba(212,175,55,0.1)",
              }}
            >
              <div className="px-7 py-7">
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.46rem", letterSpacing: "0.4em", color: "#D4AF37", marginBottom: "0.7rem" }}>
                  CORE INTEL TAG · 情报局核心标签
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "clamp(1.05rem, 2.3vw, 1.5rem)",
                    color: "#1C1C1E",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    letterSpacing: "0.05em",
                  }}
                >
                  &ldquo;柔软但坚定，自由但深情。&rdquo;
                </p>
                <p className="mt-3" style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#D4AF37" }}>
                  MUZIYANG · FELINE INTELLIGENCE BUREAU
                </p>
              </div>
            </div>

            {/* 探长亲笔署名 */}
            <div
              className="mx-auto mb-10"
              style={{
                opacity: sigVisible ? 1 : 0,
                transform: sigVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 1.2s ease, transform 1s ease",
              }}
            >
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#8E8E93", marginBottom: "0.5rem" }}>
                猫探长本人亲笔签署
              </p>
              <p
                style={{
                  fontFamily: "var(--font-handwriting), cursive",
                  fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
                  color: "#D8A7B1",
                  opacity: 0.85,
                  letterSpacing: "0.08em",
                }}
              >
                MuZiyang · 木子洋
              </p>
              <div
                className="mx-auto mt-2"
                style={{ width: "clamp(120px, 30%, 200px)", height: "0.5px", background: "linear-gradient(90deg, transparent, #D8A7B1, transparent)" }}
              />
            </div>

            {/* 火漆印章按钮 */}
            <div className="flex flex-col items-center">
              <button
                onClick={onEggTrigger}
                data-clickable
                aria-label="点击拆开火漆印章，查看情报局深层档案密信"
                className="flex items-center justify-center outline-none"
                style={{ background: "none", border: "none", cursor: "none" }}
              >
                <div
                  className={`relative ${stampVisible ? "stamp-animate" : "opacity-0"}`}
                  style={{ width: 100, height: 100, filter: "drop-shadow(0 8px 18px rgba(124,42,34,0.35))" }}
                >
                  <Image src="/huoqi.png" alt="情报局火漆印章" fill style={{ objectFit: "contain" }} />
                </div>
              </button>
              <p className="mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8E8E93", opacity: 0.6 }}>
                ↑ 火漆未拆 · 点击拆封解锁深层情报
              </p>
            </div>

            {/* 五维颜色条 */}
            <div className="mt-14 flex h-1 w-full overflow-hidden" style={{ boxShadow: "0 0 0 1px rgba(212,175,55,0.2)" }}>
              {fusionPersonalities.map((p) => (
                <div key={p.label} style={{ flex: 1, backgroundColor: p.color }} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center" style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#8E8E93", opacity: 0.4 }}>
          FELINE INTELLIGENCE BUREAU · CASE NO. 2026-YANG · 5 DOSSIERS FILED
        </p>
      </div>
    </section>
  )
}

function FusionOrb() {
  return (
    <div className="relative" style={{ width: "min(300px, 78vw)", height: "min(300px, 78vw)" }}>
      <svg viewBox="0 0 320 320" width="100%" height="100%" fill="none" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FAF7F5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="100" fill="url(#centerGlow)" />

        {fusionPersonalities.map((p, i) => {
          const angle = (i * (360 / fusionPersonalities.length) * Math.PI) / 180 - Math.PI / 2
          const cx = parseFloat((160 + 78 * Math.cos(angle)).toFixed(4))
          const cy = parseFloat((160 + 78 * Math.sin(angle)).toFixed(4))
          const tx = parseFloat((160 + 128 * Math.cos(angle)).toFixed(4))
          const ty = parseFloat((160 + 128 * Math.sin(angle)).toFixed(4))
          return (
            <g key={p.label}>
              <circle cx={cx} cy={cy} r="38" fill={p.color} opacity="0.2" />
              <circle cx={cx} cy={cy} r="28" fill={p.color} opacity="0.16" />
              <circle cx={cx} cy={cy} r="17" fill={p.color} opacity="0.28" />
              <line x1="160" y1="160" x2={cx} y2={cy} stroke={p.color} strokeWidth="0.8" opacity="0.4" />
              <text x={tx} y={ty + 4} textAnchor="middle" fill={p.color} fontSize="11" opacity="0.85" fontFamily="var(--font-serif), serif">
                {p.label}
              </text>
            </g>
          )
        })}

        <circle cx="160" cy="160" r="140" stroke="#D4AF37" strokeWidth="0.6" opacity="0.3" strokeDasharray="6 4" />
        <polygon points="160,130 190,160 160,190 130,160" fill="#D4AF37" opacity="0.12" />
        <polygon points="160,140 180,160 160,180 140,160" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.5" />
        <circle cx="160" cy="160" r="6" fill="#D4AF37" opacity="0.7" />
        <circle cx="160" cy="160" r="2.5" fill="#FAF7F5" opacity="0.8" />
      </svg>
    </div>
  )
}