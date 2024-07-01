import { Vector3 } from 'three';
import { ECS, Entity } from '../World';
import Bubble from '../../DEMO/Bubble';

interface BubbleEntityProps {
    active: boolean,
    position: Vector3,
    entity: Entity
}
const BubbleEntity = ({ active, position, entity }: BubbleEntityProps) => {
    return (
        <ECS.Entity entity={entity}>
            <ECS.Component name="sceneObject">
                <Bubble position={position} active={active}/>
            </ECS.Component>
        </ECS.Entity>
    )
}


export default BubbleEntity;