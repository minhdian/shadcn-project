import { useCallback } from "react";
import { playerStore } from "./storePlayer";

export const usePlayerRef = () => {
    const handlePlayerRef = useCallback((ref: HTMLVideoElement | null) => {
        if (ref) {
            playerStore.playerRef = ref;
            console.log("Player ref set:", ref);
        }
    }, []);
    return { playerRef: playerStore.playerRef, handlePlayerRef };

}

// How to use:
// const { playerRef, handlePlayerRef } = usePlayerRef();
// <ReactPlayer ref={handlePlayerRef} ... />
// playerRef?.play(); // Example usage of the playerRef