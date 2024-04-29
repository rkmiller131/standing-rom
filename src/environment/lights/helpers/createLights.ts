import { PointLight, Scene } from 'three'

export const bulbLuminousPowers = {
    "1000W": 110000,
    "300W": 3500,
    "100W": 1700,
    "60W": 800,
    "40W": 400,
    "25W": 180,
    "10W": 120,
    "4W": 20,
    Off: 0,
  };

export const createBulbLight = (
  scene: Scene,
  position: [number, number, number],
  bulbPower: keyof typeof bulbLuminousPowers
) => {
  const bulbLight = new PointLight(0xffffff, 1, 100, 2);
  bulbLight.position.set(...position);
  bulbLight.castShadow = true;

  scene.add(bulbLight);

  const power = bulbLuminousPowers[bulbPower];
  bulbLight.power = power;

  return bulbLight;
};