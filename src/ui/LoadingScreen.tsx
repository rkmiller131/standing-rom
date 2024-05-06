import { useEffect, useState } from 'react'
import { useGameState } from '../ecs/store/GameState'

import '../css/LoadingScreen.css'

export default function LoadingScreen() {
    const gameState = useGameState();
    const [isLoading, setIsLoading] = useState(true);
    const [unmountComponent, setUnmountComponent] = useState(false);

    useEffect(() => {
        if (gameState.sceneLoaded.get({noproxy: true})) {
            setIsLoading(false)
            setTimeout(() => {
                console.log('Unmounting...');
                setUnmountComponent(true);
            }, 1000)
        }
    }, [gameState.sceneLoaded])

    if (unmountComponent) return null;

    return (
        <div id="loading-screen" className={!isLoading ? 'fade-out' : ''}>
            <div className="loading-spinner">
                Loading
                <span></span>
            </div>
        </div>
    );
}