/* eslint-disable react-hooks/exhaustive-deps */
import SceneMap from './props/SceneMap';
import GrassComponent from './props/GrassBlade';
import { lazy, useEffect } from 'react';
import { useSceneState } from '../../ecs/store/SceneState';
import CustomEnvironment from './props/Sunlight';

const Bush = lazy(() =>
  import('../outdoors/props/Bush').then((module) => ({ default: module.Bush })),
);

const BushInstance = lazy(() =>
  import('../outdoors/props/Bush').then((module) => ({
    default: module.BushInstance,
  })),
);
const Tree = lazy(() =>
  import('../outdoors/props/Tree').then((module) => ({ default: module.Tree })),
);

const TreeInstance = lazy(() =>
  import('../outdoors/props/Tree').then((module) => ({
    default: module.TreeInstance,
  })),
);

const Flower = lazy(() =>
  import('../outdoors/props/Flower2').then((module) => ({
    default: module.Flower,
  })),
);

const FlowerInstance = lazy(() =>
  import('../outdoors/props/Flower2').then((module) => ({
    default: module.FlowerInstance,
  })),
);

const Sound = lazy(() => import('./sound/Sound'));

export default function OutdoorScene() {
  const sceneState = useSceneState();

  useEffect(() => {
    // delay the scene loading to let async instances come into the scene - my own measurement is about ~ 6-8 seconds...
    const timer = setTimeout(() => {
      sceneState.environmentLoaded.set(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ambientLight intensity={1} />
      <CustomEnvironment />
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
      <Sound />
    </>
  );
}
