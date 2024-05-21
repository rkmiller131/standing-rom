import { useSphere } from '@react-three/cannon';
import { Sphere } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Depth, Fresnel, LayerMaterial } from 'lamina';
import { useEffect, useRef, useState } from 'react';
import { BufferGeometry, Float32BufferAttribute, Mesh, Points, PointsMaterial, Vector3 } from 'three';

const geometry = new BufferGeometry();
const material = new PointsMaterial({ color: 0xffffff, size: 0.01 });

// generate random x, y, z coordinates for particles, between -1 and 1
const vertices = [];
for (let i = 0; i < 25; i++) {
  const x = Math.random() * 2 - 1;
  const y = Math.random() * 2 - 1;
  const z = Math.random() * 2 - 1;
  vertices.push(x, y, z);
}
// each group of 3 numbers in vertices array should be treated as a single vertex
geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

const particleData = {
  direction: -1,
  speed: 700
};

export default function Bubble({ position }: { position: [number, number, number] }) {
  const { scene } = useThree();
  const particleSystemRef = useRef<Points | null>(null);
  const [hasCollided, setHasCollided] = useState(false);

  useEffect(() => {
    if (!particleSystemRef.current) {
      const points = new Points(geometry, material);
      points.scale.set(0.02, 0.02, 0.02);
      points.position.set(...position);
      scene.add(points);
      particleSystemRef.current = points;
    }
  }, [position, scene]);

  const [ref, api] = useSphere<Mesh>(() => ({
    position: [...position],
    onCollide: () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.scale.set(0.3, 0.3, 0.3);
        // can't destroy collider, so just move it far away
        api.position.set(5,5,5);
      }
    },
    onCollideBegin: (e) => {
      if (e) {
        setHasCollided(true);
      }
    },
    onCollideEnd: () => {
      api.sleep;
    },
    type: 'Dynamic',
    args: [0.07],
  }));

  useFrame(({ clock }) => {
    if (!hasCollided || !particleSystemRef.current || !particleSystemRef.current.geometry) return;

    const positions = particleSystemRef.current.geometry.attributes.position;
    const count = positions.count;
    const delta = clock.getDelta();

    for (let i = 0; i < count; i++) {
      const px = positions.getX(i);
      const py = positions.getY(i);
      const pz = positions.getZ(i);

      // Calculate world position
      const worldPosition = new Vector3(px, py, pz);
      particleSystemRef.current.localToWorld(worldPosition);

      // Animation logic
      if (worldPosition.y < -1) {
        // Remove particles from the scene once global y is -1.
        positions.needsUpdate = false;
        scene.remove(particleSystemRef.current);
        break;
      }
      if (py > 0) {
        positions.setXYZ(
          i,
          px + 1.25 * (0.75 - Math.random()) * particleData.speed * delta,
          py + 3.0 * (0.25 - Math.random()) * particleData.speed * delta,
          pz + 1.5 * (0.5 - Math.random()) * particleData.speed * delta,
        );
      } else {
        positions.setXYZ(i, px, py - particleData.speed * delta, pz);
      }
    }
    positions.needsUpdate = true;
  });

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
      ) : null}

      {particleSystemRef.current && (
        <primitive object={particleSystemRef.current} />
      )}
    </>
  );
}
