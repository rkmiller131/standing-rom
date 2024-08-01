import { IncandescentBulb } from './IncandescentBulb';
import { SpotlightWithTarget } from './SpotlightWithTarget';

export default function Lights() {
  return (
    <>
      <SpotlightWithTarget position={[-0.2, 2.4, -3.7]} lock={[0, -30, 0]} />
      <SpotlightWithTarget position={[-1.08, 2.4, -2.8]} lock={[0, -30, 0]} />
      <SpotlightWithTarget position={[1.1, 2.4, -1.5]} lock={[0, -30, 0]} />
      <SpotlightWithTarget position={[-1.09, 2.4, 0.67]} lock={[0, -30, 0]} />
      <IncandescentBulb position={[-1, 1.3, -2]} bulbPower="6W" />
      <IncandescentBulb position={[0, 1.3, 1]} bulbPower="6W" />
      {/* Back Room Light */}
      <IncandescentBulb position={[0, 1.3, 2.7]} bulbPower="6W" />
      {/* Lighting the Character */}
      <IncandescentBulb position={[0, 1.5, -0.75]} bulbPower="4W" />
    </>
  );
}
