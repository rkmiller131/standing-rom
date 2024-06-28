/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useGameState } from '../store/GameState';
import RenderLoop from './RenderLoop';
import { useSceneState } from '../store/SceneState';
import { EntityId } from '../store/types';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameRunning = false;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();
  const sceneState = useSceneState();
  let firstBubbleInSet: unknown | EntityId;

  // add a check if game running && game is not over, then get first bubble, otherwise it will throw an error
  if (gameRunning) {
    firstBubbleInSet = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
  }

  async function startTheGame() {
    await gameState.startGame();
  }

  useEffect(() => {
    if (sceneState.sceneLoaded.get({ noproxy: true })) {
      startTheGame();
      gameRunning = true;
    }
  }, [sceneState.sceneLoaded])

  useEffect(() => {
    if (!gameRunning) return;

    console.log('first bubble in the set is ', firstBubbleInSet)
    // if there are no more bubbles in the current set
    if (firstBubbleInSet !== 0 && !firstBubbleInSet) {
      // remove the set from the levels array
      const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
      gameState.levels.set(setsInPlay);
      console.log('No more bubbles in the set; game state is ', gameState)
    } else {
      // otherwise if there is a new first bubble, make it active!
      // do a query in the world for the bubble by the id of the firstBubble, then access its active property
    }
  }, [firstBubbleInSet])

  return gameRunning ? <RenderLoop avatar={avatar} /> : null;
}
