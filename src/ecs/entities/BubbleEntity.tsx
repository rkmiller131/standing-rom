import { Vector3 } from 'three';
import { ECS, Entity } from '../World';
import BubbleComponent from '../../components/bubble/BubbleComponent';
import { RefObject } from 'react';
import { PublicApi } from '@react-three/cannon';

interface BubbleEntityProps {
    position: Vector3,
    entity: Entity,
    active: boolean,
    colliderRef: RefObject<PublicApi>
}
const BubbleEntity = ({ position, entity, active, colliderRef }: BubbleEntityProps) => {
    return (
        <ECS.Entity entity={entity}>
            <ECS.Component name="sceneObject">
                <BubbleComponent position={position} active={active} colliderRef={colliderRef}/>
            </ECS.Component>
        </ECS.Entity>
    )
}

export default BubbleEntity;