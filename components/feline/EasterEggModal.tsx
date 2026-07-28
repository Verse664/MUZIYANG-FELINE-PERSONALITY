"use client"

import { useEffect } from "react"

interface EasterEggModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  description?: string
  videoSrc?: string
  posterSrc?: string
  accent?: string
}

export default function EasterEggModal({
  open,
  onClose,
  title = "深层档案 · 藏在时间里的话",
  subtitle = "VIDEO EXHIBIT",
  description,
  videoSrc,
  posterSrc,
  accent = "#D4AF37",
}: EasterEggModalProps) {
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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(28,28,30,0.55)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="视频弹窗"
    >
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
        <div
          className="flex items-center justify-between px-6 py-4 sm:px-8"
          style={{ borderBottom: `1px solid ${accent}20` }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.5rem",
              letterSpacing: "0.45em",
              color: accent,
            }}
          >
            {subtitle}
          </span>
          <button
            onClick={onClose}
            data-clickable
            aria-label="关闭"
            style={{
              background: "none",
              border: "none",
              color: "#8E8E93",
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

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <h3
            className="mb-3 text-center"
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              color: "#1C1C1E",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            {title}
          </h3>

          {description ? (
            <p
              className="mb-5 text-center"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                color: "#3C3C3E",
                letterSpacing: "0.06em",
              }}
            >
              {description}
            </p>
          ) : null}

          {videoSrc ? (
            <div
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: `${accent}30`, backgroundColor: "#000" }}
            >
              <video
                className="w-full"
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={posterSrc}
                style={{ maxHeight: 460, backgroundColor: "#000" }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed px-6 py-10 text-center" style={{ borderColor: `${accent}30` }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "#3C3C3E" }}>
                暂无可播放视频
              </p>
            </div>
          )}
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
