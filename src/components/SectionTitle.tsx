import React from 'react';
import '../css/SetupScreen.css';

interface SectionTitleProps {
  title: string;
  subtitle: string;
  useDefaultStyle: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, useDefaultStyle, className }) => {
  return (
    <div className={`${useDefaultStyle ? 'default-style' : 'alternative-style'} ${className}`}>
      <h3>{title}</h3>
      <h2>{subtitle}</h2>
    </div>
  );
};

export default SectionTitle;
