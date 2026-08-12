"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const bootSequence = [
  "【系统提示：核心人格协议解密中......】",
  "【权限申请中......】",
  "【权限确认：范围内可公开】",
]

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [displayedLine, setDisplayedLine] = useState("")
  const [lineIndex, setLineIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const blink = window.setInterval(() => setShowCursor((v) => !v), 480)
    return () => window.clearInterval(blink)
  }, [])

  useEffect(() => {
    const glitchLoop = window.setInterval(() => {
      if (Math.random() < 0.35) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 6)
        window.setTimeout(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 80 + Math.random() * 100)
      }
    }, 700)
    return () => window.clearInterval(glitchLoop)
  }, [])

  useEffect(() => {
    let cancelled = false
    const timeouts: number[] = []
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn()
      }, delay)
      timeouts.push(id)
    }

    if (lineIndex >= bootSequence.length) {
      schedule(() => {
        setIsExiting(true)
        schedule(() => onCompleteRef.current(), 450)
      }, 500)
      return () => {
        cancelled = true
        timeouts.forEach((id) => window.clearTimeout(id))
      }
    }

    const target = bootSequence[lineIndex]
    setDisplayedLine("")
    let charIndex = 0

    const typeNextChar = () => {
      if (cancelled) return
      charIndex += 1
      setDisplayedLine(target.slice(0, charIndex))

      if (Math.random() < 0.1) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 4)
        schedule(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 60)
      }

      if (charIndex >= target.length) {
        schedule(() => {
          if (cancelled) return
          setVisibleLines((prev) => [...prev, target])
          setLineIndex((prev) => prev + 1)
        }, 500)
      } else {
        schedule(typeNextChar, 28)
      }
    }

    schedule(typeNextChar, 28)

    return () => {
      cancelled = true
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [lineIndex])

  const progress = Math.min(
    100,
    Math.round(((lineIndex + (displayedLine ? 0.5 : 0)) / bootSequence.length) * 100)
  )

  const glitchLineTop = `${20 + Math.random() * 60}%`

  return (
    <div
      className="mx-auto flex min-h-[320px] max-w-2xl items-center justify-center px-6 py-8 transition-all duration-500"
      style={{ opacity: isExiting ? 0 : 1, transform: isExiting ? "scale(0.97)" : "scale(1)" }}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl border px-7 py-9 sm:px-10 sm:py-12"
        style={{
          borderColor: "#A65D7360",
          background: "linear-gradient(165deg, #2A1219 0%, #3B1826 55%, #2A1219 100%)",
          boxShadow: "0 30px 90px rgba(60, 15, 30, 0.45), inset 0 0 60px rgba(186,143,160,0.08)",
          transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
          transition: glitchActive ? "none" : "transform 120ms ease-out",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 3px)",
            opacity: glitchActive ? 0.16 : 0.08,
            transition: "opacity 90ms ease-out",
          }}
        />

        {glitchActive ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(244,166,184,0.06) 2px, rgba(244,166,184,0.06) 3px)",
              transform: `translateX(${glitchOffset * 1.5}px)`,
            }}
          />
        ) : null}

        {glitchActive ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0"
            style={{ height: "2px", top: glitchLineTop, backgroundColor: "rgba(246,220,227,0.35)" }}
          />
        ) : null}

        <span aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 border-l border-t" style={{ borderColor: "#D8A7B1" }} />
        <span aria-hidden="true" className="absolute right-3 top-3 h-4 w-4 border-r border-t" style={{ borderColor: "#D8A7B1" }} />
        <span aria-hidden="true" className="absolute bottom-3 left-3 h-4 w-4 border-b border-l" style={{ borderColor: "#D8A7B1" }} />
        <span aria-hidden="true" className="absolute bottom-3 right-3 h-4 w-4 border-b border-r" style={{ borderColor: "#D8A7B1" }} />

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: "#E8B8C4" }}>
            <span className="flex items-center gap-2">
              <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#F4A6B8", boxShadow: "0 0 8px #F4A6B8" }} />
              ARCHIVE TERMINAL
            </span>
            <span style={{ textShadow: glitchActive ? "1px 0 #F4A6B8, -1px 0 #6FE3D9" : "none" }}>
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>

          <div className="space-y-3 font-mono" style={{ fontSize: "0.9rem", lineHeight: 2, color: "#F6DCE3" }}>
            {visibleLines.map((line, index) => (
              <p key={`${line}-${index}`} className="flex flex-wrap items-baseline gap-2">
                <span style={{ color: "#7A4456" }}>[{String(index + 1).padStart(2, "0")}]</span>
                <span style={{ color: line.includes("确认") ? "#F4A6B8" : "#F6DCE3" }}>{line}</span>
                <span style={{ color: "#7A4456" }}>OK</span>
              </p>
            ))}
            {lineIndex < bootSequence.length ? (
              <p className="flex items-baseline gap-2">
                <span style={{ color: "#7A4456" }}>[{String(lineIndex + 1).padStart(2, "0")}]</span>
                <span style={{ textShadow: glitchActive ? "1.5px 0 rgba(244,166,184,0.7), -1.5px 0 rgba(111,227,217,0.5)" : "none" }}>
                  {displayedLine}
                  <span
                    className="ml-1 inline-block h-4 w-2 align-middle"
                    style={{ backgroundColor: "#F4A6B8", opacity: showCursor ? 1 : 0, boxShadow: "0 0 6px #F4A6B8" }}
                  />
                </span>
              </p>
            ) : null}
          </div>

          <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full" style={{ backgroundColor: "#5A2C3B" }}>
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: "#F4A6B8", boxShadow: "0 0 10px #F4A6B8" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const dossiers = [
  {
    id: "mischievous",
    letter: "M",
    word: "MISCHIEF",
    systemLabel: "日常交互模块评估报告",
    chinese: "捣蛋",
    description:
      "将平淡的日常，悄然酿成一场惊喜。\n以恰到好处的调皮与玩笑，温柔瓦解沉闷；\n让笑意在彼此之间，自然发生。\n偶尔幼稚，也是在认真治愈生活。",
    observerLog: "哪怕偶尔展露幼稚的一面，也是治愈生活的良药。他用最松弛的姿态，接住了所有疲惫的灵魂。",
    accent: "#BA8FA0",
    image: "/KWINdaodan.png",
    posterSrc: "/KWINdaodan.png",
    videoTitle: "行动影像 · 捣蛋信号已捕获",
    videoDescription: "请接收一段突发快乐。观测期间，严肃情绪可能自动失效。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/daodan.mp4",
  },
  {
    id: "tender",
    letter: "U",
    word: "UPBEAT",
    systemLabel: "精神内核评估报告",
    chinese: "温柔",
    description:
      "以冷峻的骨相抵御喧嚣，\n以温柔的本心回应世界。\nThe world has kissed my soul with its pain,\nasking for its return in songs.\n世界以痛吻我，我愿回报以歌。",
    observerLog:
      "目标人物并非生来披甲，而是将苦难与锋芒尽数熔铸为铠甲。他用极致的清醒对抗外界的嘈杂，又用最柔软的善意接住所有的偏爱。这份在泥泞中依然选择歌唱的赤诚，是他最坚不可摧的绝对法则。",
    accent: "#A77E91",
    image: "/KWINwenrou.jpg",
    posterSrc: "/KWINwenrou.jpg",
    videoTitle: "行动影像 · 温柔波段接入中",
    videoDescription: "低频、安静、持续有效。一段能让时间放慢的陪伴记录。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/wenrou.mp4",
  },
  {
    id: "Zesty",
    letter: "Z",
    word: "ZESTY",
    systemLabel: "舞台掌控力评估报告",
    chinese: "曼妙",
    description:
      "聚光灯的轨迹由他定义，\n全场的呼吸随他起伏。\n无需迎合，亦不必借光；\n只要立于舞台中央，便自成绝对法则。\n目标气场全开，请观测者留意心跳频率。",
    observerLog: "强烈建议其余观测者备好氧气瓶，并随时准备交出心跳。",
    accent: "#D8A7B1",
    image: "/KWINmanmiao.jpg",
    posterSrc: "/KWINmanmiao.jpg",
    videoTitle: "行动影像 · 舞台权限全开",
    videoDescription: "光影正在归位，目光正在聚焦；请见证他如何定义全场。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/manmiao.mp4",
  },
  {
    id: "intelligent",
    letter: "I",
    word: "INTELLIGENT",
    systemLabel: "核心驱动源评估报告",
    chinese: "担当",
    description:
      "温暖与坚韧在此共生。\n不声张，自有万钧之力；\n不喧哗，稳作定海之锚。\nSoft as a cloud, yet an unshakeable anchor.",
    observerLog:
      "目标人物从不刻意展露锋芒，却总能在风暴骤起时，稳稳托底所有的不安。这份不动声色的重量感，是他赋予周遭最顶级的安全感。",
    accent: "#9E7186",
    image: "/KWINdandang.jpg",
    posterSrc: "/KWINdandang.jpg",
    videoTitle: "行动影像 · 锚点信号稳定",
    videoDescription: "请读取这一份沉静而可靠的力量：温度始终在线，方向从未偏移。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/dandang.mp4",
  },
  {
    id: "Yvonne",
    letter: "Y",
    word: "YVONNE",
    systemLabel: "社交防御机制评估报告",
    chinese: "傲娇",
    description: "择人而交，宁缺毋滥。\n看似漫不经心，实则优雅审视全场。\n防御机制已启动；获准靠近者，另当别论。",
    observerLog:
      "目标人物的社交门槛极高，绝不轻易交付真心。请其余观测者铭记：一旦被他选中，便意味着你通过了最高级别的灵魂审核，这本身就是一份无上殊荣。",
    accent: "#C0718A",
    image: "/KWINaojiao.jpg",
    posterSrc: "/KWINaojiao.jpg",
    videoTitle: "行动影像 · 高冷信号解析中",
    videoDescription: "表面是优雅的距离感，镜头会替你捕捉那一瞬间的柔软破绽。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/aojiao.mp4",
  },
]

