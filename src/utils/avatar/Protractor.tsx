import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

var wristGlobal: [number, number, number] = [0, 0, 0];
var shoulderGlobal: [number, number, number] = [0, 0, 0];

export function protractor(
  wristPos: [number, number, number],
  shoulder: [number, number, number],
) {
  wristGlobal = wristPos;
  shoulderGlobal = shoulder;
}

export default function Protractor() {
  const { scene } = useThree();
  const curveRef = useRef<THREE.Line | null>(null);
  const startToOriginLineRef = useRef<THREE.Line | null>(null);
  const originToEndLineRef = useRef<THREE.Line | null>(null);
  const [angle, setAngle] = useState(0);
  const hipPosition = new THREE.Vector3(0, 0.75, 0);

  useEffect(() => {
    const ellipseCurve = new THREE.EllipseCurve(
      0,
      0,
      1,
      1,
      0,
      2 * Math.PI,
      false,
      0,
    );
    const curvePoints = ellipseCurve.getPoints(50);
    const convertedPoints = curvePoints.map(
      (p) => new THREE.Vector3(p.x, p.y, 0),
    );
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(
      convertedPoints,
    );
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x0ed8a5 });
    const curveLine = new THREE.Line(curveGeometry, curveMaterial);
    curveRef.current = curveLine;

    curveRef.current.rotation.set(0, 0, Math.PI / 2);
    curveRef.current.rotation.set(Math.PI, Math.PI, Math.PI);
    curveRef.current.scale.set(0.25, 0.25, 0.25);

    // Lines from origin to start and from origin to end
    const curveStartPoint = convertedPoints[0]; // Start point of the curve
    const curveEndPoint = convertedPoints[convertedPoints.length - 1]; // End point of the curve
    const origin = new THREE.Vector3(0, 0, 0); // Origin

    startToOriginLineRef.current = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([curveStartPoint, origin]),
      new THREE.LineBasicMaterial({ color: 0x0ed8a5 }),
    );

    originToEndLineRef.current = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([origin, curveEndPoint]),
      new THREE.LineBasicMaterial({ color: 0x0ed8a5 }),
    );

    const group = new THREE.Group();
    group.add(startToOriginLineRef.current);
    group.add(originToEndLineRef.current);
    group.add(curveRef.current);

    group.position.set(0.25, 0.5, 0.35);

    scene.add(group);
  }, [scene]);

  const updateEllipseCurve = (angle: number) => {
    if (curveRef.current) {
      const curve = new THREE.EllipseCurve(
        0,
        0,
        1,
        1,
        0,
        angle * (Math.PI / 180),
        false,
        0,
      );
      const curvePoints = curve.getPoints(20);
      const convertedPoints = curvePoints.map(
        (p) => new THREE.Vector3(p.x, p.y, 0),
      );
      curveRef.current.geometry.setFromPoints(convertedPoints);

      // Update lines
      if (startToOriginLineRef.current && originToEndLineRef.current) {
        startToOriginLineRef.current.geometry.setFromPoints([
          convertedPoints[0],
          new THREE.Vector3(0, 0, 0),
        ]);
        originToEndLineRef.current.geometry.setFromPoints([
          new THREE.Vector3(0, 0, 0),
          convertedPoints[convertedPoints.length - 1],
        ]);
      }
    }
  };

  useFrame(() => {
    if (
      !curveRef.current ||
      !startToOriginLineRef.current ||
      !originToEndLineRef.current
    )
      return;

    const wristPosition = new THREE.Vector3(...wristGlobal);
    const shoulderPosition = new THREE.Vector3(...shoulderGlobal);

    // Calculate vectors
    const wristShoulderVector = wristPosition
      .clone()
      .sub(shoulderPosition)
      .normalize();
    const shoulderHipVector = hipPosition
      .clone()
      .sub(shoulderPosition)
      .normalize();

    const calculatedAngle =
      Math.acos(wristShoulderVector.dot(shoulderHipVector)) * (180 / Math.PI);
    setAngle(calculatedAngle);

    updateEllipseCurve(calculatedAngle);
  });

  return (
    <>
      <Text
        position={[1, 0.75, 0]}
        scale={0.2}
        color={new THREE.Color(0xffffff)}
        characters=".0123456789"
      >
        {angle.toFixed(2) + ' °'}
      </Text>
    </>
  );
}
