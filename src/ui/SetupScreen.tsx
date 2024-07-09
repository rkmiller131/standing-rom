import { useState, useCallback } from 'react';
import { useSceneState } from '../ecs/store/SceneState';
import '../css/SetupScreen.css';
import SectionTitle from "../components/SectionTitle";
import EnvironmentOption from "../components/EnvironmentOption";

export default function SetupScreen() {
    const sceneState = useSceneState();
    const [submitted, setSubmitted] = useState(false);
    const [selected, setSelected] = useState<'Outdoors' | 'Indoor Office' | ''>('');

    const handleSelection = useCallback(
        (environment: 'Outdoors' | 'Indoor Office') => {
            sceneState.selectedEnvironment.set(environment);
            setSelected(environment);
            setSubmitted(true);
        },
        [sceneState],
    );

    if (submitted) return null;

    return (
        <div id="setup">
            <video className="background-video" autoPlay loop muted>
                <source src="/BackgroundVid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <SectionTitle title="Choose your" subtitle="Environment" />
            <div className="environment-selection">
                <EnvironmentOption
                    imageSrc="public/EnviormentImages/OutdoorEnviorment/outfoorEnv.png"
                    name="Outdoors"
                    selected={selected === 'Outdoors'}
                    onSelect={() => handleSelection('Outdoors')}
                />
                <EnvironmentOption
                    imageSrc="public/EnviormentImages/IndoorEnviorment/indoorEnv.png"
                    name="Indoor Office"
                    selected={selected === 'Indoor Office'}
                    onSelect={() => handleSelection('Indoor Office')}
                />
            </div>
        </div>
    );
}
