"use client"

import { useEffect, useRef, useState } from "react"

interface SelfConsistentSectionProps {
  onEggTrigger: () => void
}

const fusionPersonalities = [
  { label: "曼妙", color: "#D8A7B1" },
  { label: "温柔", color: "#A77E91" },
  { label: "捣蛋", color: "#BA8FA0" },
  { label: "担当", color: "#9E7186" },
  { label: "傲娇", color: "#C0718A" },
]

// 浅色版终端卡片：等宽字体 + 行号 + OK 标签 + 故障闪烁
function TerminalCard({
  lines,
  visible,
}: {
  lines: string[]
  visible: boolean
}) {
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const blink = window.setInterval(() => setShowCursor((v) => !v), 480)
    return () => window.clearInterval(blink)
  }, [])

  useEffect(() => {
    if (!visible) return
    const glitchLoop = window.setInterval(() => {
      if (Math.random() < 0.3) {
        setGlitchActive(true)
        setGlitchOffset((Math.random() - 0.5) * 5)
        window.setTimeout(() => {
          setGlitchActive(false)
          setGlitchOffset(0)
        }, 80 + Math.random() * 100)
      }
    }, 1100)
    return () => window.clearInterval(glitchLoop)
  }, [visible])

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-lg border px-5 py-4 text-left"
      style={{
        borderColor: "#D4AF3760",
        backgroundColor: "#FBF5EE",
        boxShadow: "0 6px 24px rgba(196,140,60,0.1)",
        transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
        transition: glitchActive ? "none" : "transform 120ms ease-out",
      }}
    >
      {/* 扫描线纹理 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #6B4230 0px, transparent 1px, transparent 3px)",
          opacity: glitchActive ? 0.1 : 0.045,
          transition: "opacity 90ms ease-out",
        }}
      />
      {/* 故障色差闪 */}
      {glitchActive ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2"
          style={{ height: "1.5px", backgroundColor: "rgba(180,72,63,0.4)", transform: `translateY(${glitchOffset}px)` }}
        />
      ) : null}

      <div className="relative flex items-center gap-2" style={{ marginBottom: "0.6rem" }}>
        <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#B4483F" }} />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", letterSpacing: "0.24em", color: "#B4483F" }}>
          ARCHIVE LOG
        </span>
      </div>

      <div className="relative space-y-1.5 font-mono" style={{ fontSize: "0.72rem", lineHeight: 1.9 }}>
        {lines.map((line, i) => (
          <p key={i} className="flex flex-wrap items-baseline gap-2">
            <span style={{ color: "#B99B7A" }}>[{String(i + 1).padStart(2, "0")}]</span>
            <span
              style={{
                color: "#6B4230",
                textShadow: glitchActive ? "1px 0 rgba(180,72,63,0.5), -1px 0 rgba(212,175,55,0.4)" : "none",
              }}
            >
              {line}
            </span>
            <span style={{ color: "#B99B7A" }}>OK</span>
          </p>
        ))}
        <p className="flex items-center gap-1 pt-0.5">
          <span
            className="inline-block h-3.5 w-1.5 align-middle"
            style={{ backgroundColor: "#B4483F", opacity: showCursor ? 1 : 0 }}
          />
        </p>
      </div>
    </div>
  )
}

