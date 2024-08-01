import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import { useSphere } from '@react-three/cannon';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { VRM } from '@pixiv/three-vrm';
import { useRef } from 'react';
import { protractor } from '../../utils/avatar/Protractor';

interface HandColliderProps {
  avatar: React.RefObject<VRM>;
  handedness: 'right' | 'left';
}

const previousPosition = new Vector3();
const currentPosition = new Vector3();

export default function HandCollider({
  avatar,
  handedness,
}: HandColliderProps) {
  const { sceneLoaded } = useHookstateGetters();
  const gameState = useGameState();
  const poppedBubbles = useRef<Set<string>>(new Set());

  // Audio
  const audio = new Audio('/bubblePop.mp3');
  audio.volume = 0.75;

  // Collision filter group - both hands are part of the same group
  const collisionFilterGroup = 1 << 0;

  // Determine the current hand's group and the mask to exclude the other hand
  const collisionFilterMask = ~(1 << (handedness === 'right' ? 0 : 1));

  const [, api] = useSphere<Mesh>(() => ({
    position: handedness === 'right' ? [1, 0, 0] : [-1, 0, 0],
    mass: 1,
    type: 'Kinematic',
    onCollideBegin: (e) => {
      audio.play();
      poppedBubbles.current.add(e.body.uuid);
    },
    onCollideEnd: () => {
      audio.currentTime = 0;
    },
    args: [0.075],
    collisionFilterGroup,
    collisionFilterMask,
  }));

  useFrame((_state, delta) => {
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

      const shoulderP = new Vector3();
      const shoulderPos =
        avatar.current.humanoid.humanBones.rightShoulder?.node.matrixWorld;
      if (!shoulderPos) return;
      const shoulderFinal = shoulderP.setFromMatrixPosition(shoulderPos);

      protractor(
        [wristFinal.x, wristFinal.y, wristFinal.z],
        [shoulderFinal.x, shoulderFinal.y, shoulderFinal.z],
      );
      // --------------------------------------------------------------------------

      // Calculate velocity only if time difference is greater than zero (so no divide by 0 or super small values)
      if (poppedBubbles.current.size > 0 && delta > 0.001) {
        const distance = currentPosition.clone().sub(previousPosition);

        const velocityVector = distance.clone().divideScalar(delta);
        velocityVector.normalize();
        previousPosition.copy(currentPosition);

        if (poppedBubbles.current.size > 0) {
          poppedBubbles.current.forEach(() => {
            const velocity =
              (Math.abs(velocityVector.x) +
                Math.abs(velocityVector.y) +
                Math.abs(velocityVector.z)) /
              3;
            gameState.popBubble(velocity, true);
          });
          poppedBubbles.current.clear();
        }
      }
    }
  });

  return null;
}
