import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ContentBody } from './layout/body'
import { Footer } from './layout/footer'
import { HeaderStudy } from './layout/header'
import { RightSidebar } from './layout/right-sidebar'

export const Study = observer(() => {
  // Navigation state
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  return (
    <div className='flex h-screen flex-col bg-black text-white'>
      <HeaderStudy />
      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Main Content Area */}
        <div
          className={`flex h-full flex-1 overflow-hidden transition-all duration-300 ${
            !isNavCollapsed ? 'xl:ml-0' : 'ml-0'
          }`}
        >
          {/* Left Panel - Course Content or Video Player */}
          {/* Center Panel - Subtitles */}
          <ContentBody />

          {/* Right Panel - Course List */}
          <RightSidebar />
        </div>
      </div>

      {/* Bottom Control Bar */}
      <Footer />

      {/* Mobile Overlay */}
      {!isNavCollapsed && (
        <div
          className='bg-opacity-50 fixed inset-0 z-30 bg-black xl:hidden'
          onClick={() => setIsNavCollapsed(true)}
        />
      )}
    </div>
  )
})
