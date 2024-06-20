import { hookstate, useHookstate } from '@hookstate/core';
import { GameType } from './types';
import getGameSetup from '../helpers/getGameSetup';
import { ECS } from '../World';

const initialState: GameType = hookstate({
  levels: [],
  score: {
    totalBubbles: 0,
    popped: 0,
    maxLeftArmAngle: 0,
    maxRightArmAngle: 0,
    poppedVelocities: [],
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
    popBubble: (velocity: number) => {
      // Remove the current bubble from the ECS ?
      // Any time we deal with the ECS, we get a lag in the game. Maybe just keep and cleanup later...
      // const bubbleId = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
      // const bubbleEntity = ECS.world.entity(bubbleId as EntityId);
      // if (bubbleEntity) ECS.world.remove(bubbleEntity);

      // Remove the current bubble form the levels in gameState
      const bubblesInPlay = gameState.levels[0].bubbleEntities.get({ noproxy: true }).slice(1);
      gameState.levels[0].bubbleEntities.set(bubblesInPlay);
      gameState.score.popped.set((prev) => prev + 1);
      gameState.score.poppedVelocities.merge([velocity]);
    },
    toggleEndGame: () => {
      ECS.world.clear();
      gameState.gameOver.set((prev) => !prev);
    },
  };
};

// to get things without a proxy, use:
// console.log('~~ game state is ', gameState.levels[0].sideSpawned.get({noproxy: true}));
