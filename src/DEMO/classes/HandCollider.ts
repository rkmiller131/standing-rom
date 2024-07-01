import { Body, Sphere, Vec3 } from 'cannon-es';
import { world, worldHandColliderManager } from '../PhysicsWorld';

export default class HandCollider {
  // both hands are part of the same group
  public COLLISION_FILTER = 1 << 0;
  public COLLISION_MASK: number;
  public body: Body | null = null;
  public entityId: number | null = null;
  public poppedTargets = new Set();

  private _handedness: 'right' | 'left';

  constructor(handedness: 'right' | 'left') {
    this._handedness = handedness;
    // Determine the current hand's group and the mask to exclude the other hand
    // Flip all bits except the one at index 0 or 1 depending on handedness
    this.COLLISION_MASK = ~(1 << (handedness === 'right'? 0 : 1));
    this.addCollider();
  }

  addCollider() {
    if (!this.body) {
      this.body = new Body({
        position: this._handedness === 'right' ? new Vec3(1, 1, 0) : new Vec3(-1, 1, 0),
        mass: 1,
        type: Body.KINEMATIC,
        collisionResponse: false,
        shape: new Sphere(0.07),
        collisionFilterGroup: this.COLLISION_FILTER,
        collisionFilterMask: this.COLLISION_MASK
      });

      this.entityId = this.body.id;
      worldHandColliderManager[this.entityId] = this;

      world.addEventListener('beginContact', handleHandCollision);
      world.addBody(this.body);
    }
  }

}

function handleHandCollision({ bodyA, bodyB }: { bodyA: Body, bodyB: Body }) {
  const bubbleId = bodyB.id;
  const handId = bodyA.id;
  const hand = worldHandColliderManager[handId];
  hand.poppedTargets.add(bubbleId);
}