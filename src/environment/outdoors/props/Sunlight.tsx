import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {
  DirectionalLight,
  EquirectangularReflectionMapping,
  TextureLoader,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';

interface CustomEnvironmentProps {}

const CustomEnvironment: React.FC<CustomEnvironmentProps> = () => {
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

    new RGBELoader().load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/meadow_2k.hdr?v=1715123590317',
      (texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentRotation.set(0, Math.PI / 4, 0);
        scene.background = texture;
      },
    );
  }, [scene]);

  return null;
};

export default CustomEnvironment;
