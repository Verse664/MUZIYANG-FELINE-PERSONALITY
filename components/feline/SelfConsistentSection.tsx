"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

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

// 无框终端文字：等宽字体 + 故障闪烁，去掉行号和卡片背景，直接漂浮在页面上
function TerminalText({
  lines,
  visible,
  showCursor = false,
}: {
  lines: string[]
  visible: boolean
  showCursor?: boolean
}) {
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)
  const [cursorOn, setCursorOn] = useState(true)

  useEffect(() => {
    if (!showCursor) return
    const blink = window.setInterval(() => setCursorOn((v) => !v), 480)
    return () => window.clearInterval(blink)
  }, [showCursor])

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
      className="mx-auto max-w-md space-y-1.5 text-center font-mono"
      style={{
        fontSize: "0.72rem",
        lineHeight: 1.95,
        transform: glitchActive ? `translateX(${glitchOffset}px)` : "translateX(0)",
        transition: glitchActive ? "none" : "transform 120ms ease-out",
      }}
    >
      {lines.map((line, i) => {
        const isQuoteLine = /truth is/i.test(line)
        const isLast = i === lines.length - 1
        return (
          <p key={i} className="flex flex-wrap items-baseline justify-center gap-2">
            <span
              style={{
                color: isQuoteLine ? "#D4AF37" : "#6B4230",
                fontStyle: isQuoteLine ? "italic" : "normal",
                fontSize: isQuoteLine ? "1.35rem" : undefined,
                fontWeight: isQuoteLine ? 700 : 500,
                letterSpacing: isQuoteLine ? "0.08em" : undefined,
                lineHeight: isQuoteLine ? 1.4 : undefined,
                textShadow: glitchActive
                  ? "1px 0 rgba(180,72,63,0.7), -1px 0 rgba(212,175,55,0.6), 0 0 12px rgba(212,175,55,0.45)"
                  : "0 0 12px rgba(212,175,55,0.22)",
              }}
            >
              {line}
            </span>
            {!isQuoteLine ? <span style={{ color: "#B99B7A" }}>OK</span> : null}
            {showCursor && isLast ? (
              <span
                className="inline-block h-3.5 w-1.5 align-middle"
                style={{ backgroundColor: "#B4483F", opacity: cursorOn ? 1 : 0 }}
              />
            ) : null}
          </p>
        )
      })}
    </div>
  )
}

// 猫探长头像：黑猫铺满整个圆形按钮，保持清晰可见，解密进行中强化故障效果
function CatAvatarGlitch({ intense }: { intense: boolean }) {
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

  const active = glitchActive || intense

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-full"
      style={{
        backgroundColor: "#FAF7F5",
        transform: active
          ? `translateX(${intense ? (Math.random() - 0.5) * 3 : glitchOffset}px)`
          : "translateX(0)",
        transition: active
          ? "none"
          : "transform 140ms ease-out",
      }}
    >
      <Image
        src="/blackcat.png"
        alt="猫探长情报局徽标"
        fill
        sizes="108px"
        className="object-contain"
        style={{
          opacity: 1,
          transform: "scale(1.16)",
        }}
      />

      {active ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-multiply"
            style={{
              backgroundColor: "rgba(180,72,63,0.08)",
              transform: `translateX(${(intense ? 2 : glitchOffset) * 1.2}px)`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-screen"
            style={{
              backgroundColor: "rgba(111,227,217,0.06)",
              transform: `translateX(${(intense ? -2 : -glitchOffset) * 1.1}px)`,
            }}
          />
        </>
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(28,28,30,0.10) 0px, transparent 1px, transparent 4px)",
          opacity: active ? 0.16 : 0.05,
        }}
      />
    </div>
  )
}

// 解密进度环按钮：黑猫铺满圆形按钮 + 文字浮在黑猫上方 → 点击后扫描解锁动效 → 触发弹窗
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
      className="relative flex items-center justify-center overflow-hidden rounded-full outline-none"
      style={{
        width: size,
        height: size,
        backgroundColor: "#FAF7F5",
        border: "none",
        cursor: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* 黑猫：现在直接占据整个圆形按钮 */}
      <CatAvatarGlitch intense={decrypting} />

      {/* 原来的金色进度环保持不变 */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D4AF3735"
          strokeWidth={strokeWidth}
        />

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

      {/* 原来的金色光晕保留，但放到黑猫下面、文字上面 */}
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none z-10"
        style={{
          width: size - 26,
          height: size - 26,
          background:
            "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)",
          animation: decrypting ? "none" : "glow-pulse 3s ease-in-out infinite",
        }}
      />

      {/* 中文文字：直接浮在黑猫图片中央 */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <span
          style={{
            fontFamily:
              'var(--font-serif), "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif',
            fontSize: decrypting ? "0.72rem" : "0.76rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#f089b2",
            whiteSpace: "nowrap",
            textShadow: "0 1px 2px rgba(250,247,245,0.95)",
            animation: decrypting
              ? "decrypt-text-flicker 0.9s steps(5, end) forwards"
              : "none",
          }}
        >
          {decrypting ? "解密中" : "点击解密"}
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
            BUREAU FILE · 03 · FINAL SEAL
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

        {/* 开场：无框终端文字 */}
        <div className="mb-16">
          <TerminalText
            lines={["【系统提示：最终观测报告生成中……】", "【权限确认：绝密档案解封】"]}
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
          <span className="block">木经岁寒，拆卷宗以阅万千侧写；</span>
          <span className="block">子夜微光，合坐标而定唯一归程；</span>
          <span className="block">洋波入定，任猫格流转皆为此身。</span>
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
          MuZiyang · 木子洋
        </p>

        {/* 五色归档索引 */}
        <div className="mx-auto mt-16 flex max-w-md items-center gap-3">
          <span style={{ flex: 1, height: "0.5px", background: "linear-gradient(90deg, transparent, #D4AF3760)" }} />
          <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 px-2">
            {fusionPersonalities.map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block rounded-full"
                  style={{ width: 6, height: 6, backgroundColor: p.color, boxShadow: `0 0 4px ${p.color}90` }}
                />
                <span className="font-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.1em", color: "#6A4551" }}>
                  {p.label}
                </span>
              </span>
            ))}
          </div>
          <span style={{ flex: 1, height: "0.5px", background: "linear-gradient(90deg, #D4AF3760, transparent)" }} />
        </div>

        {/* 收尾：无框终端文字（日志 + 英文题眼归并在同一组），光标只出现在此处最后一行 */}
        <div
          className="mt-16"
          style={{
            opacity: closingVisible ? 1 : 0,
            transform: closingVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1.1s ease, transform 1.1s ease",
          }}
        >
          <TerminalText
            lines={["【系统提示：目标人物观测日志已永久存档。】", "The only truth is MU ZIYANG."]}
            visible={closingVisible}
            showCursor
          />
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
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -${2 * Math.PI * 51};
          }
        }

        @keyframes decrypt-progress {
          from {
            stroke-dashoffset: ${2 * Math.PI * 51};
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes decrypt-text-flicker {
          0%, 100% {
            opacity: 1;
          }

          20%, 60% {
            opacity: 0.3;
          }

          40%, 80% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}