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
import { EntityId } from '../store/types';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

let gameInitialized = false;
let gameEnded = false;

export default function RenderLoop({ avatar }: RenderLoopProps) {
  const clock = useRef(new Clock());
  const gameState = useGameState();
  const sceneState = useSceneState();

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
      const numLevels = levels.length; // sets
      const numTargets = levels[0].bubbleEntities.length; // reps
      // constantly check for the first set(level)
      if (levels && numLevels > 0) {
        // Set up the game all at once to avoid lag between ECS.add entities.
        if (!gameInitialized) {
          for (let i = 0; i < numLevels; i++) {
            // depending on the level's spawn side, calc angles for all the reps
            const spawnSide = levels[i].sideSpawned;
            // spawn all the reps in every set, but with all bubbles starting as invisible entities
            for (let j = 0; j < numTargets; j++) {
              let origin = avatarProportions.spinePos;
              let startPosition;
              // 0.31 would be about 18 deg to compensate for the starting arm angle, subject to change though
              const startAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? 0 : Math.PI / 2;
              // end over top the head, not too far over. 1.31 feels about right, subject to change though. Was - 0.75
              const endAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? Math.PI - 1.31 : Math.PI;
              const midAngle = (endAngle - startAngle) / 2;
              const angleIncrement = (endAngle - startAngle) / (numTargets - 1);
              let angle = startAngle + j * angleIncrement;

              // positions to spawn bubbles slightly away from the avatar's body but still within arm's length
              if (spawnSide === 'left') {
                // left lateral hand position
                startPosition = new Vector3(-0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos); // maybe add in the actual spawn pos of hand

              } else if (spawnSide === 'right') {
                // right lateral hand position
                startPosition = new Vector3(0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

              } else if (spawnSide === 'frontL') {
                // left hand front positioin
                startPosition = new Vector3(-0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

              } else if (spawnSide === 'frontR') {
                // right hand front position
                startPosition = new Vector3(0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

              } else if (spawnSide === 'crossL') {
                // left shoulder position
                startPosition = new Vector3(-0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos); // might have to add in actual shoulder spawn pos too
                // update with the actual origin of the left shoulder plus some extra -z(?)
                origin = new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos);

              } else if (spawnSide === 'crossR') {
                // right shoulder position
                startPosition = new Vector3(0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);
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

              // ---------------------------------------------------------------------------------------------------------------------------------
              // Changing the linear coordinates to frontal raises instead of cross body - more consistent with the actual PT but hard to track
              // with a single web cam - the arm doesn't fully extend, so maybe still compensate with the frontal arc raises
              // ---------------------------------------------------------------------------------------------------------------------------------
              // if (spawnSide === 'frontL' || spawnSide === 'frontR') {
              //   const endPosition = spawnSide === 'frontL' ? new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos) : new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
              //   spawnPos = calculateLinearCoordinates(startPosition!, endPosition, numTargets, i);
              // } else {
              //   spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);
              // }

              const spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);

              // now use the spawnPos to add a bubble to the ECS.world.add({ bubble: ... })
              const bubbleEntity = ECS.world.add({
                bubble: {
                  // ...uuidComponent(),
                  age: 0,
                  spawnPosition: spawnPos,
                  active: false
                },
                invisible: true
              });
              const bubbleId = ECS.world.id(bubbleEntity);
              // save the EntityId (uuid) of the bubbles in game state, replacing the empty array slots
              gameState.levels[i].bubbleEntities[j].set(bubbleId as EntityId);
            }
          }
          gameInitialized = true;
        }

        if (levels[0].inPlay === false) {
          // if the current set is not already in play, make it in play
          gameState.levels[0].inPlay.set(true);
          // make all bubbles in the first set visible by removing their invisibility component
          const bubbleIds = gameState.levels[0].bubbleEntities.get({ noproxy: true });
          for (let k = 0; k < bubbleIds.length; k++) {
            const bubbleEntity = ECS.world.entity(bubbleIds[k] as EntityId);
            if (bubbleEntity) ECS.world.removeComponent(bubbleEntity, 'invisible');
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
