import { Vector3 } from 'three';
import { ECS, Entity } from '../World';
import Bubble from '../../DEMO/Bubble2';

interface BubbleEntityProps {
    active: boolean,
    position: Vector3,
    entity: Entity
}
const BubbleEntity = ({ active, position, entity }: BubbleEntityProps) => {
    console.log('~~ Bubble entity has rerendered ECS.Entity')

    return (
        <ECS.Entity entity={entity}>
            <ECS.Component name="sceneObject">
                <Bubble position={position} active={active}/>
            </ECS.Component>
        </ECS.Entity>
    )
}


export default BubbleEntity;