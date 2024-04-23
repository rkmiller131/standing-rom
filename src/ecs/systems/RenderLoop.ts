import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Clock } from "three";
import { useGameState } from "../store/GameState";

export default function RenderLoop() {
    const clock = useRef(new Clock());
    const gameState = useGameState();

    useFrame(() => {
        const elapsedTime = clock.current.getElapsedTime();

        if (elapsedTime >= 1) {
            // have a function in here that pulls from game state and compares the calculated arm angles
            // updates arm angles in state live if the max is reached
            // then somewhere else the component will just pull from that state and render the max that it receives
            if (gameState.sceneLoaded) {
                console.log('~~ SCENE HAS LOADED 1x per sec')
            }

            // resetting the clock after all frames per second have been executed
            clock.current.start();
        }

        console.log('~~ executing once per FRAME')
        // import other functions here related to the ecs queries
        // import other functions here related to the WebGPU renderer
    });

    return null;
}