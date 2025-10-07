import { observer } from "mobx-react-lite";
import { layoutStore } from "../store";
import { Pause, Play, Repeat, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { playerStore } from "../storePlayer";
import { useRef, useState } from "react";

import { favoriteStore } from "../storeFavorite";


export const Footer = observer(() => {
  const { isShowControl } = layoutStore;
  const { selectedCourse, currentLesson, getPreviousLesson, getNextLesson, handleSkipBack, handleSkipForward } = favoriteStore;
  const { setPLayerControls, rewind, playerControls, setPlayerCurrentTime, setAudioCurrentTime,
    PlayerDuration, AudioDuration
  } = playerStore;

//   const [rewindSeconds, setRewindSeconds] = useState(5); // State cho số giây lùi lại
  // const [isRepeating, setIsRepeating] = useState(false);
  // const [isChapterLooping, setIsChapterLooping] = useState(false); // State cho lặp lại toàn bộ chapter
  // const [volume, setVolume] = useState(0.8); // State cho volume (0-1)
  // const [muted, setMuted] = useState(false); // State cho mute
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const seekbarRef = useRef<HTMLInputElement>(null);

  // Hàm xử lý lùi lại video
  const handleRewind = () => {
    rewind();
  };
  
  // Xử lý skip về lesson trước đó
  const handleSkipBackClick = () => {
    handleSkipBack();
  };
  // Xử lý skip đến lesson tiếp theo
  const handleSkipForwardClick = () => {
    handleSkipForward();
  };
    
  // Hàm xử lý lặp lại subtitle
  const handleRepeat = () => {
    const { isRepeating } = playerControls;
    setPLayerControls({ isRepeating: !isRepeating });

    // Khi bật repeat, tắt các chế độ loop khác để tránh xung đột
    if (!isRepeating) {
      setPLayerControls({ isChapterLooping: false, loop: false });
    }
  };
  // Hàm xử lý lặp lại video
  const handleVideoLoop = () => {
    const { loop } = playerControls;
    setPLayerControls({ loop: !loop });
    // Nếu bật video loop thì tắt chapter loop
    if (!loop) {
      setPLayerControls({ isChapterLooping: false });
    }
  };

  // Hàm xử lý lặp lại chapter (toàn bộ video trong chương)
  const handleChapterLoop = () => {
    const { isChapterLooping } = playerControls;
    setPLayerControls({ isChapterLooping: !isChapterLooping });
    // Nếu bật chapter loop thì tắt video loop
    if (!isChapterLooping) {
      setPLayerControls({ loop: false });
    }
  };

  const handleSeekbarHover = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!seekbarRef.current) return; 

    // Lấy duration thực từ player
    let actualDuration = playerControls.duration;
    // if (currentLesson?.type === "video" && playerRef.current?.duration) {
    //   actualDuration = playerRef.current.duration;
    // } else if (currentLesson?.type === "audio" && audioRef.current?.duration) {
    //   actualDuration = audioRef.current.duration;
    // }
    if (!actualDuration) return;

    // Tính toán vị trí hover dựa trên width của input
    const rect = seekbarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Khoảng cách từ đầu thanh đến vị trí chuột
    const clampedX = Math.max(0, Math.min(x, rect.width)); // Đảm bảo x nằm trong bounds

    // Tính phần trăm dựa trên vị trí click
    const percentage = clampedX / rect.width;

    // Đổi phần trăm ra giây
    const hoverTimeInSeconds = percentage * actualDuration;

    console.log("Seekbar hover calculation:", {
      mouseX: x,
      clampedX: clampedX,
      inputWidth: rect.width,
      percentage: (percentage * 100).toFixed(1) + "%",
      actualDuration: actualDuration.toFixed(2),
      hoverTime: hoverTimeInSeconds.toFixed(2),
    //   currentTime: (state.playedSeconds || 0).toFixed(2),
    });

    setHoverTime(hoverTimeInSeconds);
    setHoverX(clampedX);
  };

  // Hàm xử lý click trực tiếp lên thanh seekbar
  const handleSeekbarClick = (e: React.MouseEvent<HTMLInputElement>) => {
    
    if (!seekbarRef.current) return;

    // Lấy duration thực từ player
    let actualDuration = playerControls.duration;
    // if (currentLesson?.type === "video" && playerRef.current?.duration) {
    //   actualDuration = playerRef.current.duration;
    // } else if (currentLesson?.type === "audio" && audioRef.current?.duration) {
    //   actualDuration = audioRef.current.duration;
    // }
    console.log("duration:", actualDuration);
    if (!actualDuration) return;

    // Tính toán vị trí click
    const rect = seekbarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));

    // Tính phần trăm và thời gian
    const percentage = clampedX / rect.width;
    const clickTime = percentage * actualDuration;

    console.log("Seekbar click:", {
      clickX: x,
      inputWidth: rect.width,
      percentage: (percentage * 100).toFixed(1) + "%",
      clickTime: clickTime.toFixed(2),
    });

    // Update state
    setPLayerControls({ played: percentage, playedSeconds: clickTime });

    // Seek player
    setPlayerCurrentTime(clickTime);

    setAudioCurrentTime(clickTime);
  };

  const handleSeekMouseDown = () => {
    setPLayerControls({ seeking: true });
  };

  const handleSeekChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    const newPlayed = Number.parseFloat(inputTarget.value);

    setPLayerControls({ played: newPlayed });
  };

  const handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    const newPlayed = Number.parseFloat(inputTarget.value);

    setPLayerControls({ seeking: false });

    // Tính toán thời gian chính xác để seek
    let actualDuration = playerControls.duration;
    if (currentLesson?.type === "video" && PlayerDuration) {
      actualDuration = PlayerDuration;
    } else if (currentLesson?.type === "audio" && AudioDuration) {
      actualDuration = AudioDuration;
    }

    if (actualDuration) {
      const seekTime = newPlayed * actualDuration;

      console.log("Seeking to:", {
        newPlayed: (newPlayed * 100).toFixed(1) + "%",
        actualDuration: actualDuration.toFixed(2),
        seekTime: seekTime.toFixed(2),
      });

      // Seek video player
      setPlayerCurrentTime(seekTime);

      // Seek audio player
      setAudioCurrentTime(seekTime);
    }
  };

  // Hàm format thời gian từ giây sang MM:SS hoặc HH:MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
  };
  // Hàm xử lý thay đổi volume
  const handleVolumeChange = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const inputTarget = event.target as HTMLInputElement;
    const newVolume = parseFloat(inputTarget.value);
    setPLayerControls({ volume: newVolume });
    if (newVolume === 0) {
      setPLayerControls({ muted: true });
    } else {
      setPLayerControls({ muted: false });
    }
  };
  const handleMuteClick = () => {
  if (playerControls.muted || playerControls.volume === 0) {
    setPLayerControls({ muted: false, volume: 0.75 });
  } else {
    setPLayerControls({ muted: true, volume: 0 });
  }
};
  return (
    <>
    {isShowControl && (
        <footer className="bg-green-600 p-2 sm:p-3 lg:p-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            {/* Lesson Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Button lùi lại với input số giây */}
              <div className="flex items-center space-x-1">
                <button
                  className="text-white hover:text-gray-200"
                  title="Lùi lại"
                  onClick={handleRewind}
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <input
                  type="number"
                  defaultValue="5"
                  min="1"
                  max="60"
                  onChange={(e) => setPLayerControls({ rewindSeconds: Number(e.target.value) })}
                  className="w-8 sm:w-10 h-6 sm:h-7 text-xs bg-black bg-opacity-50 text-white text-center rounded border border-white border-opacity-30 focus:outline-none focus:border-green-400"
                />
                <span className="text-white text-xs hidden sm:inline">
                  giây
                </span>
              </div>

              <button
                className="text-white hover:text-gray-200"
                onClick={handleSkipBackClick}
                disabled={!getPreviousLesson()}
                title={
                  getPreviousLesson()
                    ? `Previous: ${getPreviousLesson()?.title}`
                    : "No previous lesson"
                }
              >
                <SkipBack
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    !getPreviousLesson() ? "opacity-50" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => setPLayerControls({ isPlaying: !playerControls.isPlaying })}
                className="text-white hover:text-gray-200"
              >
                {playerControls.isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                )}
              </button>
              <button
                className="text-white hover:text-gray-200"
                onClick={handleSkipForwardClick}
                disabled={!getNextLesson()}
                title={
                  getNextLesson()
                    ? `Next: ${getNextLesson()?.title}`
                    : "No next lesson"
                }
              >
                <SkipForward
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    !getNextLesson() ? "opacity-50" : ""
                  }`}
                />
              </button>

              {/* Button lặp lại sub */}
              <button
                className={` ${
                  playerControls.isRepeating ? "text-yellow-300" : ""
                } text-white hover:text-yellow-300 transition-colors`}
                title="Lặp lại"
                onClick={handleRepeat}
              >
                <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Button lặp lại video*/}
              <button
                className={` ${
                  playerControls.loop ? "text-yellow-300" : ""
                } text-white hover:text-blue-300 transition-colors`}
                title="Lặp lại video"
                onClick={handleVideoLoop}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Button lặp lại video trong chương*/}
              <button
                className={` ${
                  playerControls.isChapterLooping ? "text-yellow-300" : ""
                } text-white hover:text-blue-300 transition-colors`}
                title="Lặp lại video trong chương"
                onClick={handleChapterLoop}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Progress & Current Info */}
            <div className="flex-1 mx-3 sm:mx-4 lg:mx-8">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex-1">
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="any"
                      className="w-full h-1 bg-black bg-opacity-30 rounded-full cursor-pointer appearance-none"
                      value={playerControls.played}
                      ref={seekbarRef}
                      onMouseMove={handleSeekbarHover}
                      onMouseDown={handleSeekMouseDown}
                      onChange={handleSeekChange}
                      onMouseUp={handleSeekMouseUp}
                      onClick={handleSeekbarClick}
                      onMouseLeave={() => setHoverTime(null)}
                      style={{ width: "100%" }}
                    />
                    {hoverTime !== null && (
                      <div
                        style={{
                          position: "absolute",
                          left: hoverX,
                          top: -28,
                          background: "#222",
                          color: "#fff",
                          fontSize: 12,
                          padding: "2px 6px",
                          borderRadius: 4,
                          pointerEvents: "none",
                          transform: "translateX(-50%)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatTime(hoverTime || 0)}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-white text-xs sm:text-sm truncate flex-1 mr-2">
                      {currentLesson
                        ? `${currentLesson.title} - ${
                            selectedCourse?.title || ""
                          }`
                        : "Select a lesson to start learning"}
                    </div>
                    <div className="text-white text-xs sm:text-sm whitespace-nowrap">
                      {formatTime(playerControls.playedSeconds || 0)} /{" "}
                      {formatTime(playerControls.duration)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <button
                className="text-white hover:text-gray-200 hidden md:block"
                onClick={handleMuteClick}
              >
                {playerControls.volume === 0 ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <div className="w-12 sm:w-16 lg:w-20 bg-black bg-opacity-30 rounded-full h-1 hidden md:block relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="any"
                  value={playerControls.volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title={`Volume: ${Math.round(playerControls.volume * 100)}%`}
                />
                <div
                  className="bg-white h-1 rounded-full transition-all duration-150"
                  style={{ width: `${playerControls.volume * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
});
