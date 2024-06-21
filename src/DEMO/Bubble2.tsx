import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Sphere } from '@react-three/drei';
import { Depth, Fresnel, LayerMaterial } from 'lamina';
import SphereCollider from '../ecs/components/SphereCollider';
import { PublicApi } from '@react-three/cannon';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';
import BubbleParticles from './Particles';

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

// FUTURE TODOS FOR POLISH
// add sound when bubble pops

const Bubble = forwardRef(({ position, active }: BubbleProps, ref) => {
  const colliderRef =  useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null>(null);
  const [physicsApi, setPhysicsApi] = useState<PublicApi | null>(null);
  const [bubblePopped, setBubblePopped] = useState(false);

  useImperativeHandle(ref, () => (colliderRef), [colliderRef]);

  const attachRefs = (physicsRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null>, colliderApi: PublicApi) => {
    if (physicsRef && physicsRef.current) {
      colliderRef.current! = physicsRef.current;
    }
    if (colliderApi) {
      setPhysicsApi(colliderApi);
    }
  }

  console.log('~~Bubble has rerendered')

  useEffect(() => {
    if (bubblePopped && physicsApi) {
      // can't destroy cannon collider, so just move it far away
      physicsApi.position.set(10, 10, 10)
    }
  }, [bubblePopped, physicsApi])

  const onCollideBegin = () => {
    setBubblePopped(true);
  };

  return (
    <>
      {bubblePopped ? (
        <BubbleParticles
          position={[position.x, position.y + 0.1, position.z]}
          radius={0.1}
          count={100}
        />
      ) : (
        <mesh position={position}>
          <Sphere castShadow ref={colliderRef} args={[0.05, 8, 8]}>
            <LayerMaterial
              color={'#ffffff'}
              lighting={'physical'}
              transmission={1}
              roughness={0.1}
              thickness={2}
            >
              <Depth
                near={0.4854}
                far={0.7661999999999932}
                origin={[-0.4920000000000004, 0.4250000000000003, 0]}
                // green active, regular bubble color not active
                colorA={active ? '#9effb1' : '#fec5da'}
                colorB={active ? '#04781a' : '#00b8fe'}
              />
              <Fresnel
                color={'#fefefe'}
                bias={-0.3430000000000002}
                intensity={1}
                power={3.3699999999999903}
                factor={1.119999999999999}
                mode={'screen'}
              />
            </LayerMaterial>
          </Sphere>
        </mesh>
      )}
      {/* {active && <SphereCollider
        onAttachRefs={attachRefs}
        position={position}
        onCollideBegin={onCollideBegin}
      />} */}
      {!bubblePopped &&
        <SphereCollider
          onAttachRefs={attachRefs}
          position={position}
          onCollideBegin={onCollideBegin}
        />
      }
    </>
  );
});

export default Bubble;
