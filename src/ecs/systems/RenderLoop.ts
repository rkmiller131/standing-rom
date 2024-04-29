import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Clock } from 'three'
import { useGameState } from '../store/GameState'
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles'
import { VRM } from '../../THREE_Interface'

interface RenderLoopProps {
    avatar: React.RefObject<VRM>
}

export default function RenderLoop({ avatar }: RenderLoopProps) {
    const clock = useRef(new Clock());
    const gameState = useGameState();

    useFrame(() => {
        const elapsedTime = clock.current.getElapsedTime();

        if (elapsedTime >= 0.5) {

            // currently starts checking when avatar is in T pose - add an extra && for when game start happens
            if (gameState.sceneLoaded && avatar.current) {
                const { leftArmAngle, rightArmAngle } = calculateArmAngles(avatar);
                const maxLeftArmAngle = gameState.score.maxLeftArmAngle.get({ noproxy: true });
                const maxRightArmAngle = gameState.score.maxRightArmAngle.get({ noproxy: true });

                if (leftArmAngle > maxLeftArmAngle && (leftArmAngle <= 180 && leftArmAngle >= 0)) {
                    gameState.score.maxLeftArmAngle.set(leftArmAngle);
                }

                if (rightArmAngle > maxRightArmAngle && (rightArmAngle <= 180 && rightArmAngle >= 0)) {
                    gameState.score.maxRightArmAngle.set(rightArmAngle);
                }
            }

            // resetting the clock after all frames per second have been executed
            clock.current.start();
        }

        // console.log('~~ executing once per FRAME')
        // import other functions here related to the ecs queries
        // import other functions here related to the WebGPU renderer
    });

    return null;
}
