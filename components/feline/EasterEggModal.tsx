"use client"

import { useEffect, useState } from "react"

interface EasterEggModalProps {
  open: boolean
  onClose: () => void
  variant?: "video" | "letter"
  title?: string
  subtitle?: string
  accent?: string
  description?: string
  videoSrc?: string
  posterSrc?: string
  letterLines?: string[]
  signature?: string
}

const defaultLetterLines = [
  "如果你看到这里，说明五份卷宗你都翻完了。",
  "谢谢你愿意花这些时间，认真地认识一遍「洋洋」。",
]

function isSystemLine(line: string): boolean {
  return line.trim().startsWith("【")
}

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
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

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

  useEffect(() => {
    if (!open || variant !== "letter") return

    const blink = window.setInterval(() => setShowCursor((v) => !v), 480)
    return () => window.clearInterval(blink)
  }, [open, variant])

  useEffect(() => {
    if (!open || variant !== "letter") return

    const glitchLoop = window.setInterval(() => {
      if (Math.random() < 0.3) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 5)

        window.setTimeout(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 80 + Math.random() * 100)
      }
    }, 1000)

    return () => window.clearInterval(glitchLoop)
  }, [open, variant])

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

  const resolvedSubtitle = subtitle ?? (variant === "letter" ? "SEALED LETTER · 绝密档案" : "VIDEO EXHIBIT")

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
        <div
          className="relative w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "slideInModal 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border px-7 py-8 sm:px-10 sm:py-11"
            style={{
              borderColor: "#A65D7360",
              background: "linear-gradient(165deg, #2A1219 0%, #3B1826 55%, #2A1219 100%)",
              boxShadow: "0 30px 90px rgba(60, 15, 30, 0.5), inset 0 0 60px rgba(186,143,160,0.08)",
              transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
              transition: glitchActive ? "none" : "transform 120ms ease-out",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 3px)",
                opacity: glitchActive ? 0.14 : 0.07,
                transition: "opacity 90ms ease-out",
              }}
            />
            {glitchActive ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0"
                style={{ height: "2px", top: `${20 + Math.random() * 60}%`, backgroundColor: "rgba(246,220,227,0.3)" }}
              />
            ) : null}

            <span aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 border-l border-t" style={{ borderColor: "#D8A7B1" }} />
            <span aria-hidden="true" className="absolute right-3 top-3 h-4 w-4 border-r border-t" style={{ borderColor: "#D8A7B1" }} />
            <span aria-hidden="true" className="absolute bottom-3 left-3 h-4 w-4 border-b border-l" style={{ borderColor: "#D8A7B1" }} />
            <span aria-hidden="true" className="absolute bottom-3 right-3 h-4 w-4 border-b border-r" style={{ borderColor: "#D8A7B1" }} />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between font-mono" style={{ fontSize: "0.56rem", letterSpacing: "0.26em", color: "#E8B8C4" }}>
                <span className="flex items-center gap-2">
                  <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#F4A6B8", boxShadow: "0 0 8px #F4A6B8" }} />
                  {resolvedSubtitle}
                </span>
                <button
                  onClick={onClose}
                  data-clickable
                  aria-label="关闭"
                  style={{ background: "none", border: "none", color: "#E8B8C4", fontSize: "0.56rem", letterSpacing: "0.2em", cursor: "none", opacity: 0.75 }}
                >
                  [ CLOSE ]
                </button>
              </div>

              <h3
                className="mb-7 text-center"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(1.1rem, 2.6vw, 1.5rem)",
                  color: "#F6DCE3",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {title}
              </h3>

              <div className="space-y-3">
                {(() => {
                  let logIndex = 0

                  return letterLines.map((line, i) => {
                    const active = i < visibleCount
                    const system = isSystemLine(line)
                    const isFinalLine = /truth is/i.test(line)

                    if (system) {
                      logIndex += 1
                      return (
                        <p
                          key={i}
                          className="flex flex-wrap items-baseline gap-2 font-mono"
                          style={{
                            fontSize: "0.72rem",
                            lineHeight: 1.9,
                            opacity: active ? 1 : 0,
                            transform: active ? "translateY(0)" : "translateY(6px)",
                            transition: "opacity 0.5s ease, transform 0.5s ease",
                          }}
                        >
                          <span style={{ color: "#7A4456" }}>[{String(logIndex).padStart(2, "0")}]</span>
                          <span
                            style={{
                              color: "#C79DAA",
                              textShadow: glitchActive && active ? "1px 0 #F4A6B8, -1px 0 #6FE3D9" : "none",
                            }}
                          >
                            {line}
                          </span>
                          <span style={{ color: "#7A4456" }}>OK</span>
                        </p>
                      )
                    }

                    return (
                      <p
                        key={i}
                        className="text-center"
                        style={{
                          fontFamily: "var(--font-serif), serif",
                          fontStyle: isFinalLine ? "italic" : "normal",
                          fontSize: isFinalLine ? "clamp(0.95rem, 2.2vw, 1.15rem)" : "clamp(1.02rem, 2.4vw, 1.25rem)",
                          lineHeight: 1.9,
                          letterSpacing: "0.05em",
                          color: isFinalLine ? "#D4AF37" : "#F6DCE3",
                          padding: isFinalLine ? "0.6rem 0 0" : "0.15rem 0",
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(8px)",
                          transition: "opacity 0.6s ease, transform 0.6s ease",
                          textShadow: glitchActive && active && !isFinalLine ? "1px 0 rgba(244,166,184,0.5), -1px 0 rgba(111,227,217,0.35)" : "none",
                        }}
                      >
                        {line}
                      </p>
                    )
                  })
                })()}

                {visibleCount < letterLines.length ? (
                  <div className="flex justify-center pt-1">
                    <span
                      className="inline-block h-4 w-2"
                      style={{ backgroundColor: "#F4A6B8", opacity: showCursor ? 1 : 0, boxShadow: "0 0 6px #F4A6B8" }}
                    />
                  </div>
                ) : null}
              </div>

              <div
                className="mt-8 flex flex-col items-center gap-2"
                style={{
                  opacity: sigVisible ? 1 : 0,
                  transform: sigVisible ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.8s ease, transform 0.8s ease",
                }}
              >
                <div style={{ width: 60, height: "0.5px", backgroundColor: "#F4A6B8", opacity: 0.4 }} />
                <p
                  style={{
                    fontFamily: "var(--font-handwriting), cursive",
                    fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)",
                    color: "#F4A6B8",
                    opacity: 0.9,
                    letterSpacing: "0.06em",
                  }}
                >
                  {signature}
                </p>
                <p className="mt-1" style={{ fontFamily: "var(--font-sans)", fontSize: "0.44rem", letterSpacing: "0.3em", color: "#B98A99" }}>
                  本档案仅你可见 · ACCESS GRANTED
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
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