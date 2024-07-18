import { useGameState } from '../ecs/store/GameState';
import { useSceneState } from '../ecs/store/SceneState';

export default function useHookstateGetters() {
  const gameState = useGameState();
  const sceneState = useSceneState();

  // SCENE STATE
  const environmentLoaded = () => (sceneState.environmentLoaded.get({ noproxy: true }));
  const environmentSelected = () => (sceneState.selectedEnvironment.get({ noproxy: true }));
  const sceneLoaded = () => (sceneState.sceneLoaded.get({ noproxy: true }));

  // GAME STATE
  const gameOver = () => (gameState.gameOver.get({ noproxy: true }));

  return {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameOver
  }
}