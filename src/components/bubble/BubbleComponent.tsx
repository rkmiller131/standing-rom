import { LegacyRef, forwardRef, useEffect, useState } from 'react';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useSphere } from '@react-three/cannon';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../../hookstate-store/GameState';
// import BubbleParticles from './particle-effect/BubbleParticles';

// Bubble is wrapped in ECS.Component, which implicitly "fowards" a ref to the Bubble component
// forwardRef allows this parent to pass a ref directly to this child, as denoted by the child declaring
// forwardRef; it's kind of like: "I got a ref prop from ECS.Component"
// This passed down ref's purpose is to attach to the visual mesh component (sphere) AND the physics collider ref and api extracted from useSphere.
// The ref parameter in the Bubble component's function signature is automatically handled by forwardRef, allowing ECS.Component to pass to it.
// The Bubble component who receives this ref then passes it to SphereCollider via the onAttachRefs callback, which allows the collider
// to attach the physics api to the ref, linking the visual mesh with the physics simulation.

// Note - if ever adapted to React 19, this forwarding ref pattern will be obsolete

interface BubbleProps {
  position: Vector3;
  playParticles: (position: [number, number, number]) => void;
}

const MAX_DISTANCE = 1.5;
const collisionFilterGroup = 1 << 2 // Bubbles assigned to group 4 (2^2)
const collisionFilterMask = (1 << 0) | (1 << 1) // Allow interaction with hands (group 1 and 2)

const Bubble = forwardRef((
  { position, playParticles }: BubbleProps,
  ref: LegacyRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>
) => {
  const [bubblePopped, setBubblePopped] = useState(false);
  const [bubbleZ, setBubbleZ] = useState(position.clone().z);
  const gameState = useGameState();

  const [colliderRef, api] = useSphere<Mesh>(() => ({
    position: [position.x, position.y, bubbleZ],
    onCollideBegin: () => {
      setBubblePopped(true);
      playParticles([position.x, position.y + 0.1, -0.7]);
    },
    args: [0.08] as [radius: number],
    type: 'Dynamic',
    collisionFilterGroup,
    collisionFilterMask
  }))

  useFrame((_state, delta) => {
    if (bubbleZ > MAX_DISTANCE) {
      gameState.popBubble(0, false);
    } else if (api) {
      setBubbleZ((bubbleZ) => bubbleZ + delta);
      api.position.set(
        position.x,
        position.y,
        bubbleZ
      )
    }
  })

  useEffect(() => {
    if (bubblePopped && api) {
      // can't destroy cannon collider, so just move it far away
      api.position.set(
        (Math.floor(Math.random() * 11) + 10),
        (Math.floor(Math.random() * 11) + 10),
        (Math.floor(Math.random() * 11) + 10)
      );
    }
  }, [bubblePopped, api])

  return (
    <>
      {bubblePopped ? null : (
        <mesh position={position} ref={colliderRef}>
          <Sphere args={[0.08, 16, 16]} ref={ref}>
            <MeshDistortMaterial
              attach="material"
              color="#89CFF0"
              distort={0.2}
              speed={3}
              roughness={0}
              clearcoat={1}
              clearcoatRoughness={0.5}
              metalness={0.4}
              envMapIntensity={0}
              transparent
              opacity={0.8}
              reflectivity={1}
              emissive="blue"
              emissiveIntensity={0.5}
            />
          </Sphere>
        </mesh>
      )}
    </>
  );
});

export default Bubble;