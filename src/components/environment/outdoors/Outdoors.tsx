/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense } from 'react';
import SceneMap from './props/SceneMap';
import GrassComponent from './props/GrassBlade';
import CustomEnvironmentSunlight from './props/CustomEnvironmentSunlight';
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