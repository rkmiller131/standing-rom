import { hookstate, useHookstate } from '@hookstate/core'
import { SceneType } from './types'

const initialState: SceneType = hookstate({
    sceneLoaded: false,
    environmentLoaded: false,
    device: 'Desktop',
    selectedEnvironment: ''
});

export const useSceneState = () => {
    const sceneState = useHookstate(initialState);

    return {
        ...sceneState,
    }
}