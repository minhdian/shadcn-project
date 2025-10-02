import { observer } from "mobx-react-lite";
import { layoutStore } from "../../../store";
import { BookOpen, Clock, Play, Trash2 } from "lucide-react";
import mockCourseData from "../../../../mock-course.json";
import { favoriteStore } from "../../../storeFavorite";
import { savedSubtitlesStore } from "../../../storeSavedSubtitle";

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
export const Favorite = observer(() => {

 const { isShowFavorite } = layoutStore;
 const { selectedCourse, setSelectedCourse, playSavedSubtitle } = favoriteStore;
 const { savedSubtitles, removeSavedSubtitle, clearAllSaved } = savedSubtitlesStore;

  // Convert mock data to proper types
  const courses: Course[] = mockCourseData.courses.map((course) => ({
    ...course,
    chapters: course.chapters.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => ({
        ...lesson,
        type: lesson.type as "video" | "audio",
      })),
    })),
  }));

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handlePlaySavedSubtitle = (savedSubtitle: any) => {
    console.log("🎯 Favorite component - Play clicked:", {
      subtitleId: savedSubtitle.subtitleId,
      subtitleText: savedSubtitle.subtitleText,
      courseId: savedSubtitle.courseId,
      chapterId: savedSubtitle.chapterId,
      lessonId: savedSubtitle.lessonId
    });
    
    console.log("🎯 Calling playSavedSubtitle function...");
    playSavedSubtitle(savedSubtitle);
  };
  const formatTime = (timeString: string) => {
    return timeString.replace(',', '.');
  };
  return <>
    
    {isShowFavorite && (
      
        <section className="hidden lg:block w-full lg:w-1/5 bg-gray-100 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 font-semibold flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Saved Subtitles
              </h3>
              {savedSubtitles.length > 0 && (
                <button
                  onClick={clearAllSaved}
                  className="text-red-500 hover:text-red-700 text-xs"
                  title="Clear all saved subtitles"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Saved Subtitles List */}
            <div className="space-y-3 mb-6">
              {savedSubtitles.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No saved subtitles yet</p>
                  <p className="text-gray-400 text-xs">Click save icon on subtitles to add them here</p>
                </div>
              ) : (
                savedSubtitles.map((savedSubtitle) => (
                  <div
                    key={savedSubtitle.id}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all group"
                  >
                    {/* Course & Lesson Info */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-medium text-blue-600 truncate">
                          {savedSubtitle.courseTitle}
                        </h5>
                        <h6 className="text-xs text-gray-600 truncate">
                          {savedSubtitle.chapterTitle} • {savedSubtitle.lessonTitle}
                        </h6>
                      </div>
                      <button
                        onClick={() => removeSavedSubtitle(savedSubtitle.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                        title="Remove saved subtitle"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtitle Content */}
                    <div
                      className="cursor-pointer bg-gray-50 rounded p-2 mb-2 hover:bg-gray-100 transition-colors"
                      onClick={() => handlePlaySavedSubtitle(savedSubtitle)}
                    >
                      <p className="text-sm text-gray-800 mb-1 line-clamp-2">
                        {savedSubtitle.subtitleText}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(savedSubtitle.subtitleStart)}
                        </div>
                        <button className="text-green-600 hover:text-green-700 p-1">
                          <Play className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Saved Date */}
                    <div className="text-xs text-gray-400">Saved
                      {/* Saved {formatDate(savedSubtitle.savedAt)} */}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Available Courses Section */}
            {/* <div className="border-t border-gray-300 pt-4">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Available Courses
              </h3>

              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`bg-white rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedCourse?.id === course.id
                        ? "ring-2 ring-green-500 shadow-lg"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 h-24 rounded-lg mb-3"></div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {course.chapters.length} chapters
                      </span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        {course.chapters.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0
                        )}{" "}
                        lessons
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </section>
              )}
  </>;
})