import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, Suspense, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import calculateArmAngles from "../helpers/calculateArmAngles";
import { Text } from "@react-three/drei";

interface AvatarProps {
  setAvatarModel: (vrm: VRM) => void;
  avatar: React.RefObject<VRM>;
}
export default function Avatar({ setAvatarModel, avatar }: AvatarProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [right, setRightArmAngle] = useState(0);
  const [left, setLeftArmAngle] = useState(0);

  useLayoutEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      // "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981",
      '/Man.vrm',
      (gltf) => {
        const vrm = gltf.userData.vrm;
        setAvatarModel(vrm);
        setAvatarLoaded(true);
      },
      (progress) =>
        console.log(
          "Loading model...",
          100.0 * (progress.loaded / progress.total),
          "%"
        ),
      (error) => console.error("Error Loading Avatar: ", error)
    );
  }, [setAvatarModel]);

  useFrame(() => {
    if (avatar.current) {
      const { leftArmAngle, rightArmAngle } = calculateArmAngles(avatar);
      setRightArmAngle(rightArmAngle);
      setLeftArmAngle(leftArmAngle);
    }
  });

  return (
    <Suspense fallback={null}>
      {avatarLoaded && (
        <>
          <Text position={[0, 2, -2]} scale={0.35} color="black">
            {right} and {left}
          </Text>
          <primitive
            object={avatar.current!.scene}
            scale={[0.75, 0.75, 0.75]}
          />
        </>
      )}
    </Suspense>
  );
}
