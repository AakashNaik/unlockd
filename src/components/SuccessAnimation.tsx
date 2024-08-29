import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder, OrbitControls } from '@react-three/drei'

function Woman({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * 2) * 0.1
  })
  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.5, 32, 32]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="peachpuff" />
      </Sphere>
      <Cylinder args={[0.3, 0.5, 1.2, 32]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="pink" />
      </Cylinder>
    </group>
  )
}

function Medal({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t * 2)
    ref.current.position.y = position[1] + Math.sin(t * 3) * 0.1
  })
  return (
    <Cylinder ref={ref} args={[0.3, 0.3, 0.05, 32]} position={position}>
      <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
    </Cylinder>
  )
}

export default function SuccessAnimation() {
  return (
    <Canvas style={{ height: '400px' }} camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Woman position={[-1, 0, 0]} />
      <Medal position={[1, 1.5, 0]} />
      <Box args={[5, 0.1, 5]} position={[0, -1, 0]}>
        <meshStandardMaterial color="limegreen" />
      </Box>
      <OrbitControls />
    </Canvas>
  )
}