import * as THREE from 'three';
import { textureLoader } from '../../../../interfaces/THREE_Interface';
import { useThree } from '@react-three/fiber';

const map =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/grass3.jpg?v=1715123494484';

export default function Ground() {
  const { scene } = useThree();

  textureLoader
    .loadAsync(map)
    .then((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);

      const planeGeometry = new THREE.PlaneGeometry(100, 100);

      const mat1 = new THREE.MeshBasicMaterial({ map: texture });
      const mat2 = new THREE.ShadowMaterial({ opacity: 1 });

      // this is the grounds material
      const meshWithTexture = new THREE.Mesh(planeGeometry, mat1);
      meshWithTexture.rotation.set(-Math.PI / 2, 0, 0);
      meshWithTexture.position.set(0, 0, 0);
      meshWithTexture.receiveShadow = true;
      scene.add(meshWithTexture);

      // this is a transparent plane with shadows drawn where necessary.
      const meshWithShadow = new THREE.Mesh(planeGeometry, mat2);
      meshWithShadow.rotation.set(-Math.PI / 2, 0, 0);
      meshWithShadow.position.set(0, 0, 0);
      meshWithShadow.receiveShadow = true;
      scene.add(meshWithShadow);
    })
    .catch((error) => {
      console.error('Failed to load texture:', error);
    });

  return null;
}
