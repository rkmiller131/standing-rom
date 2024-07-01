import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Clock } from 'three';
import { useGameState } from '../store/GameState';
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useSceneState } from '../store/SceneState';
import { ECS } from '../World';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

let gameEnded = false;

export default function RenderLoop({ avatar }: RenderLoopProps) {
  const clock = useRef(new Clock());
  const gameState = useGameState();
  const sceneState = useSceneState();

  useFrame(() => {
    if (gameEnded) return;
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

    // Below executes once per frame

    // SPAWN BUBBLES - GAME LOGIC --------------------------------------------------------
    const levels = gameState.levels.get({ noproxy: true });
    // constantly check for the first set(level)
    if (levels && levels.length > 0) {
      if (levels[0].inPlay === false) {
        // if the current set is not already in play, make it in play
        gameState.levels[0].inPlay.set(true);
        // Now spawn all the reps (bubbles) in that set
        const bubbles = gameState.levels[0].bubbleEntities.get({ noproxy: true })
        for (let i = 0; i < bubbles.length; i++) {
          ECS.world.add({
            bubble: bubbles[i]
          });

        }
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
  });

  return null;
}
