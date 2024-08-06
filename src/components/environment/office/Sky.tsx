import { useVideoTexture } from '@react-three/drei';
import { officeWindowBG } from '../../../utils/cdn-links/environmentAssets';

const video = officeWindowBG;

export default function Sky() {
  const texture = useVideoTexture(video);
  return (
    <mesh position={[6, 0.5, -8.5]}>
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
