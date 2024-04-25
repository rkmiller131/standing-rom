import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

import * as THREE from "three";
import { useVideoTexture } from "@react-three/drei";

const bulbLuminousPowers = {
  "1000W": 110000,
  "300W": 3500,
  "100W": 1700,
  "60W": 800,
  "40W": 400,
  "25W": 180,
  "10W": 120,
  "4W": 20,
  Off: 0,
};

export const Sky: React.FC = () => {
  const tex = useVideoTexture("./sunny.mp4");
  return (
    <mesh position={[2.7, 0.95, -2]} rotation={[0, -Math.PI / 2.5, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

export const Sun: React.FC = () => {
  return (
    <mesh scale={0.04} position={[4.5, 2.7, -8]}>
      <sphereGeometry args={[10, 15, 15]} />
      <meshStandardMaterial
        emissive="#f9d97a"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
};

interface IncandescentBulbProps {
  bulbPower?: keyof typeof bulbLuminousPowers;
  position?: [number, number, number];
}

export const IncandescentBulb: React.FC<IncandescentBulbProps> = ({
  bulbPower = "1000W",
  position = [0, 2, 0],
}) => {
  const bulbLightRef = useRef<THREE.PointLight | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    const bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 1,
      color: 0x000000,
    });

    const bulbLight = new THREE.PointLight(0xffffff, 1, 100, 2);
    bulbLight.position.set(...position);
    bulbLight.castShadow = true;

    scene.add(bulbLight);

    bulbLightRef.current = bulbLight;

    const power = bulbLuminousPowers[bulbPower];
    bulbLight.power = power;
    bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0);

    return () => {
      scene.remove(bulbLight);
    };
  }, [scene, bulbPower, position]);

  return null;
};

interface SpotlightWithTargetProps {
  lock: [number, number, number];
  position: [number, number, number];
}

export const SpotlightWithTarget: React.FC<SpotlightWithTargetProps> = ({
  lock,
  position,
}) => {
  const { scene } = useThree();
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    const targetObject = new THREE.Object3D();
    targetObject.position.set(...lock);
    scene.add(targetObject);

    if (spotlightRef.current) {
      spotlightRef.current.target = targetObject;
      spotlightRef.current.position.set(...position);
    }

    return () => {
      scene.remove(targetObject);
    };
  }, [scene, lock, position]);

  return (
    <spotLight
      ref={spotlightRef}
      color="#ffffff"
      position={position}
      angle={1}
      penumbra={0.75}
      intensity={10}
    />
  );
};
