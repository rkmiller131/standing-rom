import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Clock, Vector3 } from 'three';
import { useGameState } from '../store/GameState';
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useSceneState } from '../store/SceneState';
import { avatarProportions } from '../../avatar/helpers/setupAvatarProportions';
import { calculateLinearCoordinates } from '../helpers/calculateLinearCoordinates';
import { calculateArcCoordinates } from '../helpers/calculateArcCoordinates';
import { ECS } from '../World';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

let gameEnded = false;
const leftHandPosition = new Vector3();
const rightHandPosition = new Vector3();

const leftHandFrontPos = new Vector3();
const rightHandFrontPos = new Vector3();

const leftShoulderPosition = new Vector3();
const rightShoulderPosition = new Vector3();


export default function RenderLoop({ avatar }: RenderLoopProps) {
  const clock = useRef(new Clock());
  const gameState = useGameState();
  const sceneState = useSceneState();
  // const [activeBubble, setActiveBubble] = useState(null);

  console.log('render loop has started')

  useFrame(() => {
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

    // console.log('~~ executing once per FRAME')
    // import other functions here related to the ecs queries
    // import other functions here related to the WebGPU renderer

    // SPAWN BUBBLES - GAME LOGIC --------------------------------------------------------
    if (!gameEnded) {
      const levels = gameState.levels.get({ noproxy: true });
      // constantly check for the first set(level)
      if (levels && levels.length > 0) {
        if (levels[0].inPlay === false) {
          // if the current set is not already in play, make it in play
          gameState.levels[0].inPlay.set(true);
          const numTargets = levels[0].bubbleEntities.length; // reps
          console.log('the game state is ', gameState)

          // depending on the level's spawn side, calc angles for all the reps
          // these are the starting angles/points of reference
          const spawnSide = levels[0].sideSpawned;
          let startPosition;
          let spawnPos;
          const startAngle = 0.31; // about 18 deg to compensate for the starting arm angle
          const endAngle = Math.PI - 0.75; // end over top the head, not too far over
          const midAngle = (endAngle - startAngle) / 2;
          const angleIncrement = (endAngle - startAngle) / (numTargets - 1);

          // positions to spawn bubbles slightly away from the avatar's body but within arm's length
          leftHandPosition.set(-0.35 * avatarProportions.armLength, avatarProportions.handHeight, 0);
          rightHandPosition.set(0.35 * avatarProportions.armLength, avatarProportions.handHeight, 0);

          leftHandFrontPos.set(-0.3 * avatarProportions.armLength, avatarProportions.handHeight, 0);
          rightHandFrontPos.set(0.3 * avatarProportions.armLength, avatarProportions.handHeight, 0);

          leftShoulderPosition.set(-0.3 * avatarProportions.armLength, avatarProportions.shoulderHeight, 0);
          rightShoulderPosition.set(0.3 * avatarProportions.armLength, avatarProportions.shoulderHeight, 0);

          // Now spawn all the reps (bubbles) in that set
          for (let i = 0; i < numTargets; i++) {
            let angle = startAngle + i * angleIncrement;

            if (spawnSide === 'left') {
              startPosition = leftHandPosition;

            } else if (spawnSide === 'right') {
              startPosition = rightHandPosition;

            } else if (spawnSide === 'frontL' || spawnSide === 'crossL') {
              startPosition = leftHandFrontPos;

            } else if (spawnSide === 'frontR' || spawnSide === 'crossR') {
              startPosition = rightHandFrontPos;
            }

            if (numTargets === 1) {
              angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
            }

            if (spawnSide === 'left') {
              angle = -angle; // necessary to mirror coordinates
            }

            if (spawnSide === 'crossL' || spawnSide === 'crossR') {
              const endPosition = spawnSide === 'crossL' ? rightShoulderPosition : leftShoulderPosition;
              spawnPos = calculateLinearCoordinates(startPosition!, endPosition, numTargets, i);

            } else {
              spawnPos = calculateArcCoordinates(avatarProportions.spinePos, spawnSide, startPosition!, angle);
            }

            // now use the spawnPos to add a bubble to the ECS.world.add({ bubble: ... })
            ECS.world.add({
              bubble: {
                age: 0,
                spawnPosition: spawnPos,
                active: false
              }
            })
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
    }
  });

  return null;
}
