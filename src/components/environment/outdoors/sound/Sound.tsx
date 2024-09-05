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
import useHookstateGetters from '../../../../interfaces/Hookstate_Interface';

const songPath = backgroundMusic['Outdoors'];
const ambiencePath = backgroundMusic['OutdoorAmbience'];

export default function Sound() {
  const { camera, scene } = useThree();
  const { getMusic, getAllSounds } = useHookstateGetters();

  useEffect(() => {
    camera.add(listener);

    const sound1 = new PositionalAudio(listener);
    const sound2 = new PositionalAudio(listener);

    const sphere = new SphereGeometry(20, 32, 16);
    const material = new MeshPhongMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0,
      side: DoubleSide,
    });

    audioLoader.load(songPath, function (buffer: AudioBuffer) {
      sound1.setBuffer(buffer);
      sound1.setRefDistance(20);
      sound1.setVolume(0.3);
      sound1.setLoop(true);
      if (getAllSounds() && getMusic()) {
        sound1.play();
      } else {
        sound1.stop();
      }
    });

    audioLoader.load(ambiencePath, function (buffer: AudioBuffer) {
      sound2.setBuffer(buffer);
      sound2.setRefDistance(20);
      sound2.setVolume(0.3);
      sound2.setLoop(true);
      if (getAllSounds() && getMusic()) {
        sound2.play();
      } else {
        sound2.stop();
      }
    });

    const mesh = new Mesh(sphere, material);

    mesh.add(sound1);
    mesh.add(sound2);

    scene.add(mesh);

    return () => {
      scene.remove(mesh);
      camera.remove(listener);
    };
  }, []);

  return null;
}
