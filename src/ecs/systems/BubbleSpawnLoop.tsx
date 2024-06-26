import { useFrame } from '@react-three/fiber';
import useGameData from '../../hooks/useGameData';
import { useGameState } from '../store/GameState';

let gameEnded = false;

export default function BubbleSpawnLoop() {
  const { makeFirstLevelInPlay } = useGameData();
  const gameState = useGameState();

  const levels = gameState.levels.get({ noproxy: true });

  console.log('bubble spawn loop has started')

  useFrame(() => {
    // SPAWN BUBBLES - GAME LOGIC --------------------------------------------------------
    if (!gameEnded) {
      // console.log('game hasnt ended')
      // constantly check for the first set(level)
      if (levels && levels.length > 0) {
        if (levels[0].inPlay === false) {
          // if the current set is not already in play, make it in play
          makeFirstLevelInPlay();

          // console.log('levels in the render loop are ', levels)
          console.log('game state in the bubble spawn loop is ', gameState)

          // // Now spawn all the reps (bubbles) in that set within the ECS
          // for (let i = 0; i < bubbles.length; i++) {
          //   // now use the spawnPos to add a bubble to the ECS.world.add({ bubble: ... })
          //   ECS.world.add({
          //     bubble: bubbles[i]
          //   })
          // }
        } else {
          // // if the first set is already in play, then we need to check if the first bubble is present.
          // let firstBubbleEntity = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });

          // if (firstBubbleEntity) {
          //   const firstBubble = getMutableComponent(firstBubbleEntity, BubbleComponent);
          //   // then start ageing the first bubble
          //   const currentAge = firstBubble.age.get(NO_PROXY)
          //   firstBubble.age.set(currentAge + deltaSeconds);

          //   // if there is a first bubble and its age is > 5 sec old,
          //   if (firstBubble.age.value > 5) {
          //     // then remove the bubble, no score for player!
          //     dispatchAction(
          //       ROMGameActions.popBubble({
          //         gameEntityUUID: gameEntityUUID as EntityUUID,
          //         bubbleEntity: firstBubbleEntity,
          //         playerPopped: false
          //       })
          //     )
          //   }
          // }
        }
      } else {
        // otherwise if there is no more first set (empty levels array) - game is over!
        if (!gameEnded) {
          console.log('~~ THE GAME IS OVER');
          gameEnded = true;
          // don't forget to update the global state
        }
      }
    }
  });

  return null;
}
