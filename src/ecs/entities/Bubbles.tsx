import { ECS } from '../World';
import { Sphere } from '@react-three/drei';
import { Depth, Fresnel, LayerMaterial } from 'lamina';
import { useEntities } from 'miniplex-react';
import { ForkedECSComponent } from '../components/ForkedECSComponent';

interface BubbleEntityProps {
  position?: [number, number, number]
}

export const Bubbles = ({ position = [0.5, 1.2, 0.3] }: BubbleEntityProps) => {
  const entities = useEntities(ECS.world.with('bubble'));

  return (
    <>
      <ECS.Entities in={entities}>
        {(eBubble) => (
          <ForkedECSComponent name="sceneObject">
            <group {...position}>
              <Sphere castShadow args={[0.07, 8, 8]}>
                <LayerMaterial
                  color={'#ffffff'}
                  lighting={'physical'}
                  transmission={1}
                  roughness={0.1}
                  thickness={2}
                >
                  <Depth
                    near={0.4854}
                    far={0.7661999999999932}
                    origin={[-0.4920000000000004, 0.4250000000000003, 0]}
                    colorA={'#fec5da'}
                    colorB={'#00b8fe'}
                  />
                  <Fresnel
                    color={'#fefefe'}
                    bias={-0.3430000000000002}
                    intensity={3.8999999999999946}
                    power={3.3699999999999903}
                    factor={1.119999999999999}
                    mode={'screen'}
                  />
                </LayerMaterial>
              </Sphere>
            </group>
          </ForkedECSComponent>
        )}
      </ECS.Entities>
    </>
  );
}