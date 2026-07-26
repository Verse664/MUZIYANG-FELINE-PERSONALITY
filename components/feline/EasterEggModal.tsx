"use client"

import { useEffect } from "react"

interface EasterEggModalProps {
  open: boolean
  onClose: () => void
}

export default function EasterEggModal({ open, onClose }: EasterEggModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-6"
      style={{
        backgroundColor: "rgba(28,28,30,0.55)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="洋洋的深层档案寄语"
    >
      {/* Modal card */}
      <div
        className="relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(250,247,245,0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(212,175,55,0.3)",
          boxShadow: "0 8px 60px rgba(28,28,30,0.2), 0 2px 20px rgba(212,175,55,0.12)",
          animation: "slideInModal 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: "1px solid rgba(216,167,177,0.25)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.5rem",
              letterSpacing: "0.45em",
              color: "#D4AF37",
            }}
          >
            ◆ CLASSIFIED ARCHIVE · RESTRICTED ◆
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

        {/* Content */}
        <div className="px-8 py-10">
          {/* Archive number */}
          <div
            className="mb-6"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.5rem",
              letterSpacing: "0.4em",
              color: "#8E8E93",
            }}
          >
            DOC-YANG-2026 · LEVEL 5 CLEARANCE · INNER ARCHIVE
          </div>

          {/* Eye decoration */}
          <div className="mb-8 flex justify-center">
            <svg viewBox="0 0 100 40" width="100" height="40" fill="none">
              <ellipse cx="50" cy="20" rx="44" ry="17" fill="#F4E2E5" opacity="0.8" />
              <ellipse cx="50" cy="20" rx="12" ry="17" fill="#1C1C1E" opacity="0.7">
                <animate attributeName="rx" values="12;8;12" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="44" cy="15" rx="4" ry="6" fill="white" opacity="0.3" />
              <ellipse cx="50" cy="20" rx="44" ry="17" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>

          {/* Title */}
          <h3
            className="mb-6 text-center"
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              color: "#1C1C1E",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            深层档案 · 自洽寄语
          </h3>

          {/* Divider */}
          <div
            className="mx-auto mb-8"
            style={{
              width: 60,
              height: 1,
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />

          {/* Message */}
          <p
            className="mb-6 text-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
              lineHeight: 2.2,
              color: "#3C3C3E",
              letterSpacing: "0.08em",
            }}
          >
            自洽，不是不在乎外界——
            <br />
            而是知道自己在乎什么，
            <br />
            所以不会被那些<span style={{ color: "#D8A7B1" }}>不重要的声音</span>带走。
          </p>

          <p
            className="mb-8 text-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              lineHeight: 2,
              color: "#8E8E93",
              letterSpacing: "0.06em",
            }}
          >
            你已经是一个完整的宇宙了，
            <br />
            不需要被任何人&ldquo;填满&rdquo;，
            <br />
            也不需要让自己去&ldquo;填满&rdquo;别人。
          </p>

          {/* Gold quote */}
          <div
            className="mb-8 text-center px-6 py-5"
            style={{
              border: "1px solid rgba(212,175,55,0.2)",
              backgroundColor: "rgba(212,175,55,0.04)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(1rem, 2vw, 1.3rem)",
                color: "#1C1C1E",
                fontStyle: "italic",
                letterSpacing: "0.06em",
                lineHeight: 1.7,
              }}
            >
              &ldquo;洋洋，你本身就是光。&rdquo;
            </p>
          </div>

          {/* Handwritten note */}
          <div className="text-right">
            <p
              style={{
                fontFamily: "var(--font-handwriting), cursive",
                fontSize: "1.1rem",
                color: "#D8A7B1",
                opacity: 0.7,
              }}
            >
              — with love, always ♡
            </p>
          </div>
        </div>

        {/* Bottom stamps row */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{ borderTop: "1px solid rgba(216,167,177,0.2)" }}
        >
          <div className="flex gap-1.5">
            {["#D8A7B1", "#E8C4B0", "#B0AEE0", "#9BA8A0"].map((c, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c, opacity: 0.6 }} />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.45rem",
              letterSpacing: "0.35em",
              color: "#8E8E93",
              opacity: 0.4,
            }}
          >
            ARCHIVE NO. 2026-YANG · END OF FILE
          </span>
        </div>

        {/* Gold corner accents */}
        {[
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute ${cls} w-5 h-5`}
            style={{ borderColor: "rgba(212,175,55,0.5)" }}
          />
        ))}
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
