/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useGameState } from '../store/GameState';
import RenderLoop from './RenderLoop';
import { Bubble } from '../store/types';
import { ECS } from '../World';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameRunning = false;
let firstBubbleInSet: null | Bubble;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();

  if (gameRunning && gameState.levels.length) {
    firstBubbleInSet = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
  }

  async function startTheGame() {
    await gameState.startGame();
  }

  useEffect(() => {
    startTheGame();
    gameRunning = true;
  }, [])

  useEffect(() => {
    if (!gameRunning) return;
    // if there are no more bubbles in the current set
    if (!firstBubbleInSet && firstBubbleInSet !== 0) {
      // remove the set from the levels array
      const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
      gameState.levels.set(setsInPlay);
      // since all we have are bubbles, and each bubble is added per set, clear the whole world I guess.
      ECS.world.clear();
    }
  }, [firstBubbleInSet])

  return gameRunning ? <RenderLoop avatar={avatar} /> : null;
}
