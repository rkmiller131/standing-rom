import { GameType, LevelsType, ScoreType, SetType } from '../store/types';
import findSideSpawned from './findSideSpawned';
import getGameData from './getGameData';

export default async function getGameSetup(): Promise<GameType> {
  const { reps, sets } = await getGameData();
  const levels: LevelsType = [];
  for (let i = 0; i < sets; i++) {
    const set: SetType = {
      sideSpawned: findSideSpawned(i),
      bubbleEntities: new Array(reps),
      inPlay: false,
    };
    levels.push(set);
  }

  const score: ScoreType = {
    totalBubbles: reps * sets,
    popped: 0,
    maxLeftArmAngle: 0,
    maxRightArmAngle: 0,
    poppedVelocities: [],
  };

  const game: GameType = {
    levels,
    score,
    gameOver: false,
  };
  return game;
}
