"use client"

const speciesParams = [
  { label: "观察周期", value: "1994 — 2026 · ongoing", unit: "" },
  { label: "情绪维度", value: "4", unit: "核心维度" },
  { label: "能量状态", value: "自发补给型", unit: "无需外部充能" },
  { label: "社群属性", value: "选择性亲近", unit: "主动建立联结" },
  { label: "稀有指数", value: "SSSR", unit: "极稀有物种" },
  { label: "自洽指数", value: "∞", unit: "趋近完整" },
]

export default function SpeciesSection() {
  return (
    <section
      className="relative py-32 px-6"
      style={{ backgroundColor: "#FAF7F5" }}
    >
      {/* Section label */}
      <div className="mx-auto mb-20 max-w-5xl">
        <div className="reveal flex items-center gap-5 mb-3">
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.4em",
              color: "#8E8E93",
            }}
          >
            02 — SPECIMEN RECORD
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: "#E8D3D8" }} />
        </div>
        <h2
          className="reveal delay-1"
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#1C1C1E",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          猫格档案
        </h2>
        <p
          className="reveal delay-2 mt-3"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            color: "#8E8E93",
          }}
        >
          SPECIES INFORMATION RECORD · FELIS YANGYANG
        </p>
      </div>

      {/* Main archive card */}
      <div className="mx-auto max-w-5xl">
        <div
          className="reveal grid grid-cols-1 gap-0 overflow-hidden md:grid-cols-2"
          style={{
            border: "1px solid #E8D3D8",
            backgroundColor: "rgba(250,247,245,0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 2px 40px rgba(216,167,177,0.12), 0 1px 0 rgba(212,175,55,0.1)",
          }}
        >
          {/* Photo frame */}
          <div
            className="relative flex flex-col items-center justify-center overflow-hidden p-10"
            style={{
              background: "linear-gradient(145deg, #F4E2E5 0%, #E8D3D8 100%)",
              minHeight: 380,
            }}
          >
            {/* Photo placeholder with art filter */}
            <div
              className="relative overflow-hidden"
              style={{
                width: "clamp(180px, 60%, 240px)",
                aspectRatio: "3/4",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 8px 32px rgba(28,28,30,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              {/* Cat silhouette illustration */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(180deg, #D8A7B1 0%, #C49099 60%, #A07080 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Stylized cat SVG */}
                <svg viewBox="0 0 120 160" width="80" height="107" fill="none" style={{ opacity: 0.55 }}>
                  {/* Body */}
                  <ellipse cx="60" cy="110" rx="34" ry="40" fill="#FAF7F5" />
                  {/* Head */}
                  <ellipse cx="60" cy="62" rx="28" ry="25" fill="#FAF7F5" />
                  {/* Ears */}
                  <polygon points="36,46 28,20 50,38" fill="#FAF7F5" />
                  <polygon points="84,46 92,20 70,38" fill="#FAF7F5" />
                  {/* Inner ears */}
                  <polygon points="39,44 33,27 50,39" fill="#E8D3D8" opacity="0.7" />
                  <polygon points="81,44 87,27 70,39" fill="#E8D3D8" opacity="0.7" />
                  {/* Eyes */}
                  <ellipse cx="50" cy="62" rx="6" ry="7" fill="#1C1C1E" />
                  <ellipse cx="70" cy="62" rx="6" ry="7" fill="#1C1C1E" />
                  <ellipse cx="47.5" cy="59.5" rx="2" ry="3" fill="white" opacity="0.7" />
                  <ellipse cx="67.5" cy="59.5" rx="2" ry="3" fill="white" opacity="0.7" />
                  {/* Nose */}
                  <polygon points="60,73 57,77 63,77" fill="#D8A7B1" />
                  {/* Tail */}
                  <path d="M94,140 Q130,130 118,100 Q110,80 100,95" stroke="#FAF7F5" strokeWidth="6" strokeLinecap="round" fill="none" />
                </svg>
                {/* Film overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, transparent 40%, rgba(28,28,30,0.15) 100%)",
                  }}
                />
              </div>
            </div>

            {/* Photo caption */}
            <p
              className="mt-5"
              style={{
                fontFamily: "var(--font-handwriting), cursive",
                fontSize: "0.9rem",
                color: "#8E8E93",
                letterSpacing: "0.05em",
              }}
            >
              specimen · portrait no.1
            </p>

            {/* Corner decoration */}
            <div className="absolute top-5 left-5 flex flex-col gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: i === 0 ? 20 : i === 1 ? 12 : 8,
                    height: 1,
                    backgroundColor: "#D8A7B1",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-5 right-5 flex flex-col items-end gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: i === 0 ? 8 : i === 1 ? 12 : 20,
                    height: 1,
                    backgroundColor: "#D8A7B1",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-between p-10">
            {/* Header */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.4em",
                  color: "#D4AF37",
                  marginBottom: "0.75rem",
                }}
              >
                CLASSIFICATION RECORD
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#1C1C1E",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  lineHeight: 1.25,
                }}
              >
                木子洋<br/>KWIN
              </h3>
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--font-handwriting), cursive",
                  fontSize: "1.1rem",
                  color: "#D8A7B1",
                }}
              >
                Self-Consistent Feline
              </p>

              {/* Divider */}
              <div className="my-6" style={{ height: 1, backgroundColor: "#E8D3D8" }} />

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  lineHeight: 1.8,
                  color: "#8E8E93",
                  letterSpacing: "0.04em",
                }}
              >
                一种极为罕见的猫科人格形态。内在宇宙完整而自洽，同时拥有多元情感维度，
                兼容温柔与力量，感性与理性，在自由与深情之间寻得平衡。
              </p>
            </div>

            {/* Params grid */}
            <div className="mt-8">
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.4em",
                  color: "#8E8E93",
                  marginBottom: "1rem",
                }}
              >
                OBSERVATION PARAMETERS ——
              </div>
              <div className="grid grid-cols-2 gap-4">
                {speciesParams.map((p, i) => (
                  <div key={i} className="flex flex-col">
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.3em",
                        color: "#8E8E93",
                        textTransform: "uppercase",
                      }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="mt-0.5"
                      style={{
                        fontFamily: "var(--font-serif), serif",
                        fontSize: "0.9rem",
                        color: "#1C1C1E",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {p.value}
                    </span>
                    {p.unit && (
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.5rem",
                          color: "#D8A7B1",
                          letterSpacing: "0.15em",
                        }}
                      >
                        {p.unit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Archive stamp area */}
            <div className="mt-8 flex items-end justify-between">
              <span
                style={{
                  fontFamily: "var(--font-handwriting), cursive",
                  fontSize: "0.8rem",
                  color: "#8E8E93",
                  opacity: 0.5,
                }}
              >
                * 档案已审阅 · reviewed
              </span>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  border: "1.5px solid #D8A7B1",
                  opacity: 0.5,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.45rem",
                    letterSpacing: "0.1em",
                    color: "#D8A7B1",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  YANG
                  <br />
                  2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
