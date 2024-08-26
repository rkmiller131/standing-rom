/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {
  SphereGeometry,
  Mesh,
  PositionalAudio,
  MeshPhongMaterial,
  DoubleSide,
} from 'three';
import {
  audioLoader,
  audioListener as listener,
} from '../../../../interfaces/THREE_Interface';
import { backgroundMusic } from '../../../../utils/cdn-links/sounds';

const songPath = backgroundMusic['Outdoors'];

export default function Sound() {
  const { camera, scene } = useThree();

  useEffect(() => {
    camera.add(listener);

    const sound = new PositionalAudio(listener);

    const sphere = new SphereGeometry(20, 32, 16);
    const material = new MeshPhongMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0,
      side: DoubleSide,
    });

    audioLoader.load(songPath, function (buffer: AudioBuffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.setVolume(0.3);
      sound.setLoop(true);
      sound.play();
    });

    const mesh = new Mesh(sphere, material);

    mesh.add(sound);

    scene.add(mesh);

    return () => {
      scene.remove(mesh);
      camera.remove(listener);
    };
  }, []);

  return null;
}