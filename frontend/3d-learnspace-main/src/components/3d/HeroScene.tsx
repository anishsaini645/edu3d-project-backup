import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Torus, Icosahedron } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedMolecule() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central atom */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Orbital electrons */}
      <Float speed={3} rotationIntensity={1} floatIntensity={0.3}>
        <Sphere args={[0.3, 32, 32]} position={[2, 0.5, 0]}>
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.4}>
        <Sphere args={[0.25, 32, 32]} position={[-1.5, 1, 1]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
        <Sphere args={[0.35, 32, 32]} position={[0.5, -1.5, 1.5]}>
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} />
        </Sphere>
      </Float>

      {/* Orbital rings */}
      <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshStandardMaterial color="#6366f1" transparent opacity={0.4} />
      </Torus>

      <Torus args={[2, 0.02, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#a855f7" transparent opacity={0.3} />
      </Torus>

      {/* Decorative icosahedron */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={0.2}>
        <Icosahedron args={[0.4]} position={[-2, -0.5, -1]}>
          <meshStandardMaterial
            color="#22d3ee"
            wireframe
            emissive="#22d3ee"
            emissiveIntensity={0.3}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[0, 10, -10]} intensity={0.3} color="#a855f7" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
      />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Lights />
          <AnimatedMolecule />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
