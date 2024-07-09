import { hookstate, useHookstate } from '@hookstate/core';
import { SceneType } from './types';

const initialState: SceneType = hookstate({
  sceneLoaded: false,
  environmentLoaded: false,
  gameRunning: false,
  device: 'Desktop',
  selectedEnvironment: ''
});

export const useSceneState = () => {
  const sceneState = useHookstate(initialState);

  return {
    ...sceneState,
    reset: () => {
      // sceneState.sceneLoaded.set(false);
      // sceneState.environmentLoaded.set(false);
      // sceneState.gameRunning.set(false);
      sceneState.set(initialState);
    }
  };
};
