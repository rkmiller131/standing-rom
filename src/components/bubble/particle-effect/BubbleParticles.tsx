/* eslint-disable react-hooks/exhaustive-deps */
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from './fragmentShader';
import { vertexShader } from './vertexShader';

const COUNT = 100;
const RADIUS = 0.3;

// const particlePositions = (() => {
//   const positions = new Float32Array(COUNT * 3);
//   for (let i = 0; i < COUNT; i++) {
//     const distance = Math.sqrt(Math.random()) * RADIUS;
//     const theta = THREE.MathUtils.randFloatSpread(360);
//     const phi = THREE.MathUtils.randFloatSpread(360);

//     const x = distance * Math.sin(theta) * Math.cos(phi);
//     const y = distance * Math.sin(theta) * Math.sin(phi);
//     const z = distance * Math.cos(theta);

//     positions.set([x, y, z], i * 3);
//   }
//   return positions;
// })();

interface Props {
  position: [number, number, number];
  toggleParticles: () => void;
}

export default function BubbleParticles({ position, toggleParticles }: Props) {
  const points = useRef<THREE.Points>(null);
  const { scene } = useThree();
  let elapsedTime = 0;
  console.log('HERE IN BUBBLE PARTICLES')

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const distance = Math.sqrt(Math.random()) * RADIUS;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      const x = distance * Math.sin(theta) * Math.cos(phi);
      const y = distance * Math.sin(theta) * Math.sin(phi);
      const z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [COUNT]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0.0 },
    uRadius: { value: RADIUS },
    uOpacity: { value: 1 }
  }), []);

  useFrame((_, delta) => {
    elapsedTime += delta;

    const material = points.current?.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      material.uniforms.uTime.value = elapsedTime;
    }

    if (elapsedTime >= 5) {
      if (points.current !== null) {
        material.dispose();
        points.current.geometry.dispose();
        scene.remove(points.current as THREE.Object3D);
        toggleParticles();
      }
    }
  });

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        transparent={true}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
}