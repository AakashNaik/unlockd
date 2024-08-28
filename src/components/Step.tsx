import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface StepProps {
  position: [number, number, number];
  text: string;
}

function Step({ position, text }: StepProps) {
  return (
    <group position={position}>
      {/* Horizontal part (step) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[30, 5, 30]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Vertical part (riser) */}
      <mesh position={[0, -12.5, -15]}>
        <boxGeometry args={[30, 25, 1]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <Text
        position={[0, -12, -14.5]}
        rotation={[0, 0, 0]}
        fontSize={4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

function Ladder() {
  const steps = [
    { text: "Step 1", position: [0, 0, 0] },
    { text: "Step 2", position: [0, 25, -25] },
    { text: "Step 3", position: [0, 50, -50] },
    { text: "Step 4", position: [0, 75, -75] },
    { text: "Step 5", position: [0, 100, -100] },
  ];

  return (
    <Canvas
      camera={{ position: [100, 100, 100], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} />
      <group rotation={[0, Math.PI / 4, 0]} position={[0, -50, 50]}>
        {steps.map((step, index) => (
          <Step key={index} position={step.position as [number, number, number]} text={step.text} />
        ))}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

export default Ladder;