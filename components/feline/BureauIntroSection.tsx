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

// ============================================================
// 猫眼徽标：静态低强度呼吸闪烁 + 随机故障
// ============================================================
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
      style={{
        width: 56,
        height: 56,
      }}
    >
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: 48,
          height: 48,
          border: "1px solid rgba(212,175,55,0.4)",
          boxShadow: glitchActive
            ? "0 0 14px 3px rgba(180,72,63,0.35)"
            : "0 0 8px 2px rgba(212,175,55,0.18)",
          transform: glitchActive
            ? `translateX(${glitchOffset}px)`
            : "translateX(0)",
          transition: glitchActive
            ? "none"
            : "transform 140ms ease-out, box-shadow 0.4s ease",
          filter: glitchActive
            ? "contrast(1.25) saturate(1.3)"
            : "none",
        }}
      >
        <Image
          src="/blackcat.png"
          alt="木子猫星光情报站徽标"
          fill
          sizes="48px"
          className="object-cover"
          style={{
            opacity: glitchActive ? 0.9 : 1,
          }}
        />

        {glitchActive ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 mix-blend-screen"
              style={{
                backgroundColor:
                  "rgba(180,72,63,0.28)",
                transform:
                  `translateX(${glitchOffset * 1.6}px)`,
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 mix-blend-screen"
              style={{
                backgroundColor:
                  "rgba(111,227,217,0.16)",
                transform:
                  `translateX(${-glitchOffset * 1.4}px)`,
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-x-0"
              style={{
                height: "2px",
                top:
                  `${20 + Math.random() * 55}%`,
                backgroundColor:
                  "rgba(246,220,227,0.4)",
              }}
            />
          </>
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 3px)",
            opacity:
              glitchActive ? 0.12 : 0.05,
          }}
        />
      </div>

      <span
        className="absolute -bottom-1 -right-1 rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#D4AF37",
          boxShadow:
            "0 0 8px 2px rgba(212,175,55,0.5)",
          animation:
            "glow-pulse 1.8s ease-in-out infinite",
        }}
      />
    </div>
  )
}

