import { VRM } from '@pixiv/three-vrm';
import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useSceneState } from '../ecs/store/SceneState';
import { Vector3, Mesh } from 'three';
import { useGameState } from '../ecs/store/GameState';

interface RightHandColliderProps {
  avatar: React.RefObject<VRM>;
}

const previousPosition = new Vector3();
const position = new Vector3();
let avgMoveSpeed = 0;

export default function RightHandCollider({ avatar }: RightHandColliderProps) {
  const sphereRef = useRef<Mesh>(null);

  const sceneState = useSceneState();
  const gameState = useGameState();
  const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });

  const poppedBubbles = useRef<Set<string>>(new Set());

  const [colliderRef, api] = useSphere<Mesh>(() => ({
    position: [0, 0, 0],
    mass: 1,
    type: 'Kinematic',
    onCollideBegin: (e) => {
      if (!poppedBubbles.current.has(e.body.uuid)) {
        poppedBubbles.current.add(e.body.uuid);
      }
    },
    args: [0.075],
  }));

  // Track the previous position of the rightHandWorld for velocity of bubble contact
  useFrame(({ clock }) => {
    if (!sceneLoaded || !avatar.current) return;

    const rightHandWorld = avatar.current.humanoid.humanBones.rightMiddleIntermediate?.node.matrixWorld;
    if (!rightHandWorld) return;

    position.setFromMatrixPosition(rightHandWorld);

    if (colliderRef.current && sphereRef.current && position) {
      api.position.set(position.x, position.y, position.z);
      sphereRef.current.position.copy(position);
    }

    const displacement = position.clone().sub(previousPosition);

    const timeDifference = clock.getDelta();

    // Calculate velocity only if time difference is greater than zero
    if (timeDifference > 0.0001) {
      const velocity = displacement.clone().divideScalar(timeDifference);
      // Normalize velocity after division for unit vector
      velocity.normalize();
      previousPosition.copy(position);

      if (poppedBubbles.current.size > 0) {
        poppedBubbles.current.forEach(() => {
          avgMoveSpeed = (Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z)) / 3;
          console.log('~~Moving at ', `${avgMoveSpeed} m/s`);
          gameState.popBubble(avgMoveSpeed);
        });
        poppedBubbles.current.clear();
      }
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[0.07]} />
      <meshBasicMaterial
        attach="material"
        transparent
        opacity={0}
        color="white"
      />
    </mesh>
  );
}
