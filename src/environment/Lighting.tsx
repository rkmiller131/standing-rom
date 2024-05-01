import { useVideoTexture } from "@react-three/drei";
import { IncandescentBulb } from "./lights/IncandescentBulb";
import { SpotlightWithTarget } from "./lights/SpotlightWithTarget";

export default function Lighting() {
  const texture = useVideoTexture("./sun2.mp4");
  return (
    <>
      <SpotlightWithTarget position={[-0.2, 2.4, -3.7]} lock={[0, -30, 0]} />
      <SpotlightWithTarget position={[-1.08, 2.4, -2.8]} lock={[0, -30, 0]} />
      <SpotlightWithTarget position={[1.1, 2.4, -1.5]} lock={[0, -30, 0]} />
      <SpotlightWithTarget position={[-1.09, 2.4, 0.67]} lock={[0, -30, 0]} />
      <IncandescentBulb position={[-1, 1.3, -2]} bulbPower="6W" />
      <IncandescentBulb position={[0, 1.3, 1]} bulbPower="6W" />
      <mesh position={[5, 0.5, -8.5]} rotation={[0, -Math.PI / 2.3, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </>
  );
}
