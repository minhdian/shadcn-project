import { useEffect } from 'react'
import { subtitles } from '@/routes/_authenticated/study/-page/mock-sub'
import { playerStore, usePlayerStore } from '../../../../store/playerStore'
import { savedSubtitlesStore } from '../../../../store/savedSubtitlesStore'

export const useRepeatSub = () => {
  const { playerControls, audioRef } = playerStore
  const {
    timeToSeconds,
    setCurrentSubtitleIndex,
    repeatSubtitle,
    setRepeatSubtitle,
  } = savedSubtitlesStore
  const { playerRef } = usePlayerStore()

  // Xử lý khi bật/tắt repeat mode
  useEffect(() => {
    if (playerControls.isRepeating) {
      // Khi bật repeat, tìm subtitle hiện tại để repeat
      if (playerRef || audioRef?.current) {
        const currentTime =
          (playerRef?.currentTime ?? 0) + 0.01 ||
          audioRef?.current?.currentTime ||
          0

        let current = null

        for (let i = 0; i < subtitles.length; i++) {
          const subtitle = subtitles[i]
          const startTime = timeToSeconds(subtitle.start)

          // Lấy thời gian bắt đầu của subtitle tiếp theo (nếu có)
          const nextSubtitle = subtitles[i + 1]
          const nextStartTime = nextSubtitle
            ? timeToSeconds(nextSubtitle.start)
            : Infinity

          // Kiểm tra xem currentTime có nằm trong khoảng [startTime, nextStartTime)
          if (currentTime >= startTime && currentTime < nextStartTime) {
            current = subtitle
            break
          }
        }
        if (current) {
          setRepeatSubtitle(current)
          setCurrentSubtitleIndex(current.id)
          console.log('Repeat mode ON - Selected subtitle:', current.text)
        }
      }
    } else {
      // Khi tắt repeat, clear subtitle được repeat
      setRepeatSubtitle(null)
      console.log('Repeat mode OFF')
    }
  }, [playerControls.isRepeating])

  // Logic repeat subtitle đơn giản
  useEffect(() => {
    if (!playerControls.isRepeating || !repeatSubtitle) return

    const checkRepeat = () => {
      const player = playerRef || audioRef?.current
      if (!player) return

      const currentTime = player.currentTime
      const endTime = timeToSeconds(repeatSubtitle.end)

      // Nếu đã phát hết subtitle, quay lại đầu
      if (currentTime >= endTime) {
        const startTime = timeToSeconds(repeatSubtitle.start)
        player.currentTime = startTime + 0.01
        console.log('Repeating subtitle:', repeatSubtitle.text)
      }
    }

    const interval = setInterval(checkRepeat, 100)
    return () => clearInterval(interval)
  }, [playerControls.isRepeating, repeatSubtitle])
}
