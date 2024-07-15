import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Clock } from 'three';
import { useGameState } from '../store/GameState';
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useSceneState } from '../store/SceneState';
import { ECS, worldBubbleIds } from '../World';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

export default function RenderLoop({ avatar }: RenderLoopProps) {
  const clock = useRef(new Clock());
  const gameState = useGameState();
  const sceneState = useSceneState();

  useFrame((_state, delta) => {
    if (gameState.gameOver.get({ noproxy: true })) return;
    const elapsedTime = clock.current.getElapsedTime();

    // CALCULATE ROM - ARM ANGLES ---------------------------------------------------------------
    if (elapsedTime >= 0.5) {
      // currently starts checking when avatar is in T pose - add an extra && for when game start happens
      if (sceneState.sceneLoaded.get({ noproxy: true }) && avatar.current) {
        const { leftArmAngle, rightArmAngle } = calculateArmAngles(avatar);
        const maxLeftArmAngle = gameState.score.maxLeftArmAngle.get({ noproxy: true });
        const maxRightArmAngle = gameState.score.maxRightArmAngle.get({ noproxy: true });

        if (
          leftArmAngle > maxLeftArmAngle &&
          leftArmAngle <= 180 &&
          leftArmAngle >= 0
        ) {
          gameState.score.maxLeftArmAngle.set(leftArmAngle);
        }

        if (
          rightArmAngle > maxRightArmAngle &&
          rightArmAngle <= 180 &&
          rightArmAngle >= 0
        ) {
          gameState.score.maxRightArmAngle.set(rightArmAngle);
        }
      }

      // resetting the clock after all frames per second have been executed
      clock.current.start();
    }

    /* Below executes once per frame
       v                           v
    */
    // Wait for the countdown to end before the bubbles actually spawn
    if (!sceneState.gameRunning.get({ noproxy: true })) return;
    const levels = gameState.levels.get({ noproxy: true });
    // constantly check for the first set(level)
    if (levels && levels.length > 0) {
      if (levels[0].inPlay === false) {
        // if the current set is not already in play, make it in play
        gameState.levels[0].inPlay.set(true);
        // Now spawn all the reps (bubbles) in that set within the ECS
        const bubbles = gameState.levels[0].bubbleEntities.get({ noproxy: true })
        for (let i = 0; i < bubbles.length; i++) {
          const bubbleEntity = ECS.world.add({
            bubble: bubbles[i]
          });

          // Note: might need to refactor this id into a uuid as part of the bubble itself:
          // docs say: "In more complex projects that need stable entity IDs, especially when synchronizing entities across the network,
          // the user is encouraged to implement their own ID generation and management"
          const bubbleId = ECS.world.id(bubbleEntity);
          if (bubbleId === 0 || bubbleId) worldBubbleIds.push(bubbleId);
        }
      } else {
        // if the first set is already in play, then we need to check if the first bubble is present and not already active.
        const firstBubbleEntity = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
        if (firstBubbleEntity) {
          const firstBubbleId = worldBubbleIds[0];
          const bubbleEntity = ECS.world.entity(firstBubbleId);
          // So far, only way to trigger ECS.Entities to re-render bubbles is to add or remove components, or in this case add or remove entire entities.
          // adding or removing components is more performant than indexing the whole new entities store but couldn't get a good example of that running.
          // Would need to revist that later during polish week.
          if (bubbleEntity && !firstBubbleEntity.active) {
            gameState.levels[0].bubbleEntities[0].active.set(true); // make active in gamestate
            const newBubbleEntity = ECS.world.add({
              bubble: {
                age: bubbleEntity.bubble!.age,
                spawnPosition: bubbleEntity.bubble!.spawnPosition,
                active: true // make active in ECS
              }
            })
            const newBubbleId = ECS.world.id(newBubbleEntity);
            if (newBubbleId === 0 || newBubbleId) worldBubbleIds[0] = newBubbleId; // replace old bubble reference with new active one
            ECS.world.remove(bubbleEntity)
          }

          // then start ageing the first bubble
          const currentAge = firstBubbleEntity.age;
          gameState.levels[0].bubbleEntities[0].age.set(currentAge + delta);

          if (currentAge > 3) { // 3 seconds to pop the bubbles, otherwise counts as a miss
            // remove from the ECS
            const oldBubbleId = worldBubbleIds[0];
            const oldBubbleEntity = ECS.world.entity(oldBubbleId);
            if (oldBubbleEntity) ECS.world.remove(oldBubbleEntity);
            // update the gamestate "score" for missing a bubble (also removes from worldBubbleId manager)
            gameState.popBubble(0, false);
          }
        }
      }
    } else {
      // otherwise if there is no more first set (empty levels array) - game is over!
      if (!gameState.gameOver.get({ noproxy: true })) {
        console.log('GAME OVER');
        gameState.toggleEndGame();
      }
    }
  });

  return null;
}
