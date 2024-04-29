import { IncandescentBulb } from "./lights/IncandescentBulb";
import { SpotlightWithTarget } from "./lights/SpotlightWithTarget";


export default function Lighting() {
    return (
        <>
            <SpotlightWithTarget
                position={[-0.2, 2.32, -3.7]}
                lock={[0, -30, 0]}
            />
            <SpotlightWithTarget
                position={[-1.08, 2.32, -2.8]}
                lock={[0, -30, 0]}
            />
            <SpotlightWithTarget
                position={[1.1, 2.32, -1.5]}
                lock={[0, -30, 0]}
            />
            <SpotlightWithTarget
                position={[-1.09, 2.32, 0.67]}
                lock={[0, -30, 0]}
            />
            <IncandescentBulb position={[-1, 1.8, -2]} bulbPower="25W" />
            <IncandescentBulb position={[0, 1.8, 1]} bulbPower="25W" />
        </>
    )
}