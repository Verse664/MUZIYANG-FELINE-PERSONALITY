"use client"

import { useEffect, useState } from "react"

interface EasterEggModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  letterLines?: string[]
  signature?: string
  accent?: string
}

const defaultLetterLines = [
  "如果你看到这里，说明五份卷宗你都翻完了。",
  "谢谢你愿意花这些时间，认真地认识一遍「洋洋」。",
  "曼妙、温柔、捣蛋、担当、傲娇——",
  "其实哪一面都不是刻意扮演的角色，",
  "只是不同的时刻，恰好露出了不同的自己。",
  "谢谢你没有只选一面来定义我，",
  "谢谢你愿意把五份都看完。",
  "以后的路还很长，",
  "希望你还愿意继续陪着看下去。",
]

export default function EasterEggModal({
  open,
  onClose,
  title = "深层档案 · 藏在时间里的话",
  subtitle = "SEALED LETTER · 火漆密信",
  letterLines = defaultLetterLines,
  signature = "MuZiyang · 木子洋",
  accent = "#D4AF37",
}: EasterEggModalProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [sigVisible, setSigVisible] = useState(false)

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    window.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  // 信件逐行淡入
  useEffect(() => {
    if (!open) {
      setVisibleCount(0)
      setSigVisible(false)
      return
    }
    let cancelled = false
    let i = 0
    const timeouts: number[] = []

    const revealNext = () => {
      if (cancelled) return
      i += 1
      setVisibleCount(i)
      if (i < letterLines.length) {
        const id = window.setTimeout(revealNext, 480)
        timeouts.push(id)
      } else {
        const id = window.setTimeout(() => {
          if (!cancelled) setSigVisible(true)
        }, 600)
        timeouts.push(id)
      }
    }

    const startId = window.setTimeout(revealNext, 500)
    timeouts.push(startId)

    return () => {
      cancelled = true
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [open, letterLines])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(28,28,30,0.6)",
        backdropFilter: "blur(14px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="深层档案密信"
    >
      <div
        className="relative w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInModal 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {/* 拆开的火漆印章，悬浮在信纸顶部 */}
        <div className="relative z-20 mx-auto -mb-8 flex justify-center">
          <BrokenWaxSeal accent={accent} />
        </div>

        {/* 信纸主体 */}
        <div
          className="relative overflow-hidden pt-14"
          style={{
            backgroundColor: "#F3DCCF",
            border: "1px solid #C08D74",
            boxShadow: "0 25px 70px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.15)",
          }}
        >
          {/* 纸纤维纹理 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "repeating-linear-gradient(115deg, #6B4230 0px, transparent 1px, transparent 3px)" }}
          />

          {/* 顶部信息条 */}
          <div className="relative flex items-center justify-between px-6 pb-4 sm:px-8">
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", letterSpacing: "0.35em", color: "#8C5A42" }}>
              {subtitle}
            </span>
            <button
              onClick={onClose}
              data-clickable
              aria-label="关闭"
              style={{
                background: "none",
                border: "none",
                color: "#8C5A42",
                fontFamily: "var(--font-sans)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                cursor: "none",
                opacity: 0.7,
              }}
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="relative px-8 pb-10 sm:px-12 sm:pb-12">
            <h3
              className="mb-8 text-center"
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)",
                color: "#3D2418",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {title}
            </h3>

            {/* 信件正文，逐行淡入 */}
            <div className="mx-auto max-w-md space-y-3">
              {letterLines.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-handwriting), cursive",
                    fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                    lineHeight: 1.9,
                    color: "#3D2418",
                    letterSpacing: "0.03em",
                    textAlign: "center",
                    opacity: i < visibleCount ? 1 : 0,
                    transform: i < visibleCount ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* 签名 */}
            <div
              className="mt-10 flex flex-col items-center gap-2"
              style={{
                opacity: sigVisible ? 1 : 0,
                transform: sigVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <div style={{ width: 60, height: "0.5px", backgroundColor: "#B4483F", opacity: 0.4 }} />
              <p
                style={{
                  fontFamily: "var(--font-handwriting), cursive",
                  fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                  color: "#B4483F",
                  opacity: 0.85,
                  letterSpacing: "0.06em",
                }}
              >
                {signature}
              </p>
              <p
                className="mt-2"
                style={{ fontFamily: "var(--font-sans)", fontSize: "0.46rem", letterSpacing: "0.3em", color: "#8C5A42", opacity: 0.55 }}
              >
                本信仅你可见 · ACCESS GRANTED
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInModal {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// 拆开状态的火漆印章：裂成两半，露出信纸的效果
function BrokenWaxSeal({ accent }: { accent: string }) {
  return (
    <div className="relative flex items-center" style={{ width: 120, height: 76 }}>
      {/* 左半边蜡片 */}
      <svg width="64" height="76" viewBox="0 0 64 76" style={{ position: "absolute", left: 0, transform: "rotate(-6deg)" }}>
        <defs>
          <radialGradient id="waxLeft" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#D9584C" />
            <stop offset="55%" stopColor="#B4483F" />
            <stop offset="100%" stopColor="#7C2A22" />
          </radialGradient>
        </defs>
        <path
          d="M58 8 C62 2 50 -2 42 4 C34 -4 20 0 18 8 C8 6 0 16 6 26 C-2 32 2 44 12 46 C8 56 18 66 28 62 C32 72 48 72 50 62 C60 64 66 52 58 46 C64 38 60 26 50 24 C56 16 52 6 58 8 Z"
          fill="url(#waxLeft)"
        />
        <ellipse cx="24" cy="18" rx="10" ry="6" fill="#fff" opacity="0.18" />
        <text x="30" y="42" textAnchor="middle" fill="#F3DCCF" fontSize="15" fontFamily="var(--font-serif), serif" opacity="0.85">
          洋
        </text>
      </svg>

      {/* 右半边蜡片 */}
      <svg width="64" height="76" viewBox="0 0 64 76" style={{ position: "absolute", right: 0, transform: "rotate(7deg)" }}>
        <defs>
          <radialGradient id="waxRight" cx="65%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#D9584C" />
            <stop offset="55%" stopColor="#B4483F" />
            <stop offset="100%" stopColor="#7C2A22" />
          </radialGradient>
        </defs>
        <path
          d="M6 8 C2 2 14 -2 22 4 C30 -4 44 0 46 8 C56 6 64 16 58 26 C66 32 62 44 52 46 C56 56 46 66 36 62 C32 72 16 72 14 62 C4 64 -2 52 6 46 C0 38 4 26 14 24 C8 16 12 6 6 8 Z"
          fill="url(#waxRight)"
        />
        <ellipse cx="40" cy="18" rx="10" ry="6" fill="#fff" opacity="0.15" />
      </svg>

      {/* 底部滴蜡小点 */}
      <span
        className="absolute rounded-full"
        style={{ width: 6, height: 6, backgroundColor: "#7C2A22", left: 18, bottom: -3, opacity: 0.8 }}
      />
      <span
        className="absolute rounded-full"
        style={{ width: 4, height: 4, backgroundColor: "#7C2A22", right: 26, bottom: -2, opacity: 0.7 }}
      />

      {/* 金色裂缝细光 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 2, height: 50, background: `linear-gradient(180deg, transparent, ${accent}90, transparent)`, opacity: 0.6, transform: "rotate(4deg)" }}
      />
    </div>
  )
}