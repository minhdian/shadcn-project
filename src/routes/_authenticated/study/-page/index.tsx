import {
  Bell,
  BookOpen,
  List,
  Menu,
  Mic,
  Pause,
  Play,
  Plus,
  User,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Virtuoso } from "react-virtuoso";
import { subtitles } from "./mock-sub";
import { useUIStore } from "./store";
import { HeaderStudy } from "./layout/header";
import { RightSidebar } from "./layout/right-sidebar";
import { observer } from "mobx-react-lite";
import { favoriteStore } from "./layout/storeFavorite";
import { Footer } from "./layout/footer";
import { playerStore, usePlayerStore } from "./layout/storePlayer";
import { usePlayerRef } from "./layout/useRefPlayer";
import { layoutStore } from "./layout/store";


interface Course {
  id: number;
  title: string;
  image: string;
  description: string;
  chapters: Chapter[];
}
// Type definitions
interface Lesson {
  id: number;
  title: string;
  type: "video" | "audio";
  url: string;
  subtitle: string;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

export const Study = observer(() => {
  
  const { isShowFavorite } = layoutStore;
  const { selectedCourse, activeChapter, setActiveChapter, currentLesson, setCurrentLesson, setLessonSelectHandler, getNextLesson } = favoriteStore;
  const {
    
    setAudioRef,
    playerControls,
    setPLayerControls,
  } = playerStore;

  // UI Store
  const {
      showSidebar,
  } = useUIStore();


  // Navigation state
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // Player state
  // Educational content state
  // const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  // const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const [currentSubtitle, setCurrentSubtitle] = useState<number | null>(null);
  const [manualSubtitleTime, setManualSubtitleTime] = useState<number | null>(
    null
  ); // Thời gian khi user click subtitle thủ công

  const [isFocusMode, setIsFocusMode] = useState(false); // State cho Focus mode
  const [repeatSubtitle, setRepeatSubtitle] = useState<
    (typeof subtitles)[0] | null
  >(null); // State cho subtitle đang repeat

  const [currentSubtitles, setCurrentSubtitles] = useState<typeof subtitles>(
    []
  );
  const [subtitleDisplayMode, setSubtitleDisplayMode] = useState<
    "both" | "english" | "vietnamese"
  >("both");
  // Refs
  
  const audioRef = useRef<any>(null);
  const virtuosoRef = useRef<any>(null);
  const { playerRef, handlePlayerRef } = usePlayerStore();

  // Event handlers
  useEffect(() => {
    // Set player ref trong store khi component mount
    // if (playerRef.current) {
    //   setPlayerRef(playerRef.current);
    // } 
  }, []);

  useEffect(() => {
    // Set refs trong store khi component mount
    setAudioRef(audioRef.current);
  }, []);

  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setCurrentLesson(null);
    setCurrentSubtitles([]);
  };

  const handleLessonSelect = (lesson: Lesson, autoPlay: boolean = false) => {
    console.log("handleLessonSelect called:", {
      lesson: lesson.title,
      autoPlay,
    });
    setCurrentLesson(lesson);
    setCurrentSubtitles(subtitles);

    setPLayerControls({ isPlaying: autoPlay , played: 0, playedSeconds: 0, seeking: false, duration: 0 }); // Chỉ phát nếu autoPlay = true

    // Reset thời gian và duration khi chuyển lesson
  };
  // Đăng ký callback khi component mount
  useEffect(() => {
    setLessonSelectHandler(handleLessonSelect);
  }, [setLessonSelectHandler]);
  
  const handleSubtitleClick = (subtitle: (typeof subtitles)[0]) => {
    // Convert subtitle start time (HH:MM:SS,mmm) to seconds with milliseconds precision
    const totalSeconds = timeToSeconds(subtitle.start);

    console.log("Seeking to subtitle:", {
      subtitle: subtitle.text,
      timeString: subtitle.start,
      totalSeconds: totalSeconds,
    });

    // Set manual selection time để khóa auto update trong 500ms
    setManualSubtitleTime(totalSeconds);

    // Set highlight cho subtitle được click
    setCurrentSubtitle(subtitle.id);

    // Seek video player
    if (currentLesson?.type === "video" && playerRef) {
      playerRef.currentTime = totalSeconds;
    }

    // Seek audio player
    if (currentLesson?.type === "audio" && audioRef.current) {
      audioRef.current.currentTime = totalSeconds;
    }

    // Clear manual time sau 1 giây để cho phép auto update trở lại
    setTimeout(() => {
      setManualSubtitleTime(null);
    }, 1000);
  };

  // Chuyển đổi thời gian từ "00:00:00,000" sang giây
  const timeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":");
    const [secs, ms] = seconds.split(",");

