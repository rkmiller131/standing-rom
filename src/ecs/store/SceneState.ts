import { hookstate, useHookstate } from '@hookstate/core';
import { SceneType } from './types';

const initialState: SceneType = hookstate({
  sceneLoaded: false,
  environmentLoaded: false,
  calibrationRunning: false,
  device: 'Desktop',
  selectedEnvironment: '',
  // gameIsRunning: false
});

export const useSceneState = () => {
  const sceneState = useHookstate(initialState);

  return {
    ...sceneState,
  };
};
