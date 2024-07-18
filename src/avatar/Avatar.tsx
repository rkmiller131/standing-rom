/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from 'react';
import { VRM, VRMLoaderPlugin, gltfLoader as loader } from '../../interfaces/THREE_Interface';
import debounce from '../ecs/helpers/debounce';
import { useSceneState } from '../ecs/store/SceneState';
// import { ikTargets, iks } from './helpers/solvers';
import { CCDIKHelper, TransformControls } from 'three/examples/jsm/Addons.js';
import { useThree } from '@react-three/fiber';
import { iks, ikTargets, setupIKSolver } from './helpers/setupIKSolver';
import { SkeletonHelper } from 'three';

interface AvatarProps {
  setAvatarModel: (vrm: VRM) => void;
  avatar: React.RefObject<VRM>;
}

export default function Avatar({ setAvatarModel, avatar }: AvatarProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const isMobile = useSceneState().device.get({ noproxy: true }) === 'Mobile';
  const { scene, camera, gl } = useThree();

  const updateProgress = debounce((loadedPercentage) => {
    // could set a state here instead, for loading screen in the future
    console.log('Loading Avatar: ', loadedPercentage + '%');
  }, 100);

  useEffect(() => {
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      // 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/Man-Compressed.vrm?v=1715274436489',
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/manNoRoll.vrm?v=1721253731150',
      (gltf) => {
        const vrm = gltf.userData.vrm;

        setupIKSolver(vrm);
        console.log('vrm is ', vrm)
        const ccdikHelper = new CCDIKHelper(ikTargets.avatarMesh, iks, 0.01);
        scene.add(ccdikHelper);

        const transformControls = new TransformControls(camera, gl.domElement);
        transformControls.size = 0.75;
        transformControls.showX = true;
        transformControls.space = 'world';
        transformControls.attach(ikTargets.rightArm.ikTarget);
        scene.add(transformControls);

        const skeletonHelper = new SkeletonHelper(ikTargets.avatarMesh);
        scene.add(skeletonHelper)

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
