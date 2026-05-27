"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, Center } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <group ref={meshRef} scale={1.2}>
        {/* Main solid body */}
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={1}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing wireframe overlay */}
        <mesh scale={1.01}>
          <torusKnotGeometry args={[1, 0.3, 64, 8]} />
          <meshBasicMaterial
            color="#10b981"
            wireframe={true}
            transparent={true}
            opacity={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function Abstract3DShowcase() {
  return (
    <div 
      className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#10b981" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#3b82f6" />

        <Center>
          <AnimatedGeometry />
        </Center>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
