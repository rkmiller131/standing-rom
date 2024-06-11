import Bubble from '../../DEMO/Bubble';
import { EntityUUID } from '../store/types';

interface BubblesProps {
  bubbles: EntityUUID[]
}
export default function Bubbles({ bubbles }: BubblesProps) {
  return (
    <>
      {bubbles.map((_bubble, i) => <Bubble position={[0.4, 1  + i/4, 0.3]} key={i}/>)}
    </>
  )
}