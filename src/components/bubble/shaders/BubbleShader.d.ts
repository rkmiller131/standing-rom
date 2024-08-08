import * as THREE from 'three';

declare module './BubbleShader' {
  export const BubbleShader: {
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
      color: { value: THREE.Color };
      opacity: { value: number };
    };
  };
}
