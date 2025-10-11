import { useCallback } from "react";
import { savedSubtitlesStore } from "../../../../storeSavedSubtitle";
import { favoriteStore } from "../../../../storeFavorite";
import { playerStore } from "../../../../storePlayer";

export const useEndAction = () => {
  // Xử lý khi video kết thúc
 const handleEnded = useCallback(() => {
    const { getNextLesson, getFirstLessonInChapter, handleLessonSelect } = favoriteStore
    const { repeatSubtitle } = savedSubtitlesStore
    const { playerControls, setPLayerControls, isTransitioning, setIsTransitioning } = playerStore

    console.log('🏁 Video ended - Current controls:', {
              isRepeating: playerControls.isRepeating,
              isChapterLooping: playerControls.isChapterLooping,
              loop: playerControls.loop,
              repeatSubtitle: !!repeatSubtitle
          });
  
    setIsTransitioning(true);
        
        // Xử lý lặp lại subtitle - KHÔNG làm gì vì logic repeat đã tự xử lý
        if (playerControls.isRepeating && repeatSubtitle) {
            setIsTransitioning(false);
            return;
        }

        // Nếu chapter looping được bật và video loop tắt
        if (playerControls.isChapterLooping && !playerControls.loop) {
            const nextLesson = getNextLesson();

            if (nextLesson) {
                console.log('🔄 Moving to next lesson:', nextLesson.title);
                setTimeout(() => {
                    handleLessonSelect(nextLesson, true);
                    setIsTransitioning(false);
                }, 200);
            } else {
                // Đã hết lesson trong chapter, quay lại lesson đầu tiên
                const firstLesson = getFirstLessonInChapter();
                if (firstLesson) {
                    console.log('🔄 Moving to first lesson:', firstLesson.title);
                    setTimeout(() => {
                        handleLessonSelect(firstLesson, true);
                        setIsTransitioning(false);
                    }, 200);
                } else {
                    setIsTransitioning(false);
                }
            }
            return;
        }

        // Logic mặc định: dừng phát
        if (!playerControls.loop) {
            console.log('⏹️ Video ended - stopping playback');
            setPLayerControls({ isPlaying: false });
        }
        
        setTimeout(() => setIsTransitioning(false), 200);
      }, [
          playerStore.playerControls.isRepeating,
          playerStore.playerControls.isChapterLooping, 
          playerStore.playerControls.loop,
          savedSubtitlesStore.repeatSubtitle,
          favoriteStore.getNextLesson,
          favoriteStore.getFirstLessonInChapter,
          favoriteStore.handleLessonSelect,
          playerStore.setPLayerControls
    ]);

    return { handleEnded }
}

