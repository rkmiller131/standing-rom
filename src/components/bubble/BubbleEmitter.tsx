import { useThree } from '@react-three/fiber';
import { useGameState } from '../../hookstate-store/GameState';

export default function BubbleEmitter(delta: Number) {
  const { scene } = useThree();
  const gameState = useGameState();
  const bubble = gameState.level[0].get({noproxy: true});


}