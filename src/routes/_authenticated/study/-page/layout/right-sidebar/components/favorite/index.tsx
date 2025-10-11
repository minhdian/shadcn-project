import { ArrowUpDown, BookOpen, Clock, Play, Trash2 } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { layoutStore } from '../../../store/layoutStore'
import { savedSubtitlesStore } from '../../../store/savedSubtitlesStore'
import { useSortAction } from './hooks/useSortAction'
import { formatTime } from './util'

export const Favorite = observer(() => {
  const { isShowFavorite } = layoutStore
  const {
    savedSubtitles,
    removeSavedSubtitle,
    clearAllSaved,
    handlePlaySavedSubtitle,
  } = savedSubtitlesStore

  const {
    showSortModal,
    setShowSortModal,
    selectedSubtitleIndex,
    newPosition,
    setNewPosition,
    handleShowSortModal,
    handleConfirmSort,
  } = useSortAction()
  return (
    <>
      {isShowFavorite && (
        <section className='animate-in slide-in-from-right hidden w-full overflow-y-auto bg-gray-100 duration-300 lg:block lg:w-1/5'>
          <div className='p-4'>
            {/* Header */}
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='flex items-center font-semibold text-gray-800'>
                <BookOpen className='mr-2 h-5 w-5' />
                Saved Subtitles
              </h3>
              {savedSubtitles.length > 0 && (
                <button
                  onClick={clearAllSaved}
                  className='text-xs text-red-500 hover:text-red-700'
                  title='Clear all saved subtitles'
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Saved Subtitles List */}
            <div className='mb-6 space-y-3'>
              {savedSubtitles.length === 0 ? (
                <div className='py-8 text-center'>
                  <BookOpen className='mx-auto mb-3 h-12 w-12 text-gray-400' />
                  <p className='text-sm text-gray-500'>
                    No saved subtitles yet
                  </p>
                  <p className='text-xs text-gray-400'>
                    Click save icon on subtitles to add them here
                  </p>
                </div>
              ) : (
                savedSubtitles.map((savedSubtitle, index) => (
                  <div
                    key={savedSubtitle.id}
                    className='group rounded-lg border border-gray-200 bg-white p-3 transition-all hover:shadow-md'
                  >
                    {/* Course & Lesson Info */}
                    <div className='mb-2 flex items-start justify-between'>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <span className='rounded bg-gray-200 px-2 py-1 text-xs font-bold text-gray-500'>
                            #{index + 1}
                          </span>
                          <h5 className='truncate text-xs font-medium text-blue-600'>
                            {savedSubtitle.courseTitle}
                          </h5>
                        </div>
                        <h6 className='truncate text-xs text-gray-600'>
                          {savedSubtitle.chapterTitle} •{' '}
                          {savedSubtitle.lessonTitle}
                        </h6>
                      </div>
                      <div className='flex items-center gap-1'>
                        <button
                          onClick={() => handleShowSortModal(index)}
                          className='p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-blue-500'
                          title='Change position'
                        >
                          <ArrowUpDown className='h-3 w-3' />
                        </button>
                        <button
                          onClick={() => removeSavedSubtitle(savedSubtitle.id)}
                          className='p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500'
                          title='Remove saved subtitle'
                        >
                          <Trash2 className='h-3 w-3' />
                        </button>
                      </div>
                    </div>

                    {/* Subtitle Content */}
                    <div
                      className='mb-2 cursor-pointer rounded bg-gray-50 p-2 transition-colors hover:bg-gray-100'
                      onClick={() => handlePlaySavedSubtitle(savedSubtitle)}
                    >
                      <p className='mb-1 line-clamp-2 text-sm text-gray-800'>
                        {savedSubtitle.subtitleText}
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center text-xs text-gray-500'>
                          <Clock className='mr-1 h-3 w-3' />
                          {formatTime(savedSubtitle.subtitleStart)}
                        </div>
                        <button className='p-1 text-green-600 hover:text-green-700'>
                          <Play className='h-3 w-3' />
                        </button>
                      </div>
                    </div>

                    {/* Saved Date */}
                    <div className='text-xs text-gray-400'>
                      Saved
                      {/* Saved {formatDate(savedSubtitle.savedAt)} */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div
          onClick={() => setShowSortModal(false)}
          className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30'
        >
          <div
            className='mx-4 w-80 rounded-lg bg-white p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              Change Subtitle Position
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Vị trí hiện tại
                </label>
                <div className='text-lg font-bold text-blue-600'>
                  #{selectedSubtitleIndex + 1}
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Di chuyển đến vị trí
                </label>
                <input
                  type='number'
                  min='1'
                  max={savedSubtitles.length}
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  placeholder={`Enter 1-${savedSubtitles.length}`}
                />
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setShowSortModal(false)}
                className='px-4 py-2 text-gray-600 transition-colors hover:text-gray-800'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSort}
                disabled={
                  !newPosition ||
                  Number(newPosition) < 1 ||
                  Number(newPosition) > savedSubtitles.length
                }
                className='rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
