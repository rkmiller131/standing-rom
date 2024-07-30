import Vector from './utils/vector'
import { clamp, dotBetween2BodySegments } from './utils/helpers'
import { Results, Side } from './Types'
import { RIGHT, LEFT, PI } from './constants'

/**
 * Calculates arm rotation as euler angles
 * @param {Array} lm : array of 3D pose vectors from mediapipe
 */
export const calcArms = (lm: Results) => {
    //Pure Rotation Calculations - returns a rotation vector needed to align the 
    // first point with the second. This rotation can then be applied to an 
    // object to reorient it according to the calculated angle (normalized)
    const UpperArm = {
        r: Vector.findRotation(lm[11], lm[13]),
        l: Vector.findRotation(lm[12], lm[14]),
    };
    // sets y to the dot product between opposite shoulder and end of upper arm.
    // imagine 2 segments: left shoulder to right shoulder and right shoulder to elbow.
    // In T pose, the dot product between those two should be 1 for y, 0 (perpendicular) for hands at sides/over head
    // UpperArm.r.y = Vector.angleBetween3DCoords(lm[12], lm[11], lm[13]);
    // UpperArm.r.z = Vector.angleBetween3DCoords(lm[11], lm[13], lm[23]);
    UpperArm.r.y = dotBetween2BodySegments(lm[12], lm[11], lm[11], lm[13]);
    // const dot = dotBetween2BodySegments(lm[11], lm[13], lm[11], lm[23]);
    // console.log('the dot product was ', dot)
    // UpperArm.r.z = dot;
    // UpperArm.r.z = Vector.angleBetween3DCoords(lm[23], lm[11], lm[13]);
    UpperArm.l.y = Vector.angleBetween3DCoords(lm[11], lm[12], lm[14]);

    const LowerArm = {
        r: Vector.findRotation(lm[13], lm[15]),
        l: Vector.findRotation(lm[14], lm[16]),
    };
    LowerArm.r.y = Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]);
    LowerArm.l.y = Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]);
    LowerArm.r.z = clamp(LowerArm.r.z, -2.14, 0.1);
    LowerArm.l.z = clamp(LowerArm.l.z, -2.14, 0.1);
    // LowerArm.r.x = clamp(LowerArm.r.x, -1, 0);
    // LowerArm.l.x = clamp(LowerArm.l.x, -1, 0);

    const Hand = {
        r: Vector.findRotation(
            Vector.fromArray(lm[16]),
            Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)
        ),
        l: Vector.findRotation(
            Vector.fromArray(lm[15]),
            Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)
        ),
    };

    // Wrist.r.y = Vector.angleBetween3DCoords(lm[14], lm[16], Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5));
    // Wrist.l.y = Vector.angleBetween3DCoords(lm[13], lm[15], Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5));
    // Wrist.r.z = clamp(Wrist.r.z, -2.14, 0);
    // Wrist.l.z = clamp(Wrist.l.z, -2.14, 0); // z is wrist movement side to side (abduction/adduction)

    // const Hand = {
    //     r: LowerArm.r.multiply(Wrist.r),
    //     l: LowerArm.l.multiply(Wrist.l)
    // }

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

    //            -2.3
    UpperArm.z *= -2.5 * invert;
    // UpperArm.z *= PI * invert;
    // UpperArm.z -= Math.min(LowerArm.z, 0); // might need to be the shoulder to hip point
    // UpperArm.z -= -invert * Math.max(LowerArm.x, 0); // might need to be x?

    //Modify UpperArm rotationY as influenced by  position of lowerarm and hand vectors
    UpperArm.y *= PI * invert; // flip on y axis (upside down)
    UpperArm.y -= Math.max(LowerArm.x, 0); // align upper arm's y rotation with position of  lower arm along x axis
    UpperArm.y -= -invert * Math.max(LowerArm.z, 0);
    UpperArm.x -= 0.2 * invert; // 0.3

    LowerArm.z *= -2.14 * invert;
    LowerArm.y *= 2.5 * invert; // 2.14
    LowerArm.x *= 2.5 * invert; // 2.14

    //Clamp values to human limits
    UpperArm.x = clamp(UpperArm.x, -0.5, PI);
    LowerArm.x = clamp(LowerArm.x, -0.3, 0.3);

    Hand.y = clamp(Hand.z * 2, -0.5, 0.5); //side to side 
    Hand.z = Hand.z * -2.6 * invert; //up down

    return {
        //Returns Values in Radians for direct 3D usage
        UpperArm: UpperArm,
        LowerArm: LowerArm,
        Hand: Hand,
    };
};