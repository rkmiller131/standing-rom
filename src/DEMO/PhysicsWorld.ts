import { Vec3, World } from 'cannon-es';

const world = new World({
  gravity: new Vec3(0, 0, 0),
})

export default world;