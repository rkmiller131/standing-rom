// import { VRM } from "@pixiv/three-vrm";
// import { Sphere } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { RigidBody } from "@react-three/rapier";
// import { useRef } from "react";
// import { Vector3 } from "three";

// interface RightHandColliderProps {
//     avatar: React.RefObject<VRM>
// }
// export default function RightHandCollider({ avatar }: RightHandColliderProps) {
//     const rightHandInitial = useRef(new Vector3()); 

//     useFrame(() => {
//         // every frame calculate the world position of the right hand
//         // update local position state of the collider
//         if (!avatar.current) return;
//         const rightHandWorld = avatar.current!.humanoid.humanBones.rightHand.node.matrixWorld;
//         rightHandInitial.current.setFromMatrixPosition(rightHandWorld);
//         // console.log('~~ seeing the vrm pos ', rightHandVector);
//     })

//     return (
//         <RigidBody position={position} colliders="ball">
//             <Sphere args={[0.1, 5, 5]}/>
//         </RigidBody>
//     )
// }