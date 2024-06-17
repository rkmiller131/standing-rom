import { Vector3 } from 'three';
import { ECS, Entity } from '../World';
import { ForkedECSComponent } from '../components/ForkedECSComponent';
// import Bubble from '../../DEMO/Bubble';
import Bubble from '../../DEMO/Bubble2';

interface BubbleEntityProps {
    active: boolean,
    position: Vector3,
    entity: Entity
}
const BubbleEntity = ({ active, position, entity }: BubbleEntityProps) => {
    // console.log('position is ', position)
    // console.log('active is ', active)

    return (
        <ECS.Entity entity={entity}>
            <ForkedECSComponent name="sceneObject">
                <Bubble position={position} active={active}/>
            </ForkedECSComponent>
        </ECS.Entity>
    )
}


export default BubbleEntity;