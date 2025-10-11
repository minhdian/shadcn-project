import { useState } from 'react'
import { List } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { Virtuoso } from 'react-virtuoso'
import { favoriteStore } from '../../../store/favoriteStore'
import { layoutStore } from '../../../store/layoutStore'
import { usePlayerStore } from '../../../store/playerStore'
import { savedSubtitlesStore } from '../../../store/savedSubtitlesStore'
import { useRepeatSub } from './hooks/useRepeatSub'

export const CenterPanel = observer(() => {
  const { isShowFavorite } = layoutStore
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
    handleSaveSubtitle,
  } = savedSubtitlesStore
  const {
    selectedCourse,
    activeChapter,
    currentLesson,
    // courses,
  } = favoriteStore

  const [subtitleDisplayMode, setSubtitleDisplayMode] = useState<
    'both' | 'english' | 'vietnamese'
  >('both')
  // const virtuosoRef = useRef<any>(null);
  const { handleVirtuosoRef } = usePlayerStore()
  useRepeatSub()

  return (
    <section
      className={`hidden w-full md:block ${
        isShowFavorite ? 'md:w-2/5' : 'md:w-1/2'
      } flex flex-col overflow-y-auto bg-gray-900`}
    >
      <div className='flex-shrink-0 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <h3 className='flex items-center font-semibold text-white'>
              <List className='mr-2 h-5 w-5' />
              Subtitles & Transcript
            </h3>

            {/* Focus Mode Button */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`rounded-md border px-3 py-1.5 text-xs transition-all ${
                autoScroll
                  ? 'border-orange-500 bg-orange-600 text-white shadow-md'
                  : 'border-orange-400 bg-transparent text-orange-400 hover:bg-orange-600 hover:text-white'
              }`}
              title='Focus mode: Highlight only current subtitle'
            >
              Focus
            </button>
          </div>

          {/* Subtitle Language Tabs */}
          <div className='flex items-center rounded-lg bg-gray-800 p-1'>
            <button
              onClick={() => setSubtitleDisplayMode('both')}
              className={`rounded-md px-2 py-1 text-xs transition-all ${
                subtitleDisplayMode === 'both'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              EN+VI
            </button>
            <button
              onClick={() => setSubtitleDisplayMode('english')}
              className={`rounded-md px-2 py-1 text-xs transition-all ${
                subtitleDisplayMode === 'english'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setSubtitleDisplayMode('vietnamese')}
              className={`rounded-md px-2 py-1 text-xs transition-all ${
                subtitleDisplayMode === 'vietnamese'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              VI
            </button>
          </div>
        </div>
      </div>

      {currentLesson ? (
        <div className='flex-1 px-4 pb-4'>
          <Virtuoso
            ref={handleVirtuosoRef}
            data={currentSubtitles}
            style={{ height: '500px' }}
            itemContent={(_, subtitle) => (
              <div
                key={subtitle.id}
                className={`group relative mb-2 cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-700 ${
                  currentSubtitleIndex === subtitle.id
                    ? 'border border-green-600 bg-green-800'
                    : 'bg-gray-800'
                }`}
                onClick={() => handleSubtitleClick(subtitle)}
              >
                <div className='pr-8'>
                  {(subtitleDisplayMode === 'both' ||
                    subtitleDisplayMode === 'english') && (
                    <div
                      className={`text-sm text-white group-hover:text-green-400 ${
                        subtitleDisplayMode === 'both' && subtitle.textVi
                          ? 'mb-2'
                          : ''
                      }`}
                    >
                      {subtitle.text}
                    </div>
                  )}
                  {(subtitleDisplayMode === 'both' ||
                    subtitleDisplayMode === 'vietnamese') &&
                    subtitle.textVi && (
                      <div className='text-sm text-yellow-300 italic group-hover:text-yellow-200'>
                        {subtitle.textVi}
                      </div>
                    )}
                </div>
                {/* Save Icon - chỉ hiện khi hover */}
                <button
                  className={`absolute top-3 right-3 rounded p-1 transition-all duration-200 hover:bg-gray-600 ${
                    selectedCourse &&
                    activeChapter &&
                    currentLesson &&
                    savedSubtitlesStore.isSubtitleSaved(
                      subtitle.id,
                      currentLesson.id,
                      selectedCourse.id
                    )
                      ? 'text-yellow-400 opacity-100' // Đã lưu - hiện luôn
                      : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white' // Chưa lưu - chỉ hiện khi hover
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() // Ngăn click event lan ra subtitle div
                    console.log('Save subtitle:', subtitle.text)
                    // TODO: Implement save functionality
                    handleSaveSubtitle(subtitle)
                  }}
                  title='Save this subtitle'
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                    />
                  </svg>
                </button>
              </div>
            )}
          />
        </div>
      ) : (
        <div className='flex flex-1 items-center justify-center'>
          <div className='text-center'>
            <div className='text-gray-500'>
              <List className='mx-auto mb-3 h-12 w-12 opacity-50' />
              <p>Select a lesson to view subtitles</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
})
