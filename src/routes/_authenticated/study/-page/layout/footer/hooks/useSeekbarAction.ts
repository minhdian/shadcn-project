import { useRef, useState } from 'react'
import { playerStore } from '../../store/playerStore'

export const useSeekbarAction = () => {
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverX, setHoverX] = useState(0)
  const seekbarRef = useRef<HTMLInputElement>(null)

  const {
    playerControls,
    setPLayerControls,
    setAudioCurrentTime,
    setPlayerCurrentTime,
  } = playerStore

  const handleSeekbarHover = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!seekbarRef.current) return
    let actualDuration = playerControls.duration
    if (!actualDuration) return
    const rect = seekbarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left // Khoảng cách từ đầu thanh đến vị trí chuột
    const clampedX = Math.max(0, Math.min(x, rect.width)) // Đảm bảo x nằm trong bounds

    // Tính phần trăm dựa trên vị trí click
    const percentage = clampedX / rect.width

    // Đổi phần trăm ra giây
    const hoverTimeInSeconds = percentage * actualDuration
    setHoverTime(hoverTimeInSeconds)
    setHoverX(clampedX)
  }

  // Hàm xử lý click trực tiếp lên thanh seekbar
  const handleSeekbarClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!seekbarRef.current) return
    let actualDuration = playerControls.duration
    if (!actualDuration) return

    // Tính toán vị trí click
    const rect = seekbarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clampedX = Math.max(0, Math.min(x, rect.width))

    // Tính phần trăm và thời gian
    const percentage = clampedX / rect.width
    const clickTime = percentage * actualDuration
    // Update state
    setPLayerControls({ played: percentage, playedSeconds: clickTime })

    // Seek player
    setPlayerCurrentTime(clickTime)
    setAudioCurrentTime(clickTime)
  }

  return {
    handleSeekbarHover,
    handleSeekbarClick,
    seekbarRef,
    setHoverTime,
    hoverTime,
    hoverX,
  }
}
