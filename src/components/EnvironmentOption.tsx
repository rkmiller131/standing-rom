import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../css/SetupScreen.css';

interface EnvironmentOptionProps {
    imageSrc: string;
    name: string;
    selected: boolean;
    onSelect: () => void;
}

const EnvironmentOption: React.FC<EnvironmentOptionProps> = ({ imageSrc, name, selected, onSelect }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent) => {
        const element = elementRef.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        gsap.to(element.querySelector('.parallax-bg'), {
            x: (x - rect.width / 2) / 20,
            y: (y - rect.height / 2) / 20,
            duration: 0.5,
            ease: 'power3.out'
        });
    };

    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        gsap.set(element.querySelector(".hover-text"), { autoAlpha: 0, x: -200 });

        const animateHoverIn = () => {
            gsap.to(element.querySelector('.hover-text'), { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' });
        };

        const animateHoverOut = () => {
            gsap.to(element.querySelector('.hover-text'), { autoAlpha: 0, x: -200, duration: 0.5, ease: 'power3.out' });
            gsap.to(element.querySelector('.parallax-bg'), { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
        };

        element.addEventListener("mouseenter", animateHoverIn);
        element.addEventListener("mouseleave", animateHoverOut);
        element.addEventListener("mousemove", handleMouseMove);

        return () => {
            element.removeEventListener("mouseenter", animateHoverIn);
            element.removeEventListener("mouseleave", animateHoverOut);
            element.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`environment-option ${selected ? 'selected' : ''}`}
            onClick={onSelect}
            style={{ backgroundImage: `url(${imageSrc})` }}
        >
            <div className="parallax-bg" style={{ backgroundImage: `url(${imageSrc})` }}></div>
            <div className="hover-text">{name}</div>
        </div>
    );
};

export default EnvironmentOption;
