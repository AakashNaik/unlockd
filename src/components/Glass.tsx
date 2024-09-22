import React from 'react';
import styles from '../Glass.module.css'; // Assuming you have a CSS module for this component

interface GlassmorphismComponentProps {
  text: string;
  className?: string;
}

const GlassmorphismComponent: React.FC<GlassmorphismComponentProps> = ({ text, className }) => {
  return (
    <div className={`glass ${styles.glassCard} ${styles.whiteText} ${className || ''}`}>
      {text}
    </div>
  );
};

export default GlassmorphismComponent;