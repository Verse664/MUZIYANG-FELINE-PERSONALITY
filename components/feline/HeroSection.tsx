"use client"

import { useEffect, useRef, useState } from "react"

interface HeroSectionProps {
  onEggTrigger: () => void
  scrollY: number
}

export default function HeroSection({ onEggTrigger, scrollY }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [tagVisible, setTagVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Staggered entrance
  useEffect(() => {
    if (!mounted) return
    const t1 = setTimeout(() => setTitleVisible(true), 400)
    const t2 = setTimeout(() => setSubtitleVisible(true), 900)
    const t3 = setTimeout(() => setTagVisible(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [mounted])

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 30%, #3B1826 0%, #2A1219 55%, #1C0D13 100%)",
      }}
    >
      {/* 板面颗粒纹理，呼应终端动画/角色档案深色背景的质感 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #F6DCE3 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      {/* Subtle grid lines（浅色改暗，避免在深色底上过亮） */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#F6DCE3 1px, transparent 1px), linear-gradient(90deg, #F6DCE3 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Parallax content wrapper */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ transform: "translateY(0)" }}
      >
        {/* 情报局接入标识 */}
        <div
          className="mb-8 flex items-center gap-3 border border-[#D4AF37]/40 bg-[#F6DCE3]/5 px-5 py-2.5 backdrop-blur-sm"
          style={{
            opacity: tagVisible ? 1 : 0,
            transform: tagVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#D4AF37",
              boxShadow: "0 0 8px 2px #D4AF3788",
              display: "inline-block",
              animation: "glow-pulse 1.8s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.38em",
              color: "#D4AF37",
              fontWeight: 700,
            }}
          >
            FELINE INTELLIGENCE BUREAU
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "#B98A99",
            }}
          >
            · 木子猫情报局
          </span>
        </div>

        {/* Cat eye SVG */}
        <div
          className="relative mb-16"
          style={{ background: "none", border: "none" }}
        >
          <CatEyeVideo />
        </div>

        {/* Main title */}
        <h1
          className="mb-5 text-center leading-tight transition-all duration-1000 ease-out"
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(1.6rem, 5.5vw, 4rem)",
            letterSpacing: "0.12em",
            color: "#F6DCE3",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(28px)",
            maxWidth: "820px",
            fontWeight: 700,
          }}
        >
          木子洋 KWIN
          <span
            style={{
              display: "block",
              fontSize: "clamp(1rem, 3vw, 2.2rem)",
              letterSpacing: "0.28em",
              color: "#F4A6B8",
              fontWeight: 400,
              marginTop: "0.3em",
            }}
          >
            猫探长情报档案
          </span>
          <span
            style={{
              display: "block",
              fontSize: "clamp(0.65rem, 1.4vw, 1rem)",
              letterSpacing: "0.35em",
              color: "#B98A99",
              fontWeight: 400,
              marginTop: "0.5em",
              fontFamily: "var(--font-sans)",
            }}
          >
            FELINE INTELLIGENCE DOSSIER · CASE NO. 2026-YANG
          </span>
        </h1>

        {/* Divider */}
        <div
          className="mb-8 flex items-center gap-4 transition-all duration-700"
          style={{ opacity: subtitleVisible ? 1 : 0 }}
        >
          <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #F4A6B8)" }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "#D4AF37",
            }}
          >
            ◆
          </span>
          <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, #F4A6B8, transparent)" }} />
        </div>

        {/* Subtitle */}
        <p
          className="mb-10 transition-all duration-1000 ease-out"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.75rem, 1.8vw, 1rem)",
            letterSpacing: "0.22em",
            color: "#B98A99",
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          本局已运营八周年 · 猫探长现身情报大厅
        </p>

        {/* Archive tag */}
        <div
          className="group flex items-center gap-3 border border-[#F4A6B8]/30 px-6 py-2.5 transition-all duration-700"
          style={{
            opacity: tagVisible ? 1 : 0,
            transform: tagVisible ? "translateY(0)" : "translateY(16px)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D4AF37",
              boxShadow: "0 0 8px 2px #D4AF3766",
              animation: "glow-pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#C7A0AC",
            }}
          >
            [ 情报局 · 公开情报 · 翻阅档案 ]
          </span>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-24 flex flex-col items-center gap-2 transition-all duration-1000"
          style={{ opacity: tagVisible ? 0.5 : 0 }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              color: "#C7A0AC",
            }}
          >
            SCROLL · ENTER BUREAU
          </span>
          <div
            style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, #F4A6B8, transparent)",
              animation: "float-petal 2.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

    </section>
  )
}

