import React from 'react';

interface GlassmorphismComponentProps {
  text: string;
}

const GlassmorphismComponent: React.FC<GlassmorphismComponentProps> = ({ text }) => {
  return (
    <div className='glass' style={{ margin: '55px' }}>
      <h1 style={{ color: '#ffffff' }}>{text}</h1>
    </div>
  );
};

export default GlassmorphismComponent;