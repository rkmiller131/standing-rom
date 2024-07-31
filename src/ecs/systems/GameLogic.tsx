/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { VRM } from '../../interfaces/THREE_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import { Bubble } from '../../hookstate-store/Types';
import { ECS } from '../World';
import RenderLoop from './RenderLoop';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameIsSetup = false;
let firstBubbleInSet: null | Bubble;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();

  if (gameIsSetup && gameState.levels.length) {
    firstBubbleInSet = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
  }

  async function startTheGame() {
    await gameState.startGame();
  }

  useEffect(() => {
    startTheGame();
    gameIsSetup = true;
  }, [])

  useEffect(() => {
    if (!gameIsSetup) return;
    // if there are no more bubbles in the current set (ECS id starts at index 0 - subject to change when own uuid system is made)
    if (!firstBubbleInSet && firstBubbleInSet !== 0) {
      // remove the set from the levels array
      const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
      gameState.levels.set(setsInPlay);
      ECS.world.clear(); // this will clear any player popped bubbles that round from the ECS
    }

    if (gameState.gameOver.get({ noproxy: true })) {
      gameIsSetup = false;
    }

  }, [firstBubbleInSet])

  return gameIsSetup ? <RenderLoop avatar={avatar} /> : null;
}