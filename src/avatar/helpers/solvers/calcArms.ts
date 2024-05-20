import Vector from './utils/vector'
import { clamp } from './utils/helpers'
import { Results, Side } from './Types'
import { RIGHT, LEFT, PI } from './constants'
// import { Quaternion, Vector3 } from 'three';

// const rightAxis = new Vector3(1, 0, 0);
// const leftAxis = new Vector3(-1, 0, 0);

/**
 * Calculates arm rotation as euler angles
 * @param {Array} lm : array of 3D pose vectors from tfjs or mediapipe
 */
export const calcArms = (lm: Results) => {
    //Pure Rotation Calculations
    const UpperArm = {
        r: Vector.findRotation(lm[11], lm[13]),
        l: Vector.findRotation(lm[12], lm[14]),
    };
    UpperArm.r.y = Vector.angleBetween3DCoords(lm[12], lm[11], lm[13]);
    UpperArm.l.y = Vector.angleBetween3DCoords(lm[11], lm[12], lm[14]);

    const LowerArm = {
        r: Vector.findRotation(lm[13], lm[15]),
        l: Vector.findRotation(lm[14], lm[16]),
    };
    LowerArm.r.y = Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]);
    LowerArm.l.y = Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]);
    LowerArm.r.z = clamp(LowerArm.r.z, -2.14, 0);
    LowerArm.l.z = clamp(LowerArm.l.z, -2.14, 0);
    // LowerArm.r.x = clamp(LowerArm.r.x, -1, 0);
    // LowerArm.l.x = clamp(LowerArm.l.x, -1, 0);

    // const Wrist = {
    //     r: Vector.findRotation(
    //         Vector.fromArray(lm[16]),
    //         Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)
    //     ),
    //     l: Vector.findRotation(
    //         Vector.fromArray(lm[15]),
    //         Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)
    //     ),
    // };

    // Wrist.r.y = Vector.angleBetween3DCoords(lm[14], lm[16], Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5));
    // Wrist.l.y = Vector.angleBetween3DCoords(lm[13], lm[15], Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5));
    // // Wrist.r.z = clamp(Wrist.r.z, -2.14, 0);
    // // Wrist.l.z = clamp(Wrist.l.z, -2.14, 0); // z is wrist movement side to side (abduction/adduction)

    // const Hand = {
    //     r: LowerArm.r.multiply(Wrist.r),
    //     l: LowerArm.l.multiply(Wrist.l)
    // }

    const Hand = {
        r: Vector.findRotation(
            Vector.fromArray(lm[15]),
            Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)
        ),
        l: Vector.findRotation(
            Vector.fromArray(lm[16]),
            Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)
        ),
    };

    // const startRight = new Vector3().subVectors(UpperArm.r, LowerArm.r).normalize()
    // const midRight = new Vector3().subVectors(LowerArm.r, Hand.l).normalize()
    // const parentRightChest = new Vector3().subVectors(lm[12], lm[11]).normalize()

    Hand.r.y = Vector.angleBetween3DCoords(lm[14], lm[16], Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5));
    Hand.l.y = Vector.angleBetween3DCoords(lm[13], lm[15], Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5));
    // Hand.r.x = clamp(Hand.r.x, -PI / 2, 0);
    // Hand.l.x = clamp(Hand.l.x, -PI / 2, 0);

    //Modify Rotations slightly for more natural movement
    const rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    const leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);

    return {
        //Scaled
        UpperArm: {
            r: rightArmRig.UpperArm,
            l: leftArmRig.UpperArm,
        },
        LowerArm: {
            r: rightArmRig.LowerArm,
            l: leftArmRig.LowerArm,
        },
        Hand: {
            r: rightArmRig.Hand,
            l: leftArmRig.Hand,
        },
        //Unscaled
        Unscaled: {
            UpperArm: UpperArm,
            LowerArm: LowerArm,
            Hand: Hand,
        },
    };
};

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperArm : normalized rotation values
 * @param {Object} LowerArm : normalized rotation values
 * @param {Object} Hand : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigArm = (UpperArm: Vector, LowerArm: Vector, Hand: Vector, side: Side = RIGHT) => {
    // Invert modifier based on left vs right side
    const invert = side === RIGHT ? 1 : -1;

    UpperArm.z *= -2.3 * invert;
    //Modify UpperArm rotationY  by LowerArm X and Z rotations
    UpperArm.y *= PI * invert;
    UpperArm.y -= Math.max(LowerArm.x);
    UpperArm.y -= -invert * Math.max(LowerArm.z, 0);
    UpperArm.x -= 0.3 * invert;

    LowerArm.z *= -2.14 * invert;
    LowerArm.y *= 2.14 * invert;
    LowerArm.x *= 2.14 * invert;

    //Clamp values to human limits
    UpperArm.x = clamp(UpperArm.x, -0.5, PI);
    LowerArm.x = clamp(LowerArm.x, -0.3, 0.3);

    Hand.y = clamp(Hand.z * 2, -0.6, 0.6); //side to side
    Hand.z = Hand.z * -2.3 * invert; //up down

    return {
        //Returns Values in Radians for direct 3D usage
        UpperArm: UpperArm,
        LowerArm: LowerArm,
        Hand: Hand,
    };
};