import { makeAutoObservable } from "mobx";
import { subtitles } from "../mock-sub";
import { playerStore } from "./storePlayer";
import { favoriteStore } from "./storeFavorite";
import { VirtuosoHandle } from "react-virtuoso";
import { use, useCallback } from "react";

interface SavedSubtitle {
  id: string; // unique id
  subtitleId: number;
  subtitleText: string;
  subtitleStart: string;
  subtitleEnd: string;
  courseId: number;
  courseTitle: string;
  chapterId: number;
  chapterTitle: string;
  lessonId: number;
  lessonTitle: string;
}
interface subtitles {
    id: number;
    start: string;
    end: string;
    text: string;
    textVi?: string | undefined;
} 

class SavedSubtitlesStore {
   private _savedSubtitles: SavedSubtitle[] = [];
  private _manualSubtitleTime: number | null = null;
  private _currentSubtitles: subtitles[] = [];
  private _currentSubtitleIndex: number | null = null;
  private _autoScroll: boolean = false;
  private _repeatSubtitle: subtitles | null = null;

  constructor() {
    makeAutoObservable(this);
    
  }

  get autoScroll() {
    return this._autoScroll;
  }
  setAutoScroll = (value: boolean) => {
    this._autoScroll = value;
  }

  get repeatSubtitle() {
    return this._repeatSubtitle;
  }
  setRepeatSubtitle = (subtitle: subtitles | null) => {
    this._repeatSubtitle = subtitle;
  }

  get currentSubtitleIndex() {
    return this._currentSubtitleIndex;
  }
  setCurrentSubtitleIndex = (index: number | null) => {
    this._currentSubtitleIndex = index;
  }
  
  get currentSubtitles() {
    return this._currentSubtitles;
  }
  setCurrentSubtitles = (subtitles: subtitles[]) => {
    this._currentSubtitles = subtitles;
  }

  get manualSubtitleTime() {
    return this._manualSubtitleTime;
  }
  setManualSubtitleTime = (time: number | null) => {
    this._manualSubtitleTime = time;
  }

  get savedSubtitles() {
    return this._savedSubtitles;
  }

  addSavedSubtitle = (subtitle: any, course: any, chapter: any, lesson: any) =>{
    const newSavedSubtitle: SavedSubtitle = {
      id: `${course.id}-${chapter.id}-${lesson.id}-${subtitle.id}-${Date.now()}`, // unique id
      subtitleId: subtitle.id,
      subtitleText: subtitle.text,
      subtitleStart: subtitle.start,
      subtitleEnd: subtitle.end,
      courseId: course.id,
      courseTitle: course.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    };
    // Kiểm tra đã lưu chưa
    console.log("newSavedSubtitle", newSavedSubtitle);
    
    const exists = this._savedSubtitles.some(
      (saved) =>
        saved.subtitleId === subtitle.id &&
        saved.lessonId === lesson.id &&
        saved.courseId === course.id
    );

    if (!exists) {
      this._savedSubtitles.push(newSavedSubtitle); // Thêm vào cuối list
    } else {
      console.log("Subtitle already saved");
    }
  }

  // Xóa subtitle đã lưu
  removeSavedSubtitle = (id: string) => {
    this._savedSubtitles = this._savedSubtitles.filter(
      (saved) => saved.id !== id
    );
  };

  // Xóa tất cả
  clearAllSaved = () => {
    this._savedSubtitles = [];
  };

  // Lấy subtitle theo course
  getSavedSubtitlesByCourse = (courseId: number) => {
    return this._savedSubtitles.filter((saved) => saved.courseId === courseId);
  };

  // Check subtitle đã được lưu chưa
  isSubtitleSaved = (subtitleId: number, lessonId: number, courseId: number) => {
    return this._savedSubtitles.some(
      (saved) =>
        saved.subtitleId === subtitleId &&
        saved.lessonId === lessonId &&
        saved.courseId === courseId
    );
  };

  handleSortFavorite = (currentIndex: number, newIndex: number) => {
    if (newIndex < 0 || newIndex >= this._savedSubtitles.length) {
      console.error("New index is out of bounds");
      return;
    }
    const updatedSubtitles = [...this._savedSubtitles];
    const [movedSubtitle] = updatedSubtitles.splice(currentIndex, 1);
    updatedSubtitles.splice(newIndex, 0, movedSubtitle);
    this._savedSubtitles = updatedSubtitles;
  }

