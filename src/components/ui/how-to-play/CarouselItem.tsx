import { H2PlayCard } from '../../../utils/cdn-links/motionGraphics';

interface CarouselItemProps {
    currentIndex: number;
    card: H2PlayCard;
    itemIndex: number;
}
export default function CarouselItem({ currentIndex, itemIndex, card }: CarouselItemProps) {
    console.log(itemIndex)
    const styles = {
        filter: currentIndex === card.id ? '' : 'blur(10px)',
        // transform: currentIndex === card.id ? 'translateY(15%)' : currentIndex > card.id ? 
    }

    // const getTransformStyle = () => {
    //     if (itemIndex === currentIndex) {
    //         return { transform: 'translate(100%, 20%)' };
    //     } else if (itemIndex === currentIndex - 1) {
    //         return { transform: 'translate(-55%, 0)' };
    //     } else if (itemIndex === currentIndex + 1) {
    //         return { transform: 'translate(-45%, 0)' };
    //     } else {
    //         return { transform: `translateX(${(currentIndex - card.id) * 50}%)` }
    //     }
    // }

    return (
        <div className="h2play-card" style={styles}>
            <video>
                <source></source>
            </video>
        </div>
    );
}

