import { hookstate, useHookstate } from '@hookstate/core';
import { GameType } from './types';
import getGameSetup from '../helpers/getGameSetup';

// NOTE:  moved levels and this game state store into the class for GameSetup
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
      getGameSetup().then((results) => gameState.set(results));
    },
    popBubble: (velocity: number) => {
      const bubblesInPlay = gameState.levels[0].bubbleEntities.get({ noproxy: true }).slice(1);
      gameState.levels[0].bubbleEntities.set(bubblesInPlay);
      gameState.score.popped.set((prev) => prev + 1);
      gameState.score.poppedVelocities.merge([velocity]);
    },
    toggleEndGame: () => {
      gameState.gameOver.set((prev) => !prev);
    },
  };
};

// to get things without a proxy, use:
// console.log('~~ game state is ', gameState.levels[0].sideSpawned.get({noproxy: true}));
