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
  const getUserDevice = () => sceneState.device.get({ noproxy: true });

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
  const getPoppedVelocities = () =>
    gameState.score.poppedVelocities.get({ noproxy: true });
  const getCurrentStreak = () =>
    gameState.score.currentStreak.get({ noproxy: true });

  return {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameRunning,
    getUserDevice,
    gameOver,
    getMaxLeftArmAngle,
    getMaxRightArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
    getCurrentStreak,
  };
}
