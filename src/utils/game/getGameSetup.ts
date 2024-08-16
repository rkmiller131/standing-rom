import { GameType, ScoreType } from '../../hookstate-store/Types';
import httpGetGameData from '../http/httpGetGameData';
import generateLevels from './generateLevels';

/**
 * Asynchronously fetches game setup data for this patient and game instance from the uvx backend.
 * This function makes an HTTP request to retrieve game data, generates levels based on the received data,
 * initializes a score object, and constructs a game object with these details.
 *
 * @returns {Promise<GameType>} A promise that resolves to a game setup object containing generated levels and an initial score.
 */
export default async function getGameSetup(): Promise<GameType> {
  const { sets, reps } = await httpGetGameData();
  const levels = generateLevels(sets, reps);

  const score: ScoreType = {
    totalBubbles: reps * sets,
    popped: 0,
    maxLeftArmAngle: 0,
    maxRightArmAngle: 0,
    poppedRightVelocities: [],
    poppedLeftVelocities: [],
    currentStreak: 0,
  };

  const game: GameType = {
    levels,
    score,
    gameOver: false,
  };
  return game;
}
