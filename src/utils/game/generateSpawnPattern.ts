import { Vector3 } from 'three';

export default function generateSpawnPattern(numTargets: number) {
    const level = [];

    for (let i = 0; i < numTargets; i++) {
        const randomSide = Math.random();
        const side = randomSide > 0.5 ? 'right' : 'left';
        // right side is between 0 and 1; left side between -1 and 0
        const posX = side === 'right'? Math.random() : Math.random() * 2 - 1;
        const spawnPos = new Vector3(posX, 1, -4.5);

        const bubbleEntity = {
            age: 0,
            spawnPosition: spawnPos,
            active: false
        }

        level.push(bubbleEntity);
    }
}