import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, Suspense, useState } from "react"
import { Clock } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Avatar({ setAvatarModel, avatar }) {
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    useLayoutEffect(() => {
        const loader = new GLTFLoader();
        loader.register((parser) => {
          return new VRMLoaderPlugin(parser);
        });
        loader.load(
          'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981',
        //   '/avaturn_avatar.vrm',
          // '/man.vrm',
          (gltf) => {
            const vrm = gltf.userData.vrm;
            setAvatarModel(vrm);
            setAvatarLoaded(true);
          },
          (progress) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
          (error) => console.error('Error Loading Avatar: ', error)
        )
      }, [setAvatarModel]);

    useFrame(({ gl, scene, camera }) => {
        gl.render(scene, camera)
    }, 1);


      return (
        <Suspense fallback={null}>
            {avatarLoaded && (
                <primitive object={avatar.current.scene} scale={[0.85, 0.85, 0.85]} />
            )}
        </Suspense>
      )
}