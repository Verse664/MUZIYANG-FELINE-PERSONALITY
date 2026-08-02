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
      style={{
        background: "linear-gradient(160deg, #F4E2E5 0%, #FAF7F5 40%, #E8D3D8 75%, #EDD5D9 100%)",
      }}
    >
      {/* 背景光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
        }}
      />

      {/* 细微网格线 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1E 1px, transparent 1px), linear-gradient(90deg, #1C1C1E 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* 顶部标记 */}
      <div
        className="absolute top-6 left-0 right-0 flex items-center justify-center gap-2"
        style={{
          opacity: 0.4,
        }}
      >
        <span style={{ flex: 1, maxWidth: 100, height: "0.5px", background: "linear-gradient(90deg, transparent, #D8A7B1)" }} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.48rem",
            letterSpacing: "0.4em",
            color: "#8E8E93",
          }}
        >
          FELINE INTELLIGENCE BUREAU
        </span>
        <span style={{ flex: 1, maxWidth: 100, height: "0.5px", background: "linear-gradient(90deg, #D8A7B1, transparent)" }} />
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
            fontSize: "clamp(1.2rem, 3.2vw, 2rem)",
            color: "#1C1C1E",
            letterSpacing: "0.1em",
            lineHeight: 1.9,
            minHeight: "4em",
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
                  backgroundColor: "#D4AF37",
                  marginLeft: 3,
                  verticalAlign: "middle",
                  animation: "cursor-blink 0.9s step-end infinite",
                }}
              />
            )}
          </span>
        </div>

        {/* 副文案 */}
        <div
          className="mt-12 flex flex-col items-center gap-2"
          style={{
            opacity: showSub ? 1 : 0,
            transform: showSub ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div style={{ width: 70, height: "0.5px", background: "linear-gradient(90deg, transparent, #D8A7B1, transparent)" }} />
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: "#3C3C3E",
            }}
          >
            5 份卷宗已解密 · 情报即将启动
          </p>
        </div>

        {/* 情报局印章 */}
        <div
          className="mt-16"
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
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "1.5px solid rgba(216,167,177,0.4)",
              backgroundColor: "rgba(216,167,177,0.04)",
              boxShadow: "0 0 0 5px rgba(216,167,177,0.03)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 6,
                borderRadius: "50%",
                border: "1px solid rgba(216,167,177,0.2)",
              }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.25em", color: "#D8A7B1", zIndex: 1 }}>
              情报局
            </span>
            <div style={{ width: 16, height: "0.5px", backgroundColor: "#D8A7B1", opacity: 0.3, zIndex: 1 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.35rem", letterSpacing: "0.15em", color: "#8E8E93", zIndex: 1 }}>
              2026
            </span>
          </div>
        </div>
      </div>

      {/* 底部向下箭头 */}
      <div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        style={{
          opacity: showSub ? 0.4 : 0,
          transition: "opacity 1s ease 0.4s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.45rem",
            letterSpacing: "0.35em",
            color: "#8E8E93",
          }}
        >
          SCROLL
        </span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
          <path d="M7 0 L7 16" stroke="#D8A7B1" strokeWidth="0.8" strokeOpacity="0.5" />
          <path d="M1 11 L7 17 L13 11" stroke="#D8A7B1" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        </svg>
      </div>

      {/* 底部装饰线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(216,167,177,0.2), transparent)" }}
      />

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
