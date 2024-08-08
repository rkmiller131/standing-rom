import { useEffect, useState } from 'react';
import { Vector3 } from 'three';

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
  const hipPosition = new Vector3(0, 0.75, 0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const wristPositionR = new Vector3(...rightWristGlobal);
      const shoulderPositionR = new Vector3(...rightShoulderGlobal);
      const wristPositionL = new Vector3(...leftWristGlobal);
      const shoulderPositionL = new Vector3(...leftShoulderGlobal);

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
        Math.acos(wristShoulderVectorR.dot(shoulderHipVectorR)) *
        (180 / Math.PI);
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
        Math.acos(wristShoulderVectorL.dot(shoulderHipVectorL)) *
        (180 / Math.PI);
      setAngleL(calculatedAngle);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div>
        <p>Right: {angleR.toFixed(2)} °</p>
        <p>Left: {angleL.toFixed(2)} °</p>
      </div>
    </>
  );
}
