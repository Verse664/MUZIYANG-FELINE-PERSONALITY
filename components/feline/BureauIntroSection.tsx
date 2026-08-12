"use client"

import { useEffect, useState } from "react"

interface BureauIntroSectionProps {
  isActive?: boolean
}

export default function BureauIntroSection({ isActive = true }: BureauIntroSectionProps) {
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle")
  const [typed, setTyped] = useState("")
  const [showSub, setShowSub] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  const fullText = "亲爱的侦探小姐，\n欢迎进入木子猫情报局，\n祝您今日交易愉快~"

  useEffect(() => {
    if (!isActive || phase !== "idle") return
    const t0 = setTimeout(() => setPhase("typing"), 600)
    return () => clearTimeout(t0)
  }, [isActive, phase])

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
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      {/* 细微网格线 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1E 1px, transparent 1px), linear-gradient(90deg, #1C1C1E 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* 扫描线纹理，呼应终端动画质感 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #1C1C1E 0px, transparent 1px, transparent 3px)" }}
      />

      {/* 顶部标记 */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-center gap-2" style={{ opacity: 0.5 }}>
        <span style={{ flex: 1, maxWidth: 100, height: "0.5px", background: "linear-gradient(90deg, transparent, #D8A7B1)" }} />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", letterSpacing: "0.4em", color: "#8E8E93" }}>
          FELINE INTELLIGENCE BUREAU
        </span>
        <span style={{ flex: 1, maxWidth: 100, height: "0.5px", background: "linear-gradient(90deg, #D8A7B1, transparent)" }} />
      </div>

      {/* 案号标签，呼应后续卷宗页面的 CASE NO. 系统 */}
      <div
        className="absolute top-16"
        style={{ opacity: 0.55, fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#D4AF37" }}
      >
        CASE NO. 2026-YANG · ACCESS TERMINAL
      </div>

      {/* 档案封面：首屏作为“取阅前的机密卷宗”，为后续翻页建立书本语境 */}
      <div
        className="relative z-10 flex w-[min(760px,calc(100vw-3rem))] flex-col items-center px-6 py-10 text-center sm:px-12 sm:py-14"
        style={{
          border: "1px solid rgba(212,175,55,0.5)",
          background: "linear-gradient(135deg, rgba(255,253,248,0.78), rgba(244,226,229,0.72))",
          boxShadow: "0 18px 70px rgba(87,45,55,0.14), inset 0 0 0 5px rgba(212,175,55,0.06)",
          maxWidth: 760,
        }}
      >
        <span aria-hidden="true" className="absolute left-3 top-3 h-7 w-7 border-l border-t border-[#D4AF37]/55" />
        <span aria-hidden="true" className="absolute right-3 top-3 h-7 w-7 border-r border-t border-[#D4AF37]/55" />
        <span aria-hidden="true" className="absolute bottom-3 left-3 h-7 w-7 border-b border-l border-[#D4AF37]/55" />
        <span aria-hidden="true" className="absolute bottom-3 right-3 h-7 w-7 border-b border-r border-[#D4AF37]/55" />
        <div
          className="mb-8 flex items-center gap-3"
          style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", letterSpacing: "0.35em", color: "#9C7A2E" }}
        >
          <span className="h-px w-8 bg-[#D4AF37]/60" />
          RESTRICTED ARCHIVE · 01
          <span className="h-px w-8 bg-[#D4AF37]/60" />
        </div>
        {/* 情报局 logo 区（罗盘式徽标） */}
        <div
          className="mb-12 flex items-center justify-center"
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            border: "1.5px solid rgba(212,175,55,0.5)",
            boxShadow: "0 0 0 8px rgba(212,175,55,0.05), 0 0 0 16px rgba(212,175,55,0.03)",
            backgroundColor: "rgba(212,175,55,0.04)",
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "0.5px solid rgba(212,175,55,0.25)" }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 1.5, height: 20, background: "linear-gradient(180deg, transparent, #D4AF37, transparent)" }} />
            <div style={{ width: 20, height: 1.5, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
            <div style={{ width: 1.5, height: 20, background: "linear-gradient(180deg, transparent, #D4AF37, transparent)" }} />
          </div>
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
            whiteSpace: "pre-line",
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

        {/* 副文案：状态提示条，呼应终端 boot sequence 语气 */}
        <div
          className="mt-12 flex flex-col items-center gap-3"
          style={{
            opacity: showSub ? 1 : 0,
            transform: showSub ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div style={{ width: 70, height: "0.5px", background: "linear-gradient(90deg, transparent, #D8A7B1, transparent)" }} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.3em", color: "#3C3C3E" }}>
            5 份卷宗已解密 · 情报即将启动
          </p>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
            style={{ borderColor: "#D4AF3750", color: "#9C7A2E", fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.16em" }}
          >
            <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#D4AF37" }} />
            【权限确认：访客身份已核验】
          </span>
        </div>

        {/* 情报局印章 */}
        <div
          className="mt-14"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: showBadge ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-8deg)",
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
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: "1.5px solid rgba(216,167,177,0.45)",
              backgroundColor: "rgba(216,167,177,0.05)",
              boxShadow: "0 0 0 5px rgba(216,167,177,0.04)",
              position: "relative",
            }}
          >
            <div
              aria-hidden="true"
              style={{ position: "absolute", inset: 6, borderRadius: "50%", border: "1px solid rgba(216,167,177,0.25)" }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.25em", color: "#D8A7B1", zIndex: 1 }}>
              情报局
            </span>
            <div style={{ width: 16, height: "0.5px", backgroundColor: "#D8A7B1", opacity: 0.35, zIndex: 1 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.35rem", letterSpacing: "0.15em", color: "#8E8E93", zIndex: 1 }}>
              2026
            </span>
          </div>
        </div>
      </div>

      {/* 底部滚动提示（原来重复的两组箭头合并为一组） */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{ opacity: showSub ? 0.5 : 0, transition: "opacity 1s ease 0.4s" }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.45rem", letterSpacing: "0.4em", color: "#8E8E93" }}>
          ENTER BUREAU
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
          <path d="M8 0 L8 20" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" />
          <path d="M2 14 L8 20 L14 14" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        </svg>
      </div>

      {/* 底部装饰线（原来重复的两条合并为一条） */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
      />
    </section>
  )
}
