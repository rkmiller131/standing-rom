import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from './fragmentShader';
import { vertexShader } from './vertexShader';

export default function CustomGeometryParticles({
  count,
  radius,
  position,
}: {
  count: number;
  radius: number;
  position: [number, number, number];
}) {
  // This reference gives us direct access to our points
  const points = useRef<THREE.Points>(null);
  // const { scene } = useThree();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
      uOpacity: {
        value: 1, // Set initial opacity, to zero. We can't go to zero
      },
    }),
    [],
  );

  // useFrame(({ clock }) => {
  //   const material = points.current?.material as THREE.ShaderMaterial;
  //   const time = clock.getElapsedTime();
  //   if (material.uniforms) {
  //     material.uniforms.uTime.value = time;
  //   }
  //   if (time >= 5) {
  //     if (points.current !== null) {
  //       points.current.geometry.dispose();
  //       scene.remove(points.current as THREE.Object3D);
  //     }
  //   }
  // });

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
