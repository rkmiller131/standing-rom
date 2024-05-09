import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { grassVertexShader } from "../shaders/grassVertexShader";
import { grassFragmentShader } from "../shaders/grassFragmentShader";

const BLADE_WIDTH = 0.1;
const BLADE_HEIGHT = 0.25;
const BLADE_HEIGHT_VARIATION = 0.1;
const BLADE_VERTEX_COUNT = 5;
const BLADE_TIP_OFFSET = 0.1;

const cloudMap =
  "https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/cloudinverted.jpg?v=1715283924460";

function interpolate(
  val: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

// Initialize it to null
let cloudTexture: THREE.Texture | null = null;

if (typeof document !== "undefined") {
  cloudTexture = new THREE.TextureLoader().load(cloudMap);
  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
}

export class GrassGeometry extends THREE.BufferGeometry {
  constructor(size: number, count: number) {
    super();

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < count; i++) {
      const surfaceMin = (size / 2) * -1;
      const surfaceMax = size / 2;
      const radius = (size / 2) * Math.random();
      const theta = Math.random() * 2 * Math.PI;

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      uvs.push(
        ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
          interpolate(x, surfaceMin, surfaceMax, 0, 1),
          interpolate(y, surfaceMin, surfaceMax, 0, 1),
        ])
      );

      const blade = this.computeBlade([x, 0, y], i);
      positions.push(...blade.positions);
      indices.push(...blade.indices);
    }

    this.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    this.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
    this.setIndex(indices);
    this.computeVertexNormals();
  }

  computeBlade(
    center: [number, number, number],
    index: number = 0
  ): { positions: number[]; indices: number[] } {
    const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION;
    const vIndex = index * BLADE_VERTEX_COUNT;

    const yaw = Math.random() * Math.PI * 2;
    const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)];
    const bend = Math.random() * Math.PI * 2;
    const bendVec = [Math.sin(bend), 0, -Math.cos(bend)];

    const bl = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * 1 + center[i]);
    const br = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * -1 + center[i]);
    const tl = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * 1 + center[i]);
    const tr = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * -1 + center[i]);
    const tc = bendVec.map((n, i) => n * BLADE_TIP_OFFSET + center[i]);

    tl[1] += height / 2;
    tr[1] += height / 2;
    tc[1] += height;

    return {
      positions: [...bl, ...br, ...tr, ...tl, ...tc],
      indices: [
        vIndex,
        vIndex + 1,
        vIndex + 2,
        vIndex + 2,
        vIndex + 4,
        vIndex + 3,
        vIndex + 3,
        vIndex,
        vIndex + 2,
      ],
    };
  }
}

class Grass extends THREE.Mesh {
  constructor(size: number, count: number) {
    const geometry = new GrassGeometry(size, count);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCloud: { value: cloudTexture },
        uTime: { value: 0 },
      },
      side: THREE.DoubleSide,
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
    });
    super(geometry, material);
  }
}

const GrassComponent: React.FC<{
  size: number;
  count: number;
}> = ({ size, count }) => {
  const { scene } = useThree();
  const grassRef = useRef<Grass>();

  useEffect(() => {
    const grass = new Grass(size, count);
    grassRef.current = grass;
    scene.add(grass);

    return () => {
      if (grassRef.current) {
        scene.remove(grassRef.current);
      }
    };
  }, [scene, size, count]);

  useFrame(({ clock }) => {
    const material = grassRef.current?.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value += clock.getDelta() + 10;
    // material.uniforms.uTime.value = 300; static grass
  });

  return null;
};

export default GrassComponent;