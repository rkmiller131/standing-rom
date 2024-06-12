import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Clock } from 'three';
import { useGameState } from '../store/GameState';
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useSceneState } from '../store/SceneState';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

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
      // constantly check for the first set(level)
      if (levels && levels.length > 0) {
        if (levels[0].inPlay === false) {
          // if the current set is not already in play, make it in play
          gameState.levels[0].inPlay.set(true);
          const numTargets = gameState.levels[0].bubbleEntities.length; // reps
          console.log('the game state is ', gameState)
          // spawn all the reps in that set
          for (let i = 0; i < numTargets; i++) {
            //
          }

        //   const avatarComponent = getOptionalComponent(Engine.instance.localClientEntity, AvatarComponent);
        //   const avatarTransform = getOptionalComponent(Engine.instance.localClientEntity, TransformComponent);

        //   if (avatarComponent && avatarTransform) {
        //     const avatarHeight = avatarComponent.avatarHeight;
        //     const eyeHeight = avatarComponent.eyeHeight;
        //     const armLength = (avatarComponent.avatarHeight / 2); // a person's entire wingspan === their height

        //     const spinePos = avatarTransform.position.clone().setY(avatarComponent.avatarHeight * 0.75);

        //     // Calculate the positions of the L/R hands and shoulders
        //     const handHeight = eyeHeight - 0.5 * avatarHeight; // hands are mid height (for y axis)
        //     const shoulderPosition = avatarHeight - (0.5 * avatarComponent.torsoLength)

        //     const leftHandPosition = new Vector3(-0.5 * armLength, handHeight, 0).add(avatarTransform.position);
        //     const rightHandPosition = new Vector3(0.5 * armLength, handHeight, 0).add(avatarTransform.position);

        //     const leftHandFrontPos = new Vector3(-0.3 * armLength, handHeight, 0).add(avatarTransform.position);
        //     const rightHandFrontPos = new Vector3(0.3 * armLength, handHeight, 0).add(avatarTransform.position);

        //     const leftShoulderPosition = new Vector3(-0.3 * armLength, shoulderPosition, 0).add(avatarTransform.position);
        //     const rightShoulderPosition = new Vector3(0.3 * armLength, shoulderPosition, 0).add(avatarTransform.position);

        //     const numTargets = levels[0].bubbleEntities.length;

        //     // Now spawn some bubbles into the 'emitter' (the array in state).
        //     for (let i = 0; i < numTargets; i++) {
        //       const bubbleEntity = createEntity();
        //       setComponent(bubbleEntity, BubbleComponent);
        //       setComponent(bubbleEntity, EntityTreeComponent, {
        //         parentEntity: UndefinedEntity, // not a child of any parent in the ecs
        //         uuid: MathUtils.generateUUID() as EntityUUID
        //       })

        //       const spawnSide = levels[0].sideSpawned;
        //       let startPosition;
        //       let spawnPos;

        //       const startAngle = 0.45; // about 25 deg to compensate for armpit angle
        //       const endAngle = Math.PI - 0.45;
        //       const midAngle = (endAngle - startAngle) / 2;
        //       const angleIncrement = (endAngle - startAngle) / (numTargets - 1);
        //       let angle = startAngle + i * angleIncrement;

        //       if (spawnSide === 'left') {
        //         startPosition = leftHandPosition;

        //       } else if (spawnSide === 'right') {
        //         startPosition = rightHandPosition;

        //       } else if (spawnSide === 'frontL' || spawnSide === 'crossL') {
        //         startPosition = leftHandFrontPos;

        //       } else if (spawnSide === 'frontR' || spawnSide === 'crossR') {
        //         startPosition = rightHandFrontPos;
        //       }

        //       if (numTargets === 1) {
        //         angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
        //       }

        //       if (spawnSide === 'left') {
        //         angle = -angle; // necessary to mirror coordinates
        //       }

        //       if (spawnSide === 'crossL' || spawnSide === 'crossR') {
        //         const endPosition = spawnSide === 'crossL' ? rightShoulderPosition : leftShoulderPosition;
        //         spawnPos = calculateLinearCoordinates(startPosition, endPosition, numTargets, i);

        //       } else {
        //         spawnPos = calculateArcCoordinates(spinePos, spawnSide, startPosition, angle);
        //       }

        //       // get the bubble's startingPosition property and set it to the spawnPos
        //       const currentBubble = getComponent(bubbleEntity, BubbleComponent);
        //       const currentBubbleTransform = getComponent(bubbleEntity, TransformComponent);
        //       currentBubble.startPosition.set(spawnPos.x, spawnPos.y, spawnPos.z); // might not need to keep a start pos reference as a property
        //       currentBubbleTransform.position.set(spawnPos.x, spawnPos.y, spawnPos.z);

        //       // finally add that bubble to the 'emitter' array
        //       const mutableGameState = getMutableState(ROMGameState);
        //       const mutableBubbleArray = mutableGameState[gameEntityUUID].levels[0];
        //       mutableBubbleArray.bubbleEntities[i].set(bubbleEntity); // replaces the empty item with an entity ref
        //     }
        //   }
        // } else {
        //   // if the first set is already in play, then we need to check if the first bubble is present.
        //   let firstBubbleEntity = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });

        //   if (firstBubbleEntity) {
        //     const firstBubble = getMutableComponent(firstBubbleEntity, BubbleComponent);
        //     // then start ageing the first bubble
        //     const currentAge = firstBubble.age.get(NO_PROXY)
        //     firstBubble.age.set(currentAge + deltaSeconds);

        //     // if there is a first bubble and its age is > 5 sec old,
        //     if (firstBubble.age.value > 5) {
        //       // then remove the bubble, no score for player!
        //       dispatchAction(
        //         ROMGameActions.popBubble({
        //           gameEntityUUID: gameEntityUUID as EntityUUID,
        //           bubbleEntity: firstBubbleEntity,
        //           playerPopped: false
        //         })
        //       ) // this happens so fast sometimes - why?
        //     }
        //   }
        // }
        //   //check for max angle achieved and dispatch action to update the state
        //   // every frame, track the avatar's arm angle. Will need for both arms.
        //   const rig = getOptionalComponent(Engine.instance.localClientEntity, AvatarRigComponent);

        //   if (rig && rig.vrm && frameCounter % 60 === 0) {
        //     const { leftArmAngle, rightArmAngle } = calculateArmAngles(rig);
        //     const scoreLeft = gameState[gameEntityUUID].score.maxLeftArmAngle.value;
        //     const scoreRight = gameState[gameEntityUUID].score.maxRightArmAngle.value;

        //     //  Arm angle is not accurate (it's very jumpy) should we delay the execution check? solution: 1 check per sec
        //     if (leftArmAngle > scoreLeft && (leftArmAngle < 181 && leftArmAngle > 0)) {
        //         gameState[gameEntityUUID].score.maxLeftArmAngle.set(leftArmAngle);
        //     }

        //     if(rightArmAngle > scoreRight && (rightArmAngle < 181 && rightArmAngle > 0)) {
        //       gameState[gameEntityUUID].score.maxRightArmAngle.set(rightArmAngle);
        //     }
        }
      } else {
        // if there is no first set (empty levels array) - dispatch an end of game
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
