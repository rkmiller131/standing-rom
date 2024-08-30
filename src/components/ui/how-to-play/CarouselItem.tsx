import { H2PlayCard } from '../../../utils/cdn-links/motionGraphics';
// import { gsap } from 'gsap';

interface CarouselItemProps {
    currentIndex: number;
    card: H2PlayCard;
    itemIndex: number;
}
export default function CarouselItem({ currentIndex, itemIndex, card }: CarouselItemProps) {

    const getTransformStyle = () => {
        if (card.id === currentIndex) {
            return 'translate(100%, 20%)';
        } else if (itemIndex === 1) {
            return 'translate(-55%, 0)';
        } else {
            return 'translate(-45%, 0)';
        }
    }

    // const frontCard = card.id === currentIndex;
    // const leftCard = itemIndex === 1; // second item in the visible cards array -> [center, left, right]

    // const translateFromX = frontCard ? '-55%' : leftCard ? '-45%' : '100%';
    // const translateToX = frontCard ? '100%' : leftCard ? '-55%' : '-45%';
    // const translateFromY = leftCard ? '20%' : '0';
    // const translateToY = frontCard ? '20%' : '0';

    // const translateFromX = frontCard ? -55 : leftCard ? -45 : 100;
    // const translateToX = frontCard ? 100 : leftCard ? -55 : -45;
    // const translateFromY = leftCard ? 20 : 0;
    // const translateToY = frontCard ? 20 : 0;


    const styles = {
        // filter: currentIndex === card.id ? '' : 'blur(10px)',
        opacity: currentIndex === card.id ? 1 : 0.5,
        transform: getTransformStyle(),
    }

    // const frontCard = card.id === currentIndex;
    // const leftCard = itemIndex === 1; // second item in the visible cards array -> [center, left, right]

    // const translateFromX = frontCard ? '-55%' : leftCard ? '-45%' : '100%';
    // const translateToX = frontCard ? '100%' : leftCard ? '-55%' : '-45%';
    // const translateFromY = frontCard || leftCard ? '0%' : '20%';
    // const translateToY = frontCard ? '20%' : '0%';
    // gsap.fromTo(`#card${card.id}`,
    //     {
    //         x: translateFromX,
    //         y: translateFromY
    //     },
    //     {
    //         x: translateToX,
    //         y: translateToY,
    //         duration: 1,
    //         ease: 'power2.out',
    //     }
    // )

    return (
        <div id={`card${card.id}`} className="h2play-card" style={styles}>
            {/* <video>
                <source></source>
            </video> */}
            {`CARD NUMBER ${card.id + 1}`}
        </div>
    );
}

