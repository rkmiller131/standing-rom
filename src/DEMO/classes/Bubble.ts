import { Body, Sphere } from 'cannon-es';
import { LayerMaterial, Depth, Fresnel } from 'lamina/vanilla';
import { Mesh, Object3D, Scene, SphereGeometry, Vector3 } from 'three';
import { world, worldBubbleManager } from '../PhysicsWorld';
import GameSetup from './GameSetup';

export default class Bubble extends Object3D {
  public mesh: Mesh;
  public position: Vector3;
  public body: Body | null = null;
  public entityId: number | null = null;

  private _scene: Scene
  private _gameManager: GameSetup
  private COLLISION_GROUP = 1 << 2 // Bubbles assigned to group 4 (2^2)
  private COLLISION_MASK = (1 << 0) | (1 << 1) // Allow interaction with hands (group 1 and 2)

  constructor(scene: Scene, gameManager: GameSetup, position: Vector3) {
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
    this._scene = scene;
    this._gameManager = gameManager;
  }

  addCollider() {
    if (!this.body) {
      this.body = new Body({
        mass: 1,
        shape: new Sphere(0.05),
        type: Body.DYNAMIC,
        collisionResponse: false,
        collisionFilterGroup: this.COLLISION_GROUP,
        collisionFilterMask: this.COLLISION_MASK
      });
      this.body.position.set(this.position.x, this.position.y, this.position.z);
      this.entityId = this.body.id;

      worldBubbleManager[this.entityId] = this;

      world.addEventListener('beginContact', handleBubbleCollision)

      world.addBody(this.body);
    }
  }

  popEffect() {
    this._gameManager.removeBubble();
    this._scene.remove(this.mesh);
    // play the particle pop effect
  }
}

function handleBubbleCollision({ bodyB }: { bodyB: Body }) {
  const bubbleId = bodyB.id;
  const bubble = worldBubbleManager[bubbleId];
  if (bubble) {
    bubble.popEffect();
    delete worldBubbleManager[bubbleId];
    // you can't remove a body immediately when a collide event fires bc physics
    // simulation hasn't finished that frame yet, so setTimeout to remove in between frames:
    setTimeout(() => {
      world.removeBody(bodyB);
    }, 0)
  }
}