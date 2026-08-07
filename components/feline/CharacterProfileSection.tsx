"use client"

import Image from "next/image";
import React from "react";

// 六维雷达图数据：数值区间 0-5，按顶部开始顺时针排列
const radarStats = [
  { label: "外貌", value: 5 },
  { label: "唱功", value: 4.5 },
  { label: "性格", value: 5 },
  { label: "人气", value: 5 },
  { label: "反差", value: 5 },
  { label: "魅力", value: 4.5 },
];

const personalInfo = [
  { label: "年龄 / AGE", value: "保密（永远18岁）" },
  { label: "生日 / BIRTHDAY", value: "04/21（金牛座）" },
  { label: "身高 / HEIGHT", value: "188cm" },
  { label: "身份 / IDENTITY", value: "职业偶像 / 坤音娱乐CE2O" },
  { label: "应援色 / COLOR", value: "噗通粉 Thump Pink" },
  { label: "位置 / POSITION", value: "门面 / Rapper / 气氛组担当" },
  { label: "擅长领域 / EXPERTISE", value: "甜嗓 / 模特步 / 搞笑 / 撒娇" },
];

const skills = [
  {
    dot: "#C0718A",
    title: "反差萌突袭",
    desc: "快速切换高冷超模脸与软萌甜嗓，瞬间击穿敌方心理防线，造成持续性心动伤害。",
  },
  {
    dot: "#9E7186",
    title: "社交黏人术",
    desc: "进入无边界感状态，对队友发起高频肢体接触（摸头、拥抱），提升团队亲密度并回复自身能量。",
  },
  {
    dot: "#D4AF37",
    title: "嘴硬心软男子汉",
    desc: "自称山东传奇好汉，实则对恐怖元素、节肢动物毫无抵抗力，被吓后秒变\"弟弟抱紧我\"模式。",
  },
];

const likes = ["甜点", "舞台", "哥哥弟弟们"];
const dislikes = ["恐怖系", "螃蟹", "突然的安静", "未知的「新人」", "冷暴力"];
const tags = ["天才爱豆", "颜值担当", "抽象梗王", "猫系男友", "小哭包", "醋精"];

// 极简的极坐标到 XY 计算（顶部为 0°，顺时针）
function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildHexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => polarToXY(cx, cy, r, i * 60));
}

