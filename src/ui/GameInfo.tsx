import { Html } from '@react-three/drei'
import { useGameState } from '../ecs/store/GameState'

export default function GameInfo() {
    const gameState = useGameState();
    return (
        <Html position={[-2, 2.2, -2]}>
        <div
          style={{
            backgroundColor: "#ffffff80",
            border: "2px solid",
            borderColor: "#0ED8A5",
            width: "350px",
            height: "250px",
            padding: "10px",
            borderRadius: "5px",
            color: "black",
          }}
        >
          <h2>Game Information</h2>
          <p>Max Right Arm Angle: {gameState.score.maxRightArmAngle.get({noproxy: true})}°</p>
          <p>Max Left Arm Angle: {gameState.score.maxLeftArmAngle.get({noproxy: true})}°</p>
        </div>
      </Html>
    )
}