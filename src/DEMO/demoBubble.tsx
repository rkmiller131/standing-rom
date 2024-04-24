import { VRM } from "@pixiv/three-vrm";
import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Mesh, MeshBasicMaterial, Vector3 } from "three";
import { useGameState } from "../ecs/store/GameState";

interface DemoBubbleProps {
    position: Vector3;
    avatar: React.RefObject<VRM>
}

function checkCollisionWithSphere(landmarkPosition: Vector3, sphere: Mesh) {
    const sphereCenter = new Vector3();
    sphere.getWorldPosition(sphereCenter)
    const radius = sphere.geometry.boundingSphere!.radius || 0.1;
    const distance = landmarkPosition.distanceTo(sphereCenter);
    return distance <= radius;
}

export default function DemoBubble({ position, avatar }: DemoBubbleProps) {
    const sphereRef = useRef<Mesh>();
    const handRef = useRef<Vector3>(new Vector3());
    const gameState = useGameState();

    useFrame(() => {
        if (avatar.current && sphereRef.current && gameState.sceneLoaded) {
            // console.log('~~ in the sphere use frame')
            const rightHandMatrix = avatar.current.humanoid.humanBones.rightHand.node.matrixWorld;
            const rightHandPosition = handRef.current.setFromMatrixPosition(rightHandMatrix);

            if (sphereRef.current!.visible && checkCollisionWithSphere(rightHandPosition, sphereRef.current)) {
                const material = sphereRef.current.material as MeshBasicMaterial;
                material.color.set(0xff0000);
                gameState.score.popped.set(1);
                sphereRef.current!.visible = false;
            }
        }
    })

    const defaultMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
    if (sphereRef.current) {
        sphereRef.current.material = defaultMaterial;
        sphereRef.current.visible = true;
    }

    // args = radius, width, height
    return (
        <Suspense fallback={null}>
            <Sphere ref={sphereRef as React.LegacyRef<Mesh>} args={[0.1, 5, 5]} position={position} />
        </Suspense>
    )
}