import { Vector3 } from 'three';
import { ECS, Entity } from '../World';
import BubbleComponent from '../../components/bubble/BubbleComponent';

interface BubbleEntityProps {
    position: Vector3,
    entity: Entity,
    playParticles: (position: [number, number, number]) => void;
}

const BubbleEntity = ({ position, entity, playParticles }: BubbleEntityProps) => {
    return (
        <ECS.Entity entity={entity}>
            <ECS.Component name="sceneObject">
                <BubbleComponent position={position} playParticles={playParticles}/>
            </ECS.Component>
        </ECS.Entity>
    )
}

export default BubbleEntity;