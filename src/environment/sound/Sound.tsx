import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { SphereGeometry, Mesh, PositionalAudio, MeshPhongMaterial, DoubleSide } from 'three'
import { audioLoader, audioListener as listener } from '../../THREE_Interface'

const songPath = 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/officeBgMusic.mp3?v=1714682590547';

export default function Sound () {
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
}
