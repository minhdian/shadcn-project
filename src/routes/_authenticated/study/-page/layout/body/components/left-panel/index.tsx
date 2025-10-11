<<<<<<< HEAD
import { observer } from "mobx-react-lite";
import { layoutStore } from "../../../store";
import { favoriteStore } from "../../../storeFavorite";
import ReactPlayer from "react-player";
import { playerStore, usePlayerStore } from "../../../storePlayer";
import { BookOpen, Mic, Pause, Play, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { savedSubtitlesStore } from "../../../storeSavedSubtitle";
import { subtitles } from "../../../../mock-sub";
import { useAudioAction } from "./hooks/useAudioAction";
import { Lesson} from "./model";
import { useEndAction } from "./hooks/useEndAction";
import { usePlayPauseAction } from "./hooks/usePlayPauseAction";

export const LeftPanel = observer(() => {
    const { isShowFavorite } = layoutStore;
    const { 
        timeToSeconds,
        updateCurrentSubtitle,
        autoScroll,
        handlePlaySavedSubtitle,
        repeatSubtitle,
        handleTimeUpdate,
     } = savedSubtitlesStore;
    const { 
        selectedCourse, 
        activeChapter, 
        setActiveChapter, 
        currentLesson, 
        getNextLesson, 
        setSelectedCourse,
        handleChapterSelect,
        getFirstLessonInChapter,
        handleLessonSelect,
        // courses,
    } = favoriteStore;
    const {  
        playerControls,
        setPLayerControls,
        virtuosoRef,
        isTransitioning,
        setIsTransitioning,
    } = playerStore;
  

    const { playerRef, handlePlayerRef } = usePlayerStore();
    const { audioRef } = useAudioAction();
    const { togglePlayPause, handlePlaySafely, handlePauseSafely } = usePlayPauseAction();
    const { handleEnded } = useEndAction();


    return (
        <>
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
                              onTimeUpdate={handleTimeUpdate}
                              onDuration={(duration: number) => setPLayerControls({ duration: duration })}
                              onEnded={handleEnded}
                              onPlay={handlePlaySafely}
                              onPause={handlePauseSafely}
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
                                  onPlay={() => {
                                    if (!isTransitioning) {
                                      console.log('🎵 Audio play');
                                      setPLayerControls({ isPlaying: true });
                                    }
                                  }}
                                  onPause={() => {
                                    if (!isTransitioning) {
                                      console.log('⏸️ Audio pause');
                                      setPLayerControls({ isPlaying: false });
                                    }
                                  }}
                                  onTimeUpdate={(e) => {
                                    const audio = e.target as HTMLAudioElement;
                                    if (!playerControls.seeking && audio.duration && !isTransitioning) {
                                      setPLayerControls({ played: audio.currentTime / audio.duration });
                                      setPLayerControls({ playedSeconds: audio.currentTime });
                                      // Cập nhật subtitle highlight cho audio
                                      updateCurrentSubtitle(audio.currentTime, virtuosoRef, autoScroll);
                                    }
                                  }}
                                  onEnded={() => {
                                    console.log('🏁 Audio ended');
                                    if (!isTransitioning) {
                                      handleEnded();
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
                                disabled={isTransitioning}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  
                                  console.log("Play button clicked:", {
                                    currentLessonId: currentLesson?.id,
                                    clickedLessonId: lesson.id,
                                    isCurrentLesson: currentLesson?.id === lesson.id,
                                    isPlaying: playerControls.isPlaying,
                                  });

                                  if (currentLesson?.id === lesson.id) {
                                    // Same lesson - toggle play/pause
                                    console.log("Same lesson - Toggling play/pause:", !playerControls.isPlaying);
                                    await togglePlayPause();
                                  } else {
                                    // Different lesson - select and play
                                    console.log("Different lesson - Selecting and playing");
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
                  <div className="flex-col items-center justify-center h-full">
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
        </>
    );
});
=======
import { BookOpen, Mic, Pause, Play, Video } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import ReactPlayer from 'react-player'
import { favoriteStore } from '../../../store/favoriteStore'
import { layoutStore } from '../../../store/layoutStore'
import { playerStore, usePlayerStore } from '../../../store/playerStore'
import { savedSubtitlesStore } from '../../../store/savedSubtitlesStore'
import { useAudioAction } from './hooks/useAudioAction'
import { useEndAction } from './hooks/useEndAction'
import { usePlayPauseAction } from './hooks/usePlayPauseAction'

export const LeftPanel = observer(() => {
  const { isShowFavorite } = layoutStore
  const {
    timeToSeconds,
    updateCurrentSubtitle,
    autoScroll,
    handlePlaySavedSubtitle,
    repeatSubtitle,
    handleTimeUpdate,
  } = savedSubtitlesStore
  const {
    selectedCourse,
    activeChapter,
    setActiveChapter,
    currentLesson,
    getNextLesson,
    setSelectedCourse,
    handleChapterSelect,
    getFirstLessonInChapter,
    handleLessonSelect,
    // courses,
  } = favoriteStore
  const {
    playerControls,
    setPLayerControls,
    virtuosoRef,
    isTransitioning,
    setIsTransitioning,
  } = playerStore

  const { playerRef, handlePlayerRef } = usePlayerStore()
  const { audioRef } = useAudioAction()
  const { togglePlayPause, handlePlaySafely, handlePauseSafely } =
    usePlayPauseAction()
  const { handleEnded } = useEndAction()

  return (
    <>
      <section
        className={`w-full ${
          isShowFavorite ? 'md:w-2/5' : 'md:w-1/2'
        } flex flex-col overflow-hidden border-r border-gray-800 bg-black`}
      >
        {selectedCourse ? (
          <div className='flex h-full flex-col'>
            {/* Course/Lesson Header - Fixed */}
            <div className='relative flex-shrink-0'>
              {currentLesson ? (
                // Video/Audio Player
                <div className='flex h-48 w-full items-center justify-center bg-black sm:h-56 lg:h-64'>
                  {currentLesson.type === 'video' ? (
                    <ReactPlayer
                      ref={handlePlayerRef}
                      src={currentLesson.url}
                      width='100%'
                      height='100%'
                      controls={true}
                      playing={playerControls.isPlaying}
                      volume={playerControls.volume}
                      muted={playerControls.muted}
                      loop={playerControls.loop}
                      onTimeUpdate={handleTimeUpdate}
                      onDuration={(duration: number) =>
                        setPLayerControls({ duration: duration })
                      }
                      onEnded={handleEnded}
                      onPlay={handlePlaySafely}
                      onPause={handlePauseSafely}
                      {...({} as any)}
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-red-500'>
                      <div className='text-center'>
                        <Mic className='mx-auto mb-4 h-16 w-16 text-white' />
                        <h3 className='text-lg font-medium text-white'>
                          {currentLesson.title}
                        </h3>
                        <p className='text-sm text-gray-200'>Audio Lesson</p>
                        <audio
                          ref={audioRef}
                          className='mt-4'
                          controls
                          loop={playerControls.loop}
                          src={currentLesson.url}
                          onPlay={() => {
                            if (!isTransitioning) {
                              console.log('🎵 Audio play')
                              setPLayerControls({ isPlaying: true })
                            }
                          }}
                          onPause={() => {
                            if (!isTransitioning) {
                              console.log('⏸️ Audio pause')
                              setPLayerControls({ isPlaying: false })
                            }
                          }}
                          onTimeUpdate={(e) => {
                            const audio = e.target as HTMLAudioElement
                            if (
                              !playerControls.seeking &&
                              audio.duration &&
                              !isTransitioning
                            ) {
                              setPLayerControls({
                                played: audio.currentTime / audio.duration,
                              })
                              setPLayerControls({
                                playedSeconds: audio.currentTime,
                              })
                              // Cập nhật subtitle highlight cho audio
                              updateCurrentSubtitle(
                                audio.currentTime,
                                virtuosoRef,
                                autoScroll
                              )
                            }
                          }}
                          onEnded={() => {
                            console.log('🏁 Audio ended')
                            if (!isTransitioning) {
                              handleEnded()
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Course Image
                <div className='relative h-48 w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 sm:h-56 lg:h-64'>
                  <div className='bg-opacity-40 absolute inset-0 bg-black'></div>
                  <div className='absolute right-0 bottom-0 left-0 p-4 lg:p-6'>
                    <div className='flex items-end justify-between'>
                      <div>
                        <h1 className='text-xl font-bold text-white lg:text-2xl'>
                          {selectedCourse.title}
                        </h1>
                        <p className='mt-2 text-sm text-gray-200'>
                          {selectedCourse.description}
                        </p>
                      </div>
                      <div className='text-right text-sm text-white'>
                        <div className='text-base lg:text-lg'>
                          {selectedCourse.chapters.length}
                        </div>
                        <div className='text-xs lg:text-sm'>Chapters</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Tabs - Fixed */}
            <div className='flex-shrink-0 border-b border-gray-800 bg-black'>
              <div className='flex space-x-0 overflow-x-auto'>
                {selectedCourse.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors lg:px-6 lg:py-4 lg:text-base ${
                      activeChapter?.id === chapter.id
                        ? 'border-green-400 bg-gray-900 text-green-400'
                        : 'border-transparent text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <span>{chapter.title}</span>
                    <span className='ml-2 rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300'>
                      {chapter.lessons.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lessons List - Scrollable */}
            {activeChapter && (
              <div className='flex-1 overflow-y-auto'>
                {activeChapter.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`group flex cursor-pointer items-center border-b border-gray-800 px-3 py-2 hover:bg-gray-900 lg:px-4 lg:py-3 ${
                      currentLesson?.id === lesson.id
                        ? 'border-green-500 bg-gray-900'
                        : ''
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <button className='mr-3 text-gray-400 hover:text-white lg:mr-4'>
                      {lesson.type === 'video' ? (
                        <Video className='h-4 w-4 text-blue-400' />
                      ) : (
                        <Mic className='h-4 w-4 text-orange-400' />
                      )}
                    </button>

                    <div className='min-w-0 flex-1'>
                      <div className='truncate text-sm text-white lg:text-base'>
                        {lesson.title}
                      </div>
                      <div className='text-xs text-gray-400 lg:text-sm'>
                        {lesson.type === 'video'
                          ? 'Video Lesson'
                          : 'Audio Lesson'}
                      </div>
                    </div>

                    <div className='flex items-center space-x-1 lg:space-x-2'>
                      <button
                        className='p-1 text-gray-400 hover:text-white'
                        disabled={isTransitioning}
                        onClick={async (e) => {
                          e.stopPropagation()

                          console.log('Play button clicked:', {
                            currentLessonId: currentLesson?.id,
                            clickedLessonId: lesson.id,
                            isCurrentLesson: currentLesson?.id === lesson.id,
                            isPlaying: playerControls.isPlaying,
                          })

                          if (currentLesson?.id === lesson.id) {
                            // Same lesson - toggle play/pause
                            console.log(
                              'Same lesson - Toggling play/pause:',
                              !playerControls.isPlaying
                            )
                            await togglePlayPause()
                          } else {
                            // Different lesson - select and play
                            console.log(
                              'Different lesson - Selecting and playing'
                            )
                            handleLessonSelect(lesson, true)
                          }
                        }}
                      >
                        {currentLesson?.id === lesson.id &&
                        playerControls.isPlaying ? (
                          <Pause className='h-4 w-4' />
                        ) : (
                          <Play className='h-4 w-4' />
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
          <div className='h-full flex-col items-center justify-center'>
            <div className='text-center'>
              <BookOpen className='mx-auto mb-4 h-16 w-16 text-gray-500' />
              <h3 className='text-lg font-medium text-gray-400'>
                Select a Course
              </h3>
              <p className='text-sm text-gray-500'>
                Choose a course from the right panel to start learning
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  )
})
>>>>>>> 71dd11bdd04c2dda181a5b392340b4ccdbe2097d
