import { useSphere } from '@react-three/cannon';
import { Sphere } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Depth, Fresnel, LayerMaterial } from 'lamina';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DemoBubble({
  position,
}: {
  position: [number, number, number];
}) {
  const { scene } = useThree();
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const [active, setActive] = useState(false);

  const data = {
    direction: -1,
    speed: 600,
    verticesDown: 0,
    delay: 200,
    start: 100,
  };

  useEffect(() => {
    if (!particleSystemRef.current) {
      const vertices = [];

      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;

        vertices.push(x, y, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.01,
      });

      particleSystemRef.current = new THREE.Points(geometry, material);
      particleSystemRef.current.scale.set(0.02, 0.02, 0.02);
      particleSystemRef.current.position.set(...position);
      scene.add(particleSystemRef.current);
    }
  }, []);

  const [ref] = useSphere<THREE.Mesh>(() => ({
    position: [...position],
    onCollide: (event) => {
      console.log('Bubble collided ', event);
      if (particleSystemRef.current) {
        particleSystemRef.current.scale.set(0.3, 0.3, 0.3);
      }
    },
    onCollideBegin: (e) => {
      if (e) {
        setActive(true);
        console.log('Bubble began collision', e);
      }
    },
    type: 'Dynamic',
    args: [0.07],
  }));

  useFrame(({ clock }) => {
    const positions = particleSystemRef.current?.geometry.attributes.position;
    const count = positions?.count;
    const delta = clock.getDelta();

    if (particleSystemRef.current && positions && count) {
      for (let i = 0; i < count; i++) {
        const px = positions.getX(i);
        const py = positions.getY(i);
        const pz = positions.getZ(i);

        // Calculate world position
        const worldPosition = new THREE.Vector3(px, py, pz);
        particleSystemRef.current.localToWorld(worldPosition);

        if (worldPosition.y < -1) {
          // Remove particles from the scene once global y is -1.
          positions.needsUpdate = false;
          scene.remove(particleSystemRef.current);
          break;
        }
        // Animation logic
        if (data.direction === -1 && active) {
          if (py > 0) {
            positions.setXYZ(
              i,
              px + 1.25 * (0.75 - Math.random()) * data.speed * delta,
              py + 3.0 * (0.25 - Math.random()) * data.speed * delta,
              pz + 1.5 * (0.5 - Math.random()) * data.speed * delta,
            );
          } else {
            positions.setXYZ(i, px, py - data.speed * delta, pz);
          }
        }
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <>
      <group {...position}>
        {!active && (
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
        )}
      </group>
      {particleSystemRef.current && (
        <primitive object={particleSystemRef.current} />
      )}
    </>
  );
}
