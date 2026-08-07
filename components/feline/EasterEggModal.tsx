"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface EasterEggModalProps {
  open: boolean
  onClose: () => void
  variant?: "video" | "letter"
  title?: string
  subtitle?: string
  accent?: string
  // video 模式专用
  description?: string
  videoSrc?: string
  posterSrc?: string
  // letter 模式专用
  letterLines?: string[]
  signature?: string
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
  variant = "video",
  title = "深层档案 · 藏在时间里的话",
  subtitle,
  accent = "#D4AF37",
  description,
  videoSrc,
  posterSrc,
  letterLines = defaultLetterLines,
  signature = "MuZiyang · 木子洋",
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

  // 信件逐行淡入（仅 letter 模式使用）
  useEffect(() => {
    if (!open || variant !== "letter") {
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
        timeouts.push(window.setTimeout(revealNext, 480))
      } else {
        timeouts.push(
          window.setTimeout(() => {
            if (!cancelled) setSigVisible(true)
          }, 600)
        )
      }
    }

    timeouts.push(window.setTimeout(revealNext, 500))
    return () => {
      cancelled = true
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [open, variant, letterLines])

  if (!open) return null

  const resolvedSubtitle = subtitle ?? (variant === "letter" ? "SEALED LETTER · 火漆密信" : "VIDEO EXHIBIT")

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
      aria-label={variant === "letter" ? "深层档案密信" : "视频弹窗"}
    >
      {variant === "letter" ? (
        // ============ 书信模式 ============
        <div
          className="relative w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "slideInModal 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {/* 悬浮火漆印章 */}
          <div className="relative z-20 mx-auto -mb-8 flex flex-col items-center gap-1">
            <div style={{ width: 76, height: 76, position: "relative", filter: "drop-shadow(0 8px 16px rgba(124,42,34,0.4))" }}>
              <Image src="/huoqi.png" alt="已拆封的火漆印章" fill style={{ objectFit: "contain" }} />
            </div>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.25em", color: "#8C5A42", opacity: 0.6 }}>
              SEAL BROKEN · 已拆封
            </span>
          </div>

          <div
            className="relative overflow-hidden pt-6"
            style={{
              backgroundColor: "#F3DCCF",
              border: "1px solid #C08D74",
              boxShadow: "0 25px 70px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.15)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "repeating-linear-gradient(115deg, #6B4230 0px, transparent 1px, transparent 3px)" }}
            />

            <div className="relative flex items-center justify-between px-6 pb-4 sm:px-8">
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", letterSpacing: "0.35em", color: "#8C5A42" }}>
                {resolvedSubtitle}
              </span>
              <button
                onClick={onClose}
                data-clickable
                aria-label="关闭"
                style={{ background: "none", border: "none", color: "#8C5A42", fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", cursor: "none", opacity: 0.7 }}
              >
                [ CLOSE ]
              </button>
            </div>

            <div className="relative px-8 pb-10 sm:px-12 sm:pb-12">
              <h3
                className="mb-8 text-center"
                style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)", color: "#3D2418", fontWeight: 700, letterSpacing: "0.08em" }}
              >
                {title}
              </h3>

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

              <div
                className="mt-10 flex flex-col items-center gap-2"
                style={{
                  opacity: sigVisible ? 1 : 0,
                  transform: sigVisible ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.8s ease, transform 0.8s ease",
                }}
              >
                <div style={{ width: 60, height: "0.5px", backgroundColor: "#B4483F", opacity: 0.4 }} />
                <p style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: "#B4483F", opacity: 0.85, letterSpacing: "0.06em" }}>
                  {signature}
                </p>
                <p className="mt-2" style={{ fontFamily: "var(--font-sans)", fontSize: "0.46rem", letterSpacing: "0.3em", color: "#8C5A42", opacity: 0.55 }}>
                  本信仅你可见 · ACCESS GRANTED
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ============ 视频模式（原样保留） ============
        <div
          className="relative w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "rgba(250,247,245,0.95)",
            backdropFilter: "blur(24px)",
            border: `1px solid ${accent}30`,
            boxShadow: `0 8px 60px rgba(28,28,30,0.2), 0 2px 20px ${accent}12`,
            animation: "slideInModal 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 sm:px-8" style={{ borderBottom: `1px solid ${accent}20` }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.45em", color: accent }}>
              {resolvedSubtitle}
            </span>
            <button
              onClick={onClose}
              data-clickable
              aria-label="关闭"
              style={{ background: "none", border: "none", color: "#8E8E93", fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", cursor: "none", opacity: 0.7 }}
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <h3
              className="mb-3 text-center"
              style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: "#1C1C1E", fontWeight: 700, letterSpacing: "0.06em" }}
            >
              {title}
            </h3>

            {description ? (
              <p
                className="mb-5 text-center"
                style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", lineHeight: 1.8, color: "#3C3C3E", letterSpacing: "0.06em" }}
              >
                {description}
              </p>
            ) : null}

            {videoSrc ? (
              <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${accent}30`, backgroundColor: "#000" }}>
                <video className="w-full" controls autoPlay playsInline preload="metadata" poster={posterSrc} style={{ maxHeight: 460, backgroundColor: "#000" }}>
                  <source src={videoSrc} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed px-6 py-10 text-center" style={{ borderColor: `${accent}30` }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "#3C3C3E" }}>暂无可播放视频</p>
              </div>
            )}
          </div>
        </div>
      )}

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