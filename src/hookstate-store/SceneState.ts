import { hookstate, useHookstate } from '@hookstate/core';
import { SceneType } from './Types';

const initialState: SceneType = hookstate({
  sceneLoaded: false,
  environmentLoaded: false,
  gameRunning: false,
  device: 'Desktop',
  selectedEnvironment: '',
  soundSettings: {
    sfx: true,
    music: true,
  },
});

export const useSceneState = () => {
  const sceneState = useHookstate(initialState);

  return {
    ...sceneState,
  };
};
