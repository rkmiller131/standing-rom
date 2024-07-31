/* eslint-disable react-hooks/exhaustive-deps */
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

export default function PixelRatio(): null {
  const { gl } = useThree();
  const [qualityLevel, setQualityLevel] = useState<number>(1);
  const [frameTimes, setFrameTimes] = useState<number[]>([]);

  useEffect(() => {
    if (gl) {
      // Adjust the pixel ratio based on the quality level
      gl.setPixelRatio(Math.min(window.devicePixelRatio, qualityLevel));
    }
  }, [gl, qualityLevel]);

  // Dynamically adjust the quality level based on frame times
  useFrame(({ clock }) => {
    const frameTime = clock.getDelta();
    setFrameTimes((prev) => [...prev, frameTime]);

    const averageFrameTime =
      frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    // 60 FPS, decrease quality level by 1 up to a min of 1
    if (averageFrameTime > 0.016) {
      setQualityLevel((prev) => Math.max(prev - 1, 1));
      // 120 FPS, increase quality level by 1, up to a max of 2
    } else if (averageFrameTime < 0.01) {
      setQualityLevel((prev) => Math.min(prev + 1, 2));
    }
  });

  return null;
}
