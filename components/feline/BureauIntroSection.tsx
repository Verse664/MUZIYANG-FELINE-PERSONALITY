"use client"

import { useEffect, useState } from "react"

export default function BureauIntroSection() {
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle")
  const [typed, setTyped] = useState("")
  const [showSub, setShowSub] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  const fullText = "亲爱的侦探小姐，欢迎进入木子猫情报局，祝您今日交易愉快~"

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("typing"), 600)
    return () => clearTimeout(t0)
  }, [])

  useEffect(() => {
    if (phase !== "typing") return
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(interval)
        setPhase("done")
        setTimeout(() => setShowSub(true), 300)
        setTimeout(() => setShowBadge(true), 700)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [phase, fullText])

  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0F0F10" }}
    >
      {/* 背景网格纹 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* 中心晕光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(216,167,177,0.06) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 顶部机密标记 */}
      <div
        className="absolute top-8 left-0 right-0 flex items-center justify-center gap-3"
        style={{
          opacity: 0.45,
        }}
      >
        <span style={{ flex: 1, maxWidth: 120, height: "0.5px", background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.5rem",
            letterSpacing: "0.5em",
            color: "#D4AF37",
          }}
        >
          FELINE INTELLIGENCE BUREAU · 木子猫情报局
        </span>
        <span style={{ flex: 1, maxWidth: 120, height: "0.5px", background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
      </div>

      {/* 档案编号 */}
      <div
        className="absolute top-16 right-10"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.45rem",
          letterSpacing: "0.35em",
          color: "#3C3C3E",
        }}
      >
        CASE NO. 2026-YANG · DISPATCH 00
      </div>

      {/* 主体内容 */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center" style={{ maxWidth: 700 }}>

        {/* 情报局 logo 区 */}
        <div
          className="mb-12 flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "1.5px solid rgba(212,175,55,0.5)",
            boxShadow: "0 0 0 8px rgba(212,175,55,0.05), 0 0 0 16px rgba(212,175,55,0.03)",
            backgroundColor: "rgba(212,175,55,0.04)",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ width: 1.5, height: 20, background: "linear-gradient(180deg, transparent, #D4AF37, transparent)" }} />
          <div style={{ width: 20, height: 1.5, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
          <div style={{ width: 1.5, height: 20, background: "linear-gradient(180deg, transparent, #D4AF37, transparent)" }} />
        </div>

        {/* 打字机主文本 */}
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)",
            color: "#F5F0EA",
            letterSpacing: "0.12em",
            lineHeight: 1.85,
            minHeight: "3.7em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>
            {typed}
            {phase !== "done" && (
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1.1em",
                  backgroundColor: "#D8A7B1",
                  marginLeft: 2,
                  verticalAlign: "middle",
                  animation: "cursor-blink 0.9s step-end infinite",
                }}
              />
            )}
          </span>
        </div>

        {/* 副文案 */}
        <div
          className="mt-10 flex flex-col items-center gap-3"
          style={{
            opacity: showSub ? 1 : 0,
            transform: showSub ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div style={{ width: 80, height: "0.5px", background: "linear-gradient(90deg, transparent, #D8A7B1, transparent)" }} />
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.68rem",
              letterSpacing: "0.35em",
              color: "#8E8E93",
            }}
          >
            情报局正式开放 · 5 份卷宗已解密
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.3em",
              color: "#D4AF37",
              opacity: 0.7,
            }}
          >
            SCROLL TO ACCESS CLASSIFIED INTEL
          </p>
        </div>

        {/* 情报局印章 */}
        <div
          className="mt-14"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: showBadge ? "scale(1)" : "scale(0.7)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,175,55,0.45)",
              backgroundColor: "rgba(212,175,55,0.03)",
              boxShadow: "0 0 0 5px rgba(212,175,55,0.04)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 6,
                borderRadius: "50%",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.42rem", letterSpacing: "0.3em", color: "#D4AF37", zIndex: 1 }}>
              情报局
            </span>
            <div style={{ width: 18, height: "0.5px", backgroundColor: "#D4AF37", opacity: 0.4, zIndex: 1 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.38rem", letterSpacing: "0.2em", color: "#8E8E93", zIndex: 1 }}>
              2026 · 8th
            </span>
          </div>
        </div>
      </div>

      {/* 底部向下箭头 */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{
          opacity: showSub ? 0.45 : 0,
          transition: "opacity 1s ease 0.4s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.45rem",
            letterSpacing: "0.4em",
            color: "#8E8E93",
          }}
        >
          ENTER BUREAU
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
          <path d="M8 0 L8 20" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" />
          <path d="M2 14 L8 20 L14 14" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        </svg>
      </div>

      {/* 底部装饰线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
      />
    </section>
  )
}
