import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import { useSphere } from '@react-three/cannon';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { VRM } from '@pixiv/three-vrm';
import { useRef } from 'react';
import { bubblePopSounds } from '../../utils/cdn-links/sounds';

interface HandColliderProps {
  avatar: React.RefObject<VRM>;
  handedness: 'right' | 'left';
}

const previousPositionR = new Vector3();
const previousPositionL = new Vector3();
const currentPosition = new Vector3();

let velocityR = new Vector3();
let velocityL = new Vector3();
let fpsStartTime = performance.now();
let fps = 0;
let frame = 0;
let avgVr = 0;
let avgVl = 0;
let dt = 0;

export default function HandCollider({
  avatar,
  handedness,
}: HandColliderProps) {
  const { sceneLoaded, getCurrentStreak } = useHookstateGetters();
  const gameState = useGameState();
  const poppedBubbles = useRef<Set<string>>(new Set());

  // Collision filter group - both hands are part of the same group
  const collisionFilterGroup = 1 << 0;

  // Determine the current hand's group and the mask to exclude the other hand
  const collisionFilterMask = ~(1 << (handedness === 'right' ? 0 : 1));

  const [, api] = useSphere<Mesh>(() => ({
    position: handedness === 'right' ? [1, 0, 0] : [-1, 0, 0],
    mass: 1,
    type: 'Kinematic',
    onCollideBegin: (e) => {
      poppedBubbles.current.add(e.body.uuid);
      const key = getCurrentStreak() >= 5 ? 4 : getCurrentStreak();
      // Create a new sound on each new collision so that if bubbles are popped rapidly, the sounds can overlap
      const audio = new Audio(bubblePopSounds[key]);
      audio.volume = 0.75;
      audio.play();
    },
    args: [0.075],
    collisionFilterGroup,
    collisionFilterMask,
  }));

  useFrame(() => {
    if (sceneLoaded() && avatar.current) {
      const handNodeWorld =
        handedness === 'right'
          ? avatar.current.humanoid.humanBones.rightMiddleProximal?.node
              .matrixWorld
          : avatar.current.humanoid.humanBones.leftMiddleProximal?.node
              .matrixWorld;

      if (!handNodeWorld) return;

      currentPosition.setFromMatrixPosition(handNodeWorld);

      if (currentPosition) {
        api.position.set(
          currentPosition.x,
          currentPosition.y,
          currentPosition.z,
        );
      }

      // --------------------------------------------------------------------------
      const wristR = new Vector3();
      const wristPos =
        avatar.current.humanoid.humanBones.rightHand?.node.matrixWorld;
      if (!wristPos) return;
      const wristFinalR = wristR.setFromMatrixPosition(wristPos);

      const wristL = new Vector3();
      const wristPosL =
        avatar.current.humanoid.humanBones.leftHand?.node.matrixWorld;
      if (!wristPosL) return;
      const wristFinalL = wristL.setFromMatrixPosition(wristPosL);
      // --------------------------------------------------------------------------

      // compute velocity

      const time = (performance.now() / 1000).toFixed(0) as unknown as number;

      frame++;

      // On execution FPS
      if (time - fpsStartTime >= 1000) {
        fps = frame / ((time - fpsStartTime) / 1000);
        fpsStartTime = time;
        frame = 0;
      }

      const actualDt = 1 / fps;
      dt = actualDt;

      if (dt < 0.0167) {
        dt = 0.0167;
      } else if (dt > 0.1) {
        dt = 0.1;
      }

      if (!(frame <= 60)) {
        velocityR = wristFinalR.clone().sub(previousPositionR).divideScalar(dt);
        velocityL = wristFinalL.clone().sub(previousPositionL).divideScalar(dt);

        avgVr =
          (Math.abs(velocityR.x) +
            Math.abs(velocityR.y) +
            Math.abs(velocityR.z)) /
          3;

        avgVl =
          (Math.abs(velocityL.x) +
            Math.abs(velocityL.y) +
            Math.abs(velocityL.z)) /
          3;

        previousPositionR.copy(wristFinalR);
        previousPositionL.copy(wristFinalL);

        if (avgVr >= 1 || avgVl >= 1) {
          avgVr = 1;
          avgVl = 1;
        }

        if (avgVr < 0.005 || avgVl < 0.005) {
          avgVr = 0;
          avgVl = 0;
        }

        console.log('Velocity Right & Left:', avgVr, avgVl);

        if (poppedBubbles.current.size > 0) {
          poppedBubbles.current.forEach(() => {
            const format = avgVl.toFixed(2) as unknown as number;
            const format2 = avgVr.toFixed(2) as unknown as number;

            console.log('Final Velocities:', format, format2);
            // Should be treated seperately
            gameState.popBubble(avgVr, avgVl, true);
          });
          poppedBubbles.current.clear();
        }
      }
    }
  });

  return null;
}
