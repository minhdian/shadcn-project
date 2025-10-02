import { makeAutoObservable } from "mobx";

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

class SavedSubtitlesStore {
   private _savedSubtitles: SavedSubtitle[] = [];

  constructor() {
    makeAutoObservable(this);
    
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

} 

export const savedSubtitlesStore = new SavedSubtitlesStore();