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

const previousPosition = new Vector3();
const currentPosition = new Vector3();

let velocity = new Vector3();
let fpsStartTime = performance.now();
let fps = 0;
let frame = 0;
let avgV = 0;
// let lastTime = (performance.now() / 1000).toFixed(0) as unknown as number;
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
      const wristP = new Vector3();
      const wristPos =
        avatar.current.humanoid.humanBones.rightHand?.node.matrixWorld;
      if (!wristPos) return;
      const wristFinal = wristP.setFromMatrixPosition(wristPos);
      // --------------------------------------------------------------------------

      // compute velocity

      const time = (performance.now() / 1000).toFixed(0) as unknown as number;

      frame++;

      // On execution FPS
      if (time - fpsStartTime >= 1000) {
        fps = frame / ((time - fpsStartTime) / 1000); // Calculate FPS
        fpsStartTime = time; // Reset start time
        frame = 0; // Reset frame count

        console.log(`Current FPS: ${fps.toFixed(2)}`);
      }

      //naive delta
      // dt = time - lastTime;

      // actual delta
      const actualDt = 1 / fps;
      dt = actualDt;

      if (dt < 0.0167) {
        dt = 0.0167;
      } else if (dt > 0.1) {
        dt = 0.1;
      }

      // lastTime = time;

      velocity = wristFinal.clone().sub(previousPosition).divideScalar(dt);

      avgV =
        (Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z)) /
        3;

      previousPosition.copy(wristFinal);

      if (avgV > 0.01) {
        console.log('Velocity:', avgV);
      }

      if (poppedBubbles.current.size > 0) {
        poppedBubbles.current.forEach(() => {
          if (avgV !== 0 || avgV > 0.01) {
            const format = avgV.toFixed(1) as unknown as number;
            gameState.popBubble(format, true);
          }
        });
        poppedBubbles.current.clear();
      }
    }
  });

  return null;
}
