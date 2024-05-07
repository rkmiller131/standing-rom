import { Html } from "@react-three/drei";
import { useGameState } from "../ecs/store/GameState";
import { useEffect, useState } from "react";

export default function GameInfo() {
  const gameState = useGameState();
  const [gameInfo, setGameInfo] = useState({
    maxRightArmAngle: 0,
    maxLeftArmAngle: 0,
    popped: 0,
  });
  const [isPhone, setIsPhone] = useState(false);

  const checkIfPhone = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  };

  useEffect(() => {
    setIsPhone(checkIfPhone());
    const handleResize = () => {
      setIsPhone(checkIfPhone());
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    if (gameState.sceneLoaded.get({ noproxy: true })) {
      setGameInfo({
        maxRightArmAngle: gameState.score.maxRightArmAngle.get({
          noproxy: true,
        }),
        maxLeftArmAngle: gameState.score.maxLeftArmAngle.get({ noproxy: true }),
        popped: gameState.score.popped.get({ noproxy: true }),
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gameState.score, gameState.sceneLoaded]);

  return (
    <Html position={[0, -0.5, -2]}>
      <div className="info-container">
        <div
          style={{
            background: "white",
            borderRadius: "50px",
            padding: "5px 17px",
          }}
        >
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "relative", top: "4px" }}
          >
            <circle cx="10.8771" cy="10.7873" r="10.7873" fill="#0ED8A5" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.9605 22.2988C15.5719 25.7586 18.5933 28.3865 22.2284 28.3865C26.3047 28.3865 29.6092 25.082 29.6092 21.0058C29.6092 17.0748 26.5361 13.8615 22.6612 13.6375C21.9953 17.7999 18.9481 21.1674 14.9605 22.2988Z"
              fill="#0ED8A5"
              fill-opacity="0.51"
            />
          </svg>
        </div>
        {gameInfo.popped}/1
      </div>
    </Html>
  );
}
