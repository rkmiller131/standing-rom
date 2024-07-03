/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useGameState } from '../store/GameState';
import RenderLoop from './RenderLoop';
import { Bubble } from '../store/types';
import { ECS } from '../World';
import { useThree } from '@react-three/fiber';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameRunning = false;
let firstBubbleInSet: null | Bubble;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();
  const { camera } = useThree();

  console.log('camera position is ', camera.position)
  console.log('camera rotation is ', camera.rotation)

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
    // if there are no more bubbles in the current set (ECS id starts at index 0 - subject to change when own uuid system is made)
    if (!firstBubbleInSet && firstBubbleInSet !== 0) {
      // remove the set from the levels array
      const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
      gameState.levels.set(setsInPlay);
      ECS.world.clear();
    }
  }, [firstBubbleInSet])

  return gameRunning ? <RenderLoop avatar={avatar} /> : null;
}
