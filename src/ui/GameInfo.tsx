import { Html } from "@react-three/drei";

export default function GameInfo() {
    return (
        <Html position={[-3, 2.2, -2]}>
        <div
          style={{
            backgroundColor: "#ffffff80",
            border: "2px solid",
            borderColor: "turquoise",
            width: "350px",
            height: "250px",
            padding: "10px",
            borderRadius: "5px",
            color: "black",
          }}
        >
          <h2>Game Information</h2>
          <p>Right Arm Angle: {right}°</p>
          <p>Left Arm Angle: {left}°</p>
        </div>
      </Html>
    )
}