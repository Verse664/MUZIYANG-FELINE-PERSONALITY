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

  // 光标闪烁
  useEffect(() => {
    const blink = window.setInterval(() => setShowCursor((v) => !v), 480)
    return () => window.clearInterval(blink)
  }, [])

  // 随机故障触发
  useEffect(() => {
    const glitchLoop = window.setInterval(() => {
      if (Math.random() < 0.35) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 6)
        window.setTimeout(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 90 + Math.random() * 120)
      }
    }, 900)
    return () => window.clearInterval(glitchLoop)
  }, [])

  // 打字机效果：递归 setTimeout + 取消令牌，避免 StrictMode 双重执行导致重复打印
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
        schedule(() => onComplete(), 700)
      }, 900)
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

      if (Math.random() < 0.12) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 4)
        schedule(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 70)
      }

      if (charIndex >= target.length) {
        schedule(() => {
          if (cancelled) return
          setVisibleLines((prev) => [...prev, target])
          setLineIndex((prev) => prev + 1)
        }, 850)
      } else {
        schedule(typeNextChar, 38)
      }
    }

    schedule(typeNextChar, 38)

    return () => {
      cancelled = true
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [lineIndex, onComplete])

  const progress = Math.min(
    100,
    Math.round(((lineIndex + (displayedLine ? 0.5 : 0)) / bootSequence.length) * 100)
  )

  const glitchLineTop = `${20 + Math.random() * 60}%`

  return (
    <div
      className="mx-auto flex min-h-[320px] max-w-2xl items-center justify-center px-6 py-8 transition-all duration-700"
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
            style={{
              height: "2px",
              top: glitchLineTop,
              backgroundColor: "rgba(246,220,227,0.35)",
            }}
          />
        ) : null}

        <span aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 border-l border-t" style={{ borderColor: "#D8A7B1" }} />
        <span aria-hidden="true" className="absolute right-3 top-3 h-4 w-4 border-r border-t" style={{ borderColor: "#D8A7B1" }} />
        <span aria-hidden="true" className="absolute bottom-3 left-3 h-4 w-4 border-b border-l" style={{ borderColor: "#D8A7B1" }} />
        <span aria-hidden="true" className="absolute bottom-3 right-3 h-4 w-4 border-b border-r" style={{ borderColor: "#D8A7B1" }} />

        <div className="relative z-10">
          <div
            className="mb-6 flex items-center justify-between font-mono"
            style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: "#E8B8C4" }}
          >
            <span className="flex items-center gap-2">
              <i
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: "#F4A6B8", boxShadow: "0 0 8px #F4A6B8" }}
              />
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
                <span
                  style={{
                    textShadow: glitchActive ? "1.5px 0 rgba(244,166,184,0.7), -1.5px 0 rgba(111,227,217,0.5)" : "none",
                  }}
                >
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
    observerLog: "目标人物并非生来披甲，而是将苦难与锋芒尽数熔铸为铠甲。他用极致的清醒对抗外界的嘈杂，又用最柔软的善意接住所有的偏爱。这份在泥泞中依然选择歌唱的赤诚，是他最坚不可摧的绝对法则。",
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
    observerLog: "目标人物从不刻意展露锋芒，却总能在风暴骤起时，稳稳托底所有的不安。这份不动声色的重量感，是他赋予周遭最顶级的安全感。",
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
    observerLog: "目标人物的社交门槛极高，绝不轻易交付真心。请其余观测者铭记：一旦被他选中，便意味着你通过了最高级别的灵魂审核，这本身就是一份无上殊荣。",
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
  const [contentVisible, setContentVisible] = useState(false)

  // 滚动到这一页才触发动画，只触发一次
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setContentVisible(true))
    })
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
          // 尚未进入视口：预留占位高度，不渲染任何内容，避免布局跳动
          <div className="min-h-[320px]" />
        ) : showBootSequence ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          <div
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            <header className="mb-16 text-center sm:mb-20">
              <p
                style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.45em", color: "#A65D73" }}
              >
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
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(1rem, 2vw, 1.4rem)",
                  color: "#A65D73",
                  letterSpacing: "0.18em",
                }}
              >
                M U Z I Y · five facets, one archive
              </p>
            </header>

            <div className="-mx-6 overflow-x-auto px-6 pb-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <div className="flex w-max items-start gap-3 sm:gap-5 lg:w-full lg:justify-between lg:gap-4">
                {dossiers.map((dossier, index) => (
                  <article
                    key={dossier.id}
                    className={`group w-36 shrink-0 sm:w-44 lg:w-auto lg:flex-1 ${["pt-8", "pt-0", "pt-5", "pt-0", "pt-7"][index]}`}
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
                      <div
                        className="relative mx-auto mt-3 max-w-[18rem] py-2.5 pl-6 pr-3 text-left"
                        style={{
                        backgroundColor: "#FFF9FA",
                        border: `1px solid ${dossier.accent}80`,
                        clipPath: "polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)",
                        }}
                        >
                          {/* 标签打孔 */}
                          <span
                          aria-hidden="true"
                          className="absolute rounded-full"
                          style={{
                            width: 3.5,
                            height: 3.5,
                            left: 5,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: dossier.accent,
                            opacity: 0.7,
                          }}
                          />
                          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "#8E5D6C", letterSpacing: "0.16em" }}>
                            观测者日志
                            </p>
                            <p className="mt-1" style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", lineHeight: 1.75, color: "#795662", letterSpacing: "0.03em" }}>
                              {dossier.observerLog}
                              </p>
                            </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}