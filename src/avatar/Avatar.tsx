/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from 'react';
import { VRM, VRMLoaderPlugin, gltfLoader as loader } from '../../interfaces/THREE_Interface';
import debounce from '../ecs/helpers/debounce';
import { useSceneState } from '../ecs/store/SceneState';
import { ikTargets, iks } from './helpers/solvers';
import { CCDIKHelper } from 'three/examples/jsm/Addons.js';
import { useThree } from '@react-three/fiber';
// import { CCDIKHelper } from 'three/examples/jsm/Addons.js';
// import { useThree } from '@react-three/fiber';
interface AvatarProps {
  setAvatarModel: (vrm: VRM) => void;
  avatar: React.RefObject<VRM>;
}

export default function Avatar({ setAvatarModel, avatar }: AvatarProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const isMobile = useSceneState().device.get({ noproxy: true }) === 'Mobile';
  const { scene } = useThree();

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
        const rootBone = vrm.scene.children[3].skeleton.bones[0];
        const skeleton = vrm.scene.children[3].skeleton;
        vrm.scene.traverse((node) => {
          if (node.name === 'Normalized_upperarm_r') ikTargets.rightUpperArm = node;
          if (node.name === 'Normalized_lowerarm_r') ikTargets.rightLowerArm = node;
          if (node.name === 'Normalized_hand_r') ikTargets.rightHand = node;
          if (node.name === 'CC_Game_Body') ikTargets.avatar = node;
        })
        ikTargets.avatar.add(rootBone);
        ikTargets.avatar.bind(skeleton);

        const ccdikHelper = new CCDIKHelper(ikTargets.avatar, iks, 0.01);
        scene.add(ccdikHelper);
        console.log('the iktargets are ', ikTargets)
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
