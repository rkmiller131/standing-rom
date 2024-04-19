import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, Suspense, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import calculateArmAngles from "../helpers/calculateArmAngles";
import { Html, Text } from "@react-three/drei";

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
      "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981",
      // '/Man.vrm',
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
          <primitive
            object={avatar.current!.scene}
            scale={[0.85, 0.85, 0.85]}
          />
          <Html position={[-3, 2.2, -2]}>
            <div
              style={{
                backgroundColor: "#ffffff80",
                border: "2px solid",
                borderColor: "turquoise",
                width: "350px",
                height: "250px",
                padding: "10px",
                borderRadius: "5px",
                color: "black",
              }}
            >
              <h2>Game Information</h2>
              <p>Right Arm Angle: {right}°</p>
              <p>Left Arm Angle: {left}°</p>
            </div>
          </Html>
        </>
      )}
    </Suspense>
  );
}
