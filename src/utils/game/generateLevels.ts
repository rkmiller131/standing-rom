import { LevelsType } from '../../hookstate-store/Types';
import findSideSpawned from './findSideSpawned';
import generateBubbles from './generateBubbles';

/**
 * Generates an array of level data based on the specified number of sets and repetitions.
 * Each level represents a set of bubble entities spawned from a determined side, with each entity having its own position and state.
 * The function iterates over the number of sets, determining the spawn side for each set using the `findSideSpawned` function,
 * and then generates bubble entities for each set using the `generateBubbles` function.
 *
 * @param {number} sets - The number of sets to generate level data for.
 * @param {number} reps - The number of repetitions per set for generating bubble entities.
 * @returns {LevelsType[]} An array of level data objects, each containing information about the side spawned, bubble entities, and whether the set is currently in play.
 */
export default function generateLevels(sets: number, reps: number) {
  const levelsGenerated: LevelsType = [];
  for (let i = 0; i < sets; i++) {
    const spawnSide = findSideSpawned(i);
    const set = {
      sideSpawned: spawnSide,
      bubbleEntities: generateBubbles(reps, spawnSide),
      inPlay: false
    }
    levelsGenerated.push(set);
  }
  return levelsGenerated;
}