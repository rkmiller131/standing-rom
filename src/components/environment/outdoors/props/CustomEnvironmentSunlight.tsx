import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DirectionalLight, TextureLoader } from 'three';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';

interface CustomEnvironmentProps {}

const CustomEnvironmentSunlight: React.FC<CustomEnvironmentProps> = () => {
  const { scene } = useThree();

  useEffect(() => {
    const light = new DirectionalLight(0xffffff, Math.PI);
    light.position.set(18, 16, -35);
    light.castShadow = true;

    // const directionalLightHelper = new CameraHelper(light.shadow.camera); // Uncomment if needed
    // scene.add(directionalLightHelper);

    const textureLoader = new TextureLoader();
    const textureFlare0 = textureLoader.load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/lensFlare3.png?v=1716574560336',
    );
    const textureFlare1 = textureLoader.load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/lensFlarel1.png?v=1716574556548',
    );
    const textureFlare2 = textureLoader.load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/lensFlareE1.png?v=1716574563228',
    );
    const textureFlare3 = textureLoader.load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/lensFlareE2.png?v=1716574552655',
    );

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
    lensflare.addElement(new LensflareElement(textureFlare1, 500, 0.15));
    lensflare.addElement(new LensflareElement(textureFlare2, 62.5, 0.4));
    lensflare.addElement(new LensflareElement(textureFlare3, 125, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 250, 0.8));

    light.add(lensflare);

    scene.add(light);
  }, [scene]);

  return null;
};

export default CustomEnvironmentSunlight;
