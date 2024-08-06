import { useThree } from '@react-three/fiber';
import { textureLoader } from '../../../../interfaces/THREE_Interface';
import * as THREE from 'three';
import { meadowMap } from '../../../../utils/cdn-links/environmentAssets';

const map = meadowMap;

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
      mesh.position.set(0, 5, 0);
      mesh.rotation.set(0, Math.PI / 12, 0);

      scene.add(mesh);
    })
    .catch((error) => {
      console.error('Failed to load texture:', error);
    });

  return null;
}
