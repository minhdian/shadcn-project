import { useCallback, useEffect, useRef } from "react";
import { playerStore } from "../../../../storePlayer";
import { fa } from "@faker-js/faker";
import { favoriteStore } from "../../../../storeFavorite";

export const usePlayPauseAction = () => {
    const { playerControls, setPLayerControls, isTransitioning, setIsTransitioning } = playerStore;
    const { currentLesson} = favoriteStore;
    const playPromiseRef = useRef<Promise<void> | null>(null);
    
    // Handle play safely theo Chrome Developer Guide
    const handlePlaySafely = useCallback(async () => {
        if (isTransitioning) return;
        
        try {
            setIsTransitioning(true);
            
            // Nếu có play promise đang pending, đợi nó complete
            if (playPromiseRef.current) {
                await playPromiseRef.current;
            }
            
            console.log('🎵 ReactPlayer onPlay triggered');
            setPLayerControls({ isPlaying: true });
            
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Play was interrupted - this is normal');
            } else {
                console.error('Play failed:', error);
            }
        } finally {
            setTimeout(() => setIsTransitioning(false), 100);
        }
    }, [isTransitioning, setPLayerControls]);

    const handlePauseSafely = useCallback(() => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        console.log('⏸️ ReactPlayer onPause triggered');
        setPLayerControls({ isPlaying: false });
        
        setTimeout(() => setIsTransitioning(false), 100);
    }, [isTransitioning, setPLayerControls]);

    // Reset transition khi lesson thay đổi
    useEffect(() => {
        setIsTransitioning(false);
        playPromiseRef.current = null;
    }, [currentLesson?.id]);

    // Safe toggle function để tránh conflicts
    const togglePlayPause = useCallback(async () => {
        if (isTransitioning) return;
        
        try {
            setIsTransitioning(true);
            
            const newPlayingState = !playerControls.isPlaying;
            console.log('🎮 Toggle play/pause to:', newPlayingState);
            
            setPLayerControls({ isPlaying: newPlayingState });
            
        } catch (error) {
            console.error('Toggle play/pause failed:', error);
        } finally {
            setTimeout(() => setIsTransitioning(false), 100);
        }
    }, [playerControls.isPlaying, setPLayerControls, isTransitioning]);
    return { togglePlayPause, handlePlaySafely, handlePauseSafely };
};
