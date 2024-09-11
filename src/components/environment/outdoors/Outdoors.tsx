/* eslint-disable react-hooks/exhaustive-deps */
import SceneMap from './props/SceneMap';
import GrassComponent from './props/GrassBlade';
import { lazy, Suspense, useEffect } from 'react';
import CustomEnvironmentSunlight from './props/CustomEnvironmentSunlight';
import { useSceneState } from '../../../hookstate-store/SceneState';
import Sound from './sound/Sound';

const Tree = lazy(() =>
  import('../outdoors/props/Tree').then((module) => ({ default: module.Tree })),
);
const TreeInstance = lazy(() =>
  import('../outdoors/props/Tree').then((module) => ({
    default: module.TreeInstance,
  })),
);

export default function OutdoorScene() {
  const sceneState = useSceneState();

  useEffect(() => {
    // delay the scene loading to let async instances come into the scene
    const timer = setTimeout(() => {
      sceneState.environmentLoaded.set(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GrassComponent size={25} count={30000} />
      <Sound />

      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <CustomEnvironmentSunlight />
        <SceneMap />
        <TreeInstance>
          <Tree
            position={[5, 0, -5]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.8}
          />
        </TreeInstance>
      </Suspense>
    </>
  );
}
