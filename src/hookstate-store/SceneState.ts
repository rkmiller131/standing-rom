import { hookstate, useHookstate } from '@hookstate/core';
import { SceneType } from './Types';

const initialState: SceneType = hookstate({
  sceneLoaded: false,
  environmentLoaded: false,
  gameRunning: false,
  device: 'Desktop',
  selectedEnvironment: '',
  selectedAvatar: '',
  sceneSettings: {
    sfx: true,
    music: true,
    announcer: true,
    allSounds: true,
    ready: false,
  },
});

export const useSceneState = () => {
  const sceneState = useHookstate(initialState);

  return {
    ...sceneState,
  };
};
