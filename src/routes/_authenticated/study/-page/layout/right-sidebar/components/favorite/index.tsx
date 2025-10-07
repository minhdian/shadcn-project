import { observer } from "mobx-react-lite";
import { layoutStore } from "../../../store";
import { ArrowUpDown, BookOpen, Clock, Play, Trash2 } from "lucide-react";
import { favoriteStore } from "../../../storeFavorite";
import { savedSubtitlesStore } from "../../../storeSavedSubtitle";
import { useState } from "react";

export const Favorite = observer(() => {
 const { isShowFavorite } = layoutStore;
 const {  playSavedSubtitle } = favoriteStore;
 const { savedSubtitles, removeSavedSubtitle, clearAllSaved, handleSortFavorite } = savedSubtitlesStore;
 
 // Use API instead of mock data
//  const { courseData, loading, error } = useCourseData();

  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(0);
  const [newPosition, setNewPosition] = useState("");

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
  const handleShowSortModal = (subtitleIndex: number) => {
    setSelectedSubtitleIndex(subtitleIndex);
    setNewPosition("");
    setShowSortModal(true);
  };
  
  const handleConfirmSort = () => {
    handleSortFavorite(selectedSubtitleIndex, Number(newPosition) - 1);
    // TODO: Implement sort functionality
    // console.log(`Moving subtitle from position ${selectedSubtitleIndex + 1} to position ${newPosition}`);
    setShowSortModal(false);
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
            {/* File Manager Component */}
          <div className="mb-6">
            
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
                savedSubtitles.map((savedSubtitle, index) => (
                  <div
                    key={savedSubtitle.id}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all group"
                  >
                    {/* Course & Lesson Info */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <h5 className="text-xs font-medium text-blue-600 truncate">
                            {savedSubtitle.courseTitle}
                          </h5>
                        </div>
                        <h6 className="text-xs text-gray-600 truncate">
                          {savedSubtitle.chapterTitle} • {savedSubtitle.lessonTitle}
                        </h6>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleShowSortModal(index)}
                          className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Change position"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeSavedSubtitle(savedSubtitle.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Remove saved subtitle"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      
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

        {/* Sort Modal */}
    {showSortModal && (
      <div 
      onClick={() => setShowSortModal(false)}
      className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
        <div 
        className="bg-white rounded-lg p-6 w-80 mx-4"
        onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Change Subtitle Position
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vị trí hiện tại
              </label>
              <div className="text-lg font-bold text-blue-600">
                #{selectedSubtitleIndex + 1}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Di chuyển đến vị trí
              </label>
              <input
                type="number"
                min="1"
                max={savedSubtitles.length}
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter 1-${savedSubtitles.length}`}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowSortModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSort}
              disabled={!newPosition || Number(newPosition) < 1 || Number(newPosition) > savedSubtitles.length}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
  </>;
})