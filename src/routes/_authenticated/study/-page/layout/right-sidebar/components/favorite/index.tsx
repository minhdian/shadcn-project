import { observer } from "mobx-react-lite";
import { layoutStore } from "../../../store";
import { BookOpen } from "lucide-react";
import mockCourseData from "../../../../mock-course.json";
import { favoriteStore } from "../../../storeFavorite";

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

 const { isShowControl, toggleControl, isShowFavorite, toggleFavorite } = layoutStore;
 const { selectedCourse, setSelectedCourse, activeChapter, setActiveChapter, currentLesson, setCurrentLesson } = favoriteStore;

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

  return <>
    
    {isShowFavorite && (
      
                <section className="hidden lg:block w-full lg:w-1/5 bg-gray-100 overflow-y-auto animate-in slide-in-from-right duration-300">
                  <div className="p-4">
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
                                (total, chapter) =>
                                  total + chapter.lessons.length,
                                0
                              )}{" "}
                              lessons
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
  </>;
})