function pointsToString(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function RadarChart() {
  const cx = 140;
  const cy = 140;
  const maxR = 92; // 稍微小一点
  const levels = [1, 2, 3, 4, 5];

  const dataPoints = radarStats.map((stat, i) => polarToXY(cx, cy, (stat.value / 5) * maxR, i * 60));
  const outerPoints = buildHexPoints(cx, cy, maxR);

  return (
    <svg viewBox="0 0 280 280" className="h-full w-full max-w-[260px]">
      <defs>
        <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4A6B8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F4A6B8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={maxR + 8} fill="url(#pinkGlow)" />

      {/* 同心六边形网格 */}
      {levels.map((lvl) => (
        <polygon
          key={lvl}
          points={pointsToString(buildHexPoints(cx, cy, (lvl / 5) * maxR))}
          fill="none"
          stroke={lvl === 5 ? "#D4AF37" : "#C0718A"}
          strokeOpacity={lvl === 5 ? 0.6 : 0.28}
          strokeWidth={lvl === 5 ? 1.2 : 0.6}
        />
      ))}

      {/* 中心到顶点的射线 */}
      {outerPoints.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="#C0718A"
          strokeOpacity={0.18}
          strokeWidth={0.6}
        />
      ))}

      {/* 数据多边形 */}
      <polygon
        points={pointsToString(dataPoints)}
        fill="#F4A6B8"
        fillOpacity={0.22}
        stroke="#F4A6B8"
        strokeWidth={1.6}
        style={{ filter: "drop-shadow(0 0 6px rgba(244,166,184,0.6))" }}
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.2} fill="#F4A6B8" style={{ filter: "drop-shadow(0 0 4px rgba(244,166,184,0.8))" }} />
      ))}

      {/* 轴标签 */}
      {radarStats.map((stat, i) => {
        const labelPos = polarToXY(cx, cy, maxR + 18, i * 60);
        return (
          <text
            key={stat.label}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F6DCE3"
            style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.06em", fontWeight: 700 }}
          >
            {stat.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function CharacterProfileSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-32" style={{ backgroundColor: "#FAF7F5" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1C1C1E 0px, transparent 1px, transparent 32px, #1C1C1E 32px, transparent 33px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-5">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "#D4AF37" }}>
            BUREAU FILE · 03
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: "#D4AF37", opacity: 0.3 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8E8E93" }}>
            CHARACTER INTRODUCTION
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#1C1C1E",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          木子洋 <span style={{ color: "#C0718A" }}>/ Mu ZiYang</span>
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
            style={{ borderColor: "#A65D7360", color: "#8E465D", fontFamily: "var(--font-sans)", fontSize: "0.55rem", letterSpacing: "0.14em" }}
          >
            <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#C0718A" }} />
            【系统提示：情报解密中……】
          </span>
          <span
            className="inline-flex items-center rounded-full border px-3 py-1"
            style={{ borderColor: "#D4AF3760", color: "#9C7A2E", fontFamily: "var(--font-sans)", fontSize: "0.55rem", letterSpacing: "0.14em" }}
          >
            【权限确认：允许公开】
          </span>
        </div>

        <div
          className="mt-12 overflow-hidden"
          style={{
            border: "1px solid #C8A87A",
            backgroundColor: "rgba(253,250,244,0.95)",
            boxShadow: "0 2px 40px rgba(212,175,55,0.1), 4px 4px 0 rgba(212,175,55,0.08)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-2" style={{ backgroundColor: "#1C1C1E", borderBottom: "1px solid #D4AF37" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.5em", color: "#D4AF37", fontWeight: 700 }}>
              [ CLASSIFIED · FELINE INTELLIGENCE BUREAU ]
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#8E8E93" }}>
              CASE NO. 2026-YANG-02
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* 左侧：肖像保留（使用现有图片）+ 雷达（在照片下方或侧边） */}
            <div className="flex flex-col items-center justify-center px-6 py-8" style={{ background: "linear-gradient(165deg, #2A1219 0%, #3B1826 55%, #2A1219 100%)", borderRight: "1px solid rgba(212,175,55,0.2)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.35em", color: "#E8B8C4", marginBottom: "0.75rem" }}>
                SUBJECT PORTRAIT
              </p>
              <div style={{ width: 160, aspectRatio: "3/4", border: "2px solid rgba(212,175,55,0.24)", boxShadow: "0 8px 28px rgba(0,0,0,0.18)", overflow: "hidden", position: 'relative' }}>
                <Image src="/KWINxiaoxiang.jpg" alt="木子洋 KWIN 情报档案照" fill style={{ objectFit: "cover" }} />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div style={{ width: 140, height: 140 }}>
                  <RadarChart />
                </div>
              </div>
            </div>

            {/* 右侧：个人信息 */}
            <div className="p-10">
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#D4AF37", marginBottom: "1rem" }}>
                个人信息 · PERSONAL INFORMATION
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {personalInfo.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      borderLeft: i % 2 === 0 ? "1px solid rgba(212,175,55,0.25)" : "1px solid rgba(216,167,177,0.25)",
                      paddingLeft: "0.75rem",
                    }}
                  >
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.47rem", letterSpacing: "0.2em", color: "#8E8E93", textTransform: "uppercase" }}>
                      {item.label}
                    </p>
                    <p className="mt-0.5" style={{ fontFamily: "var(--font-serif), serif", fontSize: "0.85rem", color: "#1C1C1E", fontWeight: 600 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-10 py-8" style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#D4AF37", marginBottom: "1.25rem" }}>
              技能 · SKILLS
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {skills.map((skill) => (
                <div key={skill.title} className="rounded-sm border p-4" style={{ borderColor: "rgba(212,175,55,0.25)", backgroundColor: "rgba(244,226,229,0.35)" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: skill.dot, boxShadow: `0 0 6px ${skill.dot}` }} />
                    <p style={{ fontFamily: "var(--font-serif), serif", fontSize: "0.85rem", color: "#1C1C1E", fontWeight: 600 }}>{skill.title}</p>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", lineHeight: 1.75, color: "#5A5A5D" }}>{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 px-10 py-8 sm:grid-cols-2" style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#D4AF37", marginBottom: "0.75rem" }}>
                喜好 · LIKES
              </p>
              <div className="flex flex-wrap gap-2">
                {likes.map((item) => (
                  <span key={item} className="rounded-full border px-3 py-1" style={{ borderColor: "#C0718A50", color: "#8E465D", fontFamily: "var(--font-sans)", fontSize: "0.68rem" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#8E8E93", marginBottom: "0.75rem" }}>
                雷区 · DISLIKES
              </p>
              <div className="flex flex-wrap gap-2">
                {dislikes.map((item) => (
                  <span key={item} className="rounded-full border px-3 py-1" style={{ borderColor: "#8E8E9350", color: "#6B6B6E", fontFamily: "var(--font-sans)", fontSize: "0.68rem" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="px-10 py-8" style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", letterSpacing: "0.4em", color: "#D4AF37", marginBottom: "0.75rem" }}>
              TAG · 标签
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-3">
                  <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "0.8rem", color: "#1C1C1E", letterSpacing: "0.06em" }}>{tag}</span>
                  {i < tags.length - 1 && <span style={{ color: "#D4AF37", opacity: 0.5 }}>|</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-10 py-6" style={{ borderTop: "1px solid rgba(212,175,55,0.2)", backgroundColor: "rgba(244,226,229,0.2)" }}>
            <span style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "0.78rem", color: "#8E8E93", opacity: 0.6 }}>* 本份情报已审阅 · reviewed</span>
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, border: "1.5px solid #D4AF37", opacity: 0.6, position: "relative" }}>
              <div style={{ position: "absolute", inset: 4, border: "0.5px solid #D4AF37", borderRadius: "50%", opacity: 0.5 }} />
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.38rem", letterSpacing: "0.1em", color: "#D4AF37", textAlign: "center", lineHeight: 1.5, zIndex: 1 }}>
                情报局
                <br />
                2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
