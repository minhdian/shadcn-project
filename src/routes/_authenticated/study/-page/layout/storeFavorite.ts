import { makeAutoObservable } from 'mobx'
import { playerStore } from './storePlayer'
import { savedSubtitlesStore } from './storeSavedSubtitle'
import { subtitles } from '../mock-sub'

interface Lesson {
  id: number
  title: string
  type: 'video' | 'audio'
  url: string
  subtitle: string
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
}

interface Course {
  id: number
  title: string
  image: string
  description: string
  chapters: Chapter[]
}
class FavoriteStore {
  private _courses: Course[] = []
  private _selectedCourse: Course | null = null
  private _activeChapter: Chapter | null = null
  private _currentLesson: Lesson | null = null


  // Callback cho play saved subtitle
  onPlaySavedSubtitle: ((savedSubtitle: any) => void) | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get courses() {
    return this._courses
  }
  setCourses = (courses: Course[]) => {
    this._courses = courses
  }

  get selectedCourse() {
    return this._selectedCourse
  }
  setSelectedCourse = (course: Course) => {
    this._selectedCourse = course
    if (course.chapters.length > 0) {
      this.setActiveChapter(course.chapters[0])
      this.setCurrentLesson(null)
    }
  }

  get activeChapter() {
    return this._activeChapter
  }
  setActiveChapter = (chapter: Chapter) => {
    this._activeChapter = chapter
  }

  get currentLesson() {
    return this._currentLesson
  }
  setCurrentLesson = (lesson: Lesson | null) => {
    this._currentLesson = lesson
  }


  //helper methods
  // Hàm lấy lesson trước đó trong chapter
  getPreviousLesson = () => {
    if (!this._activeChapter || !this._currentLesson) return null

    const currentIndex = this._activeChapter.lessons.findIndex(
      (lesson) => lesson.id === this._currentLesson!.id
    )

    if (currentIndex === -1 || currentIndex === 0) {
      return null // Không tìm thấy hoặc đã là lesson đầu tiên
    }

    return this._activeChapter.lessons[currentIndex - 1]
  }
  // Hàm lấy lesson tiếp theo trong chapter
  getNextLesson = () => {
    if (!this._activeChapter || !this._currentLesson) return null

    const currentIndex = this._activeChapter.lessons.findIndex(
      (lesson) => lesson.id === this._currentLesson!.id
    )
    if (
      currentIndex === -1 ||
      currentIndex === this._activeChapter.lessons.length - 1
    ) {
      return null // Không tìm thấy hoặc đã là lesson cuối
    }

    return this._activeChapter.lessons[currentIndex + 1]
  }

  // Xử lý skip về lesson trước đó
  handleSkipBackClick = () => {
    const previousLesson = this.getPreviousLesson()
    if (previousLesson) {
      console.log('Skipping to previous lesson:', previousLesson.title)
      this.handleLessonSelect(previousLesson, playerStore.playerControls.isPlaying) // Giữ nguyên trạng thái play/pause
    } else {
      console.log('No previous lesson available')
    }
  }
  // Xử lý skip đến lesson tiếp theo
  handleSkipForwardClick = () => {
    const nextLesson = this.getNextLesson()
    if (nextLesson) {
      console.log('Skipping to next lesson:', nextLesson.title)
      this.handleLessonSelect(nextLesson, playerStore.playerControls.isPlaying) // Giữ nguyên trạng thái play/pause
    } else {
      console.log('No next lesson available')
    }
  }

  //setCurrentSubtitles([]);

  setPlaySavedSubtitleHandler = (handler: (savedSubtitle: any) => void) => {
    this.onPlaySavedSubtitle = handler
  }

  // Method để play saved subtitle
  handlePlaySavedSubtitle = (savedSubtitle: any) => {
    console.log(
      '🏪 FavoriteStore - handlePlaySavedSubtitle called with:',
      savedSubtitle
    )
    console.log(
      '🏪 onPlaySavedSubtitle callback exists:',
      !!this.onPlaySavedSubtitle
    )

    if (this.onPlaySavedSubtitle) {
      console.log('🏪 Calling onPlaySavedSubtitle callback...')
      this.onPlaySavedSubtitle(savedSubtitle)
    } else {
      console.error('🏪 ❌ No onPlaySavedSubtitle callback registered!')
    }
  }

  handleChapterSelect = (chapter: Chapter) => {
    this.setActiveChapter(chapter);
    this.setCurrentLesson(null);
    savedSubtitlesStore.setCurrentSubtitles([]);
  };

  // Hàm lấy lesson đầu tiên trong chapter
  getFirstLessonInChapter = () => {
      if (!this._activeChapter || this._activeChapter.lessons.length === 0) return null; 
      return this._activeChapter.lessons[0];
  };

  handleLessonSelect = (lesson: Lesson, autoPlay: boolean = false) => {
      this.setCurrentLesson(lesson);
      savedSubtitlesStore.setCurrentSubtitles(subtitles);
      playerStore.setPLayerControls({ isPlaying: autoPlay , played: 0, playedSeconds: 0, seeking: false, duration: 0 }); // Chỉ phát nếu autoPlay = true
      // Reset thời gian và duration khi chuyển lesson
  };
}

export const favoriteStore = new FavoriteStore()
