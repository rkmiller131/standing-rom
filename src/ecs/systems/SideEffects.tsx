/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { EntityId } from '../store/types';
import { useGameState } from '../store/GameState';

export default function SideEffects({firstBubbleInSet} : {firstBubbleInSet: EntityId}) {
  const gameState = useGameState();
  // let firstBubbleInSet: unknown | EntityId;

  // if (gameRunning) {
  //   firstBubbleInSet = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
  // }

  useEffect(() => {
    // if (!gameRunning) return;

    console.log('first bubble in the set is ', firstBubbleInSet)
    // if there are no more bubbles in the current set
    if (firstBubbleInSet !== 0 && !firstBubbleInSet) {
      // remove the set from the levels array
      const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
      gameState.levels.set(setsInPlay);
      console.log('No more bubbles in the set; game state is ', gameState)
    } else {
      // otherwise if there is a new first bubble, make it active!
      // do a query in the world for the bubble by the id of the firstBubble, then access its active property
    }
  }, [firstBubbleInSet])
  return null;
}