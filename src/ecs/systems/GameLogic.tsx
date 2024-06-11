import { VRM } from '../../../interfaces/THREE_Interface';
import { useGameState } from '../store/GameState';
import RenderLoop from './RenderLoop';
import { useState } from 'react';
import Bubbles from '../entities/Bubbles';
import { EntityUUID } from '../store/types';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameStarted = false;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();
  const [bubbles, setBubbles] = useState([] as EntityUUID[])

  if (gameState.levels.get({noproxy: true}).length > 0 && avatar.current) {
    gameStarted = true;
  }

  if (!gameStarted) gameState.startGame();

  function renderBubbles(array: EntityUUID[]) {
    setBubbles(array);
  }

  // any side effects that need to happen, render here in a useEffect
  // if you need to listen to any ecs onEntityAdded or whatever changes, probably here too

  // pull from the hookstate store and if we have, say, levels length then return this renderloop (only start game when ready)
  return (
    <>
      <Bubbles bubbles={bubbles} />
      {gameStarted && <RenderLoop avatar={avatar} renderBubbles={renderBubbles}/>}
    </>
  )
}
