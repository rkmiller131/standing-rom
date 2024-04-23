import { RigidBody, interactionGroups, useRapier } from "@react-three/rapier";
import React, { useRef, useState } from "react";

export function Bubble({ position = [0.6, 0.8, 0] }) {
  const [color, setColor] = useState("green"); // Default color
  const { world } = useRapier();

  const first = useRef(null);

  return (
    <RigidBody
      type="fixed"
      ref={first}
      onCollisionEnter={() => setColor("red")}
      onCollisionExit={() => setColor("green")}
      userData={{ id: "bubble" }}
      colliders="ball"
      collisionGroups={interactionGroups(2)}
    >
      <mesh scale={[2.7, 2.7, 2.7]} position={position}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}

// function CircleOfBubbles({ numBubbles, circleRadius }) {
//   const angle = (2 * Math.PI) / numBubbles;
//   return (
//     <mesh position={[0, 1, 0]} rotation={[1.5, 0, 0]}>
//       {Array.from({ length: numBubbles }).map((_, index) => {
//         const x = circleRadius * Math.cos(index * angle);
//         const z = circleRadius * Math.sin(index * angle);
//         const position = [x, 0, z];
//         return <Bubble key={index} position={position} />;
//       })}
//     </mesh>
//   );
// }

// export default CircleOfBubbles;
