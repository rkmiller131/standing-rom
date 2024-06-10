import { VRM } from '../../../interfaces/THREE_Interface';
import { useGameState } from '../store/GameState';
import { useSceneState } from '../store/SceneState';
import RenderLoop from './RenderLoop';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameStarted = false;

export default function GameLogic({ avatar }: GameLogicProps) {
  const sceneState = useSceneState();
  const gameState = useGameState();

  if (sceneState.sceneLoaded.get({ noproxy: true }) && avatar.current) {
    gameStarted = true;
  }

  if (!gameStarted) gameState.startGame();
  // any side effects that need to happen, render here in a useEffect
  // if you need to listen to any ecs onEntityAdded or whatever changes, probably here too

  // pull from the hookstate store and if we have, say, levels length then return this renderloop (only start game when ready)
  return <RenderLoop avatar={avatar} />;
}
