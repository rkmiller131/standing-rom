import { H2PlayCard } from '../../../utils/cdn-links/motionGraphics';

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

    console.log(getTransformStyle())

    const styles = {
        // filter: currentIndex === card.id ? '' : 'blur(10px)',
        // opacity: currentIndex === card.id ? 1 : 0.5,
        transform: getTransformStyle()
    }

    return (
        <div className="h2play-card" style={styles}>
            {/* <video>
                <source></source>
            </video> */}
            {`CARD NUMBER ${card.id}`}
        </div>
    );
}

