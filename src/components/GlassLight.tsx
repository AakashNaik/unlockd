import React from 'react';

interface GlassLightComponentProps {
  text: string;
  width?: string;
  height?: string;
}

const GlassLightComponent: React.FC<GlassLightComponentProps> = ({ 
  text, 
  width = '100%', 
  height = '80px' 
}) => {
  return (
    <div 
      className="glass-light" 
      style={{ 
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <h3 style={{ color: '#000000', marginBottom: '10px' }}>{text}</h3>
      <div 
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(30deg)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default GlassLightComponent;