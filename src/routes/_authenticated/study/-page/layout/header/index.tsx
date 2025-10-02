import { Bell, BookOpen, Command, Search, Settings, User } from "lucide-react";
import { layoutStore } from "../store"; 
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import mockCourseData from "../../mock-course.json";
import { favoriteStore } from "../storeFavorite";

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
export const HeaderStudy = observer(() => {
    const { isShowControl, toggleControl, isShowFavorite, toggleFavorite } = layoutStore;
     const { selectedCourse, setSelectedCourse, setCourses } = favoriteStore;
    const [isCommandOpen, setIsCommandOpen] = useState(false);

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
  useEffect(() => {
    setCourses(courses);
  }, [setCourses]);

  // Handle click outside dialog
  const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          setIsCommandOpen(false);
      }
  };
  
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  return (
    <>
    <nav className="bg-black border-b border-gray-800 px-3 lg:px-6 py-2 lg:py-3">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className="text-lg lg:text-xl font-bold hidden sm:block">
                EduPlatform
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md lg:max-w-xl mx-3 lg:mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search courses, lessons..."
                className="w-full bg-gray-800 text-white pl-9 lg:pl-12 pr-4 py-2 lg:py-3 rounded-full text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Command Palette Button */}
            <button 
                onClick={() => setIsCommandOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Open command palette"
            >
                <Command className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* 3 Tabs */}
            <div
              className="hidden md:flex items-center bg-gray-800 rounded-lg p-1 ml-4 relative"
             
              title="Double-click to clear all tabs"
            >
              <button
                onClick={() => toggleControl()}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  isShowControl
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                Control
              </button>
              <button
                onClick={() => toggleFavorite()}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  isShowFavorite
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                Favorites
              </button>
            </div>

            <button className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <User className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Command Palette Dialog */}
            {isCommandOpen && (
                <div 
                onClick={handleOverlayClick}
                className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-popover rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-slate-700 p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Type a command or search..."
                                    className="w-full bg-slate-700 text-white pl-10 pr-10 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setIsCommandOpen(false)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="max-h-80 overflow-y-auto">
                            {/* General Section */}
                            <div className="p-2">
                                <div className="px-2 py-1 text-xs text-slate-400 font-medium uppercase tracking-wide">
                                    General
                                </div>
                                {courses.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-700 transition-colors text-left group"
                                        onClick={() => {
                                            console.log(`Navigate to ${item.title}`);
                                            handleCourseSelect(item);
                                            setIsCommandOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center space-x-3 flex-1">
                                            <span className="text-slate-400 group-hover:text-white">
                                                →
                                            </span>
                                            <span className="text-white font-medium">
                                                {item.title}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </>
  )
  
  
})