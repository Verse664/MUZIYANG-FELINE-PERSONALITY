"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface BureauIntroSectionProps {
  isActive?: boolean
}

type VerifyPhase = "idle" | "typing" | "starting" | "verifying" | "verified" | "done"

// 猫眼徽标：静态低强度呼吸闪烁 + 随机故障（色差撕裂 + 抖动 + 扫描线）
function CatMarkGlitch() {
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)

  useEffect(() => {
    const loop = window.setInterval(() => {
      if (Math.random() < 0.35) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 5)
        window.setTimeout(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 90 + Math.random() * 120)
      }
    }, 1400)
    return () => window.clearInterval(loop)
  }, [])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 56, height: 56 }}
    >
      

      {/* 底层猫像 */}
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: 48,
          height: 48,
          border: "1px solid rgba(212,175,55,0.4)",
          boxShadow: glitchActive
            ? "0 0 14px 3px rgba(180,72,63,0.35)"
            : "0 0 8px 2px rgba(212,175,55,0.18)",
          transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
          transition: glitchActive ? "none" : "transform 140ms ease-out, box-shadow 0.4s ease",
          filter: glitchActive ? "contrast(1.25) saturate(1.3)" : "none",
        }}
      >
        <Image
          src="/blackcat.png"
          alt="猫探长情报局徽标"
          fill
          sizes="48px"
          className="object-cover"
          style={{ opacity: glitchActive ? 0.9 : 1 }}
        />

        {/* 色差撕裂层：故障时叠加双色偏移 */}
        {glitchActive ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 mix-blend-screen"
              style={{
                backgroundColor: "rgba(180,72,63,0.28)",
                transform: `translateX(${glitchOffset * 1.6}px)`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 mix-blend-screen"
              style={{
                backgroundColor: "rgba(111,227,217,0.16)",
                transform: `translateX(${-glitchOffset * 1.4}px)`,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0"
              style={{
                height: "2px",
                top: `${20 + Math.random() * 55}%`,
                backgroundColor: "rgba(246,220,227,0.4)",
              }}
            />
          </>
        ) : null}

        {/* 常驻极淡扫描线，呼应全站终端质感 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 3px)",
            opacity: glitchActive ? 0.12 : 0.05,
          }}
        />
      </div>

      {/* 呼吸信号点，保留原有终端语言 */}
      <span
        className="absolute -bottom-1 -right-1 rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#D4AF37",
          boxShadow: "0 0 8px 2px rgba(212,175,55,0.5)",
          animation: "glow-pulse 1.8s ease-in-out infinite",
        }}
      />
    </div>
  )
}

