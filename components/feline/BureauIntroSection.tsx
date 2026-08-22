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
          alt="猫探长情报局徽标"
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

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 3px)",
            opacity: glitchActive ? 0.12 : 0.05,
          }}
        />
      </div>

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

export default function BureauIntroSection({
  isActive = true,
}: BureauIntroSectionProps) {
  const [phase, setPhase] =
    useState<VerifyPhase>("dossier-ready")

  const [typed, setTyped] = useState("")
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)

  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)

  // 视频
  const [isWeChat, setIsWeChat] = useState(false)
  const [wechatVideoStarted, setWechatVideoStarted] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoStartedRef = useRef(false)
  const videoRetryRef = useRef(0)

  const fullText =
    '欢迎各位侦探小姐\n莅临"猫咪情报局"\n\n本情报局观测对象\n百万男神木子洋'

  const VIDEO_SRC =
    "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/baiwan-25s-audio.mp4"

  /*
   * ================================
   * 微信浏览器检测
   * ================================
   */
  useEffect(() => {
    if (typeof navigator === "undefined") return

    const ua = navigator.userAgent || ""

    setIsWeChat(/MicroMessenger/i.test(ua))
  }, [])

  /*
   * ================================
   * 打开卷宗
   * ================================
   */
  const openDossier = () => {
    if (!isActive || phase !== "dossier-ready") return

    setPhase("dossier-opening")

    window.setTimeout(() => {
      setPhase("typing")
    }, 750)
  }

  /*
   * ================================
   * 打字机
   * ================================
   */
  useEffect(() => {
    if (phase !== "typing") return

    let i = 0

    const interval = window.setInterval(() => {
      i += 1

      setTyped(fullText.slice(0, i))

      if (i >= fullText.length) {
        window.clearInterval(interval)

        window.setTimeout(() => {
          setPhase("text-hold")
        }, 700)
      }
    }, 55)

    return () => window.clearInterval(interval)
  }, [phase])

  /*
   * ================================
   * 文字停留
   * ================================
   */
  useEffect(() => {
    if (phase !== "text-hold") return

    const timer = window.setTimeout(() => {
      setPhase("video-enter")
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * ================================
   * 视频进入
   * ================================
   */
  useEffect(() => {
    if (phase !== "video-enter") return

    setVideoError(false)
    setVideoLoading(false)
    setWechatVideoStarted(false)
    setVideoMuted(false)
    videoStartedRef.current = false
    videoRetryRef.current = 0

    const timer = window.setTimeout(() => {
      setPhase("video-playing")
    }, 550)

    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * ================================
   * 设置视频兼容属性
   * ================================
   */
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
      "portraint"
    )
  }

  /*
   * ================================
   * 视频阶段
   *
   * 微信：
   *   不自动播放
   *
   * Safari / Chrome：
   *   自动播放 + 尝试声音
   * ================================
   */
  useEffect(() => {
    if (phase !== "video-playing") return

    const video = videoRef.current

    if (!video) return

    prepareVideo(video)

    videoStartedRef.current = false
    videoRetryRef.current = 0

    setVideoError(false)
    setVideoLoading(false)

    /*
     * 微信：
     *
     * 不自动调用 play()
     * 等用户点击按钮。
     */
    if (isWeChat) {
      try {
        video.pause()
      } catch {}

      video.currentTime = 0
      video.muted = false

      setVideoMuted(false)
      setWechatVideoStarted(false)

      return
    }

    /*
     * Chrome / Safari：
     *
     * 尝试自动播放有声音。
     */
    video.currentTime = 0
    video.muted = false

    setVideoMuted(false)
    setVideoLoading(true)

    const playAutomatically = async () => {
      try {
        await video.play()

        setVideoLoading(false)
        setVideoError(false)
        videoStartedRef.current = true
      } catch {
        /*
         * 某些浏览器不允许有声音自动播放。
         *
         * 自动退回静音播放。
         *
         * 不显示任何错误提示。
         */
        try {
          video.muted = true

          setVideoMuted(true)

          await video.play()

          setVideoLoading(false)
          setVideoError(false)
          videoStartedRef.current = true
        } catch {
          setVideoLoading(false)
          setVideoError(true)
        }
      }
    }

    const timer = window.setTimeout(() => {
      playAutomatically()
    }, 100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [phase, isWeChat])

  /*
   * ================================
   * 微信点击播放
   *
   * 必须由用户点击触发
   * ================================
   */
  const startWechatVideo = async () => {
    const video = videoRef.current

    if (!video) return

    prepareVideo(video)

    setVideoError(false)
    setVideoLoading(true)

    try {
      video.currentTime = 0
    } catch {}

    video.muted = false

    setVideoMuted(false)

    try {
      await video.play()

      videoStartedRef.current = true
      setWechatVideoStarted(true)
      setVideoLoading(false)
      setVideoError(false)
    } catch {
      /*
       * 不在页面上显示任何错误文字。
       *
       * 保持当前画面。
       */
      setVideoLoading(false)
      setVideoError(true)
    }
  }

  /*
   * ================================
   * 视频结束
   * ================================
   */
  const handleVideoEnded = () => {
    videoStartedRef.current = false
    setWechatVideoStarted(false)
    setPhase("video-exit")
  }

  /*
   * ================================
   * 视频错误
   * ================================
   */
  const handleVideoError = () => {
    setVideoLoading(false)
    setVideoError(true)
  }

  /*
   * ================================
   * 重新播放
   * ================================
   */
  const retryVideo = async () => {
    const video = videoRef.current

    if (!video) return

    prepareVideo(video)

    setVideoError(false)
    setVideoLoading(true)

    videoRetryRef.current = 0

    try {
      video.currentTime = 0
    } catch {}

    /*
     * 微信重新播放：
     * 仍然需要用户点击。
     */
    if (isWeChat) {
      setVideoLoading(false)
      setWechatVideoStarted(false)

      try {
        video.pause()
      } catch {}

      return
    }

    /*
     * 普通浏览器重新尝试声音播放
     */
    video.muted = false
    setVideoMuted(false)

    try {
      await video.play()

      setVideoLoading(false)
      setVideoError(false)
      videoStartedRef.current = true
    } catch {
      /*
       * 回退静音播放
       */
      try {
        video.muted = true
        setVideoMuted(true)

        await video.play()

        setVideoLoading(false)
        setVideoError(false)
        videoStartedRef.current = true
      } catch {
        setVideoLoading(false)
        setVideoError(true)
      }
    }
  }

  /*
   * ================================
   * 视频退出
   * ================================
   */
  useEffect(() => {
    if (phase !== "video-exit") return

    const timer = window.setTimeout(() => {
      setPhase("starting")
    }, 600)

    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * ================================
   * Starting
   * ================================
   */
  useEffect(() => {
    if (phase !== "starting") return

    const timer = window.setTimeout(() => {
      setPhase("verifying")
    }, 1700)

    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * ================================
   * 身份核验
   * ================================
   */
  useEffect(() => {
    if (phase !== "verifying") return

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

    let accumulated = 0

    steps.forEach((step) => {
      accumulated += step.delay

      const timer = window.setTimeout(() => {
        if (cancelled) return

        setProgress(step.target)

        if (step.target === 100) {
          window.setTimeout(() => {
            if (!cancelled) {
              setPhase("verified")
            }
          }, 400)
        }
      }, accumulated)

      timeouts.push(timer)
    })

    return () => {
      cancelled = true

      timeouts.forEach((timer) => {
        window.clearTimeout(timer)
      })
    }
  }, [phase])

  /*
   * ================================
   * Verified
   * ================================
   */
  useEffect(() => {
    if (phase !== "verified") return

    const timer = window.setTimeout(() => {
      setPhase("done")
    }, 1100)

    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * ================================
   * Done
   * ================================
   */
  useEffect(() => {
    if (phase !== "done") return

    const timer = window.setTimeout(() => {
      setShowBadge(true)
    }, 700)

    return () => window.clearTimeout(timer)
  }, [phase])

  /*
   * ================================
   * 故障效果
   * ================================
   */
  useEffect(() => {
    if (phase !== "verifying") return

    const glitchLoop = window.setInterval(() => {
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

    return () => window.clearInterval(glitchLoop)
  }, [phase])

  const barLength = 30

  const filled = Math.round(
    (progress / 100) * barLength
  )

  const barString =
    "█".repeat(filled) +
    "░".repeat(barLength - filled)

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
    (phase === "starting" ||
      phase === "verifying" ||
      phase === "verified" ||
      phase === "done") &&
    typed.length === fullText.length

  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #F4E2E5 0%, #FAF7F5 40%, #E8D3D8 75%, #EDD5D9 100%)",
      }}
    >
      {/* 背景光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      {/* 网格 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#1C1C1E 1px, transparent 1px), linear-gradient(90deg, #1C1C1E 1px, transparent 1px)",
          backgroundSize: "80px 80px",
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

      {/* 顶部标记 */}
      <div
        className="absolute left-0 right-0 top-6 flex items-center justify-center gap-2"
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
            fontFamily: "var(--font-sans)",
            fontSize: "0.48rem",
            letterSpacing: "0.4em",
            color: "#8E8E93",
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

      {/* 案号 */}
      <div
        className="absolute top-16"
        style={{
          opacity: 0.55,
          fontFamily: "var(--font-sans)",
          fontSize: "0.5rem",
          letterSpacing: "0.3em",
          color: "#D4AF37",
        }}
      >
        CASE NO. 2026-YANG · ACCESS TERMINAL
      </div>

      {/* 主容器 */}
      <div
        className="relative z-10 flex w-[min(760px,calc(100vw-3rem))] flex-col items-center px-6 py-10 text-center sm:px-12 sm:py-14"
        style={{
          border: showDossierGate
            ? "none"
            : "1px solid rgba(212,175,55,0.5)",
          background: showDossierGate
            ? "transparent"
            : "linear-gradient(135deg, rgba(255,253,248,0.78), rgba(244,226,229,0.72))",
          boxShadow: showDossierGate
            ? "none"
            : "0 18px 70px rgba(87,45,55,0.14), inset 0 0 0 5px rgba(212,175,55,0.06)",
          maxWidth: 760,
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
        {!showDossierGate ? (
          <>
            <span
              aria-hidden="true"
              className="absolute left-3 top-3 h-7 w-7 border-l border-t border-[#D4AF37]/55"
            />

            <span
              aria-hidden="true"
              className="absolute right-3 top-3 h-7 w-7 border-r border-t border-[#D4AF37]/55"
            />

            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 h-7 w-7 border-b border-l border-[#D4AF37]/55"
            />

            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 h-7 w-7 border-b border-r border-[#D4AF37]/55"
            />
          </>
        ) : null}

        {/* ============================
            开卷入口
           ============================ */}
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
                    transformOrigin: "center",
                    animation:
                      "decrypt-idle-spin 4.5s linear infinite",
                  }}
                />
              </svg>

              <div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: "82%",
                  height: "82%",
                  borderRadius: "50%",
                  zIndex: 5,
                }}
              >
                <Image
                  src="/blackcat.png"
                  alt="BlackCat 徽标"
                  fill
                  sizes="220px"
                  className="object-cover"
                  priority
                />
              </div>

              <span
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                style={{
                  fontFamily:
                    "var(--font-serif), serif",
                  fontSize:
                    "clamp(1.05rem, 5vw, 1.45rem)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#F28DA8",
                  textShadow:
                    "0 1px 5px rgba(255,255,255,0.6)",
                }}
              >
                打开卷宗
              </span>
            </div>

            <div
              className="mt-7"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize:
                  "clamp(0.58rem, 2.4vw, 0.72rem)",
                letterSpacing: "0.22em",
                color: "#9A9698",
                opacity: 0.78,
              }}
            >
              ↑ 卷宗未开启 · 点击打开卷宗查看猫咪情报局绝密档案
            </div>
          </button>
        ) : null}

        {/* ============================
            打字文字
           ============================ */}
        {showIntroText ? (
          <div
            style={{
              fontFamily:
                "var(--font-serif), serif",
              fontSize:
                "clamp(1.2rem, 3.2vw, 2rem)",
              color: "#1C1C1E",
              letterSpacing: "0.1em",
              lineHeight: 1.9,
              minHeight: "7.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "pre-line",
              opacity:
                phase === "text-hold" ? 0 : 1,
              transform:
                phase === "text-hold"
                  ? "translateY(-8px)"
                  : "translateY(0)",
              transition:
                "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <span>
              {typed}

              {phase === "typing" ? (
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "1.1em",
                    backgroundColor: "#D4AF37",
                    marginLeft: 3,
                    verticalAlign: "middle",
                    animation:
                      "cursor-blink 0.9s step-end infinite",
                  }}
                />
              ) : null}
            </span>
          </div>
        ) : null}

        {/* ============================
            视频
           ============================ */}
        {showVideo ? (
          <div
            className="relative flex w-full items-center justify-center"
            style={{
              opacity:
                phase === "video-playing" ? 1 : 0,
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
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                maxWidth: 640,
                border:
                  "1px solid rgba(212,175,55,0.55)",
                padding: 8,
                background:
                  "rgba(255,253,248,0.55)",
                boxShadow:
                  "0 12px 42px rgba(87,45,55,0.14), inset 0 0 0 1px rgba(212,175,55,0.08)",
              }}
            >
              {/* 四角装饰 */}
              <span
                aria-hidden="true"
                className="absolute left-2 top-2 z-10 h-5 w-5 border-l border-t border-[#D4AF37]/60"
              />

              <span
                aria-hidden="true"
                className="absolute right-2 top-2 z-10 h-5 w-5 border-r border-t border-[#D4AF37]/60"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-2 left-2 z-10 h-5 w-5 border-b border-l border-[#D4AF37]/60"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-2 right-2 z-10 h-5 w-5 border-b border-r border-[#D4AF37]/60"
              />

              {/* 视频 */}
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                playsInline
                muted={false}
                autoPlay={!isWeChat}
                preload="auto"
                controls={false}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                onLoadedData={() => {
                  setVideoLoading(false)
                }}
                onCanPlay={() => {
                  setVideoLoading(false)
                }}
                className="block h-auto w-full"
                style={{
                  aspectRatio: "16 / 9",
                  objectFit: "contain",
                  background: "#1C1C1E",
                }}
              />

              {/* ============================
                  微信播放按钮
                 ============================ */}
              {isWeChat &&
              !wechatVideoStarted &&
              !videoError ? (
                <button
                  type="button"
                  onClick={startWechatVideo}
                  aria-label="点击播放"
                  className="absolute inset-0 z-30 flex items-center justify-center"
                  style={{
                    background:
                      "rgba(28,28,30,0.30)",
                    cursor: "pointer",
                    border: "none",
                    WebkitTapHighlightColor:
                      "transparent",
                  }}
                >
                  <div
                    className="flex flex-col items-center gap-3"
                    style={{
                      fontFamily:
                        "var(--font-sans)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 68,
                        height: 68,
                        border:
                          "1px solid rgba(212,175,55,0.78)",
                        background:
                          "rgba(28,28,30,0.68)",
                        boxShadow:
                          "0 0 24px rgba(212,175,55,0.20)",
                        animation:
                          "wechat-play-pulse 2s ease-in-out infinite",
                      }}
                    >
                      <span
                        style={{
                          marginLeft: 4,
                          fontSize: "1.45rem",
                          color: "#D4AF37",
                        }}
                      >
                        ▶
                      </span>
                    </div>

                    <span
                      style={{
                        color: "#F6DCE3",
                        fontSize: "0.68rem",
                        letterSpacing: "0.16em",
                      }}
                    >
                      点击播放
                    </span>

                    <span
                      style={{
                        color:
                          "rgba(246,220,227,0.72)",
                        fontSize: "0.48rem",
                        letterSpacing: "0.08em",
                      }}
                    >
                      TAP TO PLAY WITH SOUND
                    </span>
                  </div>
                </button>
              ) : null}

              {/* ============================
                  微信播放后的加载状态
                 ============================ */}
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
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      color: "#F6DCE3",
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
                        borderRadius: "50%",
                        animation:
                          "spin-loader 0.8s linear infinite",
                      }}
                    />

                    <span>正在读取影像</span>
                  </div>
                </div>
              ) : null}

              {/* ============================
                  普通浏览器加载
                 ============================ */}
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
                      fontSize: "0.56rem",
                      letterSpacing: "0.12em",
                      color: "#F6DCE3",
                    }}
                  >
                    正在读取影像
                  </div>
                </div>
              ) : null}

              {/* ============================
                  视频失败
                  不显示技术错误
                 ============================ */}
              {videoError ? (
                <div
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center"
                  style={{
                    background:
                      "rgba(28,28,30,0.78)",
                  }}
                >
                  <button
                    type="button"
                    onClick={retryVideo}
                    className="flex flex-col items-center gap-3 border-0 bg-transparent"
                    style={{
                      cursor: "pointer",
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
                          fontSize: "1.1rem",
                          color: "#D4AF37",
                        }}
                      >
                        ↻
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily:
                          "var(--font-sans)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.15em",
                        color: "#F6DCE3",
                      }}
                    >
                      重新播放
                    </span>
                  </button>
                </div>
              ) : null}

              {/* 微信底部小提示 */}
              {isWeChat &&
              !wechatVideoStarted &&
              !videoError ? (
                <div
                  className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap"
                  style={{
                    fontFamily:
                      "var(--font-sans)",
                    fontSize: "0.42rem",
                    letterSpacing: "0.1em",
                    color:
                      "rgba(246,220,227,0.55)",
                  }}
                >
                  FELINE INTELLIGENCE BUREAU
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ============================
            身份核验
           ============================ */}
        {showVerification ? (
          <>
            <div className="mb-4 flex flex-col items-center gap-2">
              <CatMarkGlitch />
            </div>

            {showPersistentText ? (
              <div
                className="mb-6"
                style={{
                  fontFamily:
                    "var(--font-serif), serif",
                  fontSize:
                    "clamp(1rem, 2.8vw, 1.6rem)",
                  color: "#1C1C1E",
                  letterSpacing: "0.1em",
                  lineHeight: 1.9,
                  whiteSpace: "pre-line",
                  opacity: 0.85,
                  animation:
                    "fade-in-only 0.6s ease forwards",
                }}
              >
                {typed}
              </div>
            ) : null}

            <div
              className="mt-4 flex w-full flex-col items-center gap-3 font-mono"
              style={{
                minHeight: "5.4em",
              }}
            >
              <div className="relative flex h-[1.6em] w-full items-center justify-center">
                {phase === "starting" ? (
                  <p
                    className="absolute"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em",
                      color: "#6A4551",
                      animation:
                        "fade-in-only 0.5s ease forwards",
                    }}
                  >
                    现在开始身份校核
                  </p>
                ) : null}

                {phase === "verifying" ? (
                  <p
                    className="absolute flex items-center gap-2"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em",
                      color: "#6A4551",
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

                    <span>身份核对中......</span>
                  </p>
                ) : null}

                {phase === "verified" ? (
                  <p
                    className="absolute flex items-baseline gap-2"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em",
                      color: "#9C7A2E",
                      fontWeight: 700,
                      animation:
                        "fade-in-only 0.5s ease forwards",
                    }}
                  >
                    <span style={{ fontWeight: 400 }}>
                      ✓
                    </span>

                    <span>身份已核实</span>
                  </p>
                ) : null}
              </div>

              {showProgressBar ? (
                <div
                  className="w-full max-w-[26rem] text-center"
                  style={{
                    fontSize: "0.66rem",
                    letterSpacing: "0.01em",
                    color:
                      phase === "verified"
                        ? "#D4AF37"
                        : "#8E8E93",
                    transition:
                      "color 0.4s ease, opacity 0.4s ease",
                    transform: glitchActive
                      ? `translateX(${glitchOffset}px)`
                      : "translateX(0)",
                    textShadow: glitchActive
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

              {phase === "done" ? (
                <p
                  style={{
                    fontFamily:
                      "var(--font-serif), serif",
                    fontSize: "1rem",
                    letterSpacing: "0.16em",
                    color: "#3C3C3E",
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
                opacity: showBadge ? 1 : 0,
                transform: showBadge
                  ? "scale(1) rotate(0deg)"
                  : "scale(0.7) rotate(-8deg)",
                transition:
                  "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
                  border:
                    "1.5px solid rgba(216,167,177,0.45)",
                  backgroundColor:
                    "rgba(216,167,177,0.05)",
                  boxShadow:
                    "0 0 0 5px rgba(216,167,177,0.04)",
                  position: "relative",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 6,
                    borderRadius: "50%",
                    border:
                      "1px solid rgba(216,167,177,0.25)",
                  }}
                />

                <span
                  style={{
                    fontFamily:
                      "var(--font-sans)",
                    fontSize: "0.4rem",
                    letterSpacing: "0.25em",
                    color: "#D8A7B1",
                    zIndex: 1,
                  }}
                >
                  情报局
                </span>

                <div
                  style={{
                    width: 16,
                    height: "0.5px",
                    backgroundColor: "#D8A7B1",
                    opacity: 0.35,
                    zIndex: 1,
                  }}
                />

                <span
                  style={{
                    fontFamily:
                      "var(--font-sans)",
                    fontSize: "0.35rem",
                    letterSpacing: "0.15em",
                    color: "#8E8E93",
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

      {/* 底部提示 */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{
          opacity: showBadge ? 0.6 : 0,
          transition:
            "opacity 1s ease 0.3s",
          animation: showBadge
            ? "scroll-hint-bounce 2.2s ease-in-out infinite"
            : "none",
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

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
        }}
      />

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

        @keyframes wechat-play-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 24px rgba(212, 175, 55, 0.2);
          }

          50% {
            transform: scale(1.05);
            box-shadow:
              0 0 32px rgba(212, 175, 55, 0.32);
          }
        }
      `}</style>
    </section>
  )
}