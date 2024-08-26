/* eslint-disable react-hooks/exhaustive-deps */
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import { useSphere } from '@react-three/cannon';
import { Clock, Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { VRM } from '@pixiv/three-vrm';
import { useEffect, useRef, useState } from 'react';
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
  const { sceneLoaded, getCurrentStreak, getSideSpawned } =
    useHookstateGetters();
  const gameState = useGameState();
  const poppedBubbles = useRef<Set<string>>(new Set());
  const clock = useRef(new Clock());
  const [sideSpawned, setSideSpawned] = useState(getSideSpawned());

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
      audio.play();
    },
    args: [0.075],
    collisionFilterGroup,
    collisionFilterMask,
  }));

  useEffect(() => {
    if (!gameState.levels[0].sideSpawned) return;
    setSideSpawned(getSideSpawned());
    // whenever the side spawned switches, start the current hand's clock
    clock.current.start();
  }, [gameState.levels[0].sideSpawned]);

  useFrame(() => {
    if (sceneLoaded() && avatar.current) {
      // stop the clock if this isn't the hand currently popping bubbles
      if (
        (handedness === 'right' && sideSpawned !== 'right') ||
        (handedness === 'left' && sideSpawned !== 'left')
      )
        clock.current.stop();

      const elapsedTime = clock.current.getElapsedTime();

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

      // VELOCITY -------------------------------------------------------------
      if (poppedBubbles.current.size > 0) {
        const distance = currentPosition.distanceTo(previousPosition);
        poppedBubbles.current.forEach(() => {
          const velocity = distance / elapsedTime;
          gameState.popBubble(velocity, true, handedness);
          console.log('Velocity measure: ', velocity);
        });
        poppedBubbles.current.clear();
        clock.current.start();
      }
      previousPosition.copy(currentPosition);
    }
  });

  return null;
}
