import { List } from "lucide-react";
import { observer } from "mobx-react-lite";
import { layoutStore } from "../../../store";
import { use, useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { savedSubtitlesStore } from "../../../storeSavedSubtitle";
import { favoriteStore } from "../../../storeFavorite";
import { subtitles } from "../../../../mock-sub";
import { playerStore, usePlayerStore } from "../../../storePlayer";
import { useRepeatSub } from "./hooks/useRepeatSub";

export const CenterPanel = observer(() => {
  const { isShowFavorite } = layoutStore;
  const { 
    addSavedSubtitle, 
    timeToSeconds, 
    setManualSubtitleTime, 
    currentSubtitles,
    currentSubtitleIndex,
    setCurrentSubtitleIndex,
    autoScroll,
    setAutoScroll, 
    handleSubtitleClick,
    handleSaveSubtitle
    } = savedSubtitlesStore;
  const { 
      selectedCourse, 
      activeChapter,  
      currentLesson, 
      // courses,
  } = favoriteStore;


  const [subtitleDisplayMode, setSubtitleDisplayMode] = useState<
    "both" | "english" | "vietnamese"
  >("both");
  // const virtuosoRef = useRef<any>(null);
  const { handleVirtuosoRef } = usePlayerStore();
  useRepeatSub();

  return (
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
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all border ${
                    autoScroll
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
                ref={handleVirtuosoRef}
                data={currentSubtitles}
                style={{ height: "500px" }}
                itemContent={(_, subtitle) => (
                <div
                    key={subtitle.id}
                    className={`relative p-3 mb-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group ${
                    currentSubtitleIndex === subtitle.id
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
                    className={`absolute top-3 right-3  transition-all duration-200 p-1 rounded hover:bg-gray-600
                        ${
                        selectedCourse && activeChapter && currentLesson && 
                        savedSubtitlesStore.isSubtitleSaved(subtitle.id, currentLesson.id, selectedCourse.id)
                            ? "text-yellow-400 opacity-100" // Đã lưu - hiện luôn
                            : "text-gray-400 hover:text-white opacity-0 group-hover:opacity-100" // Chưa lưu - chỉ hiện khi hover
                        }`}
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn click event lan ra subtitle div
                        console.log("Save subtitle:", subtitle.text);
                        // TODO: Implement save functionality
                        handleSaveSubtitle(subtitle);
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
  );
});