  // Chuyển đổi thời gian từ "00:00:00,000" sang giây
  timeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":");
    const [secs, ms] = seconds.split(",");

    const result = (
      Number(hours) * 3600 +
      Number(minutes) * 60 +
      Number(secs) +
      Number(ms) / 1000
    );
    
    return result;
  };
  handleTimeUpdate = () => {
        const { playerRef, virtuosoRef, isTransitioning, playerControls, setPLayerControls } = playerStore;

        const player = playerRef;
        // Chỉ update khi không kéo thanh seekbar và không đang transition
        if (!player || playerControls.seeking || isTransitioning) return;
        if (!player.duration) return;

        setPLayerControls({ played: player.currentTime / player.duration, playedSeconds: player.currentTime });
        
        // Cập nhật subtitle highlight cho video
        this.updateCurrentSubtitle(player.currentTime, virtuosoRef, this.autoScroll);

        // Cập nhật duration nếu chưa có
        if (playerControls.duration === 0 && player.duration) {
        setPLayerControls({ duration: player.duration });
        }
    };
  // Hàm theo dõi subtitle dựa trên thời gian hiện tại
  updateCurrentSubtitle = (
        currentTime: number,
        virtuosoRef: VirtuosoHandle | null,
        autoScroll: boolean,
      ) => {
    
        // Nếu vừa click subtitle thủ công (trong vòng 500ms), không auto update
        if (
          this.manualSubtitleTime &&
          Math.abs(currentTime - this.manualSubtitleTime) < 0.5
        ) {
          console.log("Skipping auto update due to recent manual selection");
          return;
        }
    
        // Tìm subtitle hiện tại dựa trên logic: từ sub.start cho đến sub.start tiếp theo
        let current = null;
        
        for (let i = 0; i < subtitles.length; i++) {
          const subtitle = subtitles[i];
          const startTime = this.timeToSeconds(subtitle.start);
          
          // Lấy thời gian bắt đầu của subtitle tiếp theo (nếu có)
          const nextSubtitle = subtitles[i + 1];
          const nextStartTime = nextSubtitle ? this.timeToSeconds(nextSubtitle.start) : Infinity;
          
          // Kiểm tra xem currentTime có nằm trong khoảng [startTime, nextStartTime)
          if (currentTime >= startTime && currentTime < nextStartTime) {
            current = subtitle;
            break;
          }
        }
    
        // Set subtitle hiện tại
        if (current) {
          if (current.id !== this.currentSubtitleIndex) {
            console.log("Setting current subtitle:", current.id, current.text);
            this.setCurrentSubtitleIndex(current.id);
    
            // Auto scroll to current subtitle when Focus mode is enabled
            if (autoScroll && virtuosoRef && this.currentSubtitles.length > 0) {
              const currentIndex = this.currentSubtitles.findIndex(
                (sub) => sub.id === current.id
              );
              if (currentIndex !== -1) {
                console.log("Auto-scrolling to subtitle index:", currentIndex);
                virtuosoRef?.scrollToIndex({
                  index: currentIndex,
                  align: "center",
                  behavior: "smooth",
                });
              }
            }
          }
        } else {
          // Chỉ clear highlight khi không có subtitle nào phù hợp
          if (this.currentSubtitleIndex !== null && !playerStore.playerControls.isRepeating) {
            console.log("Clearing current subtitle");
            this.setCurrentSubtitleIndex(null);
          }
        }
    };

  handleSubtitleClick = (subtitle: (typeof subtitles)[0]) => {
        // Convert subtitle start time (HH:MM:SS,mmm) to seconds with milliseconds precision
        const totalSeconds = this.timeToSeconds(subtitle.start);
    
        // Set manual selection time để khóa auto update trong 500ms
        this.setManualSubtitleTime(totalSeconds);

        // Set highlight cho subtitle được click
        this.setCurrentSubtitleIndex(subtitle.id);

        // Seek video player
        if (favoriteStore.currentLesson?.type === "video" && playerStore.playerRef) {
          playerStore.playerRef.currentTime = totalSeconds;
        }
    
        // Seek audio player
        // if (currentLesson?.type === "audio" && audioRef.current) {
        //   audioRef.current.currentTime = totalSeconds;
        // }
    
        // Clear manual time sau 1 giây để cho phép auto update trở lại
        setTimeout(() => {
          this.setManualSubtitleTime(null);
        }, 1000);
    };

    // Handler cho save subtitle
    handleSaveSubtitle = (subtitle: any) => {
      const { selectedCourse, activeChapter, currentLesson } = favoriteStore;
    
      if (!selectedCourse || !activeChapter || !currentLesson) {
          console.warn("Missing context for saving subtitle");
          return;
      }
  
      this.addSavedSubtitle(
          subtitle,
          selectedCourse,
          activeChapter,
          currentLesson
      );
    };

    handlePlaySavedSubtitle = (savedSubtitle: any) => {
    const { selectedCourse, setSelectedCourse, activeChapter, setActiveChapter, handleLessonSelect } = favoriteStore;
    const { playerRef, audioRef, setPlayerCurrentTime, virtuosoRef } = playerStore;
    // 1. Tìm target course từ courses array
    console.log("Available courses:", favoriteStore.courses.map(c => ({ id: c.id, title: c.title })));
    const targetCourse = favoriteStore.courses.find(c => c.id === savedSubtitle.courseId);
    
    if (!targetCourse) {
      console.log("Available course IDs:", favoriteStore.courses.map(c => c.id));
      return;
    }

    // 2. Tìm target chapter từ target course
    console.log("Available chapters in course:", targetCourse.chapters.map(c => ({ id: c.id, title: c.title })));
    const targetChapter = targetCourse.chapters.find(c => c.id === savedSubtitle.chapterId);
    
    if (!targetChapter) {
      console.log("Available chapter IDs:", targetCourse.chapters.map(c => c.id));
      return;
    }

    // 3. Tìm target lesson từ target chapter
    console.log("Available lessons in chapter:", targetChapter.lessons.map(l => ({ id: l.id, title: l.title })));
    const targetLesson = targetChapter.lessons.find(l => l.id === savedSubtitle.lessonId);
    
    if (!targetLesson) {
      console.log("Available lesson IDs:", targetChapter.lessons.map(l => l.id));
      return;
    }

    // 4-5. Set course và chapter
    if (!selectedCourse || selectedCourse.id !== savedSubtitle.courseId) {
      setSelectedCourse(targetCourse);
    } else {
      console.log("✅ Course already selected");
    }

    if (!activeChapter || activeChapter.id !== savedSubtitle.chapterId) {
      setActiveChapter(targetChapter);
    } else {
      console.log("✅ Chapter already selected");
    }

    // 6. Set lesson
    handleLessonSelect(targetLesson, true);
    
    // 7. Seek với timeout
    setTimeout(() => {

      const targetTime = this.timeToSeconds(savedSubtitle.subtitleStart);
      setPlayerCurrentTime(targetTime);
      
      if (targetLesson.type === "video" && playerRef) {
        playerRef.currentTime = targetTime;
      } else if (targetLesson.type === "audio" && audioRef?.current) {
        audioRef.current.currentTime = targetTime;
      } else {
        console.error("❌ No player available for seeking");  
      }
      // Highlight subtitle
      this.setCurrentSubtitleIndex(savedSubtitle.subtitleId);
      
      playerStore.scrollToIndex(savedSubtitle.subtitleId);
      // virtuosoRef.scrollToIndex({
      //       index: savedSubtitle.subtitleId,
      //       align: "center",
      //       behavior: "smooth",
      // });
      
      if (virtuosoRef && this.currentSubtitles.length > 0) {
        const subtitleIndex = this.currentSubtitles.findIndex(
          sub => sub.id === savedSubtitle.subtitleId
        );

        if (subtitleIndex !== -1) {
          console.log("📜 Scrolling to subtitle index:", subtitleIndex);
          virtuosoRef.scrollToIndex({
            index: subtitleIndex,
            align: "center",
            behavior: "smooth",
          });
        } else {
          console.warn("⚠️ Subtitle not found in current subtitles");
        }
      } else {
        console.warn("⚠️ Cannot scroll - virtuoso or subtitles not ready");
      }
      
    }, 1000);
    };



} 

export const savedSubtitlesStore = new SavedSubtitlesStore();