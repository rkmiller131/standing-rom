import { Vector3 } from 'three';

export type BubbleComponent = {
    bubble: {
        age: number;
        spawnPosition: Vector3;
        active: boolean;
    }
}