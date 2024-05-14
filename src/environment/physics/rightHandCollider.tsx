import { VRM } from "@pixiv/three-vrm";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { useSceneState } from "../../ecs/store/SceneState";
import * as THREE from "three";
import { useGameState } from "../../ecs/store/GameState";

interface RightHandColliderProps {
  avatar: React.RefObject<VRM>;
}

export default function RightHandCollider({ avatar }: RightHandColliderProps) {
  const sphereRef = useRef<Mesh>(null);

  const sceneState = useSceneState();
  const gameState = useGameState();

  const [bubblePopped, setBubblePopped] = useState(false);
  const [successCalled, setSuccessCalled] = useState(false);

  const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });

  const [colliderRef, api] = useSphere<THREE.Mesh>(() => ({
    position: [0, 0, 0],
    mass: 1,
    type: "Kinematic",
    onCollideBegin: () => {
      setBubblePopped(true);
    },
    args: [0.075],
  }));

  // Track the previous position of the rightHandWorld
  let previousPosition = new THREE.Vector3();
  let avgMoveSpeed = 0;

  useFrame(({ clock }) => {
    if (!sceneLoaded || !avatar.current) return;

    const rightHandWorld =
      avatar.current.humanoid.humanBones.rightMiddleIntermediate?.node
        .matrixWorld;
    if (!rightHandWorld) return;

    const position = new THREE.Vector3();
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

      // Call in Success
      if (bubblePopped && !successCalled) {
        avgMoveSpeed =
          (Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z)) /
          3;
        console.log("~~Moving at ", `${avgMoveSpeed} m/s`);
        success();
      }
    }
  });

  function success() {
    if (bubblePopped) {
      gameState.popBubble(avgMoveSpeed);
      console.log("~~Game Score:", gameState.score);
      setSuccessCalled(true);
    }
    return;
  }

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
