"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface BureauIntroSectionProps {
  isActive?: boolean
}

type VerifyPhase =
  | "dossier-ready"
  | "dossier-opening"
  | "typing"
  | "text-hold"
  | "video-enter"
  | "video-playing"
  | "video-exit"
  | "starting"
  | "verifying"
  | "verified"
  | "done"

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
  const [phase, setPhase] = useState<VerifyPhase>("dossier-ready")
  const [typed, setTyped] = useState("")
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // 标记用户是否已经交互过（点击了"打开卷宗"）
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const fullText = "欢迎各位侦探小姐\n莅临\"猫咪情报局\"\n\n本情报局观测对象\n百万男神木子洋"

  // 用户点击"打开卷宗"后，开始整个流程；该点击同时为后续带声音视频提供用户交互上下文。
  const openDossier = () => {
    if (!isActive || phase !== "dossier-ready") return
    setHasUserInteracted(true) // 标记用户已交互
    setPhase("dossier-opening")

    window.setTimeout(() => {
      setPhase("typing")
    }, 750)
  }

  // 打字机
  useEffect(() => {
    if (phase !== "typing") return
    let i = 0
    const interval = window.setInterval(() => {
      i += 1
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) {
        window.clearInterval(interval)
        window.setTimeout(() => setPhase("text-hold"), 700)
      }
    }, 55)
    return () => window.clearInterval(interval)
  }, [phase])

  // 打字结束后：文字淡出，再进入视频。停留时间从 250ms 改为 1200ms
  useEffect(() => {
    if (phase !== "text-hold") return
    const t = window.setTimeout(() => setPhase("video-enter"), 1200)
    return () => window.clearTimeout(t)
  }, [phase])

  // 视频进入阶段结束后开始播放
  useEffect(() => {
    if (phase !== "video-enter") return
    const t = window.setTimeout(() => setPhase("video-playing"), 550)
    return () => window.clearTimeout(t)
  }, [phase])

  // 视频播放逻辑 - 带声音播放
  useEffect(() => {
    if (phase !== "video-playing") return
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    
    // 如果有用户交互上下文，尝试播放（可能带声音）
    const playPromise = video.play()
    if (playPromise) {
      playPromise.catch(() => {
        // 如果浏览器阻止有声播放，降级为静音播放
        video.muted = true
        video.play().catch(() => {
          // 如果还是失败，重新加载后重试
          video.load()
          setTimeout(() => {
            video.muted = true
            video.play().catch(() => {})
          }, 100)
        })
      })
    }
  }, [phase])

  const handleVideoEnded = () => {
    setPhase("video-exit")
  }

  // 视频退出后接回原有身份核验流程。
  useEffect(() => {
    if (phase !== "video-exit") return
    const t = window.setTimeout(() => setPhase("starting"), 600)
    return () => window.clearTimeout(t)
  }, [phase])

  // starting：单独停留展示"现在开始身份校核"，稍长一些再进入校验
  useEffect(() => {
    if (phase !== "starting") return
    const t = window.setTimeout(() => setPhase("verifying"), 1700)
    return () => window.clearTimeout(t)
  }, [phase])

  // 身份校验进度：非匀速，带"卡顿再跳跃"的真实感
  useEffect(() => {
    if (phase !== "verifying") return

    const steps: { target: number; delay: number }[] = [
      { target: 12, delay: 260 },
      { target: 24, delay: 220 },
      { target: 24, delay: 500 },
      { target: 41, delay: 180 },
      { target: 52, delay: 240 },
      { target: 63, delay: 200 },
      { target: 63, delay: 420 },
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
    const t = window.setTimeout(() => setPhase("done"), 1100)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== "done") return
    const t = window.setTimeout(() => setShowBadge(true), 700)
    return () => window.clearTimeout(t)
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
  const showDossierGate = phase === "dossier-ready" || phase === "dossier-opening"
  const showIntroText = phase === "typing" || phase === "text-hold"
  const showVideo = phase === "video-enter" || phase === "video-playing" || phase === "video-exit"
  const showVerification = phase === "starting" || phase === "verifying" || phase === "verified" || phase === "done"
  
  // 判断是否应该显示保留的文字：只在身份核验阶段显示（starting, verifying, verified, done）
  const showPersistentText = 
    (phase === "starting" || phase === "verifying" || phase === "verified" || phase === "done") &&
    typed.length === fullText.length

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

      {/* BlackCat 开场 / 主流程容器 */}
      <div
        className="relative z-10 flex w-[min(760px,calc(100vw-3rem))] flex-col items-center px-6 py-10 text-center sm:px-12 sm:py-14"
        style={{
          border: showDossierGate ? "none" : "1px solid rgba(212,175,55,0.5)",
          background: showDossierGate ? "transparent" : "linear-gradient(135deg, rgba(255,253,248,0.78), rgba(244,226,229,0.72))",
          boxShadow: showDossierGate ? "none" : "0 18px 70px rgba(87,45,55,0.14), inset 0 0 0 5px rgba(212,175,55,0.06)",
          maxWidth: 760,
          transition: "opacity 0.6s ease, transform 0.6s ease",
          opacity: phase === "dossier-opening" ? 0.35 : 1,
          transform: phase === "dossier-opening" ? "scale(0.96)" : "scale(1)",
        }}
      >
        {!showDossierGate ? (
          <>
            <span aria-hidden="true" className="absolute left-3 top-3 h-7 w-7 border-l border-t border-[#D4AF37]/55" />
            <span aria-hidden="true" className="absolute right-3 top-3 h-7 w-7 border-r border-t border-[#D4AF37]/55" />
            <span aria-hidden="true" className="absolute bottom-3 left-3 h-7 w-7 border-b border-l border-[#D4AF37]/55" />
            <span aria-hidden="true" className="absolute bottom-3 right-3 h-7 w-7 border-b border-r border-[#D4AF37]/55" />
            <span className="absolute right-5 top-5" style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.2em", color: "#B99B7A", opacity: 0.5 }}>
              02
            </span>
          </>
        ) : null}

        {/* 第一幕：严格采用参考图的 BlackCat 解密入口构图 */}
        {showDossierGate ? (
          <button
            type="button"
            onClick={openDossier}
            aria-label="打开卷宗"
            className="group flex flex-col items-center border-0 bg-transparent p-0 outline-none"
            style={{ cursor: phase === "dossier-ready" ? "pointer" : "default" }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "clamp(168px, 58vw, 220px)",
                height: "clamp(168px, 58vw, 220px)",
                animation: phase === "dossier-ready" ? "dossier-breathe 2.8s ease-in-out infinite" : "dossier-open 0.75s ease forwards",
              }}
            >
              {/* 金色圆环 - 改为和 SelfConsistentSection 一样的转动效果 */}
              <svg
                className="pointer-events-none absolute inset-0 z-10"
                style={{ width: "100%", height: "100%" }}
                viewBox="0 0 220 220"
              >
                {/* 背景环（灰色底环） */}
                <circle
                  cx="110"
                  cy="110"
                  r="98"
                  fill="none"
                  stroke="rgba(212,175,55,0.15)"
                  strokeWidth="2.5"
                />
                
                {/* 动态金色环 - 不停地转动 */}
                <circle
                  cx="110"
                  cy="110"
                  r="98"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="184.5 431.6"
                  style={{
                    transformOrigin: "center",
                    animation: "decrypt-idle-spin 4.5s linear infinite",
                  }}
                />
              </svg>

              {/* BlackCat 徽标 */}
              <div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: "82%",
                  height: "82%",
                  borderRadius: "50%",
                  zIndex: 5,
                }}
              >
                <Image src="/blackcat.png" alt="BlackCat 徽标" fill sizes="220px" className="object-cover" priority />
              </div>
              {/* 粉色"打开卷宗"文字 */}
              <span
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(1.05rem, 5vw, 1.45rem)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#F28DA8",
                  textShadow: "0 1px 5px rgba(255,255,255,0.6)",
                }}
              >
                打开卷宗
              </span>
            </div>

            <div
              className="mt-7"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.58rem, 2.4vw, 0.72rem)",
                letterSpacing: "0.22em",
                color: "#9A9698",
                opacity: 0.78,
              }}
            >
              ↑ 卷宗未开启 · 点击打开卷宗查看猫咪情报局绝密档案
            </div>
          </button>
        ) : null}

        {/* 打字机阶段 - 初始显示 */}
        {showIntroText ? (
          <div
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(1.2rem, 3.2vw, 2rem)",
              color: "#1C1C1E",
              letterSpacing: "0.1em",
              lineHeight: 1.9,
              minHeight: "7.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "pre-line",
              opacity: phase === "text-hold" ? 0 : 1,
              transform: phase === "text-hold" ? "translateY(-8px)" : "translateY(0)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
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
        ) : null}

        {/* 视频阶段：横向、原比例、无跳过按钮 */}
        {showVideo ? (
          <div
            className="relative flex w-full items-center justify-center"
            style={{
              opacity: phase === "video-playing" ? 1 : 0,
              transform: phase === "video-playing" ? "scale(1)" : "scale(0.96)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
              pointerEvents: "none",
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                maxWidth: 640,
                border: "1px solid rgba(212,175,55,0.55)",
                padding: 8,
                background: "rgba(255,253,248,0.55)",
                boxShadow: "0 12px 42px rgba(87,45,55,0.14), inset 0 0 0 1px rgba(212,175,55,0.08)",
              }}
            >
              <span aria-hidden="true" className="absolute left-2 top-2 z-10 h-5 w-5 border-l border-t border-[#D4AF37]/60" />
              <span aria-hidden="true" className="absolute right-2 top-2 z-10 h-5 w-5 border-r border-t border-[#D4AF37]/60" />
              <span aria-hidden="true" className="absolute bottom-2 left-2 z-10 h-5 w-5 border-b border-l border-[#D4AF37]/60" />
              <span aria-hidden="true" className="absolute bottom-2 right-2 z-10 h-5 w-5 border-b border-r border-[#D4AF37]/60" />
              <video
                ref={videoRef}
                src="https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/baiwan-25s-audio.mp4"
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className="block h-auto w-full"
                style={{ aspectRatio: "16 / 9", objectFit: "contain", background: "#1C1C1E" }}
              />
            </div>
          </div>
        ) : null}

        {/* 原有身份核验阶段：文字在徽标下面、身份核验上面 */}
        {showVerification ? (
          <>
            {/* 猫眼徽标 */}
            <div className="mb-4 flex flex-col items-center gap-2">
              <CatMarkGlitch />
            </div>

            {/* 持久化文字：在徽标下面、身份核验上面 */}
            {showPersistentText ? (
              <div
                className="mb-6"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(1rem, 2.8vw, 1.6rem)",
                  color: "#1C1C1E",
                  letterSpacing: "0.1em",
                  lineHeight: 1.9,
                  whiteSpace: "pre-line",
                  opacity: 0.85,
                  animation: "fade-in-only 0.6s ease forwards",
                }}
              >
                {typed}
              </div>
            ) : null}

            {/* 身份核验内容 */}
            <div className="mt-4 flex w-full flex-col items-center gap-3 font-mono" style={{ minHeight: "5.4em" }}>
              <div className="relative flex h-[1.6em] w-full items-center justify-center">
                {phase === "starting" && (
                  <p key="starting" className="absolute" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "#6A4551", animation: "fade-in-only 0.5s ease forwards" }}>
                    现在开始身份校核
                  </p>
                )}
                {phase === "verifying" && (
                  <p key="verifying" className="absolute flex items-center gap-2" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "#6A4551", animation: "fade-in-only 0.4s ease forwards" }}>
                    <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full border-[1.5px]" style={{ borderColor: "#D4AF37 transparent #D4AF37 transparent", animation: "spin-loader 0.8s linear infinite" }} />
                    <span>身份核对中......</span>
                  </p>
                )}
                {phase === "verified" && (
                  <p key="verified" className="absolute flex items-baseline gap-2" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "#9C7A2E", fontWeight: 700, animation: "fade-in-only 0.5s ease forwards" }}>
                    <span style={{ fontWeight: 400 }}>✓</span>
                    <span>身份已核实</span>
                  </p>
                )}
              </div>

              {showProgressBar ? (
                <div
                  className="w-full max-w-[26rem] text-center"
                  style={{
                    fontSize: "0.66rem",
                    letterSpacing: "0.01em",
                    color: phase === "verified" ? "#D4AF37" : "#8E8E93",
                    transition: "color 0.4s ease, opacity 0.4s ease",
                    transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
                    textShadow: glitchActive ? "1px 0 rgba(180,72,63,0.5), -1px 0 rgba(212,175,55,0.4)" : "none",
                  }}
                >
                  <span className="break-all">[{barString}]</span> {progress}%
                </div>
              ) : null}

              {phase === "done" ? (
                <p style={{ fontFamily: "var(--font-serif), serif", fontSize: "1rem", letterSpacing: "0.16em", color: "#3C3C3E", opacity: 0, animation: "fade-slide-up 0.7s ease forwards" }}>
                  祝您查阅愉快
                </p>
              ) : null}
            </div>

            <div
              className="mt-10"
              style={{
                opacity: showBadge ? 1 : 0,
                transform: showBadge ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-8deg)",
                transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, width: 76, height: 76, borderRadius: "50%", border: "1.5px solid rgba(216,167,177,0.45)", backgroundColor: "rgba(216,167,177,0.05)", boxShadow: "0 0 0 5px rgba(216,167,177,0.04)", position: "relative" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 6, borderRadius: "50%", border: "1px solid rgba(216,167,177,0.25)" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", letterSpacing: "0.25em", color: "#D8A7B1", zIndex: 1 }}>情报局</span>
                <div style={{ width: 16, height: "0.5px", backgroundColor: "#D8A7B1", opacity: 0.35, zIndex: 1 }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.35rem", letterSpacing: "0.15em", color: "#8E8E93", zIndex: 1 }}>2026</span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* 底部翻页指示：身份核验完成后出现 */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{
          opacity: showBadge ? 0.6 : 0,
          transition: "opacity 1s ease 0.3s",
          animation: showBadge ? "scroll-hint-bounce 2.2s ease-in-out infinite" : "none",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.45rem", letterSpacing: "0.4em", color: "#8E8E93" }}>ENTER BUREAU</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
          <path d="M8 0 L8 20" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" />
          <path d="M2 14 L8 20 L14 14" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />

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
        @keyframes dossier-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.025); }
        }
        @keyframes dossier-open {
          0% { opacity: 1; transform: scale(1); }
          55% { opacity: 1; transform: scale(1.06); }
          100% { opacity: 0; transform: scale(0.94); }
        }
        @keyframes cursor-blink {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: 0; }
        }
        @keyframes decrypt-idle-spin {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -${2 * Math.PI * 98};
          }
        }
      `}</style>
    </section>
  )
}