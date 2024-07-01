import { LevelsType } from '../store/types';
import findSideSpawned from './findSideSpawned';
import generateBubbles from './generateBubbles';

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