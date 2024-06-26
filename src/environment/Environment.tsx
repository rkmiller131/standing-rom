import { Suspense } from 'react';
import OutdoorScene from './outdoors/Outdoors';
import OfficeScene from './office/Scene';
import { useSceneState } from '../ecs/store/SceneState';

export default function Environment() {
  const sceneState = useSceneState();

  console.log('~~ The environment component rendered: rendering the selected environment')
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
