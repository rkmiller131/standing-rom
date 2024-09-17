import { useThree } from '@react-three/fiber';
import { textureLoader } from '../../../../interfaces/THREE_Interface';
import { meadowMap } from '../../../../utils/cdn-links/environmentAssets';
import { BackSide, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

export default function SceneMap() {
  const { scene } = useThree();

  textureLoader
    .loadAsync(meadowMap)
    .then((texture) => {
      const geometry = new SphereGeometry(50, 16, 16);

      const material = new MeshStandardMaterial({
        map: texture,
        side: BackSide,
      });

      const mesh = new Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, Math.PI / -3, 0);

      scene.add(mesh);
    })
    .catch((error) => {
      console.error('Failed to load texture:', error);
    });

  return null;
}
