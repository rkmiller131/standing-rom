import React from 'react';
import '../css/SetupScreen.css';

interface SectionTitleProps {
    title: string;
    subtitle: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
    return (
        <div className="section-title">
            <h3>{title}</h3>
            <h2>{subtitle}</h2>
        </div>
    );
};

export default SectionTitle;
