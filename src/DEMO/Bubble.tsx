import { useSphere } from '@react-three/cannon';
import { Sphere } from '@react-three/drei';
import { Depth, Fresnel, LayerMaterial } from 'lamina';
import { useRef, useState } from 'react';
import { Mesh, Points } from 'three';
import CustomGeometryParticles from './Particles';

export default function Bubble({ position }: { position: [number, number, number] }) {
  const particleSystemRef = useRef<Points | null>(null);
  const [hasCollided, setHasCollided] = useState(false);

  const [ref, api] = useSphere<Mesh>(() => ({
    position: [...position],
    onCollide: () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.scale.set(0.3, 0.3, 0.3);
      }
    },
    onCollideBegin: (e) => {
      if (e) {
        setHasCollided(true);
        // can't destroy collider, so just move it far away
        api.position.set(10, 10, 10);
      }
    },
    onCollideEnd: () => {
      api.sleep;
    },
    type: 'Dynamic',
    args: [0.07],
  }));

  return (
    <>
      {!hasCollided ? (
        <group {...position}>
          <Sphere castShadow ref={ref} args={[0.07, 8, 8]}>
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
      ) : (
        <CustomGeometryParticles
          position={[0.5, 1.2, 0.3]}
          radius={1}
          count={2000}
          isActive={hasCollided}
        />
      )}
    </>
  );
}
