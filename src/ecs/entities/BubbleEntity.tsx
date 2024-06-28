import { Vector3 } from 'three';
import Bubble from '../../DEMO/Bubble2';

interface BubbleEntityProps {
    active: boolean,
    position: Vector3
}
const BubbleEntity = ({ active, position }: BubbleEntityProps) => {
    return (
        <Bubble position={position} active={active} />
    )
}


export default BubbleEntity;