import { useGameState } from '../hookstate-store/GameState';
import { useSceneState } from '../hookstate-store/SceneState';

export default function useHookstateGetters() {
  const gameState = useGameState();
  const sceneState = useSceneState();

  // SCENE STATE
  const environmentLoaded = () =>
    sceneState.environmentLoaded.get({ noproxy: true });
  const environmentSelected = () =>
    sceneState.selectedEnvironment.get({ noproxy: true });
  const sceneLoaded = () => sceneState.sceneLoaded.get({ noproxy: true });
  const gameRunning = () => sceneState.gameRunning.get({ noproxy: true });
  const setGameRunning = (value: boolean) => {
    sceneState.gameRunning.set(value);
  };
  const getUserDevice = () => sceneState.device.get({ noproxy: true });

  const getReady = () => sceneState.sceneSettings.ready.get();
  const setReady = (value: boolean) => {
    sceneState.sceneSettings.ready.set(value);
  };
  const getMusic = () => sceneState.sceneSettings.music.get();
  const getSFX = () => sceneState.sceneSettings.sfx.get();
  const getAnnouncer = () => sceneState.sceneSettings.announcer.get();
  const setMusic = (value: boolean) => {
    sceneState.sceneSettings.music.set(value);
  };
  const setSFX = (value: boolean) => {
    sceneState.sceneSettings.sfx.set(value);
  };
  const setAnnouncer = (value: boolean) => {
    sceneState.sceneSettings.announcer.set(value);
  };

  // GAME STATE
  const gameOver = () => gameState.gameOver.get({ noproxy: true });
  const getMaxLeftArmAngle = () =>
    gameState.score.maxLeftArmAngle.get({ noproxy: true });
  const getMaxRightArmAngle = () =>
    gameState.score.maxRightArmAngle.get({ noproxy: true });
  const getPoppedBubbleCount = () =>
    gameState.score.popped.get({ noproxy: true });
  const getTotalBubbleCount = () =>
    gameState.score.totalBubbles.get({ noproxy: true });
  const getPoppedVelocities = () => {
    const right = gameState.score.poppedRightVelocities.get({ noproxy: true });
    const left = gameState.score.poppedLeftVelocities.get({ noproxy: true });
    return { right, left };
  };

  const getCurrentStreak = () =>
    gameState.score.currentStreak.get({ noproxy: true });
  const getSideSpawned = () => {
    if (gameState.levels.length > 0) {
      const side = gameState.levels[0].sideSpawned.get({ noproxy: true });
      if (side === 'right' || side === 'crossR' || side === 'frontR') {
        return 'right';
      } else {
        return 'left';
      }
    }
    return null;
  };

  return {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameRunning,
    setGameRunning,
    getUserDevice,
    gameOver,
    getMaxLeftArmAngle,
    getMaxRightArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
    getCurrentStreak,
    getSideSpawned,
    getMusic,
    getSFX,
    setMusic,
    setSFX,
    getAnnouncer,
    setAnnouncer,
    getReady,
    setReady,
  };
}
