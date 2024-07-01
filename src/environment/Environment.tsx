import { Suspense } from 'react';
import OutdoorScene from './outdoors/Outdoors';
import OfficeScene from './office/Scene';
import { useSceneState } from '../ecs/store/SceneState';

export default function Environment() {
  const sceneState = useSceneState();
  const selectedScene = sceneState.selectedEnvironment.get({ noproxy: true });
  return (
    <Suspense fallback={null}>
      {selectedScene === 'Indoor Office' && (
        <OfficeScene />
      )}
      {selectedScene === 'Outdoors' && (
        <OutdoorScene />
      )}
    </Suspense>
  );
}