type Dossier = (typeof dossiers)[number]

interface PersonalitySectionProps {
  onOpenVideo?: (personality: Dossier) => void
}

export default function PersonalitySection({ onOpenVideo }: PersonalitySectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)
  const [showBootSequence, setShowBootSequence] = useState(true)
  const [contentPhase, setContentPhase] = useState<"hidden" | "revealing" | "visible">("hidden")

  useEffect(() => {
    if (started) return
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  const handleBootComplete = () => {
    setShowBootSequence(false)
    setContentPhase("revealing")
    window.setTimeout(() => setContentPhase("visible"), 460)
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-28 sm:py-32" style={{ backgroundColor: "#F4E2E5" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #6F3549 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {!started ? (
          <div className="min-h-[320px]" />
        ) : showBootSequence ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          <div
            className={contentPhase === "revealing" ? "content-glitch-in" : ""}
            style={{ opacity: contentPhase === "hidden" ? 0 : 1 }}
          >
            <header className="mb-16 text-center sm:mb-20">
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.45em", color: "#A65D73" }}>
                BUREAU FILE · 02 · OPEN ARCHIVE
              </p>
              <h2
                className="mt-4"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(2.3rem, 5.5vw, 4.5rem)",
                  color: "#41212D",
                  letterSpacing: "0.12em",
                  lineHeight: 1.12,
                }}
              >
                情报展区
              </h2>
              <p
                className="mt-4"
                style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "#A65D73", letterSpacing: "0.18em" }}
              >
                M U Z I Y · five facets, one archive
              </p>
            </header>

            {/* 卷宗展示：字母 + 照片 + 系统提示 */}
            <div className="-mx-6 overflow-x-auto px-6 pb-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <div className="flex w-max items-start gap-3 sm:gap-5 lg:w-full lg:justify-between lg:gap-4">
                {dossiers.map((dossier, index) => (
                  <article
                    key={dossier.id}
                    className={`group w-44 shrink-0 lg:w-auto lg:flex-1 ${["pt-8", "pt-0", "pt-5", "pt-0", "pt-7"][index]}`}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenVideo?.(dossier)}
                      data-clickable
                      className="block w-full text-left outline-none"
                      aria-label={`播放${dossier.chinese}情报视频`}
                    >
                      <span
                        className="mb-2 block text-center transition-transform duration-300 group-hover:-translate-y-1"
                        style={{
                          fontFamily: "var(--font-serif), serif",
                          fontSize: "clamp(3.2rem, 7vw, 6.2rem)",
                          color: "#542936",
                          lineHeight: 0.9,
                        }}
                      >
                        {dossier.letter}
                      </span>
                      <span
                        className="relative block overflow-hidden border transition-all duration-500 group-hover:-translate-y-2 group-focus-visible:-translate-y-2"
                        style={{
                          height: "clamp(240px, 31vw, 390px)",
                          borderColor: `${dossier.accent}80`,
                          boxShadow: `0 12px 26px ${dossier.accent}28`,
                        }}
                      >
                        <Image
                          src={dossier.image}
                          alt={`${dossier.chinese}主题照片`}
                          fill
                          sizes="(max-width: 640px) 44vw, (max-width: 1024px) 29vw, 19vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#4c1f2e]/45 via-transparent to-transparent" />
                        <span
                          className="absolute bottom-3 left-3 flex items-center gap-2"
                          style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "#FFF8FA", letterSpacing: "0.22em" }}
                        >
                          PLAY FILM <span aria-hidden="true">↗</span>
                        </span>
                      </span>
                    </button>

                    <div className="pt-4 text-center">
                      <p
                        style={{
                          fontFamily: "var(--font-serif), serif",
                          fontSize: "clamp(0.95rem, 1.4vw, 1.25rem)",
                          color: "#542936",
                          letterSpacing: "0.14em",
                        }}
                      >
                        {dossier.word}
                      </p>
                      <p
                        className="mt-1"
                        style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: dossier.accent, letterSpacing: "0.3em" }}
                      >
                        {dossier.chinese}
                      </p>
                      <div
                        className="mx-auto mt-3 max-w-[18rem] border-l-2 px-3 py-2 text-left"
                        style={{ borderColor: dossier.accent, backgroundColor: "#FFF8FA80" }}
                      >
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: dossier.accent, letterSpacing: "0.14em" }}>
                          【系统提示：{dossier.systemLabel}】
                        </p>
                        <p
                          className="mt-2"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.76rem",
                            lineHeight: 1.85,
                            color: "#6A4551",
                            letterSpacing: "0.04em",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {dossier.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-9 pt-6">
                      <div
                        className="relative px-4 pb-4 pt-5 text-left"
                        style={{
                          backgroundColor: "#FFFBF7",
                          border: `1px solid ${dossier.accent}55`,
                          boxShadow: "0 10px 22px rgba(84,41,54,0.14)",
                          transform: `rotate(${index % 2 === 0 ? "-1deg" : "1.2deg"})`,
                          clipPath: "polygon(0% 2%, 3% 0%, 97% 1%, 100% 3%, 99% 97%, 96% 100%, 4% 99%, 0% 96%)",
                        }}
                      >
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", color: dossier.accent, letterSpacing: "0.16em" }}>
                          {dossier.chinese} · 观察者日志
                        </p>
                        <p
                          className="mt-1.5"
                          style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", lineHeight: 1.7, color: "#6A4551", letterSpacing: "0.02em" }}
                        >
                          {dossier.observerLog}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full"
                        style={{
                          top: 14,
                          width: 12,
                          height: 12,
                          backgroundColor: dossier.accent,
                          boxShadow: "0 3px 5px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 2px rgba(0,0,0,0.2)",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 z-[3] -translate-x-1/2 rounded-full"
                        style={{ top: 24, width: 5, height: 3, backgroundColor: "#7A4456", opacity: 0.35, filter: "blur(0.5px)" }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* 观测者日志：图钉钉在便签上 */}
            <div className="hidden" aria-hidden="true">
              <div className="relative -mx-6 overflow-x-auto px-6 pb-10 pt-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                <div className="relative flex w-max items-start gap-10 sm:w-full sm:justify-between sm:gap-6">
                  {/* 背景连线：走在便签下方，只在便签之间的空隙露出 */}
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-[14px] hidden w-full sm:block"
                    style={{ height: 24, zIndex: 0 }}
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points="10,5 28,2 46,7 64,2 82,7 90,5"
                      fill="none"
                      stroke="#D08298"
                      strokeWidth="0.6"
                      strokeOpacity="0.85"
                    />
                  </svg>

                  {dossiers.map((dossier, index) => (
                    <div key={dossier.id} className="relative w-44 shrink-0 pt-6 sm:w-auto sm:flex-1">
                      <div
                        className="relative px-4 pb-4 pt-5 text-left"
                        style={{
                          backgroundColor: "#FFFBF7",
                          border: `1px solid ${dossier.accent}55`,
                          boxShadow: "0 10px 22px rgba(84,41,54,0.14)",
                          transform: `rotate(${index % 2 === 0 ? "-1deg" : "1.2deg"})`,
                          clipPath: "polygon(0% 2%, 3% 0%, 97% 1%, 100% 3%, 99% 97%, 96% 100%, 4% 99%, 0% 96%)",
                          zIndex: 1,
                        }}
                      >
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", color: dossier.accent, letterSpacing: "0.16em" }}>
                          {dossier.chinese} · 观测者日志
                        </p>
                        <p
                          className="mt-1.5"
                          style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", lineHeight: 1.7, color: "#6A4551", letterSpacing: "0.02em" }}
                        >
                          {dossier.observerLog}
                        </p>
                      </div>

                      {/* 图钉：一半嵌入便签顶部，制造"扎进纸里"的效果 */}
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full"
                        style={{
                          top: 14,
                          width: 12,
                          height: 12,
                          backgroundColor: dossier.accent,
                          boxShadow: "0 3px 5px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 2px rgba(0,0,0,0.2)",
                        }}
                      />
                      {/* 针尖阴影：落在便签纸面上，加强"被扎穿"的错觉 */}
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 z-[3] -translate-x-1/2 rounded-full"
                        style={{ top: 24, width: 5, height: 3, backgroundColor: "#7A4456", opacity: 0.35, filter: "blur(0.5px)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes glitchIn {
          0% {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(3px);
          }
          18% {
            opacity: 0.55;
            transform: translateX(-4px);
            filter: blur(1.5px);
          }
          34% {
            opacity: 0.15;
            transform: translateX(3px);
            filter: blur(1px);
          }
          50% {
            opacity: 0.8;
            transform: translateX(-2px);
            filter: blur(0.5px);
          }
          68% {
            opacity: 0.35;
            transform: translateX(2px);
          }
          85% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: none;
          }
        }
        .content-glitch-in {
          animation: glitchIn 460ms steps(2, end);
        }
      `}</style>
    </section>
  )
}
