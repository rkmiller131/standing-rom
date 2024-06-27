import { Body, Sphere } from 'cannon-es';
import { LayerMaterial, Depth, Fresnel } from 'lamina/vanilla';
import { Mesh, Object3D, SphereGeometry, Vector3 } from 'three';
import world from './PhysicsWorld';

export default class Bubble extends Object3D {
  public mesh: Mesh;
  public position: Vector3;

  private body: Body | null = null;

  constructor(position: Vector3) {
    super();
    const geometry = new SphereGeometry(0.05, 8, 8);
    const material = new LayerMaterial({
      color: '#ffffff',
      lighting: 'physical',
      transmission: 1,
      roughness: 0.1,
      thickness: 2,
      layers: [
        new Depth({
          near: 0.4854,
          far: 0.7661999999999932,
          origin: [-0.4920000000000004, 0.4250000000000003, 0],
          colorA: '#fec5da',
          colorB: '#00b8fe'
        }),
        new Fresnel({
          color: '#fefefe',
          bias: -0.3430000000000002,
          intensity: 3.8999999999999946,
          power: 3.3699999999999903,
          factor: 1.119999999999999,
          mode: 'screen'
        })
      ]
    });

    this.mesh = new Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.position.set(position.x, position.y, position.z);
    this.position = position;
  }

  addCollider() {
    const collisionFilterGroup = 1 << 2 // Bubbles assigned to group 4 (2^2)
    const collisionFilterMask = (1 << 0) | (1 << 1) // Allow interaction with hands (group 1 and 2)

    if (!this.body) {
      this.body = new Body({
        mass: 1,
        shape: new Sphere(0.05),
        type: Body.DYNAMIC,
        collisionFilterGroup: collisionFilterGroup,
        collisionFilterMask: collisionFilterMask
      });
      this.body.position.set(this.position.x, this.position.y, this.position.z);

      this.body.addEventListener('beginContact', () => {
        console.log('bubble collided with something!')
        world.removeBody(this.body!);
      });

      world.addBody(this.body);
    }
  }
}