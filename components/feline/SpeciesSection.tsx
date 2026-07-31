"use client"

import Image from "next/image";

const speciesParams = [
  { label: "侦察周期", value: "1994 — 2026 · 持续观测", unit: "ongoing" },
  { label: "情绪维度", value: "4", unit: "已解锁核心维度" },
  { label: "能量补给", value: "自发充能型", unit: "无需外源介入" },
  { label: "社群属性", value: "选择性亲近", unit: "主动建立情报网" },
  { label: "稀有级别", value: "SSSR", unit: "极稀有猫型探长" },
  { label: "自洽指数", value: "∞", unit: "趋近完整" },
]

export default function SpeciesSection() {
  return (
    <section
      className="relative py-32 px-6"
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

      {/* Section label */}
      <div className="mx-auto mb-20 max-w-5xl">
        <div className="reveal flex items-center gap-5 mb-3">
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              letterSpacing: "0.4em",
              color: "#D4AF37",
            }}
          >
            BUREAU FILE · 01
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: "#D4AF37", opacity: 0.3 }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
              color: "#8E8E93",
            }}
          >
            PUBLIC INTEL · OPEN ACCESS
          </span>
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
          公开情报
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
          DECLASSIFIED · FELIS YANGYANG · SPECIMEN DOSSIER
        </p>
      </div>

      {/* Main archive card */}
      <div className="mx-auto max-w-5xl">
        <div
          className="reveal grid grid-cols-1 gap-0 overflow-hidden md:grid-cols-2"
          style={{
            border: "1px solid #C8A87A",
            backgroundColor: "rgba(253,250,244,0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 2px 40px rgba(212,175,55,0.1), 4px 4px 0 rgba(212,175,55,0.08), inset 0 0 0 6px rgba(212,175,55,0.04)",
          }}
        >
          {/* 档案顶部机密横幅 */}
          <div
            className="col-span-full flex items-center justify-between px-6 py-2"
            style={{
              backgroundColor: "#1C1C1E",
              borderBottom: "1px solid #D4AF37",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.5rem",
                letterSpacing: "0.5em",
                color: "#D4AF37",
                fontWeight: 700,
              }}
            >
              [ CLASSIFIED · FELINE INTELLIGENCE BUREAU ]
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.5rem",
                letterSpacing: "0.3em",
                color: "#8E8E93",
              }}
            >
              CASE NO. 2026-YANG
            </span>
          </div>

          {/* Photo frame */}
          <div
            className="relative flex flex-col items-center justify-center overflow-hidden p-10"
            style={{
              background: "linear-gradient(145deg, #F4E2E5 0%, #E8D3D8 100%)",
              minHeight: 380,
              borderRight: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            {/* 档案号水印 */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-30deg)",
                fontFamily: "var(--font-sans)",
                fontSize: "4rem",
                letterSpacing: "0.3em",
                color: "#D8A7B1",
                opacity: 0.07,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              KWIN
            </div>

            <div
              className="relative overflow-hidden"
              style={{
                width: "clamp(180px, 60%, 240px)",
                aspectRatio: "3/4",
                border: "2px solid rgba(212,175,55,0.4)",
                boxShadow: "0 8px 32px rgba(28,28,30,0.15), inset 0 1px 0 rgba(255,255,255,0.4), 3px 3px 0 rgba(212,175,55,0.2)",
              }}
            >
              <Image
                src="/KWINxiaoxiang.jpg"
                alt="木子洋 KWIN 情报档案照"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 40%, rgba(28,28,30,0.15) 100%)",
                }}
              />
              {/* 照片角码 */}
              <div
                className="absolute bottom-2 right-2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.45rem",
                  letterSpacing: "0.2em",
                  color: "#D4AF37",
                  opacity: 0.8,
                  backgroundColor: "rgba(28,28,30,0.5)",
                  padding: "2px 4px",
                }}
              >
                PHOTO · 01
              </div>
            </div>

            {/* 档案照片说明 */}
            <div className="mt-4 flex items-center gap-3">
              <span style={{ width: 20, height: "0.5px", backgroundColor: "#D4AF37", opacity: 0.5 }} />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.5rem",
                  color: "#8E8E93",
                  letterSpacing: "0.3em",
                }}
              >
                SUBJECT PORTRAIT · ON FILE
              </p>
              <span style={{ width: 20, height: "0.5px", backgroundColor: "#D4AF37", opacity: 0.5 }} />
            </div>

            {/* 角落装饰线 */}
            <div className="absolute top-4 left-4">
              <div style={{ width: 16, height: 16, borderTop: "1.5px solid #D4AF37", borderLeft: "1.5px solid #D4AF37", opacity: 0.5 }} />
            </div>
            <div className="absolute top-4 right-4">
              <div style={{ width: 16, height: 16, borderTop: "1.5px solid #D4AF37", borderRight: "1.5px solid #D4AF37", opacity: 0.5 }} />
            </div>
            <div className="absolute bottom-4 left-4">
              <div style={{ width: 16, height: 16, borderBottom: "1.5px solid #D4AF37", borderLeft: "1.5px solid #D4AF37", opacity: 0.5 }} />
            </div>
            <div className="absolute bottom-4 right-4">
              <div style={{ width: 16, height: 16, borderBottom: "1.5px solid #D4AF37", borderRight: "1.5px solid #D4AF37", opacity: 0.5 }} />
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-between p-10">
            {/* Header */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.4em",
                  color: "#D4AF37",
                  marginBottom: "0.75rem",
                }}
              >
                SUBJECT IDENTIFICATION RECORD
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
                木子洋<br />KWIN
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
              <div className="my-6" style={{ height: 1, background: "linear-gradient(90deg, #D4AF37, transparent)", opacity: 0.4 }} />

              {/* Description */}
              <div
                style={{
                  borderLeft: "2px solid #D4AF37",
                  paddingLeft: "1rem",
                  opacity: 0.9,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.35em",
                    color: "#D4AF37",
                    marginBottom: "0.5rem",
                  }}
                >
                  INTEL SUMMARY · 情报摘要
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    lineHeight: 1.9,
                    color: "#3C3C3E",
                    letterSpacing: "0.04em",
                  }}
                >
                  本局侦察所得，该猫探长系极为罕见的猫科人格形态。<br />
                  冷冽气场与柔软本心，热烈张扬与沉静内敛，浪漫感性与理智清醒，种种相悖气质在其身上自然相融。<br />
                  兼具温柔底色与硬核力量，拿捏住感性与理性的边界，在随性自在与满腔赤诚之间守住恰到好处的平衡。
                </p>
              </div>
            </div>

            {/* Params grid */}
            <div className="mt-8">
              <div
                className="mb-3 flex items-center gap-3"
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.4em",
                    color: "#8E8E93",
                  }}
                >
                  OBSERVATION DATA ——
                </span>
                <span style={{ flex: 1, height: "0.5px", backgroundColor: "#E8D3D8" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {speciesParams.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col"
                    style={{
                      borderLeft: i % 2 === 0 ? "1px solid rgba(212,175,55,0.25)" : "1px solid rgba(216,167,177,0.25)",
                      paddingLeft: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.47rem",
                        letterSpacing: "0.28em",
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
                        fontSize: "0.85rem",
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
                          fontSize: "0.47rem",
                          color: "#D8A7B1",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {p.unit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 档案审阅区 */}
            <div className="mt-8 flex items-end justify-between">
              <span
                style={{
                  fontFamily: "var(--font-handwriting), cursive",
                  fontSize: "0.78rem",
                  color: "#8E8E93",
                  opacity: 0.5,
                }}
              >
                * 本份情报已审阅 · reviewed
              </span>
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  width: 60,
                  height: 60,
                  border: "1.5px solid #D4AF37",
                  borderRadius: "50%",
                  opacity: 0.6,
                  position: "relative",
                }}
              >
                {/* 印章内圈 */}
                <div
                  style={{
                    position: "absolute",
                    inset: 4,
                    border: "0.5px solid #D4AF37",
                    borderRadius: "50%",
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.4rem",
                    letterSpacing: "0.1em",
                    color: "#D4AF37",
                    textAlign: "center",
                    lineHeight: 1.5,
                    zIndex: 1,
                  }}
                >
                  情报局
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
