import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  type: string;
}

function ExerciseAnimation({ type }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const barRef = useRef<THREE.Mesh>(null);
  const weightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      if (type === "Push Ups") {
        // Angled line/plank moving up and down
        meshRef.current.rotation.x = Math.sin(t * 3) * 0.4 - 1.2;
      } else if (type === "Deadlift Pro" || type === "Bench Press") {
        // Bar moving up and down
        meshRef.current.position.y = Math.sin(t * 2) * 0.5;
      } else if (type === "Burpees Flow" || type === "High Knee Sprint") {
        // Jumping motions
        meshRef.current.position.y = Math.abs(Math.sin(t * 6)) * 0.8;
        meshRef.current.rotation.y += 0.05;
      } else {
        // General floating/rotating
        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.z += 0.005;
      }
    }
  });

  return (
    <group ref={meshRef}>
      {type === "Push Ups" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.5, 2, 0.1]} />
          <meshPhongMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      )}

      {(type === "Deadlift Pro" || type === "Bench Press") && (
        <group>
          {/* Bar */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 2, 32]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Weights */}
          <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            <meshStandardMaterial color="#39FF14" />
          </mesh>
          <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            <meshStandardMaterial color="#39FF14" />
          </mesh>
        </group>
      )}

      {(type === "Burpees Flow" || type === "High Knee Sprint" || type === "Zen Warrior III") && (
        <group>
          {/* Stylized Humanoid - Head */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.8} />
          </mesh>
          {/* Torso */}
          <mesh position={[0, 0.7, 0]}>
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
          {/* Arms/Legs - simplified as spheres or lines */}
          <mesh position={[0.2, 0.8, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#39FF14" />
          </mesh>
          <mesh position={[-0.2, 0.8, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#39FF14" />
          </mesh>
        </group>
      )}
      
      {/* Default/Generic Glow Sphere if type not explicitly handled */}
      {!["Push Ups", "Deadlift Pro", "Bench Press", "Burpees Flow", "High Knee Sprint", "Zen Warrior III"].includes(type) && (
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
           <mesh>
             <icosahedronGeometry args={[0.8, 15]} />
             <MeshDistortMaterial color="#39FF14" distort={0.3} speed={2} />
           </mesh>
        </Float>
      )}
    </group>
  );
}

export default function ExerciseModel({ type }: { type: string }) {
  return (
    <div className="w-full h-full bg-deep-black/20 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
      <Canvas shadows camera={{ position: [0, 1, 4], fov: 40 }}>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#39FF14" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <ExerciseAnimation type={type} />
        
        {/* Floor grid */}
        <gridHelper args={[10, 10, "#39FF14", "#111"]} position={[0, -0.5, 0]} rotation={[0, 0, 0]} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
