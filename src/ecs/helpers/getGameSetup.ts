import { GameType, ScoreType } from '../store/types';
import generateLevels from './generateLevels';
import httpGetGameData from './httpGetGameData';

export default async function getGameSetup(): Promise<GameType> {
  const { sets, reps } = await httpGetGameData();
  const levels = generateLevels(sets, reps);

  const score: ScoreType = {
    totalBubbles: reps * sets,
    popped: 0,
    maxLeftArmAngle: 0,
    maxRightArmAngle: 0,
    poppedVelocities: [],
    currentStreak: 0
  };

  const game: GameType = {
    levels,
    score,
    gameOver: false,
  };
  return game;
}
