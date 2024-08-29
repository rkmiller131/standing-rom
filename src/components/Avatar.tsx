/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from 'react';
import { VRM, VRMLoaderPlugin, gltfLoader as loader } from '../interfaces/THREE_Interface';
import { setupAvatarProportions } from '../utils/avatar/setupAvatarProportions';
import useHookstateGetters from '../interfaces/Hookstate_Interface';
import debounce from '../utils/general/debounce';
import { maleModel1 } from '../utils/cdn-links/models';

interface AvatarProps {
  setAvatarModel: (vrm: VRM) => void;
  avatar: React.RefObject<VRM>;
}

export default function Avatar({ setAvatarModel, avatar }: AvatarProps) {
  const { getUserDevice } = useHookstateGetters();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const isMobile = getUserDevice() === 'Mobile';

  const updateProgress = debounce((loadedPercentage) => {
    console.log('Loading Avatar: ', loadedPercentage + '%');
  }, 100);

  useEffect(() => {
    if (avatarLoaded) return;
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      maleModel1,
      (gltf) => {
        const vrm = gltf.userData.vrm;
        setupAvatarProportions(vrm);
        setAvatarModel(vrm);
        setAvatarLoaded(true);
      },
      (progress) => {
        const loadedPercentage = 100 * (progress.loaded / progress.total);
        updateProgress(loadedPercentage);
      },
      (error) => console.error('Error Loading Avatar: ', error),
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
