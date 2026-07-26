"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/feline/HeroSection"
import SpeciesSection from "@/components/feline/SpeciesSection"
import PersonalitySection from "@/components/feline/PersonalitySection"
import SelfConsistentSection from "@/components/feline/SelfConsistentSection"
import EasterEggModal from "@/components/feline/EasterEggModal"
import FilmGrainOverlay from "@/components/feline/FilmGrainOverlay"
import CustomCursor from "@/components/feline/CustomCursor"

// 词云画布尺寸
const CLOUD_VB_W = 900
const CLOUD_VB_H = 520

type Tier = 0 | 1 | 2

interface FanPhrase {
  text: string
  tier: Tier
  color: string
}

interface PlacedPhrase {
  text: string
  color: string
  fontSize: number
  x: number
  y: number
  left: number
  right: number
  top: number
  bottom: number
}

// 粉丝留言数据：保留全部原有内容，按长短分三档字号权重
const fanPhrases: FanPhrase[] = [
  // 大字（视觉重心）
  { text: "世界变软了", tier: 0, color: "#C95573" },
  { text: "猫影留言墙", tier: 0, color: "#D15D73" },
  { text: "洋洋", tier: 0, color: "#B24F6B" },

  // 中字（关键短语）
  { text: "温柔与坚定", tier: 1, color: "#D38A96" },
  { text: "陪伴", tier: 1, color: "#D27B8B" },
  { text: "靠近", tier: 1, color: "#DC7C8F" },
  { text: "治愈", tier: 1, color: "#E499A5" },
  { text: "柔软但坚定", tier: 1, color: "#CB6980" },
  { text: "谢谢洋洋示范", tier: 1, color: "#E89AA8" },
  { text: "世界如此柔软", tier: 1, color: "#C55B71" },
  { text: "猫头侧影", tier: 1, color: "#DC7C8F" },
  { text: "沉稳而温柔", tier: 1, color: "#E37A8B" },
  { text: "氛围感太强", tier: 1, color: "#EEA0AD" },
  { text: "被治愈了", tier: 1, color: "#D67384" },
  { text: "文字云", tier: 1, color: "#D98B99" },
  { text: "梦境质感", tier: 1, color: "#DB7E91" },
  { text: "粉色光影", tier: 1, color: "#D98B99" },
  { text: "柔软的目光", tier: 1, color: "#D25976" },
  { text: "猫影里的温柔", tier: 1, color: "#D15D73" },
  { text: "容易醉心", tier: 1, color: "#E37A8B" },
  { text: "这一刻很高级", tier: 1, color: "#C95573" },
  { text: "粉色调的温度", tier: 1, color: "#D67384" },
  { text: "柔光与留白", tier: 1, color: "#D98B99" },
  { text: "小鹿 · 上海", tier: 1, color: "#D8A7B1" },
  { text: "阿卷 · 成都", tier: 1, color: "#D8A7B1" },
  { text: "一一 · 东京", tier: 1, color: "#E4B8C0" },
  { text: "VOICES OF FANS", tier: 1, color: "#C86A84" },

  // 小字（完整长句 + 短句，填充纹理）
  { text: "洋洋让我相信，猫真的可以活成一个人的样子。", tier: 2, color: "#F3DFE2" },
  { text: "每次看到洋洋的照片，都觉得世界变软了。", tier: 2, color: "#F5E7E9" },
  { text: "温柔和坚定原来可以同时在一个人身上发生。", tier: 2, color: "#F7E9EC" },
  { text: "你的温柔很有力量", tier: 2, color: "#D76176" },
  { text: "好像有人悄悄抱住了我", tier: 2, color: "#CB6980" },
  { text: "像一封手写信", tier: 2, color: "#E794A0" },
  { text: "你是我的晴天", tier: 2, color: "#C96E82" },
  { text: "纸张上的猫像", tier: 2, color: "#F0D4D8" },
  { text: "这份静谧真的很好", tier: 2, color: "#F4E8EA" },
  { text: "从照片里出来的柔软", tier: 2, color: "#DB7E91" },
  { text: "谢谢你让世界安静", tier: 2, color: "#F7E8EA" },
  { text: "每一行都像心情", tier: 2, color: "#F8E3E5" },
  { text: "像猫毛一样细腻", tier: 2, color: "#F3DEE1" },
  { text: "像猫头剪影一样安静", tier: 2, color: "#F0D9DB" },
  { text: "被看见的温柔", tier: 2, color: "#F6E9EB" },
  { text: "心跳都慢了", tier: 2, color: "#E78695" },
]

