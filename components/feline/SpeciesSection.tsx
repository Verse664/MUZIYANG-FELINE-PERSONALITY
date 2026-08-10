"use client"

import Image from "next/image"

const personalInfo = [
  { label: "AGE", value: "保密（永远18岁）" },
  { label: "BIRTHDAY", value: "04/21・金牛座" },
  { label: "HEIGHT", value: "188cm" },
  { label: "IDENTITY", value: "职业偶像 / 坤音娱乐CE2O" },
  { label: "COLOR", value: "噗通粉 Thump Pink" },
  { label: "POSITION", value: "门面 / 全能ACE / 气氛组担当" },
  { label: "EXPERTISE", value: "甜嗓 / 模特步 / 搞笑 / 撒娇" },
]

const skills = [
  { code: "01", title: "反差萌突袭", desc: "快速切换高冷超模脸与软萌甜嗓，瞬间击穿敌方心理防线，造成持续性心动伤害。" },
  { code: "02", title: "可爱绝对吸引", desc: "哪怕狗毛过敏三级警报拉响，在外偶遇猫猫狗狗依然会丧失理智、忍不住上手猛吸；\n家中狗狗「铁牛」与「玉芬」，为爱可抗一切生理反应。" },
  { code: "03", title: "嘴硬心软男子汉", desc: "自称山东传奇好汉，实则对恐怖元素、节肢动物毫无抵抗力，被吓后秒变「捂耳乱窜嗷嗷叫」模式。" },
]

const likes = ["阅读", "舞台", "大海", "独处"]
const dislikes = ["恐怖系", "螃蟹", "突然的安静", "冷暴力"]
const tags = ["天才爱豆", "颜值担当", "抽象梗王", "猫系男友", "小哭包", "醋精"]

const radarStats = [
  { label: "外貌", value: 5.5 },
  { label: "唱功", value: 5 },
  { label: "性格", value: 6 },
  { label: "人气", value: 5 },
  { label: "曼妙", value: 11 },
  { label: "魅力", value: 5 },
]

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
function buildHexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => polarToXY(cx, cy, r, i * 60))
}
function pointsToString(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
}

function RadarChart() {
  const cx = 110
  const cy = 110
  const maxR = 88
  const levels = [1, 2, 3, 4, 5]
  const dataPoints = radarStats.map((s, i) => polarToXY(cx, cy, (s.value / 5) * maxR, i * 60))
  const outerPoints = buildHexPoints(cx, cy, maxR)

  return (
    <svg viewBox="0 0 220 220" className="h-full w-full max-w-[190px]" style={{ overflow: "visible" }}>
      {levels.map((lvl) => (
        <polygon
          key={lvl}
          points={pointsToString(buildHexPoints(cx, cy, (lvl / 5) * maxR))}
          fill="none"
          stroke={lvl === 5 ? "#B4483F" : "#8C6F5E"}
          strokeOpacity={lvl === 5 ? 0.6 : 0.35}
          strokeWidth={lvl === 5 ? 1 : 0.5}
        />
      ))}
      {outerPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#8C6F5E" strokeOpacity={0.3} strokeWidth={0.5} />
      ))}
      <polygon
        points={pointsToString(dataPoints)}
        fill="#C0718A"
        fillOpacity={0.28}
        stroke="#B4483F"
        strokeWidth={1.4}
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.4} fill="#B4483F" />
      ))}
      {radarStats.map((stat, i) => {
        const pos = polarToXY(cx, cy, maxR + 18, i * 60)
        return (
          <text
            key={stat.label}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#5A3A2E"
            style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.05em", fontWeight: 700 }}
          >
            {stat.label}
          </text>
        )
      })}
    </svg>
  )
}

