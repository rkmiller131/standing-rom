import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
  AudioListener,
  PositionalAudio,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
} from "three";
import * as THREE from "three";

export const Sound = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
    // Create an AudioListener and add it to the camera, why the camera? idk
    const listener = new AudioListener();
    camera.add(listener);

    const sound = new PositionalAudio(listener);

    const sphere = new SphereGeometry(20, 32, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/song.mp3", function (buffer: AudioBuffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.setVolume(0.05);
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
};
