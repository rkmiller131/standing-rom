import { gsap } from 'gsap';
import { useEffect } from 'react';
import { useSceneState } from '../ecs/store/SceneState';
import SectionTitle from "../components/SectionTitle";


let mounted = false;

export default function SlidingInfo() {
    const sceneState = useSceneState();
    const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });

    useEffect(() => {
        if (!mounted) {
            gsap.fromTo('#sliding-info-container',
                {
                    transform: 'translateX(-200%)',
                    width: '0%',
                    autoAlpha: 0
                },
                {
                    duration: 1,
                    transform: 'translateX(0)',
                    width: '40%',
                    minWidth: 'calc(4% + 450px)',
                    autoAlpha: 1
                }
            )
            mounted = true;
        }

        if (sceneLoaded) {
            gsap.fromTo('#sliding-info',
                {
                    transform: 'translateX(0)',
                    width: '40%',
                    minWidth: 'calc(4% + 450px)',
                    autoAlpha: 1
                },
                {
                    transform: 'translateX(-200%)',
                    width: '0%',
                    autoAlpha: 0,
                    duration: 3
                }
            )
        }
    }, [sceneLoaded])

    return (
        <div id="sliding-info">
            <video className="background-video-mocap" autoPlay loop muted>
                <source src="/Slider.webm" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div id="sliding-info-container">
                <img className="logo" style={{marginLeft: '10px'}} src="/UVX-LogoWhite.png" alt="UVX Logo"/>

                <div className="sliding-info-content">
                    <SectionTitle
                        title="Welcome to"
                        subtitle="Shoulder ROM"
                        useDefaultStyle={false}
                        className="section-title"
                    />
                    <p className="sliding-info-instructions">Here is a paragraph description of how to play the game.
                        Pop all the bubbles with good form! And something scientific related to the exercises document
                        for starting position, movement, etc.</p>
                </div>
            </div>
        </div>
    )
}
