import { useEffect, useState } from 'react'
import { Bell, BookOpen, Command, Search, Settings, User } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { PWAInstallButton } from '../../../../../../components/PWAInstallButton'
import {
  useCourseData,
  type Course,
} from '../../../../../../hooks/useCourseData'
import { favoriteStore } from '../store/favoriteStore'
import { layoutStore } from '../store/layoutStore'

export const HeaderStudy = observer(() => {
<<<<<<< HEAD
    const { isShowControl, toggleControl, isShowFavorite, toggleFavorite } = layoutStore;
    const { setSelectedCourse, setCourses } = favoriteStore;
    const [isCommandOpen, setIsCommandOpen] = useState(false);
=======
  const { isShowControl, toggleControl, isShowFavorite, toggleFavorite } =
    layoutStore
  const { setSelectedCourse, setCourses } = favoriteStore
  const [isCommandOpen, setIsCommandOpen] = useState(false)
>>>>>>> 71dd11bdd04c2dda181a5b392340b4ccdbe2097d

  // Use API instead of mock data
  const { courseData } = useCourseData()

  useEffect(() => {
    if (courseData.courses.length > 0) {
      // Convert API data to match store interface by ensuring subtitle is always string
      const coursesWithStringSubtitles = courseData.courses.map((course) => ({
        ...course,
        chapters: course.chapters.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) => ({
            ...lesson,
            subtitle: lesson.subtitle || '', // Ensure subtitle is always string
            type: lesson.type as 'video' | 'audio',
          })),
        })),
      }))
      setCourses(coursesWithStringSubtitles)
    }
  }, [courseData.courses, setCourses])

  // Handle click outside dialog
  const handleOverlayClick = (e: React.MouseEvent) => {
<<<<<<< HEAD
      if (e.target === e.currentTarget) {
          setIsCommandOpen(false);
      }
  };
  
=======
    if (e.target === e.currentTarget) {
      setIsCommandOpen(false)
    }
  }

>>>>>>> 71dd11bdd04c2dda181a5b392340b4ccdbe2097d
  const handleCourseSelect = (course: Course) => {
    // Convert course to match store interface
    const courseWithStringSubtitles = {
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => ({
          ...lesson,
          subtitle: lesson.subtitle || '', // Ensure subtitle is always string
          type: lesson.type as 'video' | 'audio',
        })),
      })),
    }
    setSelectedCourse(courseWithStringSubtitles)
  }

  return (
    <>
      <nav className='border-b border-gray-800 bg-black px-3 py-2 lg:px-6 lg:py-3'>
        <div className='flex items-center justify-between'>
          {/* Left Side */}
          <div className='flex items-center space-x-3 lg:space-x-6'>
            <div className='flex items-center space-x-2 lg:space-x-4'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500 lg:h-8 lg:w-8'>
                <BookOpen className='h-3 w-3 text-white lg:h-4 lg:w-4' />
              </div>
              <span className='hidden text-lg font-bold sm:block lg:text-xl'>
                EduPlatform
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className='mx-3 max-w-md flex-1 lg:mx-6 lg:max-w-xl'>
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 lg:h-5 lg:w-5' />
              <input
                type='text'
                placeholder='Search courses, lessons...'
                className='w-full rounded-full bg-gray-800 py-2 pr-4 pl-9 text-sm text-white focus:ring-2 focus:ring-green-500 focus:outline-none lg:py-3 lg:pl-12 lg:text-base'
              />
            </div>
          </div>

          {/* Right Side */}
          <div className='flex items-center space-x-2 lg:space-x-4'>
            {/* Command Palette Button */}
            <PWAInstallButton />
<<<<<<< HEAD
            <button 
                onClick={() => setIsCommandOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Open command palette"
            >
                <Command className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
=======
            <button
              onClick={() => setIsCommandOpen(true)}
              className='text-gray-400 transition-colors hover:text-white'
              title='Open command palette'
            >
              <Command className='h-4 w-4 lg:h-5 lg:w-5' />
            </button>
            <button className='text-gray-400 hover:text-white'>
              <Bell className='h-4 w-4 lg:h-5 lg:w-5' />
>>>>>>> 71dd11bdd04c2dda181a5b392340b4ccdbe2097d
            </button>

            {/* 3 Tabs */}
            <div
              className='relative ml-4 hidden items-center rounded-lg bg-gray-800 p-1 md:flex'
              title='Double-click to clear all tabs'
            >
              <button
                onClick={() => toggleControl()}
                className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                  isShowControl
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Control
              </button>
              <button
                onClick={() => toggleFavorite()}
                className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                  isShowFavorite
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Favorites
              </button>
            </div>

            <button className='text-gray-400 hover:text-white'>
              <Settings className='h-4 w-4 lg:h-5 lg:w-5' />
            </button>
            <button className='text-gray-400 hover:text-white'>
              <User className='h-4 w-4 lg:h-5 lg:w-5' />
            </button>
          </div>
        </div>
      </nav>

      {/* Command Palette Dialog */}
      {isCommandOpen && (
        <div
          onClick={handleOverlayClick}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
        >
          <div className='bg-popover mx-4 w-full max-w-md overflow-hidden rounded-lg shadow-2xl'>
            {/* Header */}
            <div className='border-b border-slate-700 p-4'>
              <div className='relative'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
                <input
                  type='text'
                  placeholder='Type a command or search...'
                  className='w-full rounded-md bg-slate-700 py-2 pr-10 pl-10 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  autoFocus
                />
                <button
                  onClick={() => setIsCommandOpen(false)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 hover:text-white'
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='max-h-80 overflow-y-auto'>
              {/* General Section */}
              <div className='p-2'>
                <div className='px-2 py-1 text-xs font-medium tracking-wide text-slate-400 uppercase'>
                  General
                </div>
<<<<<<< HEAD
                
            )}
                
=======
                {courseData.courses.map((item, index) => (
                  <button
                    key={index}
                    className='group flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-700'
                    onClick={() => {
                      console.log(`Navigate to ${item.title}`)
                      handleCourseSelect(item)
                      setIsCommandOpen(false)
                    }}
                  >
                    <div className='flex flex-1 items-center space-x-3'>
                      <span className='text-slate-400 group-hover:text-white'>
                        →
                      </span>
                      <span className='font-medium text-white'>
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
>>>>>>> 71dd11bdd04c2dda181a5b392340b4ccdbe2097d
    </>
  )
})
