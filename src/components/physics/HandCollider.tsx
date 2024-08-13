import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import { useSphere } from '@react-three/cannon';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { VRM } from '@pixiv/three-vrm';
import { useRef } from 'react';
import { protractor } from '../../utils/avatar/Protractor';
import { bubblePopSounds } from '../../utils/cdn-links/sounds';

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

  useFrame(({ clock }) => {
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

      const wristL = new Vector3();
      const wristPl =
        avatar.current.humanoid.humanBones.leftHand?.node.matrixWorld;
      if (!wristPl) return;
      const wristFl = wristL.setFromMatrixPosition(wristPl);

      const shoulderL = new Vector3();
      const shoulderPl =
        avatar.current.humanoid.humanBones.leftShoulder?.node.matrixWorld;
      if (!shoulderPl) return;
      const shoulderFl = shoulderL.setFromMatrixPosition(shoulderPl);

      protractor(
        [wristFinal.x, wristFinal.y, wristFinal.z],
        [shoulderFinal.x, shoulderFinal.y, shoulderFinal.z],
        [wristFl.x, wristFl.y, wristFl.z],
        [shoulderFl.x, shoulderFl.y, shoulderFl.z],
      );
      // --------------------------------------------------------------------------

      // compute velocity

      if (poppedBubbles.current.size > 0) {
        poppedBubbles.current.forEach(() => {
          gameState.popBubble(0.2, true);
        });
        poppedBubbles.current.clear();
      }
    }
  });

  return null;
}