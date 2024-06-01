/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from 'react';
import { VRM, VRMLoaderPlugin, gltfLoader as loader } from '../THREE_Interface';
import debounce from '../ecs/helpers/debounce';
import { useSceneState } from '../ecs/store/SceneState';
import { Bone, Object3D } from 'three';

interface AvatarProps {
  setAvatarModel: (vrm: VRM) => void;
  avatar: React.RefObject<VRM>;
}

export const avatarSchema = {
  rootBone: new Bone(),
  ikTargets: {
    rightArm: [] as Object3D[]
  }
}

export default function Avatar({ setAvatarModel, avatar }: AvatarProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const isMobile = useSceneState().device.get({ noproxy: true }) === 'Mobile';

  const updateProgress = debounce((loadedPercentage) => {
    // could set a state here instead, for loading screen in the future
    console.log('Loading Avatar: ', loadedPercentage + '%');
  }, 100);

  useEffect(() => {
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/Man-Compressed.vrm?v=1715274436489',
      (gltf) => {
        const vrm = gltf.userData.vrm;
        avatarSchema.rootBone = vrm.scene.children[3].skeleton.bones[0];
        const iks = {
          rightArm: [
            vrm.humanoid.humanBones.rightUpperArm.node,
            vrm.humanoid.humanBones.rightLowerArm.node,
            vrm.humanoid.humanBones.rightHand.node
          ]
        };
        avatarSchema.ikTargets = iks;
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
