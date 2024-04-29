import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { createTargetObject } from './helpers/createTargetObject'
import { SpotLight } from 'three'

interface SpotlightWithTargetProps {
  lock: [number, number, number];
  position: [number, number, number];
}

export const SpotlightWithTarget: React.FC<SpotlightWithTargetProps> = ({
  lock,
  position,
}) => {
  const { scene } = useThree();
  const spotlightRef = useRef<SpotLight>(null);

  useEffect(() => {
    const targetObject = createTargetObject(scene, lock);
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