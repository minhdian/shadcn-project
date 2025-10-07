import { useCallback } from 'react'
import { makeAutoObservable } from 'mobx'
import { favoriteStore } from './storeFavorite'

export interface IPlayerControls {
  isPlaying: boolean
  rewindSeconds: number
  played: number // Tỷ lệ phần trăm đã phát (0 đến 1)
  playedSeconds: number // Thời gian đã phát (tính bằng giây)
  loop: boolean
  isChapterLooping: boolean
  volume: number // Giá trị âm lượng từ 0 đến 1
  muted: boolean
  isRepeating: boolean
  duration: number // Tổng thời lượng (tính bằng giây)
  seeking: boolean // Trạng thái đang seek
}
class PlayerStore {
  // Player ref để điều khiển từ bên ngoài
  playerRef: HTMLVideoElement | null = null
  audioRef: React.RefObject<HTMLAudioElement> | null = null

  //player state
  private _playerControls: IPlayerControls = {
    isPlaying: false,
    rewindSeconds: 5,
    played: 0,
    playedSeconds: 0,
    loop: false,
    isChapterLooping: false,
    volume: 0.8,
    muted: false,
    isRepeating: false,
    duration: 0,
    seeking: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  // getters và setters cho player state
  get playerControls() {
    return this._playerControls
  }
  setPLayerControls = (controls: Partial<IPlayerControls>) => {
    this._playerControls = { ...this._playerControls, ...controls }
  }

  // Setters
  get getPlayerRef() {
    return this.playerRef
  }
  setPlayerRef = (ref: HTMLVideoElement | null) => {
    this.playerRef = ref
  }

  get getAudioRef() {
    return this.audioRef
  }
  setAudioRef = (ref: React.RefObject<HTMLAudioElement>) => {
    this.audioRef = ref
  }

  // Helper methods để check ref có sẵn không
  // private isPlayerReady = (): boolean => {
  //     return !!(this.playerRef);
  // };

  // private isAudioReady = (): boolean => {
  //     return !!(this.audioRef?.current);
  // };

  setRewindSeconds = (seconds: number) => {
    this.setPLayerControls({ rewindSeconds: seconds })
  }
  handleRewind = () => {
    if (this.playerRef) {
      const currentTime = this.playerRef.currentTime
      const newTime = Math.max(
        0,
        currentTime - +this.playerControls.rewindSeconds
      ) // Không cho phép thời gian âm

      this.playerRef.currentTime = newTime

      console.log('Rewind to:', newTime)
    }
  }

  setPlayerCurrentTime = (seconds: number) => {
    if (this.playerRef) {
      this.playerRef.currentTime = seconds
    }
  }

  setAudioCurrentTime = (seconds: number) => {
    if (this.audioRef?.current) {
      this.audioRef.current.currentTime = seconds
    }
  }

  /* ====  Actions  ==== */
  handleRepeat = () => {
    const { isRepeating } = this.playerControls
    this.setPLayerControls({ isRepeating: !isRepeating })

    // Khi bật repeat, tắt các chế độ loop khác để tránh xung đột
    if (!isRepeating) {
      this.setPLayerControls({ loop: false })
    }
  }

  handleChapterLoop = () => {
    const { isChapterLooping } = this.playerControls
    this.setPLayerControls({ isChapterLooping: !isChapterLooping })
    // Nếu bật chapter loop thì tắt video loop
    if (!isChapterLooping) {
      this.setPLayerControls({ loop: false })
    }
  }

  handleVolumeChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement
    const newVolume = parseFloat(inputTarget.value)
    this.setPLayerControls({ volume: newVolume })
    if (newVolume === 0) {
      this.setPLayerControls({ muted: true })
    } else {
      this.setPLayerControls({ muted: false })
    }
  }

  handleMuteClick = () => {
    if (this.playerControls.muted || this.playerControls.volume === 0) {
      this.setPLayerControls({ muted: false, volume: 0.75 })
    } else {
      this.setPLayerControls({ muted: true, volume: 0 })
    }
  }

  handleVideoLoop = () => {
    const { loop } = this.playerControls
    this.setPLayerControls({ loop: !loop })
    // Nếu bật video loop thì tắt chapter loop
    if (!loop) {
      this.setPLayerControls({ isChapterLooping: false })
    }
  }
  handleSeekMouseDown = () => {
    this.setPLayerControls({ seeking: true })
  }

  handleSeekChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement
    const newPlayed = Number.parseFloat(inputTarget.value)

    this.setPLayerControls({ played: newPlayed })
  }

  handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { duration } = this.playerControls
    const { currentLesson } = favoriteStore
    const inputTarget = event.target as HTMLInputElement
    const newPlayed = Number.parseFloat(inputTarget.value)

    this.setPLayerControls({ seeking: false })

    // Tính toán thời gian chính xác để seek
    let actualDuration = duration
    if (currentLesson?.type === 'video' && this.PlayerDuration) {
      actualDuration = this.PlayerDuration
    } else if (currentLesson?.type === 'audio' && this.AudioDuration) {
      actualDuration = this.AudioDuration
    }

    if (actualDuration) {
      const seekTime = newPlayed * actualDuration
      // Seek video player
      this.setPlayerCurrentTime(seekTime)

      // Seek audio player
      this.setAudioCurrentTime(seekTime)
    }
  }
  /* ====  / Actions  ==== */

  get PlayerDuration() {
    if (this.playerRef) {
      return this.playerRef.duration
    }
  }

  get AudioDuration() {
    if (this.audioRef?.current) {
      return this.audioRef.current.duration
    }
  }
}
export const playerStore = new PlayerStore()
// const playerStoreContext = createContext(playerStore);

export const usePlayerStore = () => {
  const handlePlayerRef = useCallback((ref: HTMLVideoElement | null) => {
    if (ref) {
      playerStore.playerRef = ref
      console.log('Player ref set:', ref)
    }
  }, [])
  return { ...playerStore, handlePlayerRef }
}
