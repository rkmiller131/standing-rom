import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gltfLoader as loader, textureLoader } from '../../../../interfaces/THREE_Interface';
import { grassVertexShader } from '../shaders/grassVertexShader';
import { grassFragmentShader } from '../shaders/grassFragmentShader';
import { cloudMap } from '../../../../utils/cdn-links/environmentAssets';
import { groundPlane } from '../../../../utils/cdn-links/models';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  Raycaster,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
  Vector3
} from 'three';
import { useSceneState } from '../../../../hookstate-store/SceneState';

const BLADE_WIDTH = 0.1;
const BLADE_HEIGHT = 0.3;
const BLADE_HEIGHT_VARIATION = 0.3;
const BLADE_VERTEX_COUNT = 5;
const BLADE_TIP_OFFSET = 0.1;

function interpolate(
  val: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
): number {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

let cloudTexture: Texture | null = null;

if (typeof document !== 'undefined') {
  cloudTexture = textureLoader.load(cloudMap);
  cloudTexture.wrapS = cloudTexture.wrapT = RepeatWrapping;
}

export class GrassGeometry extends BufferGeometry {
  constructor(size: number, count: number, groundPlaneMesh: Mesh) {
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
        ]),
      );

      // Raycast to find the height of the ground plane at the current position
      const raycaster = new Raycaster(
        new Vector3(x, 10, y),
        new Vector3(0, -10, 0),
      );

      const intersects = raycaster.intersectObject(groundPlaneMesh);

      let groundHeight = 0;
      if (intersects.length > 0) {
        groundHeight = intersects[0].point.y;
      }

      const blade = this.computeBlade([x, groundHeight, y], i);
      positions.push(...blade.positions);
      indices.push(...blade.indices);
    }

    this.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(positions), 3),
    );

    this.setAttribute(
      'uv',
      new BufferAttribute(new Float32Array(uvs), 2),
    );
    this.setIndex(indices);
    this.computeVertexNormals();
  }

  computeBlade(
    center: [number, number, number],
    index: number = 0,
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

class Grass extends Mesh {
  constructor(size: number, count: number, groundPlaneMesh: Mesh) {
    const geometry = new GrassGeometry(size, count, groundPlaneMesh);
    const material = new ShaderMaterial({
      uniforms: {
        uCloud: { value: cloudTexture },
        uTime: { value: 0 },
      },
      side: DoubleSide,
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
    });
    super(geometry, material);
  }
}

const GrassComponent: React.FC<{ size: number; count: number }> = ({
  size,
  count,
}) => {
  const { scene } = useThree();
  const grassRef = useRef<Grass>();
  const [groundPlaneMesh, setGroundPlaneMesh] = useState<Mesh | null>(null);
  const sceneState = useSceneState();

  useEffect(() => {
    const loadModel = async () => {
      try {
        const gltf = await loader.loadAsync(
          groundPlane,
          (event) => {
            console.log(
              `Loading Ground Plane: ${(event.loaded / event.total) * 100}%`,
            );
          },
        );
        const mesh = gltf.scene.children[0];
        if (mesh) {
          mesh.position.set(0, 0, 0);
          if (
            mesh.position.x === 0 &&
            mesh.position.y === 0 &&
            mesh.position.z === 0
          ) {
            setGroundPlaneMesh(mesh as Mesh);

            scene.add(mesh);

          } else {
            console.log('Failed to set proper position. Please Refresh');
          }
        }
      } catch (error) {
        console.error('Failed to load the model:', error);
      }
    };

    loadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (groundPlaneMesh && !grassRef.current) {
      // Wait for the ground plane to load into the right position before doing displacement calculations
      const timer = setTimeout(() => {
        const grass = new Grass(size, count, groundPlaneMesh);
        grassRef.current = grass;
        scene.add(grass);
        sceneState.environmentLoaded.set(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groundPlaneMesh]);

  useFrame(({ clock }) => {
    if (grassRef.current) {
      const material = grassRef.current?.material as ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value += clock.getDelta() + 10;
      }
    }
  });

  return null;
};

export default GrassComponent;
