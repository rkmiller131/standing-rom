/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from 'react'
import { VRM, VRMLoaderPlugin, gltfLoader as loader } from '../THREE_Interface'
import debounce from '../ecs/helpers/debounce'
import { useGameState } from '../ecs/store/GameState'

interface AvatarProps {
  setAvatarModel: (vrm: VRM) => void;
  avatar: React.RefObject<VRM>;
}
export default function Avatar({ setAvatarModel, avatar }: AvatarProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const isMobile = useGameState().device.get({noproxy: true}) === 'Mobile';

  const updateProgress = debounce((loadedPercentage) => {
    // could set a state here instead, for loading screen in the future
    console.log('Loading Avatar: ', loadedPercentage + '%');
  }, 100)

  useEffect(() => {
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      // 'https://cdn.glitch.me/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/Man2.vrm?v=1714584791654',
      'https://cdn.glitch.me/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/Man.vrm?v=1714005611608',
      (gltf) => {
        const vrm = gltf.userData.vrm;
        setAvatarModel(vrm);
        setAvatarLoaded(true);
      },
      (progress) => {
        const loadedPercentage = 100 * (progress.loaded / progress.total);
        updateProgress(loadedPercentage);
      },
      (error) => console.error("Error Loading Avatar: ", error)
    );
  }, []);

  return (
    <Suspense fallback={null}>
      {avatarLoaded && (
        <>
          <primitive
            object={avatar.current!.scene}
            scale={isMobile ? [0.6, 0.6, 0.6] : [0.75, 0.75, 0.75]}
          />
        </>
      )}
    </Suspense>
  );
}