export default function SpeciesSection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-28 sm:py-32"
      style={{
        background: "radial-gradient(circle at 30% 20%, #3B1826 0%, #24101A 55%, #180A11 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "3px 3px" }}
      />
      {/* 中心聚光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "70vw", height: "70vw", maxWidth: 900, maxHeight: 900, background: "radial-gradient(circle, rgba(244,166,184,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* 顶部姓名 + 提示标签 */}
        <div className="mb-10 text-center">
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.5em", color: "#E8B8C4" }}>
            MU ZIYANG · KWIN · CASE FILE
          </p>
          <h2
            className="mt-3"
            style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#F6DCE3", letterSpacing: "0.12em" }}
          >
            木子洋 <span style={{ color: "#B4483F" }}>KWIN</span>
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
              style={{ borderColor: "#C0718A60", color: "#E8B8C4", fontFamily: "var(--font-sans)", fontSize: "0.55rem", letterSpacing: "0.14em" }}
            >
              <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#F4A6B8" }} />
              【系统提示：情报解密中……】
            </span>
            <span
              className="inline-flex items-center rounded-full border px-3 py-1"
              style={{ borderColor: "#B4483F70", color: "#E8998F", fontFamily: "var(--font-sans)", fontSize: "0.55rem", letterSpacing: "0.14em" }}
            >
              【权限确认：允许公开】
            </span>
          </div>
        </div>

        {/* 档案袋主体：斜切纸张 + 打孔线钉 */}
        <div className="relative mx-auto max-w-5xl" style={{ transform: "rotate(-0.6deg)" }}>
          {/* 顶部文件夹标签舌片 */}
          <div
            className="absolute -top-5 left-8 z-20 px-5 py-1.5"
            style={{
              backgroundColor: "#E3B9A8",
              border: "1px solid #C08D74",
              borderBottom: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              color: "#6B4230",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
            }}
          >
            PERSONNEL FILE
          </div>

          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: "#F3DCCF",
              border: "1px solid #C08D74",
              boxShadow: "0 25px 70px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)",
            }}
          >
            {/* 纸纤维纹理 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "repeating-linear-gradient(115deg, #6B4230 0px, transparent 1px, transparent 3px)" }}
            />

            {/* CONFIDENTIAL 印章 */}
            <div
              aria-hidden="true"
              className="absolute right-8 top-8 z-20 select-none"
              style={{
                transform: "rotate(-14deg)",
                border: "3px solid #B4483F",
                color: "#B4483F",
                padding: "6px 14px",
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                opacity: 0.85,
                mixBlendMode: "multiply",
              }}
            >
              CONFIDENTIAL
            </div>

            {/* 上：照片区 + 访问卡 + 个人信息（左）／技能&雷达（右） */}
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[0.85fr_1.15fr]">
              {/* 左页 */}
              <div className="relative border-b p-8 sm:p-10 lg:border-b-0 lg:border-r" style={{ borderColor: "#C08D7480" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8C5A42" }}>
                  CN SPECIAL OPERATIONS · SUBJECT PORTRAIT
                </p>

                <div className="relative mt-4 flex justify-center">
                  {/* 照片主体 */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: "min(240px, 70%)",
                      aspectRatio: "3/4",
                      border: "3px solid #FFFFFF",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
                      transform: "rotate(-1.5deg)",
                    }}
                  >
                    <Image src="/KWINxiaoxiang.jpg" alt="木子洋 KWIN 情报档案照" fill style={{ objectFit: "cover" }} />
                  </div>

                  {/* 访问卡叠加角标 */}
                  <div
                    className="absolute -bottom-3 -right-2 flex flex-col overflow-hidden"
                    style={{
                      width: 96,
                      backgroundColor: "#1C2A3A",
                      border: "1px solid #B4483F80",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                      transform: "rotate(6deg)",
                    }}
                  >
                    <div style={{ backgroundColor: "#B4483F", padding: "3px 6px" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.36rem", letterSpacing: "0.1em", color: "#F6DCE3" }}>
                        ACCESS CARD
                      </p>
                    </div>
                    <div className="px-2 py-2">
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.4rem", color: "#E8B8C4", letterSpacing: "0.06em" }}>
                        Mu ZiYang
                      </p>
                    </div>
                  </div>
                </div>

                {/* DOPE CARD 风格个人信息表 */}
                <div className="mt-8">
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8C5A42", marginBottom: "0.5rem" }}>
                    DOPE CARD · 个人信息
                  </p>
                  <div className="border" style={{ borderColor: "#C08D7460" }}>
                    {personalInfo.map((item, i) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between px-3 py-1.5"
                        style={{
                          borderTop: i === 0 ? "none" : "1px dashed #C08D7460",
                          backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.25)" : "transparent",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#8C5A42" }}>
                          {item.label}
                        </span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#3D2418", fontWeight: 600, textAlign: "right" }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右页：雷达图 + 情报摘要 + 技能 */}
              <div className="p-8 sm:p-10">
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8C5A42" }}>
                  MARKSMAN CAPABILITY ASSESSMENT · 六维评估
                </p>

                <div className="mt-4 flex flex-col items-center gap-2 border p-4" style={{ borderColor: "#C08D7460", backgroundColor: "rgba(255,255,255,0.3)" }}>
                  <RadarChart />
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.44rem", letterSpacing: "0.2em", color: "#8C5A42" }}>
                    满分 5 · SIX-AXIS
                  </p>
                </div>

                <div className="mt-6" style={{ borderLeft: "2px solid #B4483F", paddingLeft: "0.9rem" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", letterSpacing: "0.28em", color: "#B4483F", marginBottom: "0.4rem" }}>
                    INTEL SUMMARY · 情报摘要
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", lineHeight: 1.85, color: "#3D2418" }}>
                    本局侦察所得，该猫探长系极为罕见的猫科人格形态。
                    冷冽气场与柔软本心，热烈张扬与沉静内敛，浪漫感性与理智清醒，种种相悖气质在其身上自然相融。
                    兼具温柔底色与硬核力量，拿捏住感性与理性的边界，在随性自在与满腔赤诚之间守住恰到好处的平衡。
                  </p>
                </div>

                <div className="mt-6">
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8C5A42", marginBottom: "0.6rem" }}>
                    WEAPONS · 技能
                  </p>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.code} className="flex gap-3 border p-2.5" style={{ borderColor: "#C08D7450", backgroundColor: "rgba(255,255,255,0.25)" }}>
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: "#B4483F", color: "#F6DCE3", fontFamily: "var(--font-sans)", fontSize: "0.5rem", fontWeight: 700 }}
                        >
                          {skill.code}
                        </span>
                        <div>
                          <p style={{ fontFamily: "var(--font-serif), serif", fontSize: "0.78rem", color: "#3D2418", fontWeight: 700 }}>
                            {skill.title}
                          </p>
                          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.66rem", lineHeight: 1.6, color: "#6B4230", marginTop: 2, whiteSpace: "pre-wrap" }}>
                            {skill.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 撕边分隔线 */}
            <div
              aria-hidden="true"
              className="h-3 w-full"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, transparent 45%, #F3DCCF 45%, #F3DCCF 55%, transparent 55%), linear-gradient(-135deg, transparent 45%, #F3DCCF 45%, #F3DCCF 55%, transparent 55%)",
                backgroundSize: "14px 14px",
                backgroundColor: "#24101A",
              }}
            />

            {/* 下：喜好 / 雷区 / TAG */}
            <div className="grid grid-cols-1 gap-0 border-t sm:grid-cols-2" style={{ borderColor: "#C08D7480" }}>
              <div className="border-b p-8 sm:border-b-0 sm:border-r sm:p-10" style={{ borderColor: "#C08D7480" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#B4483F", marginBottom: "0.6rem" }}>
                  LIKES · 喜好
                </p>
                <div className="flex flex-wrap gap-2">
                  {likes.map((item) => (
                    <span
                      key={item}
                      className="border px-3 py-1"
                      style={{ borderColor: "#B4483F60", color: "#8C3A2F", fontFamily: "var(--font-sans)", fontSize: "0.68rem", backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#5A5A5D", marginTop: "1.5rem", marginBottom: "0.6rem" }}>
                  DISLIKES · 雷区
                </p>
                <div className="flex flex-wrap gap-2">
                  {dislikes.map((item) => (
                    <span
                      key={item}
                      className="border px-3 py-1"
                      style={{ borderColor: "#6B6B6E50", color: "#5A5A5D", fontFamily: "var(--font-sans)", fontSize: "0.68rem", backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8C5A42", marginBottom: "0.8rem" }}>
                  TAG · 标签
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {tags.map((tag, i) => (
                    <span key={tag} className="flex items-center gap-3">
                      <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "0.8rem", color: "#3D2418", letterSpacing: "0.06em" }}>
                        {tag}
                      </span>
                      {i < tags.length - 1 && <span style={{ color: "#B4483F", opacity: 0.5 }}>|</span>}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "#C08D7460" }}>
                  <span style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "0.75rem", color: "#8C5A42", opacity: 0.7 }}>
                    * 本份情报已审阅 · reviewed
                  </span>
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 48, height: 48, border: "1.5px solid #B4483F", opacity: 0.75, position: "relative" }}
                  >
                    <div style={{ position: "absolute", inset: 3, border: "0.5px solid #B4483F", borderRadius: "50%", opacity: 0.6 }} />
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.34rem", letterSpacing: "0.1em", color: "#B4483F", textAlign: "center", lineHeight: 1.4, zIndex: 1 }}>
                      情报局
                      <br />
                      2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 装订孔 */}
          <div className="pointer-events-none absolute -left-2 top-6 flex flex-col gap-8">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: "#180A11", boxShadow: "inset 0 0 0 1px #C08D7460" }} />
            ))}
          </div>
        </div>

        {/* 底部案号 */}
        <p
          className="mt-10 text-center"
          style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#7A4456" }}
        >
          CASE NO. 2026-YANG · FELINE INTELLIGENCE BUREAU
        </p>
      </div>
    </section>
  )
}