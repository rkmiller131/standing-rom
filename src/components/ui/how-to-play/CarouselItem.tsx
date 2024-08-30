import { useEffect, useRef } from 'react';
import { H2PlayCard } from '../../../utils/cdn-links/motionGraphics';
import { gsap } from 'gsap';

interface CarouselItemProps {
    currentIndex: number;
    card: H2PlayCard;
}
export default function CarouselItem({ currentIndex, card }: CarouselItemProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let element;
        if (currentIndex === card.id) {
            element = elementRef.current;
        }
        if (!element) return;

        const animateHoverIn = () => {
            gsap.to(element.querySelector('.instructional-video'), {
                scale: 1.4,
                y: '-20%',
                duration: 0.5,
            });
        }

        const animateHoverOut = () => {
            gsap.to(element.querySelector('.instructional-video'), {
                scale: 1,
                y: '0%',
                duration: 0.5,
            });
        }

        element.addEventListener('mouseenter', animateHoverIn);
        element.addEventListener('mouseleave', animateHoverOut);

        return () => {
            element.removeEventListener('mouseenter', animateHoverIn);
            element.removeEventListener('mouseleave', animateHoverOut);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex])

    const styles = {
        filter: currentIndex === card.id ? '' : 'blur(10px)',
        opacity: currentIndex === card.id ? 1 : 0.5,
        zIndex: currentIndex === card.id ? 1 : 0
    }

    return (
        <div id={`card${card.id}`} className="h2play-card" style={styles} ref={elementRef}>
            <video autoPlay loop muted className="instructional-video">
                <source src={'/SHOULDER_FLEXION.webm'} />
            </video>
        </div>
    );
}

