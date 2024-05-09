import { useEffect, useState } from 'react'
import { useSceneState } from '../ecs/store/SceneState'

import '../css/LoadingScreen.css'

export default function LoadingScreen() {
    const sceneState = useSceneState();
    const [isLoading, setIsLoading] = useState(true);
    const [unmountComponent, setUnmountComponent] = useState(false);

    useEffect(() => {
        if (sceneState.sceneLoaded.get({noproxy: true})) {
            setIsLoading(false)
            setTimeout(() => {
                console.log('Closing Loading Screen...');
                setUnmountComponent(true);
            }, 1000)
        }
    }, [sceneState.sceneLoaded])

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