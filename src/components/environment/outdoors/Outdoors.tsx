/* eslint-disable react-hooks/exhaustive-deps */
import { Environment } from '@react-three/drei';
import SceneMap from './props/SceneMap';
import GrassComponent from './props/GrassBlade';
import { Tree, TreeInstance } from './props/Tree';
import { Flower, FlowerInstance } from './props/Flower2';
import { lazy, useEffect } from 'react';
import { useSceneState } from '../../../hookstate-store/SceneState';

const Bush = lazy(() =>
  import('../outdoors/props/Bush').then((module) => ({ default: module.Bush })),
);

const BushInstance = lazy(() =>
  import('../outdoors/props/Bush').then((module) => ({
    default: module.BushInstance,
  })),
);

export default function OutdoorScene() {
  const sceneState = useSceneState();

  useEffect(() => {
    // delay the scene loading to let async instances come into the scene
    const timer = setTimeout(() => {
      sceneState.environmentLoaded.set(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Environment
        files="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/meadow_2k.hdr?v=1715123590317"
        backgroundRotation={[0, 0, 0]}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 2]} castShadow />
      <SceneMap />

      <GrassComponent size={100} count={100000} />
      <TreeInstance>
        <Tree position={[-3, 0, -1]} rotation={[0, 0, 0]} scale={0.8} />
      </TreeInstance>

      <BushInstance>
        <Bush position={[2, 0, -2]} rotation={[0, 0, 0]} scale={1} />
      </BushInstance>

      <FlowerInstance>
        <Flower
          position={[2, 0, -1]}
          rotation={[0, Math.PI / 3, 0]}
          scale={0.05}
        />
      </FlowerInstance>
    </>
  );
}
