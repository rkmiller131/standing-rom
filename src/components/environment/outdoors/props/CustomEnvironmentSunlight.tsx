import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {
  DirectionalLight,
  EquirectangularReflectionMapping,
} from 'three';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';
import {
  lensFlares,
  meadowHDR,
} from '../../../../utils/cdn-links/environmentAssets';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { textureLoader } from '../../../../interfaces/THREE_Interface';

interface CustomEnvironmentProps {}

const CustomEnvironmentSunlight: React.FC<CustomEnvironmentProps> = () => {
  const { scene } = useThree();

  useEffect(() => {
    const light = new DirectionalLight(0xffffff, Math.PI);
    light.position.set(18, 16, -45);
    light.intensity = 2;
    light.castShadow = true;

    // const directionalLightHelper = new CameraHelper(light.shadow.camera); // Uncomment if needed
    // scene.add(directionalLightHelper);
    const textureFlare0 = textureLoader.load(lensFlares['textFlare0']);
    const textureFlare1 = textureLoader.load(lensFlares['textFlare1']);
    const textureFlare2 = textureLoader.load(lensFlares['textFlare2']);
    const textureFlare3 = textureLoader.load(lensFlares['textFlare3']);

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
    lensflare.addElement(new LensflareElement(textureFlare1, 500, 0.15));
    lensflare.addElement(new LensflareElement(textureFlare2, 62.5, 0.4));
    lensflare.addElement(new LensflareElement(textureFlare3, 125, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 250, 0.8));

    light.add(lensflare);

    scene.add(light);

    new RGBELoader().load(meadowHDR, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentRotation.set(0, Math.PI / 4, 0);
      scene.background = texture;
    });
  }, [scene]);

  return null;
};

export default CustomEnvironmentSunlight;