// 各字号档位的取值范围
const TIER_SIZE_RANGE: Record<Tier, [number, number]> = {
  0: [24, 30],
  1: [16, 21],
  2: [11, 14],
}

function randInRange([min, max]: [number, number]): number {
  return min + Math.random() * (max - min)
}

export default function FelineArchivePage() {
  const [eggOpen, setEggOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [cloudLayout, setCloudLayout] = useState<PlacedPhrase[]>([])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )
    const elements = document.querySelectorAll(".reveal")
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // 自动排版：经典词云螺旋算法，铺满整个矩形区域，保证每句话完整、不重叠
  useEffect(() => {
    let cancelled = false

    async function computeLayout() {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready
        } catch {
          // 忽略字体加载检测失败，继续用当前可用字体测量
        }
      }
      if (cancelled) return

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const rootStyles = getComputedStyle(document.documentElement)
      const fontFamily =
        rootStyles.getPropertyValue("--font-sans").trim() || "sans-serif"

      // 大字先放（占据中心视觉重心），小字后放（填充四周空隙）
      const ordered = [...fanPhrases].sort((a, b) => a.tier - b.tier)

      const placed: PlacedPhrase[] = []
      const cx = CLOUD_VB_W / 2
      const cy = CLOUD_VB_H / 2
      const maxRadius = Math.hypot(CLOUD_VB_W, CLOUD_VB_H)

      for (const phrase of ordered) {
        const fontSize = randInRange(TIER_SIZE_RANGE[phrase.tier])
        ctx.font = `${fontSize}px ${fontFamily}`
        const width = ctx.measureText(phrase.text).width
        const height = fontSize * 1.15
        const halfW = width / 2
        const halfH = height / 2

        let found: { x: number; y: number; left: number; right: number; top: number; bottom: number } | null = null
        const radiusStep = 5
        const angleStep = 0.28

        for (let r = 0; r < maxRadius && !found; r += radiusStep) {
          for (let a = 0; a < Math.PI * 2 && !found; a += angleStep) {
            const x = cx + r * Math.cos(a)
            const y = cy + r * Math.sin(a) * 0.62 // 椭圆形螺旋，贴合横向宽扁的画布比例

            const left = x - halfW
            const right = x + halfW
            const top = y - halfH
            const bottom = y + halfH

            // 必须完整落在画布内，保证句子不被裁切
            if (left < 6 || right > CLOUD_VB_W - 6 || top < 6 || bottom > CLOUD_VB_H - 6) {
              continue
            }

            // 与已放置的文字做碰撞检测，留一点点间距但保持紧密
            const pad = 3
            let overlap = false
            for (const p of placed) {
              if (
                !(right + pad < p.left ||
                  left - pad > p.right ||
                  bottom + pad < p.top ||
                  top - pad > p.bottom)
              ) {
                overlap = true
                break
              }
            }
            if (overlap) continue

            found = { x, y, left, right, top, bottom }
          }
        }

        if (found) {
          placed.push({
            text: phrase.text,
            color: phrase.color,
            fontSize,
            x: found.x,
            y: found.y,
            left: found.left,
            right: found.right,
            top: found.top,
            bottom: found.bottom,
          })
        }
        // 找不到空位就跳过这一句，绝不强行重叠或截断显示
      }

      if (!cancelled) setCloudLayout(placed)
    }

    computeLayout()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <FilmGrainOverlay />
      <main
        className="relative min-h-screen overflow-x-hidden"
        style={{ fontFamily: "var(--font-sans), sans-serif", backgroundColor: "#FAF7F5" }}
      >
        <HeroSection onEggTrigger={() => setEggOpen(true)} scrollY={scrollY} />
        <SpeciesSection />
        <PersonalitySection />
        <SelfConsistentSection onEggTrigger={() => setEggOpen(true)} />

        <section className="relative overflow-hidden py-32 px-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 14%, rgba(245,232,236,0.48) 0%, transparent 18%), radial-gradient(circle at 79% 28%, rgba(247,236,233,0.38) 0%, transparent 16%), radial-gradient(circle at 48% 76%, rgba(255,245,244,0.5) 0%, transparent 20%), linear-gradient(180deg, rgba(250,247,245,1) 0%, rgba(250,242,240,1) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 8px, rgba(230,212,215,0.18) 8px 9px)" }} />
          <div className="fan-messages-petal absolute left-8 top-16 h-16 w-16 rounded-full bg-[#F5E5E6]/80 blur-sm" />
          <div className="fan-messages-petal absolute right-12 top-32 h-20 w-20 rounded-full bg-[#F8E6E9]/80 blur-sm" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.45em] text-[#8F7F82]"
                style={{ letterSpacing: "0.35em" }}
              >
                VOICES OF FANS
              </p>
              <h2
                className="font-serif mx-auto max-w-xl text-[clamp(2rem,4vw,3.8rem)] leading-tight"
                style={{ color: "#1C1C1E", letterSpacing: "0.04em" }}
              >
                猫影留言墙 · VOICES OF FANS
              </h2>
            </div>

            <div className="relative mx-auto w-full max-w-5xl rounded-[3rem] border border-[#D8A7B1]/25 bg-[#FFF2F4]/70 px-8 py-12 shadow-[0_40px_120px_rgba(216,167,177,0.12)]">
              <div className="mx-auto w-full overflow-hidden" style={{ aspectRatio: `${CLOUD_VB_W} / ${CLOUD_VB_H}` }}>
                <svg
                  viewBox={`0 0 ${CLOUD_VB_W} ${CLOUD_VB_H}`}
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {cloudLayout.map((item, index) => (
                    <text
                      key={index}
                      x={item.x}
                      y={item.y}
                      fontSize={item.fontSize}
                      fill={item.color}
                      fontFamily="var(--font-sans), sans-serif"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {item.text}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EasterEggModal open={eggOpen} onClose={() => setEggOpen(false)} />

      <style jsx global>{`
        * { cursor: none !important; }

        /* Reveal animations */
        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.delay-1 { transition-delay: 0.1s; }
        .reveal.delay-2 { transition-delay: 0.22s; }
        .reveal.delay-3 { transition-delay: 0.38s; }
        .reveal.delay-4 { transition-delay: 0.52s; }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* Handwriting reveal */
        .handwrite-reveal {
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .handwrite-reveal.in-view {
          opacity: 1;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FAF7F5; }
        ::-webkit-scrollbar-thumb { background: #D8A7B1; border-radius: 2px; }

        /* Film grain */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(2%, 3%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(3%, -1%); }
          50% { transform: translate(-3%, 1%); }
          60% { transform: translate(1%, -2%); }
          70% { transform: translate(-2%, 3%); }
          80% { transform: translate(2%, -3%); }
          90% { transform: translate(-1%, 1%); }
        }

        @keyframes blink {
          0%, 85%, 100% { scaleY: 1; }
          90%, 92% { transform: scaleY(0.05); }
        }

        @keyframes pupil-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.72); }
        }

        @keyframes float-petal {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }

        @keyframes stamp-in {
          0% { opacity: 0; transform: scale(1.4) rotate(-8deg); }
          60% { opacity: 1; transform: scale(0.95) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .stamp-animate {
          animation: stamp-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .text-cursor::after {
          content: '|';
          animation: cursor-blink 1s step-end infinite;
          color: #D8A7B1;
        }

        .fan-messages-petal {
          animation: float-petal 14s linear infinite;
        }

        .fan-messages-petal:nth-child(1) {
          animation-delay: 0s;
          transform: translate(0, 0) rotate(-15deg);
        }

        .fan-messages-petal:nth-child(2) {
          animation-delay: 4s;
          transform: translate(0, 0) rotate(12deg);
        }
      `}</style>
    </>
  )
}