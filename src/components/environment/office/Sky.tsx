import { useVideoTexture } from '@react-three/drei';

const video =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/officeWindowBg.mp4?v=1714683917649';

export default function Sky() {
  const texture = useVideoTexture(video);
  return (
    <mesh position={[6, 0.5, -8.5]}>
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
