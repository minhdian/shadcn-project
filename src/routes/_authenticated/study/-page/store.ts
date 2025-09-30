import { create } from "zustand";

interface UIState {
  activeTabs: ("overview" | "lessons" | "transcript")[];
  showSidebar: boolean;
  showBottomBar: boolean;
  showCourseList: boolean;

  // Actions
  toggleTab: (tab: "overview" | "lessons" | "transcript") => void;
  clearAllTabs: () => void;
  updateUIBasedOnTabs: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeTabs: [],
  showSidebar: false, // Default hiển thị
  showBottomBar: false, // Default hiển thị
  showCourseList: false, // Default hiển thị

  toggleTab: (tab) => {
    const { activeTabs } = get();
    let newActiveTabs: ("overview" | "lessons" | "transcript")[];

    if (activeTabs.includes(tab)) {
      // Nếu tab đã active, remove nó
      newActiveTabs = activeTabs.filter((t) => t !== tab);
    } else {
      // Nếu tab chưa active, add nó
      newActiveTabs = [...activeTabs, tab];
    }

    set({ activeTabs: newActiveTabs });

    // Update UI visibility based on tabs
    const showSidebar = newActiveTabs.includes("overview");
    const showBottomBar = newActiveTabs.includes("lessons");
    const showCourseList = newActiveTabs.includes("transcript");

    set({
      showSidebar,
      showBottomBar,
      showCourseList,
    });
  },

  clearAllTabs: () => {
    set({
      activeTabs: [],
      showSidebar: false,
      showBottomBar: false,
      showCourseList: false,
    });
  },

  updateUIBasedOnTabs: () => {
    const { activeTabs } = get();
    const showSidebar = activeTabs.includes("overview");
    const showBottomBar = activeTabs.includes("lessons");
    const showCourseList = activeTabs.includes("transcript");

    set({
      showSidebar,
      showBottomBar,
      showCourseList,
    });
  },
}));
