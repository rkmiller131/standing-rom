import { Vector3 } from 'three';
import { ECS, Entity } from '../World';
import Bubble from '../../DEMO/Bubble';

interface BubbleEntityProps {
    position: Vector3,
    entity: Entity,
    active: boolean
}
const BubbleEntity = ({ position, entity, active }: BubbleEntityProps) => {
    return (
        <ECS.Entity entity={entity}>
            <ECS.Component name="sceneObject">
                <Bubble position={position} active={active}/>
            </ECS.Component>
        </ECS.Entity>
    )
}


export default BubbleEntity;