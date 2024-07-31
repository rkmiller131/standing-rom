/* eslint-disable react-hooks/exhaustive-deps */
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from './fragmentShader';
import { vertexShader } from './vertexShader';

export default function BubbleParticles({
  position,
  count,
  radius,
}: {
  position: [number, number, number];
  count: number;
  radius: number;
}) {
  const points = useRef<THREE.Points>(null);
  const { scene } = useThree();

  // Define a local variable for elapsed time
  let elapsedTime = 0;

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      const x = distance * Math.sin(theta) * Math.cos(phi);
      const y = distance * Math.sin(theta) * Math.sin(phi);
      const z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  const uniforms = useMemo(() => ({
      uTime: { value: 0.0 },
      uRadius: { value: radius },
      uOpacity: { value: 1 }}), []);

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
      }
    }
  });

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
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