import { VRMHumanBoneList, VRMHumanBoneName } from '@pixiv/three-vrm'
import { QuaternionSchema, Vector3Schema, TFVectorPose } from './solvers/Types'

export interface MocapComponent {
  prevWorldLandmarks: TFVectorPose | null;
  prevScreenLandmarks: Omit<TFVectorPose, "z"> | null;
  schema: {
    rig: Record<VRMHumanBoneName, typeof QuaternionSchema>;
    hipPosition: typeof Vector3Schema;
    hipRotation: typeof QuaternionSchema;
    footOffset: 'f64';
  };
}

// eventually when we make an ecs, we'll have something like a setcomponent
// that calls this method to make separate instances of these data containers (just plain obj)
export function createMocapComponent(): MocapComponent {
  return {
    prevWorldLandmarks: null,
    prevScreenLandmarks: null,
    schema: {
      rig: Object.fromEntries(VRMHumanBoneList.map((b) => [b, QuaternionSchema])) as Record<VRMHumanBoneName, typeof QuaternionSchema>,
      hipPosition: Vector3Schema,
      hipRotation: QuaternionSchema,
      footOffset: 'f64'
    }
  }
}

// but for now, we only want one mocap anyway, so we'll just use one instance:
export const mocapComponent = createMocapComponent();