import { Suspense } from 'react';
import OutdoorScene from './outdoors/Outdoors';
import OfficeScene from './office/Scene';
import { useSceneState } from '../ecs/store/SceneState';

export default function Environment() {
  const sceneState = useSceneState();
  return (
    <Suspense fallback={null}>
      {sceneState.selectedEnvironment.get({ noproxy: true }) ===
        'Indoor Office' && <OfficeScene />}
      {sceneState.selectedEnvironment.get({ noproxy: true }) === 'Outdoors' && (
        <OutdoorScene />
      )}
    </Suspense>
  );
}
