import { Vector3 } from 'three';
import Bubble from '../../DEMO/Bubble2';

interface BubbleEntityProps {
    active: boolean,
    position: Vector3,
    // entity: Entity
}
const BubbleEntity = ({ active, position }: BubbleEntityProps) => {

    // return (
    //     <ECS.Entity entity={entity}>
    //         <ECS.Component name="sceneObject">
    //             <Bubble position={position} active={active}/>
    //         </ECS.Component>
    //     </ECS.Entity>
    // )
    return (
        <Bubble position={position} active={active} />
    )
}


export default BubbleEntity;