import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { AdditiveBlending, Mesh, ShaderLib, ShaderMaterial, SphereGeometry, TextureLoader, Vector3 } from 'three';
import { makeBubbleFragShader, makeBubbleVertexShader } from './bubbleShaders';

interface BubbleMaterialProps {
  active: boolean;
  position: Vector3;
}
export default function BubbleMaterial({active, position}: BubbleMaterialProps) {
  const textureLoader = new TextureLoader();
  const bubbleTexture = textureLoader.load(
    'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/perlinNoise.jfif?v=1721870421632'
  );

  const bubbleRef = useRef<Mesh | null>(null);
  const { scene } = useThree();

  const geometry = new SphereGeometry(0.05, 16, 16);
  const material = new ShaderMaterial({
    uniforms: {
      uPattern: { value: bubbleTexture },
      uTime: { value: 0 },
      ...ShaderLib.standard.uniforms,
    },
    vertexShader: makeBubbleVertexShader(active),
    fragmentShader: makeBubbleFragShader(active),
  });

  useEffect(() => {
    let bubbleToRemove = null;
    material.blending = AdditiveBlending;
    material.uniforms.envMap.value = scene.environment;
    material.needsUpdate = true;

    if (!bubbleRef.current) {
      const bubble = new Mesh(geometry, material);
      bubbleRef.current = bubble;
      bubbleRef.current.position.copy(position);
      scene.add(bubble);
      bubbleToRemove = bubble;
    }

    return () => {
      if (bubbleToRemove) {
        scene.remove(bubbleToRemove);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useFrame(({ clock }) => {
    if (!bubbleRef.current) return;
    const material = bubbleRef.current.material as ShaderMaterial;

    // update the uniforms
    if (material.uniforms) {
      material.uniforms.uTime.value += clock.getDelta();
    }

    if (active) {
      const elapsedTime = clock.getElapsedTime();
      const yOffset = Math.sin(elapsedTime) * 0.0003;
      const xOffset = Math.cos(elapsedTime) * 0.0003;
      bubbleRef.current.position.y += yOffset;
      bubbleRef.current.position.x += xOffset;
    }
  });

  return null;

}