function CatEyeVideo() {
  const [isWeChat, setIsWeChat] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const inWeChat = ua.includes("micromessenger")
    setIsWeChat(inWeChat)

    const video = videoRef.current
    if (!video) return

    // 显式用 JS 设置静音属性——微信部分版本会忽略 HTML 里写的 muted，
    // 必须在脚本里主动赋值一次才会真正生效
    video.muted = true
    video.defaultMuted = true

    let attempts = 0
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const attemptPlay = () => {
      if (cancelled) return
      video
        .play()
        .then(() => {
          // 播放成功即停止重试
        })
        .catch(() => {
          // 播放失败：微信环境下视频解码/权限判定常常需要多试几次才成功，
          // 在最初几秒内间隔重试，避免只靠用户点击才能触发
          attempts += 1
          if (attempts < 20) {
            retryTimer = setTimeout(attemptPlay, 150)
          }
        })
    }

    attemptPlay()

    // 微信 JS 桥接就绪后再触发一次，作为额外保险
    const onBridgeReady = () => attemptPlay()
    // @ts-expect-error 微信注入的全局对象，标准环境下不存在
    if (window.WeixinJSBridge) {
      attemptPlay()
    } else {
      document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false)
    }

    // 页面从后台切回前台时（比如用户切了微信小程序又切回来）也重新尝试一次
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") attemptPlay()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      cancelled = true
      if (retryTimer) clearTimeout(retryTimer)
      document.removeEventListener("WeixinJSBridgeReady", onBridgeReady)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return (
    <div className="relative" style={{ width: 550, height: 200 }}>
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(244,166,184,0.25) 0%, rgba(212,175,55,0.08) 45%, transparent 72%)",
          filter: "blur(28px)",
          animation: "glow-pulse 3s ease-in-out infinite",
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        // 微信 X5 内核专属属性，缺一不可，否则可能不触发内联自动播放
        x5-playsinline="true"
        webkit-playsinline="true"
        x5-video-player-type="h5"
        preload="auto"
        // 首帧静态图：在视频尚未开始播放的极短时间内也不会出现空白画面，
        // 需要你准备一张眼睛的静态截图放在 /public/eyes/eyes-poster.jpg
        poster="/eyes/eyes-poster.jpg"
        aria-label="猫探长眼部影像"
        className="absolute inset-0 h-full w-full object-contain"
        style={
          isWeChat
            ? {
                filter: "brightness(1.05) contrast(1.05)",
                opacity: 0.92,
              }
            : {
                filter: "brightness(1.15) contrast(1.1) drop-shadow(0 0 24px rgba(244,166,184,0.35))",
                mixBlendMode: "screen",
                maskImage: "radial-gradient(ellipse 68% 74% at center, #000 42%, rgba(0,0,0,0.55) 62%, transparent 92%)",
                WebkitMaskImage: "radial-gradient(ellipse 68% 74% at center, #000 42%, rgba(0,0,0,0.55) 62%, transparent 92%)",
              }
        }
      >
        <source src="/eyes/eyes-web.mp4" type="video/mp4" />
      </video>

      {/* 微信环境下用一层柔和的暗角遮罩模拟原来 mask-image 的收边效果 */}
      {isWeChat ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 68% 74% at center, transparent 55%, rgba(42,18,25,0.55) 78%, #2A1219 96%)",
          }}
        />
      ) : null}
    </div>
  )
}