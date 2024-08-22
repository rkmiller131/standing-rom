import { LegacyRef, forwardRef, useEffect, useState } from 'react';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import BubbleCollider from '../physics/BubbleCollider';
import { PublicApi } from '@react-three/cannon';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';
import BubbleParticles from './particle-effect/BubbleParticles';
import BubbleMaterial from './materials/BubbleMaterial';

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
  active: boolean;
}

const Bubble = forwardRef((
  { position, active }: BubbleProps,
  ref: LegacyRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>
) => {
  const [physicsApi, setPhysicsApi] = useState<PublicApi | null>(null);
  const [bubblePopped, setBubblePopped] = useState(false);
  const [localPosition, setLocalPosition] = useState(position.clone());

  const attachRefs = (colliderApi: PublicApi) => {
    if (colliderApi) {
      setPhysicsApi(colliderApi);
    }
  }

  useEffect(() => {
    setLocalPosition(position.clone());
  }, [position]);

  useEffect(() => {
    if (bubblePopped && physicsApi) {
      // can't destroy cannon collider, so just move it far away
      physicsApi.position.set(
        (Math.floor(Math.random() * 11) + 10),
        (Math.floor(Math.random() * 11) + 10),
        (Math.floor(Math.random() * 11) + 10)
      )
    }
  }, [bubblePopped, physicsApi])

  const onCollideBegin = () => {
    setBubblePopped(true);
  };

  return (
    <>
      {bubblePopped ? (
        <BubbleParticles
          position={[localPosition.x, localPosition.y + 0.1, localPosition.z]}
          radius={0.1}
          count={100}
        />
      ) : (
        <mesh position={position}>
          <Sphere ref={ref} args={[0.05, 8, 8]}>
            {!active ?
              // <meshStandardMaterial color='blue' /> :
              // Temporarily adding a bubble material that can accept either active/inactive property depending on if we
              // want to use it for both (going the pure shader route). Can refactor later to remove unused code in BubbleMaterial.tsx
              <BubbleMaterial active={active} position={localPosition}/> :
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
            }
          </Sphere>
        </mesh>
      )}
      {active && <BubbleCollider
        onAttachRefs={attachRefs}
        position={localPosition}
        onCollideBegin={onCollideBegin}
      />}
    </>
  );
});

export default Bubble;