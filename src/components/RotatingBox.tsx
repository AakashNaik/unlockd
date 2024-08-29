import  { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CubeProps {
  position: [number, number, number];
  text: string;
}

interface MainProps {
  text: string;
  customStyle?: React.CSSProperties;
}

function Box({ position, text }: CubeProps) {
  const ref = useRef<THREE.Mesh>(null!);
  
  // Decrease rotation speed
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // Reduced from 1 to 0.3
    }
  });

  const textProps = {
    fontSize: 0.5,
    color: 'black',
    anchorX: 'center' as 'center',
    anchorY: 'middle' as 'middle',
    font: '/path/to/your/font.ttf', // Add a custom font for better aesthetics
    fontWeight: 'bold',
    letterSpacing: 0.05,
  };

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={[4, 4, 4]} />
      <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} emissive="#ffffff" emissiveIntensity={0.2} />
      
      {/* Update all Text components */}
      <Text {...textProps} position={[0, 0, 2.01]} rotation={[0, 0, 0]}>{text}</Text>
      <Text {...textProps} position={[0, 0, -2.01]} rotation={[0, Math.PI, 0]}>{text}</Text>
      <Text {...textProps} position={[-2.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>{text}</Text>
      <Text {...textProps} position={[2.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>{text}</Text>
      <Text {...textProps} position={[0, 2.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>{text}</Text>
      <Text {...textProps} position={[0, -2.01, 0]} rotation={[Math.PI / 2, 0, 0]}>{text}</Text>
    </mesh>
  );
}

interface MainProps {
  text: string;
  customStyle?: React.CSSProperties;
}

const Cube: React.FC<MainProps> = ({ text, customStyle }) => {
  return (
    <div style={{ ...defaultStyle, ...customStyle }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={8} /> {/* Increased intensity */}
        <directionalLight position={[0, 0, -2]} intensity={15} /> {/* Added front light */}
        <Box position={[0, 0, 0]} text={text} />
        <OrbitControls enableZoom={false} enablePan={true} />
      </Canvas>
    </div>
  );
};

const defaultStyle: React.CSSProperties = {
  width: '100px',
  height: '100px',
  // ... other default styles
};

export default Cube;