export default function BureauIntroSection({
  isActive = true,
}: BureauIntroSectionProps) {
  const [phase, setPhase] =
    useState<VerifyPhase>("dossier-ready")

  const [typed, setTyped] = useState("")
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)

  const [glitchActive, setGlitchActive] =
    useState(false)

  const [glitchOffset, setGlitchOffset] =
    useState(0)

  const [isWeChat, setIsWeChat] =
    useState(false)

  const [wechatVideoStarted, setWechatVideoStarted] =
    useState(false)

  const [videoLoading, setVideoLoading] =
    useState(false)

  const [videoError, setVideoError] =
    useState(false)

  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  // ============================================================
  // ★ 核心文字
  //
  // 所有“猫咪情报局”已经统一改成：
  // “木子猫星光情报站”
  // ============================================================
  const fullText =
    "欢迎各位侦探小姐\n莅临「木子猫星光情报站」\n\n本情报局观测对象\n「百万男神木子洋」"

  // ============================================================
  // 微信浏览器检测
  // ============================================================
  useEffect(() => {
    if (typeof navigator === "undefined") {
      return
    }

    const ua =
      navigator.userAgent || ""

    setIsWeChat(
      /MicroMessenger/i.test(ua)
    )
  }, [])

  // ============================================================
  // 打开卷宗
  // ============================================================
  const openDossier = () => {
    if (!isActive) {
      return
    }

    if (phase !== "dossier-ready") {
      return
    }

    setPhase("dossier-opening")

    window.setTimeout(() => {
      setTyped("")
      setPhase("typing")
    }, 750)
  }

  // ============================================================
  // ★ 打字机
  //
  // 保持完整逐字打印。
  // 「木子猫星光情报站」不会跳过。
  // ============================================================
  useEffect(() => {
    if (phase !== "typing") {
      return
    }

    let i = 0

    setTyped("")

    const interval =
      window.setInterval(() => {
        i += 1

        setTyped(
          fullText.slice(0, i)
        )

        if (i >= fullText.length) {
          window.clearInterval(interval)

          window.setTimeout(() => {
            setPhase("text-hold")
          }, 700)
        }
      }, 55)

    return () =>
      window.clearInterval(interval)
  }, [phase])

  // ============================================================
  // 打字结束后停留
  // ============================================================
  useEffect(() => {
    if (phase !== "text-hold") {
      return
    }

    const t =
      window.setTimeout(() => {
        setPhase("video-enter")
      }, 1200)

    return () =>
      window.clearTimeout(t)
  }, [phase])

  // ============================================================
  // 视频进入
  // ============================================================
  useEffect(() => {
    if (phase !== "video-enter") {
      return
    }

    const t =
      window.setTimeout(() => {
        setPhase("video-playing")
      }, 550)

    return () =>
      window.clearTimeout(t)
  }, [phase])

  // ============================================================
  // 设置移动端视频兼容属性
  //
  // 不直接写：
  // webkit-playsinline
  // x5-playsinline
  //
  // 避免 TypeScript JSX 类型报错。
  // ============================================================
  const prepareVideo = (
    video: HTMLVideoElement
  ) => {
    video.playsInline = true

    video.setAttribute(
      "playsinline",
      "true"
    )

    video.setAttribute(
      "webkit-playsinline",
      "true"
    )

    video.setAttribute(
      "x5-playsinline",
      "true"
    )

    video.setAttribute(
      "x5-video-player-type",
      "h5"
    )

    video.setAttribute(
      "x5-video-player-fullscreen",
      "false"
    )

    video.setAttribute(
      "x5-video-orientation",
      "portrait"
    )
  }

  // ============================================================
  // 视频播放
  //
  // Safari / Chrome：
  // 尝试自动播放。
  //
  // 微信：
  // 不自动播放，等待用户点击。
  // ============================================================
  useEffect(() => {
    if (phase !== "video-playing") {
      return
    }

    const video = videoRef.current

    if (!video) {
      return
    }

    prepareVideo(video)

    setVideoError(false)
    setVideoLoading(false)

    // ==========================================================
    // 微信
    // ==========================================================
    if (isWeChat) {
      try {
        video.pause()
      } catch {}

      try {
        video.currentTime = 0
      } catch {}

      video.muted = false

      setWechatVideoStarted(false)

      return
    }

    // ==========================================================
    // Safari / Chrome
    //
    // 先尝试带声音。
    // 如果浏览器阻止，则自动静音播放。
    // ==========================================================
    video.currentTime = 0
    video.muted = false

    setVideoLoading(true)

    const playWithSound =
      async () => {
        try {
          await video.play()

          setVideoLoading(false)
          setVideoError(false)
        } catch {
          try {
            video.muted = true

            await video.play()

            setVideoLoading(false)
            setVideoError(false)
          } catch {
            setVideoLoading(false)
            setVideoError(true)
          }
        }
      }

    const timer =
      window.setTimeout(() => {
        playWithSound()
      }, 100)

    return () =>
      window.clearTimeout(timer)
  }, [phase, isWeChat])

  // ============================================================
  // ★ 微信点击播放
  //
  // 用户主动点击后：
  // 允许播放声音。
  // ============================================================
  const startWechatVideo =
    async () => {
      const video = videoRef.current

      if (!video) {
        return
      }

      prepareVideo(video)

      setVideoError(false)
      setVideoLoading(true)

      try {
        video.currentTime = 0
      } catch {}

      video.muted = false

      try {
        await video.play()

        setWechatVideoStarted(true)
        setVideoLoading(false)
        setVideoError(false)
      } catch {
        setVideoLoading(false)
        setVideoError(true)
      }
    }

  // ============================================================
  // 视频结束
  // ============================================================
  const handleVideoEnded =
    () => {
      setPhase("video-exit")
    }

  // ============================================================
  // 视频错误
  // ============================================================
  const handleVideoError =
    () => {
      setVideoLoading(false)
      setVideoError(true)
    }

  // ============================================================
  // 重新播放
  // ============================================================
  const retryVideo =
    async () => {
      const video = videoRef.current

      if (!video) {
        return
      }

      prepareVideo(video)

      setVideoError(false)
      setVideoLoading(true)

      try {
        video.currentTime = 0
      } catch {}

      // 微信重新回到点击播放状态
      if (isWeChat) {
        setVideoLoading(false)
        setWechatVideoStarted(false)

        try {
          video.pause()
        } catch {}

        return
      }

      video.muted = false

      try {
        await video.play()

        setVideoLoading(false)
        setVideoError(false)
      } catch {
        try {
          video.muted = true

          await video.play()

          setVideoLoading(false)
          setVideoError(false)
        } catch {
          setVideoLoading(false)
          setVideoError(true)
        }
      }
    }

  // ============================================================
  // 视频退出
  // ============================================================
  useEffect(() => {
    if (phase !== "video-exit") {
      return
    }

    const t =
      window.setTimeout(() => {
        setPhase("starting")
      }, 600)

    return () =>
      window.clearTimeout(t)
  }, [phase])

  // ============================================================
  // starting
  // ============================================================
  useEffect(() => {
    if (phase !== "starting") {
      return
    }

    const t =
      window.setTimeout(() => {
        setPhase("verifying")
      }, 1700)

    return () =>
      window.clearTimeout(t)
  }, [phase])

  // ============================================================
  // 身份校验
  // ============================================================
  useEffect(() => {
    if (phase !== "verifying") {
      return
    }

    const steps: {
      target: number
      delay: number
    }[] = [
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

      const id =
        window.setTimeout(() => {
          if (cancelled) {
            return
          }

          setProgress(
            step.target
          )

          if (
            step.target === 100
          ) {
            window.setTimeout(() => {
              if (!cancelled) {
                setPhase("verified")
              }
            }, 400)
          }
        }, acc)

      timeouts.push(id)
    })

    return () => {
      cancelled = true

      timeouts.forEach((id) => {
        window.clearTimeout(id)
      })
    }
  }, [phase])

  // ============================================================
  // verified
  // ============================================================
  useEffect(() => {
    if (phase !== "verified") {
      return
    }

    const t =
      window.setTimeout(() => {
        setPhase("done")
      }, 1100)

    return () =>
      window.clearTimeout(t)
  }, [phase])

  // ============================================================
  // done
  // ============================================================
  useEffect(() => {
    if (phase !== "done") {
      return
    }

    const t =
      window.setTimeout(() => {
        setShowBadge(true)
      }, 700)

    return () =>
      window.clearTimeout(t)
  }, [phase])

  // ============================================================
  // 进度条故障
  // ============================================================
  useEffect(() => {
    if (phase !== "verifying") {
      return
    }

    const glitchLoop =
      window.setInterval(() => {
        if (Math.random() < 0.4) {
          setGlitchActive(true)

          setGlitchOffset(
            (Math.random() - 0.5) * 6
          )

          window.setTimeout(() => {
            setGlitchActive(false)
            setGlitchOffset(0)
          }, 70 + Math.random() * 90)
        }
      }, 550)

    return () =>
      window.clearInterval(
        glitchLoop
      )
  }, [phase])

  // ============================================================
  // 状态
  // ============================================================
  const barLength = 30

  const filled =
    Math.round(
      (progress / 100) *
        barLength
    )

  const barString =
    "█".repeat(filled) +
    "░".repeat(
      barLength - filled
    )

  const showProgressBar =
    phase === "verifying" ||
    phase === "verified"

  const showDossierGate =
    phase === "dossier-ready" ||
    phase === "dossier-opening"

  const showIntroText =
    phase === "typing" ||
    phase === "text-hold"

  const showVideo =
    phase === "video-enter" ||
    phase === "video-playing" ||
    phase === "video-exit"

  const showVerification =
    phase === "starting" ||
    phase === "verifying" ||
    phase === "verified" ||
    phase === "done"

  const showPersistentText =
    (
      phase === "starting" ||
      phase === "verifying" ||
      phase === "verified" ||
      phase === "done"
    ) &&
    typed.length ===
      fullText.length

  // ============================================================
  // ★ 精确逐行打字
  //
  // 防止第二行“木子猫星光情报站”漏字。
  // ============================================================
  const line1 =
    "欢迎各位侦探小姐"

  const line2 =
    "莅临「木子猫星光情报站」"

  const line3 =
    "本情报局观测对象"

  const line4 =
    "「百万男神木子洋」"

  const line1Start = 0

  const line1End =
    line1.length

  const line2Start =
    line1End + 1

  const line2End =
    line2Start +
    line2.length

  const line3Start =
    line2End + 2

  const line3End =
    line3Start +
    line3.length

  const line4Start =
    line3End + 1

  const line4End =
    line4Start +
    line4.length

  const typedLine1 =
    typed.slice(
      line1Start,
      line1End
    )

  const typedLine2 =
    typed.length > line2Start
      ? typed.slice(
          line2Start,
          line2End
        )
      : ""

  const typedLine3 =
    typed.length > line3Start
      ? typed.slice(
          line3Start,
          line3End
        )
      : ""

  const typedLine4 =
    typed.length > line4Start
      ? typed.slice(
          line4Start,
          line4End
        )
      : ""

  const introComplete =
    typed.length >=
    line3Start

  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #F4E2E5 0%, #FAF7F5 40%, #E8D3D8 75%, #EDD5D9 100%)",
      }}
    >
      {/* ========================================================
          背景光晕
         ======================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      {/* 细微网格 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1E 1px, transparent 1px), linear-gradient(90deg, #1C1C1E 1px, transparent 1px)",
          backgroundSize:
            "80px 80px",
        }}
      />

      {/* 扫描线 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1C1C1E 0px, transparent 1px, transparent 3px)",
        }}
      />

      {/* ========================================================
          顶部标记
         ======================================================== */}
      <div
        className="absolute left-0 right-0 top-6 flex items-center justify-center gap-2 px-4"
        style={{
          opacity: 0.5,
        }}
      >
        <span
          style={{
            flex: 1,
            maxWidth: 100,
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent, #D8A7B1)",
          }}
        />

        <span
          style={{
            fontFamily:
              "var(--font-sans)",
            fontSize:
              "clamp(0.38rem, 1.8vw, 0.48rem)",
            letterSpacing:
              "0.32em",
            color: "#8E8E93",
            whiteSpace:
              "nowrap",
          }}
        >
          FELINE INTELLIGENCE BUREAU
        </span>

        <span
          style={{
            flex: 1,
            maxWidth: 100,
            height: "0.5px",
            background:
              "linear-gradient(90deg, #D8A7B1, transparent)",
          }}
        />
      </div>

      {/* ========================================================
          案号
         ======================================================== */}
      <div
        className="absolute top-16 px-4 text-center"
        style={{
          opacity: 0.55,
          fontFamily:
            "var(--font-sans)",
          fontSize:
            "clamp(0.4rem, 1.8vw, 0.5rem)",
          letterSpacing:
            "0.22em",
          color: "#D4AF37",
          whiteSpace:
            "nowrap",
        }}
      >
        CASE NO. 2026-YANG · ACCESS TERMINAL
      </div>

      {/* ========================================================
          ★ 主流程
          
          不再有外层画布。
          使用真正的 flex 居中。
         ======================================================== */}
      <div
        className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center text-center"
        style={{
          boxSizing: "border-box",

          paddingTop:
            "clamp(92px, 14vh, 120px)",

          paddingBottom:
            "clamp(82px, 12vh, 110px)",

          transition:
            "opacity 0.6s ease, transform 0.6s ease",

          opacity:
            phase === "dossier-opening"
              ? 0.35
              : 1,

          transform:
            phase === "dossier-opening"
              ? "scale(0.96)"
              : "scale(1)",
        }}
      >
        {/* ======================================================
            第一幕：打开卷宗
           ====================================================== */}
        {showDossierGate ? (
          <button
            type="button"
            onClick={openDossier}
            aria-label="打开卷宗"
            className="group flex flex-col items-center border-0 bg-transparent p-0 outline-none"
            style={{
              cursor:
                phase === "dossier-ready"
                  ? "pointer"
                  : "default",
              WebkitTapHighlightColor:
                "transparent",
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width:
                  "clamp(168px, 58vw, 220px)",
                height:
                  "clamp(168px, 58vw, 220px)",

                animation:
                  phase === "dossier-ready"
                    ? "dossier-breathe 2.8s ease-in-out infinite"
                    : "dossier-open 0.75s ease forwards",
              }}
            >
              {/* 金色圆环 */}
              <svg
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                viewBox="0 0 220 220"
              >
                <circle
                  cx="110"
                  cy="110"
                  r="98"
                  fill="none"
                  stroke="rgba(212,175,55,0.15)"
                  strokeWidth="2.5"
                />

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
                    transformOrigin:
                      "center",
                    animation:
                      "decrypt-idle-spin 4.5s linear infinite",
                  }}
                />
              </svg>

              {/* BlackCat */}
              <div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: "82%",
                  height: "82%",
                  zIndex: 5,
                }}
              >
                <Image
                  src="/blackcat.png"
                  alt="木子猫星光情报站徽标"
                  fill
                  sizes="220px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* 打开卷宗 */}
              <span
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                style={{
                  fontFamily:
                    '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',
                  fontSize:
                    "clamp(1.05rem, 5vw, 1.45rem)",
                  fontWeight: 600,
                  letterSpacing:
                    "0.08em",
                  color: "#F28DA8",
                  textShadow:
                    "0 1px 5px rgba(255,255,255,0.6)",
                }}
              >
                打开卷宗
              </span>
            </div>

            <div
              className="mt-7 px-5"
              style={{
                fontFamily:
                  "var(--font-sans)",
                fontSize:
                  "clamp(0.56rem, 2.3vw, 0.72rem)",
                letterSpacing:
                  "0.16em",
                lineHeight: 1.8,
                color: "#9A9698",
                opacity: 0.78,
              }}
            >
              ↑ 卷宗未开启 · 点击打开卷宗查看木子猫星光情报站绝密档案
            </div>
          </button>
        ) : null}

        {/* ======================================================
            ★ 打字机
           ====================================================== */}
        {showIntroText ? (
          <div
            className="flex w-full flex-col items-center justify-center px-4"
            style={{
              minHeight:
                "42vh",

              opacity:
                phase === "text-hold"
                  ? 0
                  : 1,

              transform:
                phase === "text-hold"
                  ? "translateY(-12px)"
                  : "translateY(0)",

              transition:
                "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            {/* 第一组 */}
            <div
              style={{
                fontFamily:
                  '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',

                fontSize:
                  "clamp(1.22rem, 5.2vw, 2rem)",

                fontWeight: 500,

                letterSpacing:
                  "0.11em",

                lineHeight: 1.9,

                color: "#292326",

                width: "100%",
              }}
            >
              {/* 第一行 */}
              <div
                style={{
                  minHeight:
                    "1.9em",
                }}
              >
                {typedLine1}

                {phase === "typing" &&
                typed.length <=
                  line1End ? (
                  <span
                    aria-hidden="true"
                    className="ml-[3px] inline-block align-middle"
                    style={{
                      width: 2,
                      height: "1.1em",
                      backgroundColor:
                        "#D4AF37",
                      animation:
                        "cursor-blink 0.9s step-end infinite",
                    }}
                  />
                ) : null}
              </div>

              {/* 第二行 */}
              <div
                style={{
                  minHeight:
                    "1.9em",
                }}
              >
                {typedLine2}

                {phase === "typing" &&
                typed.length >
                  line2Start &&
                typed.length <=
                  line2End ? (
                  <span
                    aria-hidden="true"
                    className="ml-[3px] inline-block align-middle"
                    style={{
                      width: 2,
                      height: "1.1em",
                      backgroundColor:
                        "#D4AF37",
                      animation:
                        "cursor-blink 0.9s step-end infinite",
                    }}
                  />
                ) : null}
              </div>
            </div>

            {/* 分隔线 */}
            <div
              style={{
                width: 34,
                height: 1,
                marginTop: 24,
                marginBottom: 24,

                background:
                  "linear-gradient(90deg, transparent, #D4AF37, transparent)",

                opacity:
                  introComplete
                    ? 0.7
                    : 0,

                transform:
                  introComplete
                    ? "scaleX(1)"
                    : "scaleX(0)",

                transition:
                  "opacity 0.35s ease, transform 0.35s ease",
              }}
            />

            {/* 第二组 */}
            <div
              style={{
                fontFamily:
                  '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',

                fontSize:
                  "clamp(0.95rem, 3.7vw, 1.3rem)",

                fontWeight: 400,

                letterSpacing:
                  "0.15em",

                lineHeight: 1.9,

                color: "#6F6266",

                width: "100%",
              }}
            >
              {/* 第三行 */}
              <div
                style={{
                  minHeight:
                    "1.9em",
                }}
              >
                {typedLine3}

                {phase === "typing" &&
                typed.length >
                  line3Start &&
                typed.length <=
                  line3End ? (
                  <span
                    aria-hidden="true"
                    className="ml-[3px] inline-block align-middle"
                    style={{
                      width: 2,
                      height: "1.1em",
                      backgroundColor:
                        "#D4AF37",
                      animation:
                        "cursor-blink 0.9s step-end infinite",
                    }}
                  />
                ) : null}
              </div>

              {/* 第四行 */}
              <div
                style={{
                  minHeight:
                    "1.9em",

                  marginTop: 7,

                  fontSize:
                    "clamp(1.12rem, 4.8vw, 1.65rem)",

                  color: "#6A4551",

                  fontWeight: 600,

                  letterSpacing:
                    "0.13em",
                }}
              >
                {typedLine4}

                {phase === "typing" &&
                typed.length >
                  line4Start &&
                typed.length <=
                  line4End ? (
                  <span
                    aria-hidden="true"
                    className="ml-[3px] inline-block align-middle"
                    style={{
                      width: 2,
                      height: "1.1em",
                      backgroundColor:
                        "#D4AF37",
                      animation:
                        "cursor-blink 0.9s step-end infinite",
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* ======================================================
            ★ 视频
            横向沾满手机屏幕
           ====================================================== */}
        {showVideo ? (
          <div
            className="relative flex w-full items-center justify-center"
            style={{
              opacity:
                phase === "video-playing"
                  ? 1
                  : 0,

              transform:
                phase === "video-playing"
                  ? "scale(1)"
                  : "scale(0.96)",

              transition:
                "opacity 0.6s ease, transform 0.6s ease",

              pointerEvents:
                phase === "video-playing"
                  ? "auto"
                  : "none",

              width: "100vw",
            }}
          >
            <div
              className="relative w-screen overflow-hidden"
              style={{
                width: "100vw",
                maxWidth: "100vw",
                marginLeft:
                  "calc(50% - 50vw)",
                background:
                  "#1C1C1E",
              }}
            >
              <video
                ref={videoRef}
                src="https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/baiwan-25s-audio.mp4"
                playsInline
                autoPlay={!isWeChat}
                preload="auto"
                controls={false}
                onEnded={
                  handleVideoEnded
                }
                onError={
                  handleVideoError
                }
                onLoadedData={() => {
                  setVideoLoading(false)
                }}
                onCanPlay={() => {
                  setVideoLoading(false)
                }}
                className="block w-full"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio:
                    "16 / 9",
                  objectFit: "cover",
                  display: "block",
                  background:
                    "#1C1C1E",
                }}
              />

              {/* ==================================================
                  ★ 微信播放按钮
                  
                  更简洁、更高级：
                  半透明玻璃圆环
                  金色细线
                  极简三角播放符号
                  不再像普通视频播放器
                 ================================================== */}
              {isWeChat &&
              !wechatVideoStarted &&
              !videoError ? (
                <button
                  type="button"
                  onClick={
                    startWechatVideo
                  }
                  aria-label="点击播放视频"
                  className="absolute inset-0 z-30 flex items-center justify-center"
                  style={{
                    border: "none",
                    padding: 0,
                    cursor: "pointer",

                    WebkitTapHighlightColor:
                      "transparent",

                    background:
                      "linear-gradient(180deg, rgba(20,18,20,0.02) 0%, rgba(20,18,20,0.24) 100%)",
                  }}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{
                      gap: 13,
                      transform:
                        "translateY(2px)",
                    }}
                  >
                    {/* 播放圆环 */}
                    <div
                      style={{
                        position:
                          "relative",

                        width:
                          "clamp(68px, 18vw, 82px)",

                        height:
                          "clamp(68px, 18vw, 82px)",

                        borderRadius:
                          "50%",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        background:
                          "rgba(20,18,20,0.42)",

                        backdropFilter:
                          "blur(8px)",

                        WebkitBackdropFilter:
                          "blur(8px)",

                        border:
                          "1px solid rgba(255,245,230,0.48)",

                        boxShadow:
                          "0 8px 30px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(212,175,55,0.18)",

                        animation:
                          "wechat-play-pulse 2.4s ease-in-out infinite",
                      }}
                    >
                      {/* 内金色细环 */}
                      <span
                        aria-hidden="true"
                        style={{
                          position:
                            "absolute",

                          inset: 5,

                          borderRadius:
                            "50%",

                          border:
                            "1px solid rgba(212,175,55,0.34)",
                        }}
                      />

                      {/* 播放三角 */}
                      <span
                        aria-hidden="true"
                        style={{
                          width: 0,
                          height: 0,

                          marginLeft: 4,

                          borderTop:
                            "9px solid transparent",

                          borderBottom:
                            "9px solid transparent",

                          borderLeft:
                            "14px solid rgba(255,248,240,0.94)",

                          filter:
                            "drop-shadow(0 1px 3px rgba(0,0,0,0.35))",
                        }}
                      />

                      {/* 金色小光点 */}
                      <span
                        aria-hidden="true"
                        style={{
                          position:
                            "absolute",

                          top: 12,
                          right: 17,

                          width: 3,
                          height: 3,

                          borderRadius:
                            "50%",

                          background:
                            "#D4AF37",

                          boxShadow:
                            "0 0 8px rgba(212,175,55,0.8)",
                        }}
                      />
                    </div>

                    {/* 中文提示 */}
                    <div
                      style={{
                        display:
                          "flex",

                        flexDirection:
                          "column",

                        alignItems:
                          "center",

                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          fontFamily:
                            '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',

                          fontSize:
                            "clamp(0.78rem, 3.2vw, 0.9rem)",

                          fontWeight: 500,

                          letterSpacing:
                            "0.22em",

                          paddingLeft:
                            "0.22em",

                          color:
                            "rgba(255,248,240,0.94)",

                          textShadow:
                            "0 1px 5px rgba(0,0,0,0.45)",
                        }}
                      >
                        点击播放
                      </span>

                      <span
                        style={{
                          fontFamily:
                            "var(--font-sans)",

                          fontSize:
                            "clamp(0.4rem, 1.8vw, 0.48rem)",

                          letterSpacing:
                            "0.18em",

                          paddingLeft:
                            "0.18em",

                          color:
                            "rgba(255,240,230,0.62)",

                          textShadow:
                            "0 1px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        SOUND ON
                      </span>
                    </div>
                  </div>
                </button>
              ) : null}

              {/* ==================================================
                  微信播放后的加载
                 ================================================== */}
              {isWeChat &&
              wechatVideoStarted &&
              videoLoading &&
              !videoError ? (
                <div
                  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    background:
                      "rgba(28,28,30,0.24)",
                  }}
                >
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontFamily:
                        "var(--font-sans)",
                      fontSize:
                        "0.58rem",
                      letterSpacing:
                        "0.12em",
                      color:
                        "#F6DCE3",
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        border:
                          "1px solid rgba(212,175,55,0.35)",
                        borderTopColor:
                          "#D4AF37",
                        borderRadius:
                          "50%",
                        animation:
                          "spin-loader 0.8s linear infinite",
                      }}
                    />

                    <span>
                      正在读取影像
                    </span>
                  </div>
                </div>
              ) : null}

              {/* ==================================================
                  非微信加载
                 ================================================== */}
              {!isWeChat &&
              videoLoading &&
              !videoError ? (
                <div
                  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    background:
                      "rgba(28,28,30,0.20)",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "var(--font-sans)",
                      fontSize:
                        "0.56rem",
                      letterSpacing:
                        "0.12em",
                      color:
                        "#F6DCE3",
                    }}
                  >
                    正在读取影像
                  </div>
                </div>
              ) : null}

              {/* ==================================================
                  播放异常
                  
                  不写“微信视频播放失败”
                 ================================================== */}
              {videoError ? (
                <div
                  className="absolute inset-0 z-40 flex items-center justify-center"
                  style={{
                    background:
                      "rgba(28,28,30,0.78)",
                  }}
                >
                  <button
                    type="button"
                    onClick={
                      retryVideo
                    }
                    className="flex flex-col items-center gap-3 border-0 bg-transparent"
                    style={{
                      cursor:
                        "pointer",

                      WebkitTapHighlightColor:
                        "transparent",
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 54,
                        height: 54,

                        border:
                          "1px solid rgba(212,175,55,0.65)",

                        background:
                          "rgba(28,28,30,0.55)",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "1.1rem",
                          color:
                            "#D4AF37",
                        }}
                      >
                        ↻
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily:
                          "var(--font-sans)",
                        fontSize:
                          "0.58rem",
                        letterSpacing:
                          "0.15em",
                        color:
                          "#F6DCE3",
                      }}
                    >
                      重新播放
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ======================================================
            身份核验
           ====================================================== */}
        {showVerification ? (
          <>
            {/* 猫眼徽标 */}
            <div
              className="mb-4 flex flex-col items-center gap-2"
            >
              <CatMarkGlitch />
            </div>

            {/* 持久化文字 */}
            {showPersistentText ? (
              <div
                className="mb-6 px-5 text-center"
                style={{
                  fontFamily:
                    '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',

                  fontSize:
                    "clamp(0.95rem, 3.8vw, 1.6rem)",

                  color: "#1C1C1E",

                  letterSpacing:
                    "0.1em",

                  lineHeight: 1.9,

                  whiteSpace:
                    "pre-line",

                  opacity: 0.85,

                  animation:
                    "fade-in-only 0.6s ease forwards",
                }}
              >
                {typed}
              </div>
            ) : null}

            {/* 身份核验 */}
            <div
              className="mt-4 flex w-full flex-col items-center gap-3 font-mono"
              style={{
                minHeight:
                  "5.4em",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <div
                className="relative flex h-[1.6em] w-full items-center justify-center"
              >
                {phase ===
                  "starting" ? (
                  <p
                    key="starting"
                    className="absolute"
                    style={{
                      fontSize:
                        "0.7rem",
                      letterSpacing:
                        "0.06em",
                      color:
                        "#6A4551",
                      animation:
                        "fade-in-only 0.5s ease forwards",
                    }}
                  >
                    现在开始身份校核
                  </p>
                ) : null}

                {phase ===
                  "verifying" ? (
                  <p
                    key="verifying"
                    className="absolute flex items-center gap-2"
                    style={{
                      fontSize:
                        "0.7rem",
                      letterSpacing:
                        "0.06em",
                      color:
                        "#6A4551",
                      animation:
                        "fade-in-only 0.4s ease forwards",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 rounded-full border-[1.5px]"
                      style={{
                        borderColor:
                          "#D4AF37 transparent #D4AF37 transparent",
                        animation:
                          "spin-loader 0.8s linear infinite",
                      }}
                    />

                    <span>
                      身份核对中......
                    </span>
                  </p>
                ) : null}

                {phase ===
                  "verified" ? (
                  <p
                    key="verified"
                    className="absolute flex items-baseline gap-2"
                    style={{
                      fontSize:
                        "0.7rem",
                      letterSpacing:
                        "0.06em",
                      color:
                        "#9C7A2E",
                      fontWeight: 700,
                      animation:
                        "fade-in-only 0.5s ease forwards",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      ✓
                    </span>

                    <span>
                      身份已核实
                    </span>
                  </p>
                ) : null}
              </div>

              {/* 进度条 */}
              {showProgressBar ? (
                <div
                  className="w-full max-w-[26rem] text-center"
                  style={{
                    fontSize:
                      "0.66rem",

                    letterSpacing:
                      "0.01em",

                    color:
                      phase ===
                      "verified"
                        ? "#D4AF37"
                        : "#8E8E93",

                    transition:
                      "color 0.4s ease, opacity 0.4s ease",

                    transform:
                      glitchActive
                        ? `translateX(${glitchOffset}px)`
                        : "translateX(0)",

                    textShadow:
                      glitchActive
                        ? "1px 0 rgba(180,72,63,0.5), -1px 0 rgba(212,175,55,0.4)"
                        : "none",
                  }}
                >
                  <span className="break-all">
                    [{barString}]
                  </span>{" "}
                  {progress}%
                </div>
              ) : null}

              {/* 完成 */}
              {phase ===
                "done" ? (
                <p
                  style={{
                    fontFamily:
                      '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',

                    fontSize:
                      "1rem",

                    letterSpacing:
                      "0.16em",

                    color:
                      "#3C3C3E",

                    opacity: 0,

                    animation:
                      "fade-slide-up 0.7s ease forwards",
                  }}
                >
                  祝您查阅愉快
                </p>
              ) : null}
            </div>

            {/* 印章 */}
            <div
              className="mt-10"
              style={{
                opacity:
                  showBadge ? 1 : 0,

                transform:
                  showBadge
                    ? "scale(1) rotate(0deg)"
                    : "scale(0.7) rotate(-8deg)",

                transition:
                  "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                style={{
                  display:
                    "inline-flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap: 3,

                  width: 76,
                  height: 76,

                  borderRadius:
                    "50%",

                  border:
                    "1.5px solid rgba(216,167,177,0.45)",

                  backgroundColor:
                    "rgba(216,167,177,0.05)",

                  boxShadow:
                    "0 0 0 5px rgba(216,167,177,0.04)",

                  position:
                    "relative",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position:
                      "absolute",

                    inset: 6,

                    borderRadius:
                      "50%",

                    border:
                      "1px solid rgba(216,167,177,0.25)",
                  }}
                />

                <span
                  style={{
                    fontFamily:
                      "var(--font-sans)",

                    fontSize:
                      "0.4rem",

                    letterSpacing:
                      "0.25em",

                    color:
                      "#D8A7B1",

                    zIndex: 1,
                  }}
                >
                  情报局
                </span>

                <div
                  style={{
                    width: 16,
                    height:
                      "0.5px",

                    backgroundColor:
                      "#D8A7B1",

                    opacity: 0.35,

                    zIndex: 1,
                  }}
                />

                <span
                  style={{
                    fontFamily:
                      "var(--font-sans)",

                    fontSize:
                      "0.35rem",

                    letterSpacing:
                      "0.15em",

                    color:
                      "#8E8E93",

                    zIndex: 1,
                  }}
                >
                  2026
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* ========================================================
          底部翻页指示
         ======================================================== */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{
          opacity:
            showBadge ? 0.6 : 0,

          transition:
            "opacity 1s ease 0.3s",

          animation:
            showBadge
              ? "scroll-hint-bounce 2.2s ease-in-out infinite"
              : "none",
        }}
      >
        <span
          style={{
            fontFamily:
              "var(--font-sans)",

            fontSize:
              "0.45rem",

            letterSpacing:
              "0.4em",

            color:
              "#8E8E93",
          }}
        >
          ENTER BUREAU
        </span>

        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 0 L8 20"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />

          <path
            d="M2 14 L8 20 L14 14"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeOpacity="0.5"
            fill="none"
          />
        </svg>
      </div>

      {/* 底部细线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
        }}
      />

      {/* ========================================================
          动画
         ======================================================== */}
      <style jsx>{`
        @keyframes fade-in-only {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-loader {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scroll-hint-bounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(6px);
          }
        }

        @keyframes dossier-breathe {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.025);
          }
        }

        @keyframes dossier-open {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          55% {
            opacity: 1;
            transform: scale(1.06);
          }

          100% {
            opacity: 0;
            transform: scale(0.94);
          }
        }

        @keyframes cursor-blink {
          0%,
          45% {
            opacity: 1;
          }

          46%,
          100% {
            opacity: 0;
          }
        }

        @keyframes decrypt-idle-spin {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -615;
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.65;
            transform: scale(0.9);
          }

          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        /* 微信播放按钮轻微呼吸 */
        @keyframes wechat-play-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 8px 30px rgba(0, 0, 0, 0.22),
              0 0 0 rgba(212, 175, 55, 0);
          }

          50% {
            transform: scale(1.035);
            box-shadow:
              0 10px 34px rgba(0, 0, 0, 0.24),
              0 0 22px rgba(212, 175, 55, 0.18);
          }
        }

        @media (max-width: 480px) {
          /*
           * 小屏幕再稍微收紧顶部/底部空间，
           * 让真正的内容中心落在手机视觉中心。
           */
          section {
            min-height: 100svh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  )
}