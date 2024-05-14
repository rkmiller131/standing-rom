import { VRM } from "@pixiv/three-vrm";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
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
  const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });
  let finalVelocity = new THREE.Vector3(0, 0, 0);
  const [colliderRef, api] = useSphere<THREE.Mesh>(() => ({
    position: [0, 0, 0],
    mass: 1,
    type: "Kinematic",
    onCollide: () => {
      gameState.popBubble(finalVelocity);
      console.log(gameState.score);
    },
    args: [0.075],
  }));

  const prevPosition = new THREE.Vector3();

  useFrame(() => {
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

      // Calculate velocity based on the change in position
      const velocity = new THREE.Vector3().subVectors(position, prevPosition);
      api.velocity.set(velocity.x, velocity.y, velocity.z);

      // Subscribe to velocity changes
      api.velocity.subscribe((v) => {
        finalVelocity.set(v[0], v[1], v[2]);
      });

      // Log game state score
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[0.07]} />
      <meshBasicMaterial
        attach="material"
        opacity={0.5}
        color="blue"
        wireframe
      />
    </mesh>
  );
}
