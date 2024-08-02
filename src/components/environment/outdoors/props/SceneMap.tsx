import { useThree } from '@react-three/fiber';
import { textureLoader } from '../../../../interfaces/THREE_Interface';
import * as THREE from 'three';

const map =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/meadow_71.jpg?v=1722542072678';

export default function SceneMap() {
  const { scene } = useThree();

  textureLoader
    .loadAsync(map)
    .then((texture) => {
      const geometry = new THREE.SphereGeometry(50, 16, 16);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, Math.PI / 12, 0);

      scene.add(mesh);
    })
    .catch((error) => {
      console.error('Failed to load texture:', error);
    });

  return null;
}
