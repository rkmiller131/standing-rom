import { useThree } from '@react-three/fiber';
import { textureLoader } from '../../../THREE_Interface';
import * as THREE from 'three';

const map =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/meadow_7.jpg?v=1715123525520';

export default function SceneMap() {
  const { scene } = useThree();

  textureLoader
    .loadAsync(map)
    .then((texture) => {
      const geometry = new THREE.SphereGeometry(50, 60, 40);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 8, 0);
      mesh.rotation.set(0, Math.PI / 12, 0);

      scene.add(mesh);
    })
    .catch((error) => {
      console.error('Failed to load texture:', error);
    });

  return null;
}
