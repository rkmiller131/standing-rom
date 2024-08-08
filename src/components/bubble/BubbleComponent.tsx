import { LegacyRef, forwardRef, useEffect, useState } from 'react';
import { ShaderMaterial, Color } from 'three';
import { Sphere } from '@react-three/drei';
import BubbleCollider from '../physics/BubbleCollider';
import { PublicApi } from '@react-three/cannon';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';
import BubbleParticles from './particle-effect/BubbleParticles';
import { BubbleShader } from './shaders/BubbleShader'; // Ensure the correct import path

interface BubbleProps {
  position: Vector3;
  active: boolean;
}

const BubbleComponent = forwardRef((
  { position, active }: BubbleProps,
  ref: LegacyRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>
) => {
  const [physicsApi, setPhysicsApi] = useState<PublicApi | null>(null);
  const [isBubblePopped, setIsBubblePopped] = useState(false);

  const attachRefs = (colliderApi: PublicApi) => {
    if (colliderApi) {
      setPhysicsApi(colliderApi);
    }
  }

  useEffect(() => {
    if (isBubblePopped && physicsApi) {
      physicsApi.position.set(
        (Math.floor(Math.random() * 11) + 10),
        (Math.floor(Math.random() * 11) + 10),
        (Math.floor(Math.random() * 11) + 10)
      );
    }
  }, [isBubblePopped, physicsApi]);

  const onCollideBegin = () => {
    setIsBubblePopped(true);
  };

  const bubbleMaterial = new ShaderMaterial({
    vertexShader: BubbleShader.vertexShader,
    fragmentShader: BubbleShader.fragmentShader,
    uniforms: {
      ...BubbleShader.uniforms,
      color: { value: new Color(0x88cfff) }, // Adjust color to be brighter
      opacity: { value: 0.5 }, // Increase opacity
    },
    transparent: true,
  });

  return (
    <>
      {isBubblePopped ? (
        <BubbleParticles
          position={[position.x, position.y + 0.1, position.z]}
          radius={0.1}
          count={100}
        />
      ) : (
        <mesh position={position}>
          <Sphere ref={ref} args={[0.05, 112, 112]}>
            {!active ? (
              <meshStandardMaterial color='blue' />
            ) : (
              <primitive attach="material" object={bubbleMaterial} />
            )}
          </Sphere>
        </mesh>
      )}
      {active && <BubbleCollider
        onAttachRefs={attachRefs}
        position={position}
        onCollideBegin={onCollideBegin}
      />}
    </>
  );
});

export default BubbleComponent;
