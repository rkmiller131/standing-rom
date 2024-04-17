import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, Suspense } from "react"
import { Clock } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Avatar({ setAvatarModel, avatar }) {

    useLayoutEffect(() => {
        const loader = new GLTFLoader();
        loader.register((parser) => {
          return new VRMLoaderPlugin(parser);
        });
        loader.load(
          'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981',
          // '/man.gltf',
          (gltf) => {
            const vrm = gltf.userData.vrm;
            setAvatarModel(vrm);
          },
          (progress) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
          (error) => console.error('Error Loading Avatar: ', error)
        )
      }, [setAvatarModel]);

    //   useFrame((_state, delta) => {
    //     if (avatar.current) {
    //         console.log('~~ update function: ', avatar.current)
    //         avatar.current.update(delta)
    //       }
    //   })

    // const time = Date.now();
    
    // const updateModel = () => {
    //     const currentTime = Date.now();
    //     const delta = currentTime - time;
    //     if (avatar.current) {
    //         avatar.current.update(delta)
    //     }
    //     window.requestAnimationFrame(updateModel)
    // }

    // updateModel();



      return (
        <Suspense fallback={null}>
            {avatar.current && (
                <primitive object={avatar.current.scene} scale={[1, 1, 1]} />
            )}
        </Suspense>
        // avatar.current && (
        //     <primitive object={avatar.current.scene} scale={[1, 1, 1]} />
        // )
      )
}