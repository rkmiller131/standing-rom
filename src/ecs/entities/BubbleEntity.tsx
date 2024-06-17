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
    const arrPos: [number, number, number] = [position.x, position.y, position.z]
    // console.log('position is ', position)
    // console.log('active is ', active)

    return (
        <ECS.Entity entity={entity}>
            <ForkedECSComponent name="sceneObject">
                <Bubble position={arrPos} />
            </ForkedECSComponent>
        </ECS.Entity>
    )
}


export default BubbleEntity;