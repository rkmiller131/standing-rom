import { useEffect, useState } from 'react';
import { h2Play } from '../../../utils/cdn-links/motionGraphics';
import Button from '../../Button';
import TitleSubtitle from '../TitleSubtitle';
import CarouselItem from './CarouselItem';
import { gsap } from 'gsap'

import '../../../css/GameInstructions.css';

interface GameInstructionsProps {
    clickHandler: () => void;
}

export default function GameInstructions({ clickHandler }: GameInstructionsProps) {
    const [currentIndex, setCurrentIndex] = useState(0); // the center card
    const [cards, setCards] = useState(h2Play.slice(0, 3));

    // useEffect(() => {
    //     const newIndex = (currentIndex + 1) % h2Play.length;
    //     const lastIndex = newIndex + 1 === h2Play.length ? 0 : newIndex + 1 === h2Play.length + 1 ? newIndex : newIndex + 1;
    //     const firstIndex = newIndex - 1 >= 0 ? newIndex - 1 : h2Play.length - 1;

    //     const newCards = [h2Play[firstIndex], h2Play[newIndex], h2Play[lastIndex]];
    //     setCards(newCards);

    // }, [currentIndex])

    useEffect(() => {
        const automaticScroll = setInterval(() => {
            // because setInterval captures the intial state in a closure variable from it's cb fn,
            // need to make sure we grab prev and not remain stagnant at that one val.
            setCurrentIndex(prev => (prev + 1) % h2Play.length);
        }, 3000);

        return () => clearInterval(automaticScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const newIndex = (currentIndex + 1) % h2Play.length;
        const lastIndex = newIndex + 1 === h2Play.length ? 0 : newIndex + 1 === h2Play.length + 1 ? newIndex : newIndex + 1;
        const firstIndex = newIndex - 1 >= 0 ? newIndex - 1 : h2Play.length - 1;

        const newCards = [h2Play[firstIndex], h2Play[newIndex], h2Play[lastIndex]];
        setCards(newCards);

        gsap.fromTo(`#card${newCards[0].id}`,
            {
                x: '45%',
                y: '0%'
            },
            {
                x: '100%',
                y: '20%',
                duration: 1,
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
                duration: 1,
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
                duration: 1,
                ease: 'cubic.out'
            }
        );

    }, [currentIndex]);

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
                <div className="card-carousel">
                    {cards.map((card, index) => (
                        <CarouselItem
                            currentIndex={currentIndex}
                            itemIndex={index}
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