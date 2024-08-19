import { hookstate, useHookstate } from '@hookstate/core';
import { GameType } from './Types';
import { ECS, worldBubbleIds } from '../ecs/World';
import getGameSetup from '../utils/game/getGameSetup';

const initialState: GameType = hookstate({
  levels: [],
  score: {
    totalBubbles: 0,
    popped: 0,
    maxLeftArmAngle: 0,
    maxRightArmAngle: 0,
    poppedRightVelocities: [],
    poppedLeftVelocities: [],
    currentStreak: 0,
  },
  gameOver: false,
});

export const useGameState = () => {
  const gameState = useHookstate(initialState);

  return {
    ...gameState,
    startGame: () => {
      ECS.world.clear();
      getGameSetup().then((results) => gameState.set(results));
    },
    popBubble: (velocity: number, playerPopped: boolean, hand?: string) => {
      // remove the bubble from game state
      const bubblesInPlay = gameState.levels[0].bubbleEntities.get({ noproxy: true }).slice(1);
      gameState.levels[0].bubbleEntities.set(bubblesInPlay);

      worldBubbleIds.splice(0, 1);

      if (playerPopped) {
        gameState.score.popped.set((prev) => prev + 1);

        if (hand === 'right') {
          gameState.score.poppedRightVelocities.merge([velocity]);
        } else if (hand === 'left') {
          gameState.score.poppedLeftVelocities.merge([velocity]);
        }
        gameState.score.currentStreak.set((prev) => prev + 1);
      } else {
        gameState.score.currentStreak.set(0);
      }
    },
    toggleEndGame: () => {
      ECS.world.clear();
      gameState.gameOver.set((prev) => !prev);
    },
    reset: () => {
      gameState.set(initialState);
    },
  };
};

// to get things without a proxy, use:
// console.log('~~ game state is ', gameState.levels[0].sideSpawned.get({noproxy: true}));
