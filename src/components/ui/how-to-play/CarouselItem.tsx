import { H2PlayCard } from '../../../utils/cdn-links/motionGraphics';
// import { gsap } from 'gsap';

interface CarouselItemProps {
    currentIndex: number;
    card: H2PlayCard;
}
export default function CarouselItem({ currentIndex, card }: CarouselItemProps) {

    const styles = {
        filter: currentIndex === card.id ? '' : 'blur(5px)',
        opacity: currentIndex === card.id ? 1 : 0.5,
        zIndex: currentIndex === card.id ? 1 : 0
    }

    return (
        <div id={`card${card.id}`} className="h2play-card" style={styles}>
            <video autoPlay loop muted className="instructional-video">
                <source src={'/SHOULDER_FLEXION.webm'} />
            </video>
            {/* {`CARD NUMBER ${card.id + 1}`} */}
        </div>
    );
}

