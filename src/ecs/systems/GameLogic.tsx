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
    // if (!gameState.levels[0].bubbleEntities || !gameState.levels[0].bubbleEntities.length) return;
    // console.log('First bubble use effect: games state is currently ', gameState)
    if (!gameRunning) return;

    console.log('first bubble in the set is ', firstBubbleInSet)
    // if there are no more bubbles in the current set
    if (!firstBubbleInSet) {
      // remove the set from the levels array
      const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
      gameState.levels.set(setsInPlay);
    } else {
      // otherwise if there is a new first bubble, make it active!
      // do a query in the world for the bubble by the id of the firstBubble, then access its active property
    }
  }, [firstBubbleInSet])

  // any side effects that need to happen, render here in a useEffect
  // if you need to listen to any ecs onEntityAdded or whatever changes, probably here too

  // pull from the hookstate store and if we have, say, levels length then return this renderloop (only start game when ready)
  // Maybe in the future if game is all set up, then render the countdown to start while render loop is happening, and then only
  // when countdown starts does the render loop render all the bubbles (edit bubbles.tsx to wait for countdown over)
  return gameRunning ? <RenderLoop avatar={avatar} /> : null;
}