export default function BureauIntroSection({ isActive = true }: BureauIntroSectionProps) {
  const [phase, setPhase] = useState<VerifyPhase>("idle")
  const [typed, setTyped] = useState("")
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)

  const fullText = "亲爱的侦探小姐你好\n欢迎登录猫咪情报局"

  // 打字机
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
        setTimeout(() => setPhase("starting"), 500)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [phase, fullText])

  // starting：单独停留展示"现在开始身份校核"，稍长一些再进入校验
  useEffect(() => {
    if (phase !== "starting") return
    const t = setTimeout(() => setPhase("verifying"), 1700)
    return () => clearTimeout(t)
  }, [phase])

  // 身份校验进度：非匀速，带"卡顿再跳跃"的真实感
  useEffect(() => {
    if (phase !== "verifying") return

    const steps: { target: number; delay: number }[] = [
      { target: 12, delay: 260 },
      { target: 24, delay: 220 },
      { target: 24, delay: 500 }, // 卡顿
      { target: 41, delay: 180 },
      { target: 52, delay: 240 },
      { target: 63, delay: 200 },
      { target: 63, delay: 420 }, // 二次卡顿
      { target: 78, delay: 190 },
      { target: 88, delay: 210 },
      { target: 100, delay: 260 },
    ]

    let cancelled = false
    const timeouts: number[] = []
    let acc = 0

    steps.forEach((step) => {
      acc += step.delay
      const id = window.setTimeout(() => {
        if (cancelled) return
        setProgress(step.target)
        if (step.target === 100) {
          window.setTimeout(() => {
            if (!cancelled) setPhase("verified")
          }, 400)
        }
      }, acc)
      timeouts.push(id)
    })

    return () => {
      cancelled = true
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [phase])

  // verified：短暂停留展示"身份已核实"+进度条，随后进入 done，只留祝您查阅愉快
  useEffect(() => {
    if (phase !== "verified") return
    const t = setTimeout(() => setPhase("done"), 1100)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== "done") return
    const t = setTimeout(() => setShowBadge(true), 700)
    return () => clearTimeout(t)
  }, [phase])

  // 进度条故障闪烁：仅在校验中触发
  useEffect(() => {
    if (phase !== "verifying") return
    const glitchLoop = window.setInterval(() => {
      if (Math.random() < 0.4) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 6)
        window.setTimeout(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 70 + Math.random() * 90)
      }
    }, 550)
    return () => window.clearInterval(glitchLoop)
  }, [phase])

  const barLength = 30
  const filled = Math.round((progress / 100) * barLength)
  const barString = "█".repeat(filled) + "░".repeat(barLength - filled)

  const showProgressBar = phase === "verifying" || phase === "verified"

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
      {/* 扫描线纹理 */}
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

      {/* 案号标签 */}
      <div
        className="absolute top-16"
        style={{ opacity: 0.55, fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#D4AF37" }}
      >
        CASE NO. 2026-YANG · ACCESS TERMINAL
      </div>

      {/* 档案封面 */}
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

        {/* 极小角标编号 */}
        <span
          className="absolute right-5 top-5"
          style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.2em", color: "#B99B7A", opacity: 0.5 }}
        >
          02
        </span>

        {/* 猫探长徽标：替代原终端方框装饰符 */}
        <div className="mb-10 flex flex-col items-center gap-2">
          <CatMarkGlitch />
        </div>

        {/* 打字机主文本：仅两行问候语，衬线字体 */}
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(1.2rem, 3.2vw, 2rem)",
            color: "#1C1C1E",
            letterSpacing: "0.1em",
            lineHeight: 1.9,
            minHeight: "3em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "pre-line",
          }}
        >
          <span>
            {typed}
            {phase === "typing" && (
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

        {/* 终端日志区：单句轮替，无编号，进度条随流程消失，最终只留祝您查阅愉快 */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 font-mono" style={{ minHeight: "5.4em" }}>
          {/* 单句状态行 */}
          <div className="relative flex h-[1.6em] w-full items-center justify-center">
            {phase === "starting" && (
              <p
                key="starting"
                className="absolute"
                style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "#6A4551", animation: "fade-in-only 0.5s ease forwards" }}
              >
                现在开始身份校核
              </p>
            )}
            {phase === "verifying" && (
              <p
                key="verifying"
                className="absolute flex items-center gap-2"
                style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "#6A4551", animation: "fade-in-only 0.4s ease forwards" }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full border-[1.5px]"
                  style={{
                    borderColor: "#D4AF37 transparent #D4AF37 transparent",
                    animation: "spin-loader 0.8s linear infinite",
                  }}
                />
                <span>身份核对中......</span>
              </p>
            )}
            {phase === "verified" && (
              <p
                key="verified"
                className="absolute flex items-baseline gap-2"
                style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "#9C7A2E", fontWeight: 700, animation: "fade-in-only 0.5s ease forwards" }}
              >
                <span style={{ fontWeight: 400 }}>✓</span>
                <span>身份已核实</span>
              </p>
            )}
          </div>

          {/* 故障字符进度条：verified 结束后自动消失，不进入 done */}
          {showProgressBar ? (
            <div
              className="w-full max-w-[26rem] text-center"
              style={{
                fontSize: "0.66rem",
                letterSpacing: "0.01em",
                color: phase === "verified" ? "#D4AF37" : "#8E8E93",
                transition: "color 0.4s ease, opacity 0.4s ease",
                opacity: phase === "verified" ? 1 : 1,
                transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
                textShadow: glitchActive ? "1px 0 rgba(180,72,63,0.5), -1px 0 rgba(212,175,55,0.4)" : "none",
              }}
            >
              <span className="break-all">[{barString}]</span> {progress}%
            </div>
          ) : null}

          {/* 最终态：只保留祝您查阅愉快 */}
          {phase === "done" ? (
            <p
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "1rem",
                letterSpacing: "0.16em",
                color: "#3C3C3E",
                opacity: 0,
                animation: "fade-slide-up 0.7s ease forwards",
              }}
            >
              祝您查阅愉快
            </p>
          ) : null}
        </div>

        {/* 情报局印章 */}
        <div
          className="mt-10"
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

      {/* 底部翻页指示：常驻呼吸动效 */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{
          opacity: showBadge ? 0.6 : 0,
          transition: "opacity 1s ease 0.3s",
          animation: showBadge ? "scroll-hint-bounce 2.2s ease-in-out infinite" : "none",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.45rem", letterSpacing: "0.4em", color: "#8E8E93" }}>
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

      <style jsx>{`
        @keyframes fade-in-only {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-loader {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scroll-hint-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  )
}