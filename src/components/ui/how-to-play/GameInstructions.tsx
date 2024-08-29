import { useEffect, useState } from 'react';
import { h2Play } from '../../../utils/cdn-links/motionGraphics';
import Button from '../../Button';
import TitleSubtitle from '../TitleSubtitle';

import '../../../css/GameInstructions.css';
import CarouselItem from './CarouselItem';
interface GameInstructionsProps {
    clickHandler: () => void;
}
export default function GameInstructions({ clickHandler }: GameInstructionsProps) {
    const [currentIndex, setCurrentIndex] = useState(0); // the center card
    const [cards, setCards] = useState(h2Play.slice(0, 3));

    // If ever in the future there are more than 3 how to play graphics, this will keep only 3 at a time visible.
    const shiftVisibleCards = () => {
        setCurrentIndex((prev) => {
            const newIndex = (prev + 1) % h2Play.length;
            setCards(h2Play.slice(newIndex - 1, newIndex + 1))
            return newIndex;
        })
    }

    const scrollCarousel = () => {
        shiftVisibleCards();
        console.log('cards are ', cards)
        // if (currentIndex === h2Play.length) {
        //     return setCurrentIndex(0);
        // }
        // return setCurrentIndex(currentIndex + 1);
    }

    useEffect(() => {
        const automaticScroll = setInterval(() => {
            console.log('cards before next scroll: ', cards)
            scrollCarousel();
        }, 3000);

        return () => clearInterval(automaticScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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