import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Sphere } from '@react-three/drei';
import { Depth, Fresnel, LayerMaterial } from 'lamina';
import SphereCollider from '../ecs/components/SphereCollider';
import { PublicApi } from '@react-three/cannon';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';

// Bubble is wrapped in ECS.Component, which implicitly "fowards" a ref to the Bubble component
// forwardRef allows this parent to pass a ref directly to this child, as denoted by the child declaring
// forwardRef; it's kind of like: "I got a ref prop from ECS.Component"
// This passed down ref's purpose is to attach to the visual mesh component (sphere) AND the physics collider ref and api extracted from useSphere.
// The ref parameter in the Bubble component's function signature is automatically handled by forwardRef, allowing ECS.Component to pass to it.
// The Bubble component who receives this ref then passes it to SphereCollider via the onAttachRefs callback, which allows the collider
// to attach the physics api to the ref, linking the visual mesh with the physics simulation.

// Note - if ever adapted to React 19, this forwarding ref pattern will be obsolete

interface BubbleProps {
  position: [number, number, number]
}

const Bubble = forwardRef(({ position }: BubbleProps, ref) => {
  const colliderRef =  useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null>(null);
  const [physicsApi, setPhysicsApi] = useState<PublicApi | null>(null);

  // if bubble is active, set a custom ref. otherwise just return the original ref
  // useImperativeHandle(ref, () => ({
  //   sphereCollider: colliderRef.current,
  //   physicsApi
  // }), [physicsApi, colliderRef])
  useImperativeHandle(ref, () => (colliderRef), [colliderRef]);

  const attachRefs = (physicsRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null>, colliderApi: PublicApi) => {
    if (physicsRef && physicsRef.current) {
      colliderRef.current! = physicsRef.current;
    }
    if (colliderApi) {
      setPhysicsApi(colliderApi);
    }
  }

  const onCollideBegin = useCallback(() => {
    setPhysicsApi((physicsApiValue) => {
      // need to extract from the setState, otherwise value is stale
      if (physicsApiValue) {
        physicsApiValue.position.set(10, 10, 10);
      }
      return physicsApiValue;
    })
  }, []);
  console.log('the colliderRef reference is ', colliderRef)

  return (
    <>
      <group {...position}>
        <Sphere castShadow ref={colliderRef} args={[0.07, 8, 8]}>
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
              colorA={'#fec5da'}
              colorB={'#00b8fe'}
            />
            <Fresnel
              color={'#fefefe'}
              bias={-0.3430000000000002}
              intensity={3.8999999999999946}
              power={3.3699999999999903}
              factor={1.119999999999999}
              mode={'screen'}
            />
          </LayerMaterial>
        </Sphere>
      </group>
      <SphereCollider
        onAttachRefs={attachRefs}
        position={position}
        onCollideBegin={onCollideBegin}
      />
    </>
  );
});

export default Bubble;
