import { useEffect, useRef, useState } from 'react';
import { h2Play } from '../../../utils/cdn-links/motionGraphics';
import Button from '../../Button';
import TitleSubtitle from '../TitleSubtitle';
import CarouselItem from './CarouselItem';
import { gsap } from 'gsap'
import { getUserBrowser, getUserOS } from '../../../utils/general/devices';

import '../../../css/GameInstructions.css';

interface GameInstructionsProps {
    clickHandler: () => void;
}
let alertTips = false;

export default function GameInstructions({ clickHandler }: GameInstructionsProps) {
    const [currentIndex, setCurrentIndex] = useState(0); // the center card
    const [cards, setCards] = useState(h2Play.slice(0, 3));
    const carouselRef = useRef<HTMLDivElement>(null);
    const [pauseCarousel, setPauseCarousel] = useState(false);

    useEffect(() => {
        if (pauseCarousel) return;
        const automaticScroll = setInterval(() => {
            // because setInterval captures the intial state in a closure variable from it's cb fn,
            // need to make sure we grab prev and not remain stagnant at that one val.
            setCurrentIndex(prev => (prev + 1) % h2Play.length);
        }, 3000);

        return () => clearInterval(automaticScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pauseCarousel]);

    useEffect(() => {
        const element = carouselRef.current;
        if (!element) return;

        const newIndex = (currentIndex + 1) % h2Play.length;
        const lastIndex = newIndex + 1 === h2Play.length ? 0 : newIndex + 1 === h2Play.length + 1 ? newIndex : newIndex + 1;
        const firstIndex = newIndex - 1 >= 0 ? newIndex - 1 : h2Play.length - 1;

        const newCards = [h2Play[firstIndex], h2Play[newIndex], h2Play[lastIndex]];
        setCards(newCards);

        const hoverIn = () => setPauseCarousel(true);
        const hoverOut = () => {
            setPauseCarousel(false);
            setCurrentIndex(prev => (prev + 1) % h2Play.length);
        };

        element.addEventListener('mouseenter', hoverIn);
        element.addEventListener('mouseleave', hoverOut);

        gsap.fromTo(`#card${newCards[0].id}`,
            {
                x: '45%',
                y: '0%'
            },
            {
                x: '100%',
                y: '20%',
                duration: 2,
                ease: 'cubic.out'
            }
        )
        gsap.fromTo(`#card${newCards[1].id}`,
            {
                x: '55%',
                y: '0%'
            },
            {
                x: '-55%',
                y: '0%',
                duration: 2,
                ease: 'cubic.out'
            }
        )
        gsap.fromTo(`#card${newCards[2].id}`,
            {
                x: '-100%',
                y: '20%'
            },
            {
                x: '-45%',
                y: '0%',
                duration: 2,
                ease: 'cubic.out'
            }
        );

        return () => {
            element.removeEventListener('mouseenter', hoverIn);
            element.removeEventListener('mouseleave', hoverOut);
        }

    }, [currentIndex]);

    useEffect(() => {
        if (alertTips) return;
        const browser = getUserBrowser();
        const os = getUserOS();

        if (os === 'MacOS' && browser === 'Chrome') {
            window.alert(
                `For the best experience, turn on hardware acceleration.\n
                Paste the following into the web address bar:\n chrome://settings/?search=graphics+acceleration\n
                Then toggle the option ON, and visit this site again.\n
                Note: this reminder will appear every time.
                `
            )
        } else if (browser === 'Firefox') {
            window.alert(
                `For the best experience, turn on Sound, Video, and Audio.\n
                These options are located as an icon to the left of the web address bar.\n
                Note: this reminder will appear every time.
                `
            )
        } else if (browser === 'Edge') {
            window.alert(
                `For the best experience, turn on hardware acceleration.\n
                Under Settings > System and Performance > Use hardware acceleration when available > Toggle On.\n
                Note: this reminder will appear every time.
                `
            )
        } else if (browser === 'Safari') {
            window.alert(
                `For the best experience, turn on hardware acceleration.\n
                In Safari > Settings > Advanced Settings > check the "Show Develop Menu in Menu Bar"\n
                Under Develop > Experimental Features > check "GPU Process: DOM Rendering"\n
                Note: this reminder will appear every time.
                `
            )
        }
        alertTips = true;
    }, [])

    return (
        <div id="game-instructions-screen">
            <a className="back-dashboard-link" href="https://www.ubiquityvx.com/">
                {'← Back to Dashboard'}
            </a>
            <div className="how-to-play-container">
                <TitleSubtitle
                    className="callout-title h2play-title"
                    accentTitle='Instructions'
                    mainTitle='How to Play'
                />
                <div className="card-carousel" ref={carouselRef}>
                    {cards.map((card) => (
                        <CarouselItem
                            currentIndex={currentIndex}
                            card={card}
                            key={card.id}
                        />
                    ))}
                </div>
            </div>
            <div className="instruction-footer">
                <ul className="instruction-list">
                    <li>Make sure your head, torso, and extended arms are visible in the frame</li>
                    <li>Have a light source in front of you rather than from behind</li>
                    <li>Simplify your surroundings with minimal objects, people, or pets in the background</li>
                </ul>
                <Button content="Ok" onClick={clickHandler} extraClass='wide-button'/>
            </div>
        </div>
    );
}