import { useEffect, useRef } from "react";
import { playerStore } from "../../../../storePlayer";

export const useAudioAction = () => {
    const audioRef = useRef<any>(null);

    useEffect(() => {
        // Set refs trong store khi component mount
        playerStore.setAudioRef(audioRef.current);
        console.log("Audio");
    }, []);

    // Điều khiển volume cho audio/video elements
    useEffect(() => {
        if (audioRef.current) {
        audioRef.current.volume = playerStore.playerControls.volume;
        }
        console.log("Audio");

    }, [playerStore.playerControls.volume]);

    return { audioRef };
}