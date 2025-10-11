<<<<<<< HEAD

import {  useEffect, useRef, useState } from "react";
import { HeaderStudy } from "./layout/header";
import { RightSidebar } from "./layout/right-sidebar";
import { observer } from "mobx-react-lite";
import { Footer } from "./layout/footer";
import { ContentBody } from "./layout/body";



export const Study = observer(() => {
  // Navigation state
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <HeaderStudy />
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

          
            {/* Main Content Area */}
            <div
              className={`flex-1 flex overflow-hidden transition-all duration-300 h-full ${
                !isNavCollapsed ? "xl:ml-0" : "ml-0"
              }`}
            >
              {/* Left Panel - Course Content or Video Player */}
              {/* Center Panel - Subtitles */}
              <ContentBody />

              {/* Right Panel - Course List */}
              <RightSidebar />
            </div>
=======
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
>>>>>>> 71dd11bdd04c2dda181a5b392340b4ccdbe2097d

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
