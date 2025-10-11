import {
  Pause,
  Play,
  Repeat,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { favoriteStore } from '../store/favoriteStore'
import { layoutStore } from '../store/layoutStore'
import { playerStore } from '../store/playerStore'
import { hoverTimeStyle } from './config'
import { VOLUME_SIZE } from './constant'
import { useSeekbarAction } from './hooks/useSeekbarAction'
import { formatTime } from './util'

export const Footer = observer(() => {
  const { isShowControl } = layoutStore
  const {
    selectedCourse,
    currentLesson,
    getPreviousLesson,
    getNextLesson,
    handleSkipBackClick,
    handleSkipForwardClick,
  } = favoriteStore

  const {
    setPLayerControls,
    handleRewind,
    playerControls,
    handleRepeat,
    handleChapterLoop,
    handleMuteClick,
    handleVolumeChange,
    handleVideoLoop,
    handleSeekChange,
    handleSeekMouseUp,
    handleSeekMouseDown,
  } = playerStore

  const {
    handleSeekbarHover,
    handleSeekbarClick,
    seekbarRef,
    setHoverTime,
    hoverTime,
    hoverX,
  } = useSeekbarAction()

  return (
    <>
      {isShowControl && (
        <footer className='animate-in slide-in-from-bottom bg-green-600 p-2 duration-300 sm:p-3 lg:p-4'>
          <div className='flex items-center justify-between'>
            {/* Lesson Controls */}
            <div className='flex items-center space-x-2 sm:space-x-3 lg:space-x-4'>
              {/* Button lùi lại với input số giây */}
              <div className='flex items-center space-x-1'>
                <button
                  className='text-white hover:text-gray-200'
                  title='Lùi lại'
                  onClick={handleRewind}
                >
                  <RotateCcw className='h-4 w-4 sm:h-5 sm:w-5' />
                </button>
                <input
                  type='number'
                  defaultValue='5'
                  min='1'
                  max='60'
                  onChange={(e) =>
                    setPLayerControls({ rewindSeconds: Number(e.target.value) })
                  }
                  className='bg-opacity-50 border-opacity-30 h-6 w-8 rounded border border-white bg-black text-center text-xs text-white focus:border-green-400 focus:outline-none sm:h-7 sm:w-10'
                />
                <span className='hidden text-xs text-white sm:inline'>
                  giây
                </span>
              </div>

              <button
                className='text-white hover:text-gray-200'
                onClick={handleSkipBackClick}
                disabled={!getPreviousLesson()}
                title={
                  getPreviousLesson()
                    ? `Previous: ${getPreviousLesson()?.title}`
                    : 'No previous lesson'
                }
              >
                <SkipBack
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    !getPreviousLesson() ? 'opacity-50' : ''
                  }`}
                />
              </button>

              <button
                onClick={() =>
                  setPLayerControls({ isPlaying: !playerControls.isPlaying })
                }
                className='text-white hover:text-gray-200'
              >
                {playerControls.isPlaying ? (
                  <Pause className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8' />
                ) : (
                  <Play className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8' />
                )}
              </button>
              <button
                className='text-white hover:text-gray-200'
                onClick={handleSkipForwardClick}
                disabled={!getNextLesson()}
                title={
                  getNextLesson()
                    ? `Next: ${getNextLesson()?.title}`
                    : 'No next lesson'
                }
              >
                <SkipForward
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    !getNextLesson() ? 'opacity-50' : ''
                  }`}
                />
              </button>

              {/* Button lặp lại sub */}
              <button
                className={` ${
                  playerControls.isRepeating ? 'text-yellow-300' : ''
                } text-white transition-colors hover:text-yellow-300`}
                title='Lặp lại'
                onClick={handleRepeat}
              >
                <Repeat className='h-4 w-4 sm:h-5 sm:w-5' />
              </button>

              {/* Button lặp lại video*/}
              <button
                className={` ${
                  playerControls.loop ? 'text-yellow-300' : ''
                } text-white transition-colors hover:text-blue-300`}
                title='Lặp lại video'
                onClick={handleVideoLoop}
              >
                <RotateCcw className='h-4 w-4 sm:h-5 sm:w-5' />
              </button>

              {/* Button lặp lại video trong chương*/}
              <button
                className={` ${
                  playerControls.isChapterLooping ? 'text-yellow-300' : ''
                } text-white transition-colors hover:text-blue-300`}
                title='Lặp lại video trong chương'
                onClick={handleChapterLoop}
              >
                <RotateCcw className='h-4 w-4 sm:h-5 sm:w-5' />
              </button>
            </div>

            {/* Progress & Current Info */}
            <div className='mx-3 flex-1 sm:mx-4 lg:mx-8'>
              <div className='flex items-center space-x-2 sm:space-x-4'>
                <div className='flex-1'>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type='range'
                      min={0}
                      max={1}
                      step='any'
                      className='bg-opacity-30 h-1 w-full cursor-pointer appearance-none rounded-full bg-black'
                      value={playerControls.played}
                      ref={seekbarRef}
                      onMouseMove={handleSeekbarHover}
                      onMouseDown={handleSeekMouseDown}
                      onChange={handleSeekChange}
                      onMouseUp={handleSeekMouseUp}
                      onClick={handleSeekbarClick}
                      onMouseLeave={() => setHoverTime(null)}
                      style={{ width: '100%' }}
                    />
                    {hoverTime !== null && (
                      <div style={hoverTimeStyle(hoverX)}>
                        {formatTime(hoverTime || 0)}
                      </div>
                    )}
                  </div>
                  <div className='mt-1 flex items-center justify-between'>
                    <div className='mr-2 flex-1 truncate text-xs text-white sm:text-sm'>
                      {currentLesson
                        ? `${currentLesson.title} - ${
                            selectedCourse?.title || ''
                          }`
                        : 'Select a lesson to start learning'}
                    </div>
                    <div className='text-xs whitespace-nowrap text-white sm:text-sm'>
                      {formatTime(playerControls.playedSeconds || 0)} /{' '}
                      {formatTime(playerControls.duration)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Controls */}
            <div className='flex items-center space-x-2 sm:space-x-3 lg:space-x-4'>
              <button
                className='hidden text-white hover:text-gray-200 md:block'
                onClick={handleMuteClick}
              >
                {playerControls.volume === 0 ? (
                  <VolumeX size={VOLUME_SIZE} />
                ) : (
                  <Volume2
                    size={VOLUME_SIZE}
                    className='h-4 w-4 sm:h-5 sm:w-5'
                  />
                )}
              </button>
              <div className='bg-opacity-30 relative hidden h-1 w-12 rounded-full bg-black sm:w-16 md:block lg:w-20'>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='any'
                  value={playerControls.volume}
                  onChange={handleVolumeChange}
                  className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                  title={`Volume: ${Math.round(playerControls.volume * 100)}%`}
                />
                <div
                  className='h-1 rounded-full bg-white transition-all duration-150'
                  style={{ width: `${playerControls.volume * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  )
})