// 解密进度环按钮：呼吸光效 → 点击后扫描解锁动效 → 触发弹窗
function DecryptButton({ onTrigger, visible }: { onTrigger: () => void; visible: boolean }) {
  const [decrypting, setDecrypting] = useState(false)

  const handleClick = () => {
    if (decrypting) return
    setDecrypting(true)
    window.setTimeout(() => {
      onTrigger()
      window.setTimeout(() => setDecrypting(false), 400)
    }, 900)
  }

  const size = 108
  const strokeWidth = 2
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <button
      onClick={handleClick}
      data-clickable
      aria-label="点击解密，查看情报局深层档案"
      className="relative flex items-center justify-center outline-none"
      style={{
        width: size,
        height: size,
        background: "none",
        border: "none",
        cursor: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        {/* 底环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D4AF3735"
          strokeWidth={strokeWidth}
        />
        {/* 呼吸光效外圈（未解密时） */}
        {!decrypting ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.28} ${circumference}`}
            style={{
              transformOrigin: "center",
              animation: "decrypt-idle-spin 4.5s linear infinite",
            }}
          />
        ) : (
          /* 解密中：进度环快速转一圈 */
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#B4483F"
            strokeWidth={strokeWidth + 0.5}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            style={{
              transformOrigin: "center",
              transform: "rotate(-90deg)",
              animation: "decrypt-progress 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          />
        )}
      </svg>

      {/* 中心呼吸光晕 */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: size - 26,
          height: size - 26,
          background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
          animation: decrypting ? "none" : "glow-pulse 3s ease-in-out infinite",
        }}
      />

      {/* 中心文字 */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span
          className="font-mono"
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            color: decrypting ? "#B4483F" : "#B4483F",
            opacity: decrypting ? [1, 0.3, 1, 0.3, 1][0] : 1,
            animation: decrypting ? "decrypt-text-flicker 0.9s steps(5, end) forwards" : "none",
          }}
        >
          {decrypting ? "解密中" : "DECRYPT"}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: "0.46rem", letterSpacing: "0.12em", color: "#B99B7A" }}
        >
          {decrypting ? "..." : "点击解密"}
        </span>
      </div>
    </button>
  )
}

export default function SelfConsistentSection({ onEggTrigger }: SelfConsistentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [closingVisible, setClosingVisible] = useState(false)
  const [buttonVisible, setButtonVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          setTimeout(() => setClosingVisible(true), 1100)
          setTimeout(() => setButtonVisible(true), 1700)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 px-6"
      style={{ backgroundColor: "#FAF7F5" }}
    >
      {/* 档案纸底纹 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1C1C1E 0px, transparent 1px, transparent 32px, #1C1C1E 32px, transparent 33px)",
        }}
      />
      {/* 金色光晕 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: "min(600px, 80vw)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
      </div>
      {/* 放射线纹理 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025]">
        <svg viewBox="0 0 400 400" width="min(400px, 80vw)" height="min(400px, 80vw)">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180
            const x2 = parseFloat((200 + 200 * Math.cos(angle)).toFixed(4))
            const y2 = parseFloat((200 + 200 * Math.sin(angle)).toFixed(4))
            return <line key={i} x1="200" y1="200" x2={x2} y2={y2} stroke="#1C1C1E" strokeWidth="0.5" />
          })}
        </svg>
      </div>

      <div
        className="relative z-10 mx-auto max-w-2xl text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        {/* 区块标识 */}
        <div className="mb-6 flex items-center justify-center gap-5">
          <span style={{ flex: 1, maxWidth: 70, height: "0.5px", background: "linear-gradient(90deg, transparent, #D4AF37)", opacity: 0.5 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.4em", color: "#D4AF37" }}>
            BUREAU FILE · 04 · FINAL SEAL
          </span>
          <span style={{ flex: 1, maxWidth: 70, height: "0.5px", background: "linear-gradient(90deg, #D4AF37, transparent)", opacity: 0.5 }} />
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#1C1C1E",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          情报归档
        </h2>
        <p className="mt-3 mb-14" style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", letterSpacing: "0.25em", color: "#8E8E93" }}>
          BUREAU CLOSURE · FINAL DOSSIER
        </p>

        {/* 开场：终端卡片 */}
        <div className="mb-16">
          <TerminalCard
            lines={["最终观测报告生成中......", "权限确认：绝密档案解封"]}
            visible={visible}
          />
        </div>

        {/* 正文诗句 */}
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(0.98rem, 2vw, 1.15rem)",
            lineHeight: 2.5,
            color: "#3C3C3E",
            letterSpacing: "0.06em",
          }}
        >
          <span className="block">五份卷宗，五种模样。</span>
          <span className="block">曼妙、温柔、捣蛋、担当、傲娇。</span>
          <span className="block mt-5">拆开看，是五段互不相同的侧写；</span>
          <span className="block">合起来看，却只指向同一个坐标。</span>
        </div>

        {/* 核心句 */}
        <p
          className="mt-10"
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
            color: "#D8A7B1",
            letterSpacing: "0.1em",
            fontWeight: 700,
          }}
        >
          万千猫格，皆是洋洋。
        </p>

        {/* 五色归档索引：分隔线中嵌入带标签的图例 */}
        <div className="mx-auto mt-16 flex max-w-md items-center gap-3">
          <span style={{ flex: 1, height: "0.5px", background: "linear-gradient(90deg, transparent, #D4AF3760)" }} />
          <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 px-2">
            {fusionPersonalities.map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block rounded-full"
                  style={{ width: 6, height: 6, backgroundColor: p.color, boxShadow: `0 0 4px ${p.color}90` }}
                />
                <span
                  className="font-mono"
                  style={{ fontSize: "0.58rem", letterSpacing: "0.1em", color: "#6A4551" }}
                >
                  {p.label}
                </span>
              </span>
            ))}
          </div>
          <span style={{ flex: 1, height: "0.5px", background: "linear-gradient(90deg, #D4AF3760, transparent)" }} />
        </div>

        {/* 收尾：终端卡片 + 英文题眼 */}
        <div
          className="mt-16"
          style={{
            opacity: closingVisible ? 1 : 0,
            transform: closingVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1.1s ease, transform 1.1s ease",
          }}
        >
          <TerminalCard
            lines={["目标人物观测日志已永久封存."]}
            visible={closingVisible}
          />
          <p
            className="mt-6"
            style={{
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              color: "#D4AF37",
              letterSpacing: "0.06em",
            }}
          >
            The only truth is MU ZIYANG.
          </p>
        </div>

        {/* 解密进度环按钮 */}
        <div className="mt-16 flex flex-col items-center">
          <DecryptButton onTrigger={onEggTrigger} visible={buttonVisible} />
          <p className="mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8E8E93", opacity: 0.6 }}>
            ↑ 档案未解 · 点击解密查看深层情报
          </p>
        </div>

        {/* Footer */}
        <p className="mt-14" style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#8E8E93", opacity: 0.4 }}>
          FELINE INTELLIGENCE BUREAU · CASE NO. 2026-YANG · 5 DOSSIERS FILED
        </p>
      </div>

      <style jsx>{`
        @keyframes decrypt-idle-spin {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -${2 * Math.PI * 51}; }
        }
        @keyframes decrypt-progress {
          from { stroke-dashoffset: ${2 * Math.PI * 51}; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes decrypt-text-flicker {
          0%, 100% { opacity: 1; }
          20%, 60% { opacity: 0.3; }
          40%, 80% { opacity: 1; }
        }
      `}</style>
    </section>
  )
}