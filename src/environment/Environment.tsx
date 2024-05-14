import { Suspense } from 'react';
import OutdoorScene from './outdoors/Outdoors';
import OfficeScene from './office/Scene';
import { useSceneState } from '../ecs/store/SceneState';
import { VRM } from '../THREE_Interface';

interface SceneProps {
  avatar: React.RefObject<VRM>;
}

export default function Environment({ avatar }: SceneProps) {
  const sceneState = useSceneState();
  return (
    <Suspense fallback={null}>
      {sceneState.selectedEnvironment.get({ noproxy: true }) ===
        'Indoor Office' && <OfficeScene avatar={avatar} />}
      {sceneState.selectedEnvironment.get({ noproxy: true }) === 'Outdoors' && (
        <OutdoorScene />
      )}
    </Suspense>
  );
}
