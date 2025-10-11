
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

      </div>

      {/* Bottom Control Bar */}
      <Footer />

      {/* Mobile Overlay */}
      {!isNavCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
          onClick={() => setIsNavCollapsed(true)}
        />
      )}
    </div>
  );
});
