import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Clock, Vector3 } from 'three';
import { useGameState } from '../store/GameState';
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useSceneState } from '../store/SceneState';
import { avatarProportions } from '../../avatar/helpers/setupAvatarProportions';
// import { calculateLinearCoordinates } from '../helpers/calculateLinearCoordinates';
import { calculateArcCoordinates } from '../helpers/calculateArcCoordinates';
import { ECS } from '../World';
import { uuidComponent } from '../components/uuid';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

let gameEnded = false;

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

          // depending on the level's spawn side, calc angles for all the reps
          // these are the starting angles/points of reference
          const spawnSide = levels[0].sideSpawned;

          // positions to spawn bubbles slightly away from the avatar's body but within arm's length
          const leftHandPosition = new Vector3(-0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos); // maybe add in the actual spawn pos of hand
          const rightHandPosition = new Vector3(0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

          const leftHandFrontPos = new Vector3(-0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos); // might be able to use same value for front as lateral sides
          const rightHandFrontPos = new Vector3(0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

          const leftShoulderPosition = new Vector3(-0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos); // might have to add in actual shoulder spawn pos too
          const rightShoulderPosition = new Vector3(0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);

          let origin = avatarProportions.spinePos;
          let startPosition, spawnPos;
          // 0.31 would be about 18 deg to compensate for the starting arm angle, subject to change though
          const startAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? 0 : Math.PI / 2;
          // end over top the head, not too far over. 1.31 feels about right, subject to change though. Was - 0.75
          const endAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? Math.PI - 1.31 : Math.PI;
          const midAngle = (endAngle - startAngle) / 2;
          const angleIncrement = (endAngle - startAngle) / (numTargets - 1);

          // Now spawn all the reps (bubbles) in that set
          for (let i = 0; i < numTargets; i++) {
            let angle = startAngle + i * angleIncrement;

            if (spawnSide === 'left') {
              startPosition = leftHandPosition;

            } else if (spawnSide === 'right') {
              startPosition = rightHandPosition;

            } else if (spawnSide === 'frontL') {
              startPosition = leftHandFrontPos;

            } else if (spawnSide === 'frontR') {
              startPosition = rightHandFrontPos;

            } else if (spawnSide === 'crossL') {
              startPosition = leftShoulderPosition;
              origin = new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos);

            } else if (spawnSide === 'crossR') {
              startPosition = rightShoulderPosition;
              origin = new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
            }

            if (numTargets === 1) {
              angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
            }

            if (spawnSide === 'left' || spawnSide === 'crossL') {
              angle = -angle // necessary to mirror coordinates
            }

            // ---------------------------------------------------------------------------------------------------------------------------------
            // No longer have linear cross body bubbles (not going from hand to cross shoulder, but rather an arc of t pose to opposite shoulder)
            // Saving for reference later in case linear cross body is used --------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------------------------------------------
            // if (spawnSide === 'crossL' || spawnSide === 'crossR') {
            //   const endPosition = spawnSide === 'crossL' ? rightShoulderPosition : leftShoulderPosition;
            //   spawnPos = calculateLinearCoordinates(startPosition!, endPosition, numTargets, i);

            // } else {
            //   spawnPos = calculateArcCoordinates(avatarProportions.spinePos, spawnSide, startPosition!, angle);
            // }

            spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);

            console.log(`spawn side was ${spawnSide} and the angle was ${angle}: calculated spawn position is ${JSON.stringify(spawnPos)}`)
            // now use the spawnPos to add a bubble to the ECS.world.add({ bubble: ... })
            const { bubble } = ECS.world.add({
              bubble: {
                ...uuidComponent(),
                age: 0,
                spawnPosition: spawnPos,
                active: false
              }
            })
            // save the EntityId (uuid) of the bubbles in game state, replacing the empty array slots
            gameState.levels[0].bubbleEntities[i].set(bubble.uuid);
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
