"use client"

import { useEffect, useRef } from "react"

const DEFAULT_MUSIC_URL = "/audio/feline-bg.mp3"
const FALLBACK_MUSIC_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4dd8b7f1d4.mp3?filename=soft-piano-ambient-114064.mp3"

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const userGestureRef = useRef(false)
  const wasPlayingBeforeVideoRef = useRef(false)
  const videoCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const audio = new Audio(DEFAULT_MUSIC_URL)
    audio.loop = true
    audio.volume = 0.28
    audio.preload = "auto"
    audio.crossOrigin = "anonymous"
    audioRef.current = audio

    const hasVideoPlaying = () => {
      return Array.from(document.querySelectorAll("video")).some((video) => {
        return !video.paused && !video.ended && video.readyState >= 2
      })
    }

    const tryPlayMusic = async () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return
      if (hasVideoPlaying()) return
      if (!userGestureRef.current) return

      try {
        currentAudio.muted = false
        await currentAudio.play()
        console.log("✅ 背景音乐播放成功")
      } catch (error) {
        console.log("⏳ 播放被阻止，等待用户交互")
      }
    }

    const enableMusic = () => {
      if (userGestureRef.current) return
      userGestureRef.current = true
      console.log("🎵 用户交互授权已获取")
      void tryPlayMusic()
    }

    // ✅ 统一的音乐恢复检查
    const checkAndResumeMusic = () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return
      
      // 如果有视频在播放，音乐不应该恢复
      if (hasVideoPlaying()) {
        console.log("🎬 检测到视频在播放，音乐保持暂停")
        return
      }

      // 如果音乐本来就在播放，不需要操作
      if (!currentAudio.paused) {
        return
      }

      // ✅ 如果音乐是暂停状态，且之前是因为视频而被暂停的，恢复播放
      if (wasPlayingBeforeVideoRef.current && userGestureRef.current) {
        wasPlayingBeforeVideoRef.current = false
        console.log("🎵 检测到视频已关闭，恢复背景音乐")
        void tryPlayMusic()
      }
    }

    const handleVideoLifecycle = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLVideoElement)) return

      const currentAudio = audioRef.current
      if (!currentAudio) return

      if (event.type === "play") {
        if (!currentAudio.paused) {
          wasPlayingBeforeVideoRef.current = true
          console.log("🎬 视频播放，暂停音乐（之前音乐在播放）")
        } else {
          wasPlayingBeforeVideoRef.current = false
          console.log("🎬 视频播放，音乐本来就是暂停状态")
        }
        currentAudio.pause()
        return
      }

      // pause / ended：视频停下来了
      if (event.type === "pause" || event.type === "ended") {
        console.log("🎬 视频暂停/结束事件触发")
        // 延迟一帧检查，确保视频状态已更新
        requestAnimationFrame(() => {
          checkAndResumeMusic()
        })
      }
    }

    // ✅ 新增：监听 DOM 变化，检测视频元素被移除
    const handleDOMChange = () => {
      // 检查当前是否有视频在播放
      if (!hasVideoPlaying()) {
        // 没有视频播放了，尝试恢复音乐
        checkAndResumeMusic()
      }
    }

    // ✅ 使用 MutationObserver 监听视频元素的变化
    const setupMutationObserver = () => {
      const observer = new MutationObserver(() => {
        handleDOMChange()
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      return observer
    }

    // ✅ 定时轮询检查（兜底方案，防止事件遗漏）
    const startVideoCheckInterval = () => {
      videoCheckIntervalRef.current = setInterval(() => {
        handleDOMChange()
      }, 500) // 每500ms检查一次
    }

    const handleAudioError = () => {
      const currentAudio = audioRef.current
      if (!currentAudio) return
      if (currentAudio.src !== FALLBACK_MUSIC_URL) {
        console.log("⚠️ 音乐加载失败，切换到备用链接")
        currentAudio.src = FALLBACK_MUSIC_URL
        currentAudio.load()
      }
    }

    // 全局事件监听
    document.addEventListener("pointerdown", enableMusic, { passive: true })
    document.addEventListener("keydown", enableMusic, { passive: true })
    document.addEventListener("touchstart", enableMusic, { passive: true })
    document.addEventListener("play", handleVideoLifecycle, true)
    document.addEventListener("pause", handleVideoLifecycle, true)
    document.addEventListener("ended", handleVideoLifecycle, true)
    audio.addEventListener("error", handleAudioError)

    // ✅ 设置 MutationObserver
    const observer = setupMutationObserver()

    // ✅ 启动定时轮询
    startVideoCheckInterval()

    // 页面加载完成后尝试自动播放
    const attemptAutoPlay = () => {
      requestAnimationFrame(() => {
        const currentAudio = audioRef.current
        if (!currentAudio) return
        if (hasVideoPlaying()) return

        currentAudio.muted = false
        currentAudio.play()
          .then(() => {
            console.log("✅ 背景音乐自动播放成功")
            userGestureRef.current = true
          })
          .catch(() => {
            console.log("⏳ 自动播放被阻止，等待用户交互")
          })
      })
    }

    if (document.readyState === "complete") {
      attemptAutoPlay()
    } else {
      window.addEventListener("load", attemptAutoPlay)
    }

    return () => {
      // 清理事件监听
      window.removeEventListener("load", attemptAutoPlay)
      document.removeEventListener("pointerdown", enableMusic)
      document.removeEventListener("keydown", enableMusic)
      document.removeEventListener("touchstart", enableMusic)
      document.removeEventListener("play", handleVideoLifecycle, true)
      document.removeEventListener("pause", handleVideoLifecycle, true)
      document.removeEventListener("ended", handleVideoLifecycle, true)
      audio.removeEventListener("error", handleAudioError)

      // 清理定时器
      if (videoCheckIntervalRef.current) {
        clearInterval(videoCheckIntervalRef.current)
        videoCheckIntervalRef.current = null
      }

      // 清理 MutationObserver
      observer.disconnect()

      // 清理音频
      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [])

  const toggleMusic = async () => {
    const currentAudio = audioRef.current
    if (!currentAudio) return

    userGestureRef.current = true

    if (currentAudio.paused) {
      const hasVideoPlaying = Array.from(document.querySelectorAll("video")).some((video) => {
        return !video.paused && !video.ended && video.readyState >= 2
      })

      if (hasVideoPlaying) {
        console.log("🎬 有视频在播放，无法播放音乐")
        currentAudio.pause()
        currentAudio.muted = true
        return
      }

      currentAudio.muted = false
      try {
        await currentAudio.play()
        console.log("🎵 手动播放音乐")
        // ✅ 如果用户手动播放了，清除之前的状态标记
        wasPlayingBeforeVideoRef.current = true
      } catch (error) {
        console.log("⚠️ 手动播放失败")
      }
      return
    }

    // 暂停音乐
    currentAudio.pause()
    console.log("⏸️ 手动暂停音乐")
    // ✅ 用户手动暂停，清除标记
    wasPlayingBeforeVideoRef.current = false
  }

  return (
    <button
      type="button"
      aria-label="切换背景音乐"
      onClick={toggleMusic}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 9999,
        width: 46,
        height: 46,
        borderRadius: "9999px",
        border: "1px solid rgba(212,175,55,0.35)",
        background: "rgba(28,28,30,0.62)",
        backdropFilter: "blur(10px)",
        color: "#F6DCE3",
        boxShadow: "0 12px 28px rgba(28,28,30,0.15)",
        cursor: "none",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ♪
    </button>
  )
}