    return (
      Number(hours) * 3600 +
      Number(minutes) * 60 +
      Number(secs) +
      Number(ms) / 1000
    );
  };

  // Hàm theo dõi subtitle dựa trên thời gian hiện tại
  const updateCurrentSubtitle = (
    currentTime: number,
    prioritySubtitleId?: number
  ) => {
    console.log(
      "Updating subtitle for time:",
      currentTime,
      "Priority ID:",
      prioritySubtitleId
    );

    // Nếu vừa click subtitle thủ công (trong vòng 500ms), không auto update
    if (
      manualSubtitleTime &&
      Math.abs(currentTime - manualSubtitleTime) < 0.5
    ) {
      console.log("Skipping auto update due to recent manual selection");
      return;
    }

    // Tìm tất cả subtitle phù hợp với thời gian hiện tại
    const matchingSubtitles = subtitles.filter((sub) => {
      const startTime = timeToSeconds(sub.start);
      const endTime = timeToSeconds(sub.end);
      return currentTime >= startTime && currentTime <= endTime;
    });

    let current = null;

    if (matchingSubtitles.length > 0) {
      if (prioritySubtitleId) {
        // Nếu có priority subtitle và nó trong danh sách phù hợp, chọn nó
        current =
          matchingSubtitles.find((sub) => sub.id === prioritySubtitleId) ||
          matchingSubtitles[0];
      } else {
        // Không có priority, chọn subtitle đầu tiên trong danh sách
        current = matchingSubtitles[0];
      }
    }

    if (current && current.id !== currentSubtitle) {
      console.log("Setting current subtitle:", current.id, current.text);
      setCurrentSubtitle(current.id);

      // Auto scroll to current subtitle when Focus mode is enabled
      if (isFocusMode && virtuosoRef.current && currentSubtitles.length > 0) {
        const currentIndex = currentSubtitles.findIndex(
          (sub) => sub.id === current.id
        );
        if (currentIndex !== -1) {
          console.log("Auto-scrolling to subtitle index:", currentIndex);
          virtuosoRef.current.scrollToIndex({
            index: currentIndex,
            align: "center",
            behavior: "smooth",
          });
        }
      }
    } else if (!current && currentSubtitle && !manualSubtitleTime) {
      // Chỉ xóa highlight khi không có subtitle nào đang phát và không phải manual selection
      if (playerControls.isRepeating) return;
      console.log("Clearing current subtitle");
      setCurrentSubtitle(null);
    }
  };

  // Theo dõi thời gian video để xác định subtitle hiện tại
  const handleProgress = (_state: any) => {
    // const currentTime = state.playedSeconds;
    // updateCurrentSubtitle(currentTime);
  };

  // Hàm lấy lesson đầu tiên trong chapter
  const getFirstLessonInChapter = () => {
    if (!activeChapter || activeChapter.lessons.length === 0) return null;
    return activeChapter.lessons[0];
  };

  // Xử lý khi video kết thúc
  const handleEnded = () => {
    console.log("Video ended, checking conditions:", {
      // isRepeating,
      loop: playerControls.loop,
      isChapterLooping: playerControls.isChapterLooping,
      hasRepeatSubtitle: !!repeatSubtitle,
    });

    // Xử lý lặp lại subtitle - KHÔNG làm gì vì logic repeat đã tự xử lý
    if (playerControls.isRepeating && repeatSubtitle) {
      console.log("Subtitle repeat mode active - letting repeat logic handle");
      return;
    }

    // Nếu chapter looping được bật và video loop tắt
    if (playerControls.isChapterLooping && !playerControls.loop) {
      const nextLesson = getNextLesson();

      if (nextLesson) {
        console.log("Chapter loop: Playing next lesson:", nextLesson.title);
        handleLessonSelect(nextLesson, true);
      } else {
        // Đã hết lesson trong chapter, quay lại lesson đầu tiên
        const firstLesson = getFirstLessonInChapter();
        if (firstLesson) {
          console.log(
            "Chapter loop: Restarting chapter with first lesson:",
            firstLesson.title
          );
          handleLessonSelect(firstLesson, true);
        }
      }
      return;
    }

    // Logic mặc định: không loop gì cả
    if (!playerControls.loop) {
      console.log("No loop enabled, stopping playback");
      setPLayerControls({ isPlaying: false });
    }
  };

  // Xử lý khi bật/tắt repeat mode
  useEffect(() => {
    if (playerControls.isRepeating) {
      // Khi bật repeat, tìm subtitle hiện tại để repeat
      if (playerRef || audioRef.current) {
        const currentTime =
          (playerRef?.currentTime ?? 0) + 0.01 ||
          audioRef.current?.currentTime ||
          0;
        const current = subtitles.find((sub) => {
          const startTime = timeToSeconds(sub.start);
          const endTime = timeToSeconds(sub.end);
          return currentTime >= startTime && currentTime <= endTime;
        });

        if (current) {
          setRepeatSubtitle(current);
          setCurrentSubtitle(current.id);
          console.log("Repeat mode ON - Selected subtitle:", current.text);
        }
      }
    } else {
      // Khi tắt repeat, clear subtitle được repeat
      setRepeatSubtitle(null);
      console.log("Repeat mode OFF");
    }
  }, [playerControls.isRepeating]);

  // Logic repeat subtitle đơn giản
  useEffect(() => {
    if (!playerControls.isRepeating || !repeatSubtitle) return;

    const checkRepeat = () => {
      const player = playerRef || audioRef.current;
      if (!player) return;

      const currentTime = player.currentTime;
      const endTime = timeToSeconds(repeatSubtitle.end);

      // Nếu đã phát hết subtitle, quay lại đầu
      if (currentTime >= endTime) {
        const startTime = timeToSeconds(repeatSubtitle.start);
        player.currentTime = startTime + 0.01;
        console.log("Repeating subtitle:", repeatSubtitle.text);
      }
    };

    const interval = setInterval(checkRepeat, 100);
    return () => clearInterval(interval);
  }, [playerControls.isRepeating, repeatSubtitle]);

  // Điều khiển volume cho audio/video elements
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerControls.volume;
    }
  }, [playerControls.volume]);

  const handleTimeUpdate = () => {
    const player = playerRef;
    // Chỉ update khi không kéo thanh seekbar
    if (!player || playerControls.seeking) return;
    if (!player.duration) return;

    setPLayerControls({ played: player.currentTime / player.duration, playedSeconds: player.currentTime });
    
    // Cập nhật subtitle highlight cho video
    updateCurrentSubtitle(player.currentTime);

    // Cập nhật duration nếu chưa có
    if (playerControls.duration === 0 && player.duration) {
      setPLayerControls({ duration: player.duration });
    }
  };

  // Hàm xử lý khi video load và có duration
  const handleDuration = (duration: number) => {
    setPLayerControls({ duration: duration });
  };
  
  // const { played, loop } = state;

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      <HeaderStudy />
      

      {/* Top Navigation */}
      

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

          {/* Sidebar Navigation */}
          {showSidebar && (
                <aside
                  className={`fixed h-full xl:static inset-y-0 left-0 z-40 w-60 lg:w-72 bg-gray-900 border-r border-gray-800 transform transition-all duration-300 ease-in-out ${
                    isNavCollapsed
                      ? "-translate-x-full xl:translate-x-0"
                      : "translate-x-0"
                  } overflow-y-auto animate-in slide-in-from-left`}
                >
                  <div className="p-3 lg:p-6">
                    <h2 className="text-white font-semibold mb-4 lg:mb-6 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Learning Dashboard
                    </h2>

                    <nav className="space-y-1 lg:space-y-2">
                      {[
                        { id: "dashboard", label: "Dashboard", icon: BookOpen },
                        { id: "courses", label: "My Courses", icon: Video },
                        { id: "progress", label: "Progress", icon: List },
                        {
                          id: "certificates",
                          label: "Certificates",
                          icon: Plus,
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center"
                        >
                          <item.icon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>
          )}
            {/* Main Content Area */}
            <div
              className={`flex-1 flex overflow-hidden transition-all duration-300 h-full ${
                !isNavCollapsed ? "xl:ml-0" : "ml-0"
              }`}
            >
              {/* Left Panel - Course Content or Video Player */}
              <section
                className={`w-full ${
                  isShowFavorite ? "md:w-2/5" : "md:w-1/2"
                } bg-black border-r border-gray-800 flex flex-col overflow-hidden`}
              >
                {selectedCourse ? (
                  <div className="flex flex-col h-full">
                    {/* Course/Lesson Header - Fixed */}
                    <div className="relative flex-shrink-0">
                      {currentLesson ? (
                        // Video/Audio Player
                        <div className="w-full h-48 sm:h-56 lg:h-64 bg-black flex items-center justify-center">
                          {currentLesson.type === "video" ? (
                            <ReactPlayer
                              ref={handlePlayerRef}
                              src={currentLesson.url}
                              width="100%"
                              height="100%"
                              controls={true}
                              playing={playerControls.isPlaying}
                              volume={playerControls.volume}
                              muted={playerControls.muted}
                              loop={playerControls.loop}
                              onProgress={handleProgress}
                              onTimeUpdate={handleTimeUpdate}
                              onDuration={handleDuration}
                              onEnded={handleEnded}
                              onPlay={() => setPLayerControls({ isPlaying: true })}
                              onPause={() => setPLayerControls({ isPlaying: false })}
                              {...({} as any)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                              <div className="text-center">
                                <Mic className="w-16 h-16 text-white mx-auto mb-4" />
                                <h3 className="text-white text-lg font-medium">
                                  {currentLesson.title}
                                </h3>
                                <p className="text-gray-200 text-sm">
                                  Audio Lesson
                                </p>
                                <audio
                                  ref={audioRef}
                                  className="mt-4"
                                  controls
                                  loop={playerControls.loop}
                                  src={currentLesson.url}
                                  onPlay={() => setPLayerControls({ isPlaying: true })}
                                  onPause={() => setPLayerControls({ isPlaying: false })}
                                  onDurationChange={(e) =>
                                    handleDuration(
                                      (e.target as HTMLAudioElement).duration
                                    )
                                  }
                                  onTimeUpdate={(e) => {
                                    const audio = e.target as HTMLAudioElement;
                                    if (!playerControls.seeking && audio.duration) {
                                      setPLayerControls({ played: audio.currentTime / audio.duration });
                                      setPLayerControls({ playedSeconds: audio.currentTime });
                                      // Cập nhật subtitle highlight cho audio
                                      updateCurrentSubtitle(audio.currentTime);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Course Image
                        <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative">
                          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                            <div className="flex items-end justify-between">
                              <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-white">
                                  {selectedCourse.title}
                                </h1>
                                <p className="text-gray-200 text-sm mt-2">
                                  {selectedCourse.description}
                                </p>
                              </div>
                              <div className="text-right text-sm text-white">
                                <div className="text-base lg:text-lg">
                                  {selectedCourse.chapters.length}
                                </div>
                                <div className="text-xs lg:text-sm">
                                  Chapters
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chapter Tabs - Fixed */}
                    <div className="bg-black border-b border-gray-800 flex-shrink-0">
                      <div className="flex space-x-0 overflow-x-auto">
                        {selectedCourse.chapters.map((chapter) => (
                          <button
                            key={chapter.id}
                            onClick={() => handleChapterSelect(chapter)}
                            className={`px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                              activeChapter?.id === chapter.id
                                ? "text-green-400 border-green-400 bg-gray-900"
                                : "text-gray-400 border-transparent hover:text-white hover:bg-gray-900"
                            }`}
                          >
                            <span>{chapter.title}</span>
                            <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                              {chapter.lessons.length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lessons List - Scrollable */}
                    {activeChapter && (
                      <div className="flex-1 overflow-y-auto">
                        {activeChapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 hover:bg-gray-900 border-b border-gray-800 group cursor-pointer ${
                              currentLesson?.id === lesson.id
                                ? "bg-gray-900 border-green-500"
                                : ""
                            }`}
                            onClick={() => handleLessonSelect(lesson)}
                          >
                            <button className="mr-3 lg:mr-4 text-gray-400 hover:text-white">
                              {lesson.type === "video" ? (
                                <Video className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Mic className="w-4 h-4 text-orange-400" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="text-white truncate text-sm lg:text-base">
                                {lesson.title}
                              </div>
                              <div className="text-gray-400 text-xs lg:text-sm">
                                {lesson.type === "video"
                                  ? "Video Lesson"
                                  : "Audio Lesson"}
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <button
                                className="text-gray-400 hover:text-white p-1"
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngăn click event lan ra div cha
                                  console.log("Play button clicked:", {
                                    currentLessonId: currentLesson?.id,
                                    clickedLessonId: lesson.id,
                                    isCurrentLesson:
                                      currentLesson?.id === lesson.id,
                                    isPlaying: playerControls.isPlaying,
                                  });

                                  if (currentLesson?.id === lesson.id) {
                                    // Nếu là lesson đang được chọn, chỉ toggle play/pause
                                    console.log(
                                      "Same lesson - Toggling play/pause:",
                                      !playerControls.isPlaying
                                    );
                                    setPLayerControls({ isPlaying: !playerControls.isPlaying });
                                  } else {
                                    // Nếu là lesson khác, chọn lesson này và phát luôn
                                    console.log(
                                      "Different lesson - Selecting and playing"
                                    );
                                    handleLessonSelect(lesson, true);
                                  }
                                }}
                              >
                                {currentLesson?.id === lesson.id &&
                                playerControls.isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Default Course Selection State
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-gray-400 text-lg font-medium">
                        Select a Course
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Choose a course from the right panel to start learning
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Center Panel - Subtitles */}
              <section
                className={`hidden md:block w-full ${
                  isShowFavorite ? "md:w-2/5" : "md:w-1/2"
                } bg-gray-900 flex flex-col overflow-y-auto`}
              >
                <div className="p-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-semibold flex items-center">
                        <List className="w-5 h-5 mr-2" />
                        Subtitles & Transcript
                      </h3>

                      {/* Focus Mode Button */}
                      <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all border ${
                          isFocusMode
                            ? "bg-orange-600 text-white border-orange-500 shadow-md"
                            : "bg-transparent text-orange-400 border-orange-400 hover:bg-orange-600 hover:text-white"
                        }`}
                        title="Focus mode: Highlight only current subtitle"
                      >
                        Focus
                      </button>
                    </div>

                    {/* Subtitle Language Tabs */}
                    <div className="flex items-center bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setSubtitleDisplayMode("both")}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          subtitleDisplayMode === "both"
                            ? "bg-green-600 text-white shadow-md"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                      >
                        EN+VI
                      </button>
                      <button
                        onClick={() => setSubtitleDisplayMode("english")}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          subtitleDisplayMode === "english"
                            ? "bg-green-600 text-white shadow-md"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setSubtitleDisplayMode("vietnamese")}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          subtitleDisplayMode === "vietnamese"
                            ? "bg-green-600 text-white shadow-md"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                      >
                        VI
                      </button>
                    </div>
                  </div>
                </div>

                {currentLesson ? (
                  <div className="flex-1 px-4 pb-4">
                    <Virtuoso
                      ref={virtuosoRef}
                      data={currentSubtitles}
                      style={{ height: "500px" }}
                      itemContent={(_, subtitle) => (
                        <div
                          key={subtitle.id}
                          className={`relative p-3 mb-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group ${
                            currentSubtitle === subtitle.id
                              ? "bg-green-800 border border-green-600"
                              : "bg-gray-800"
                          }`}
                          onClick={() => handleSubtitleClick(subtitle)}
                        >
                          <div className="pr-8">
                          {(subtitleDisplayMode === "both" ||
                            subtitleDisplayMode === "english") && (
                            <div
                              className={`text-white text-sm group-hover:text-green-400 ${
                                subtitleDisplayMode === "both" &&
                                subtitle.textVi
                                  ? "mb-2"
                                  : ""
                              }`}
                            >
                              {subtitle.text}
                            </div>
                          )}
                          {(subtitleDisplayMode === "both" ||
                            subtitleDisplayMode === "vietnamese") &&
                            subtitle.textVi && (
                              <div className="text-yellow-300 text-sm group-hover:text-yellow-200 italic">
                                {subtitle.textVi}
                              </div>
                            )}
                          </div>
                          {/* Save Icon - chỉ hiện khi hover */}
                          <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded hover:bg-gray-600"
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn click event lan ra subtitle div
                              console.log("Save subtitle:", subtitle.text);
                              // TODO: Implement save functionality
                            }}
                            title="Save this subtitle"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-500">
                        <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Select a lesson to view subtitles</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Right Panel - Course List */}
              <RightSidebar />
            </div>

      </div>

      {/* Bottom Control Bar */}
      <Footer />

      {/* Mobile Overlay */}
      {!isNavCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
          onClick={() => setIsNavCollapsed(true)}
        />
      )}
    </div>
  );
});
