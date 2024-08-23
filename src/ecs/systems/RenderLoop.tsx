import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Clock } from 'three';
import { VRM } from '../../interfaces/THREE_Interface';
import calcArmAngles from '../../utils/math/calcArmAngles';
import { ECS, worldBubbleIds } from '../World';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
}

const SPAWN_INTERVAL = 3;
let nextSpawnCountdown = 0;

export default function RenderLoop({ avatar }: RenderLoopProps) {
  const {
    getMaxRightArmAngle,
    getMaxLeftArmAngle,
    gameRunning,
    gameOver
  } = useHookstateGetters();
  const clock = useRef(new Clock());
  const gameState = useGameState();

  useFrame((_state, delta) => {
    if (gameOver()) return;
    const elapsedTime = clock.current.getElapsedTime();

    // CALCULATE ROM - ARM ANGLES ---------------------------------------------------------------
    if (elapsedTime >= 0.5) {
      if (avatar.current) {
        const { leftArmAngle, rightArmAngle } = calcArmAngles(avatar);
        const maxLeftArmAngle = getMaxLeftArmAngle();
        const maxRightArmAngle = getMaxRightArmAngle();

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

    /* ----------- Below executes once per frame ------------------
                   v                           v
    */
    // Wait for the countdown to end before the bubbles actually spawn
    if (!gameRunning()) return;
    const level = gameState.level.get({ noproxy: true });
    // constantly check to make sure there are still bubbles to spawn
    if (level && level.length > 0) {
      // if we spawned a bubble and still have time left
      if (nextSpawnCountdown > 0) {
        // bubbleMoveSystem(delta, () => {
        //   gameState.popBubble(0, false);
        // })
        // keep decrementing the countdown
        nextSpawnCountdown -= delta;
      } else {
        // spawn bubble and reset the countdown!
        const bubbleEntity = ECS.world.add({
          spawnPosition: level[0].spawnPosition,
          active: true
        });
        const bubbleId = ECS.world.id(bubbleEntity);
        if (bubbleId === 0 || bubbleId) worldBubbleIds.push(bubbleId);

        nextSpawnCountdown = SPAWN_INTERVAL;
      }
    } else {
      // otherwise if there are no more bubbles (level.length === 0) - game is over!
      if (!gameOver()) {
        console.log('GAME OVER');
        gameState.toggleEndGame();
      }
    }
  });

  return null;
}
