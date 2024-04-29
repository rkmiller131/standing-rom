import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { bulbLuminousPowers, createBulbLight } from './helpers/createLights'
import { PointLight } from 'three';

interface IncandescentBulbProps {
  bulbPower?: keyof typeof bulbLuminousPowers;
  position?: [number, number, number];
}

export const IncandescentBulb: React.FC<IncandescentBulbProps> = ({
  bulbPower = "1000W",
  position = [0, 2, 0],
}) => {
  const bulbLightRef = useRef<PointLight | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    const bulbLight = createBulbLight(scene, position, bulbPower);
    bulbLightRef.current = bulbLight;

    return () => {
      if (bulbLightRef.current) {
        scene.remove(bulbLightRef.current);
      }
    };
  }, [scene, bulbPower, position]);

  return null;
};
