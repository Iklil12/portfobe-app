"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

function RubikCube() {
  const topLayerRef = useRef<THREE.Group>(null);
  const middleLayerRef = useRef<THREE.Group>(null);
  const bottomLayerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Twist layers in opposite directions/speeds like a Rubik's cube puzzle
    if (topLayerRef.current) {
      topLayerRef.current.rotation.y = t * 0.4;
    }
    if (middleLayerRef.current) {
      middleLayerRef.current.rotation.y = t * -0.2;
    }
    if (bottomLayerRef.current) {
      bottomLayerRef.current.rotation.y = t * 0.6;
    }
  });

  const spacing = 0.31;
  const cubieSize = 0.27;

  // Generate coordinates for outer cubies (skipping hollow center)
  const getCubiesForY = (yVal: number) => {
    const list = [];
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && yVal === 0 && z === 0) continue; // hollow center
        list.push({ x, z });
      }
    }
    return list;
  };

  const getLayerColor = (yVal: number) => {
    if (yVal === 1) return "#3b82f6"; // Blue for Top
    if (yVal === 0) return "#10b981"; // Green for Middle
    return "#ff9e00"; // Amber/Orange for Bottom
  };

  const renderSlice = (yVal: number, ref: React.RefObject<THREE.Group | null>) => {
    const cubies = getCubiesForY(yVal);
    const sliceColor = getLayerColor(yVal);

    return (
      <group ref={ref}>
        {cubies.map(({ x, z }, idx) => (
          <group 
            key={`${x}-${yVal}-${z}-${idx}`} 
            position={[x * spacing, yVal * spacing, z * spacing]}
          >
            {/* Dark chrome solid base cubie */}
            <mesh>
              <boxGeometry args={[cubieSize, cubieSize, cubieSize]} />
              <meshStandardMaterial
                color="#090d16"
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>

            {/* Glowing neon wireframe edge accent */}
            <mesh scale={1.015}>
              <boxGeometry args={[cubieSize, cubieSize, cubieSize]} />
              <meshBasicMaterial
                color={sliceColor}
                wireframe={true}
                transparent={true}
                opacity={0.25}
              />
            </mesh>
          </group>
        ))}
      </group>
    );
  };

  return (
    <group scale={2.2}>
      {renderSlice(1, topLayerRef)}
      {renderSlice(0, middleLayerRef)}
      {renderSlice(-1, bottomLayerRef)}
    </group>
  );
}

export function Abstract3DShowcase() {
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setDpr(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div 
      className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        dpr={dpr}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          precision: "mediump",
          alpha: true,
          stencil: false,
          depth: true
        }}
      >
        <ambientLight intensity={1.3} />
        
        {/* Balanced directional lights for metallic reflections */}
        <directionalLight position={[5, 8, 4]} intensity={2.2} color="#10b981" />
        <directionalLight position={[-5, -8, -4]} intensity={1.8} color="#3b82f6" />

        <Center>
          <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
            <RubikCube />
          </Float>
        </Center>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.8} 
        />
      </Canvas>
    </div>
  );
}
