"use client"

import Image from "next/image"

const dossiers = [
  {
    id: "graceful",
    letter: "M",
    word: "GRACEFUL",
    chinese: "曼妙",
    description: "他往那里一站，光和影都会顺着他改变方向。不是谁给了他舞台，而是他走到哪里，哪里就自然成了值得被看见的地方。",
    accent: "#D8A7B1",
    image: "/KWINmanmiao.jpg",
    posterSrc: "/KWINmanmiao.jpg",
    videoTitle: "情报展区 · 曼妙卷宗",
    videoDescription: "一段把光影与气场交织起来的短片。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/manmiao.mp4",
  },
  {
    id: "tender",
    letter: "U",
    word: "TENDER",
    chinese: "温柔",
    description: "档案载明：她的存在本身就是一种治愈。不需要任何解释，只是在场，就能让空间变得温暖而安全。",
    accent: "#A77E91",
    image: "/KWINwenrou.jpg",
    posterSrc: "/KWINwenrou.jpg",
    videoTitle: "情报展区 · 温柔卷宗",
    videoDescription: "一段让人感到安定与陪伴的短片。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/wenrou.mp4",
  },
  {
    id: "mischievous",
    letter: "Z",
    word: "MISCHIEF",
    chinese: "捣蛋",
    description: "她总会在不经意间制造惊喜。偶尔调皮，偶尔幼稚，喜欢用玩笑打破安静，也让身边的人忍不住跟着笑起来。",
    accent: "#BA8FA0",
    image: "/KWINdaodan.png",
    posterSrc: "/KWINdaodan.png",
    videoTitle: "情报展区 · 捣蛋卷宗",
    videoDescription: "一段带着调皮气息与快乐氛围的短片。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/daodan.mp4",
  },
  {
    id: "resilient",
    letter: "I",
    word: "RESOLUTE",
    chinese: "担当",
    description: "有时候软软的，有时候却是最稳定的锚。她不声张，但你总能在最重要的时刻感知到她的重量。",
    accent: "#9E7186",
    image: "/KWINdandang.jpg",
    posterSrc: "/KWINdandang.jpg",
    videoTitle: "情报展区 · 担当卷宗",
    videoDescription: "一段传递稳定与温度的短片。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/dandang.mp4",
  },
  {
    id: "dazzling",
    letter: "Y",
    word: "DAZZLING",
    chinese: "傲娇",
    description: "眼神锐利，挑人而交；嘴上说着随便，心里却早已挑遍全场。被她选中，是一种殊荣。",
    accent: "#C0718A",
    image: "/KWINaojiao.jpg",
    posterSrc: "/KWINaojiao.jpg",
    videoTitle: "情报展区 · 傲娇卷宗",
    videoDescription: "一段捕捉明艳傲娇气场的短片。",
    videoSrc: "https://my-video-bucket-1458721399.cos.ap-nanjing.myqcloud.com/videos/dandang.mp4",
  },
]

type Dossier = (typeof dossiers)[number]

interface PersonalitySectionProps {
  onOpenVideo?: (personality: Dossier) => void
}

export default function PersonalitySection({ onOpenVideo }: PersonalitySectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-32" style={{ backgroundColor: "#F4E2E5" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #6F3549 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-16 text-center sm:mb-20">
          <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.45em", color: "#A65D73" }}>
            BUREAU FILE · 02 · OPEN ARCHIVE
          </p>
          <h2 className="reveal delay-1 mt-4" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(2.3rem, 5.5vw, 4.5rem)", color: "#41212D", letterSpacing: "0.12em", lineHeight: 1.12 }}>
            情报展区
          </h2>
          <p className="reveal delay-2 mt-4" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "#A65D73", letterSpacing: "0.18em" }}>
            M U Z I Y · five facets, one archive
          </p>
        </header>

        <div className="reveal delay-2 -mx-6 overflow-x-auto px-6 pb-6 sm:mx-0 sm:px-0 sm:overflow-visible">
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
                <span className="mb-2 block text-center transition-transform duration-300 group-hover:-translate-y-1" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(3.2rem, 7vw, 6.2rem)", color: "#542936", lineHeight: 0.9 }}>
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
                  <Image src={dossier.image} alt={`${dossier.chinese}主题照片`} fill sizes="(max-width: 640px) 44vw, (max-width: 1024px) 29vw, 19vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#4c1f2e]/45 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "#FFF8FA", letterSpacing: "0.22em" }}>
                    PLAY FILM <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </button>

              <div className="pt-4 text-center">
                <p style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(0.95rem, 1.4vw, 1.25rem)", color: "#542936", letterSpacing: "0.14em" }}>{dossier.word}</p>
                <p className="mt-1" style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: dossier.accent, letterSpacing: "0.3em" }}>{dossier.chinese}</p>
                <p className="mx-auto mt-3 max-w-[18rem] text-left" style={{ fontFamily: "var(--font-sans)", fontSize: "0.76rem", lineHeight: 1.85, color: "#6A4551", letterSpacing: "0.04em" }}>{dossier.description}</p>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
