import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

var rightWristGlobal: [number, number, number] = [0, 0, 0];
var rightShoulderGlobal: [number, number, number] = [0, 0, 0];

var leftWristGlobal: [number, number, number] = [0, 0, 0];
var leftShoulderGlobal: [number, number, number] = [0, 0, 0];

export function protractor(
  wristPosR: [number, number, number],
  shoulderR: [number, number, number],
  wristPosL: [number, number, number],
  shoulderL: [number, number, number],
) {
  rightWristGlobal = wristPosR;
  rightShoulderGlobal = shoulderR;
  leftWristGlobal = wristPosL;
  leftShoulderGlobal = shoulderL;
}

export default function Protractor() {
  const [angleR, setAngleR] = useState(0);
  const [angleL, setAngleL] = useState(0);
  const hipPosition = new THREE.Vector3(0, 0.75, 0);

  useFrame(() => {
    const wristPositionR = new THREE.Vector3(...rightWristGlobal);
    const shoulderPositionR = new THREE.Vector3(...rightShoulderGlobal);
    const wristPositionL = new THREE.Vector3(...leftWristGlobal);
    const shoulderPositionL = new THREE.Vector3(...leftShoulderGlobal);

    // Calculate vectors
    const wristShoulderVectorR = wristPositionR
      .clone()
      .sub(shoulderPositionR)
      .normalize();
    const shoulderHipVectorR = hipPosition
      .clone()
      .sub(shoulderPositionR)
      .normalize();

    const calculatedAngleR =
      Math.acos(wristShoulderVectorR.dot(shoulderHipVectorR)) * (180 / Math.PI);
    setAngleR(calculatedAngleR);

    // Calculate vectors
    const wristShoulderVectorL = wristPositionL
      .clone()
      .sub(shoulderPositionL)
      .normalize();
    const shoulderHipVectorL = hipPosition
      .clone()
      .sub(shoulderPositionL)
      .normalize();

    const calculatedAngle =
      Math.acos(wristShoulderVectorL.dot(shoulderHipVectorL)) * (180 / Math.PI);
    setAngleL(calculatedAngle);
  });

  return (
    <>
      <Text
        position={[0.82, 0.48, 0]}
        scale={0.1}
        color={new THREE.Color(0xffffff)}
        characters=".0123456789"
      >
        {'Right: ' + angleR.toFixed(2) + ' °'}
      </Text>
      <Text
        position={[0.82, 0.68, 0]}
        scale={0.1}
        color={new THREE.Color(0xffffff)}
        characters=".0123456789"
      >
        {'Left: ' + angleL.toFixed(2) + ' °'}
      </Text>
    </>
  );
}
