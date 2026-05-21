import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Stars } from "@react-three/drei";
import { Humanoid } from "../three/Humanoid";
import { Bench, Barbell } from "../three/GymEquipment";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function HeroAnimation() {
  const barRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = Math.sin(t * 1.5);
    const phase = (cycle + 1) / 2;

    if (barRef.current) {
      barRef.current.position.y = 1.1 + (phase * 0.6);
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Humanoid animationType="Bench Press" muscleHighlights={["chest", "arms"]} />
      <Bench />
      <group ref={barRef}>
        <Barbell y={0} />
      </group>
    </group>
  );
}

export default function Model3D() {
  return (
    <div className="w-full h-full cursor-grab">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[4, 2, 6]} fov={35} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow color="#39FF14" />
        <pointLight position={[-10, 10, -10]} intensity={1} color="#39FF14" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />

        <React.Suspense fallback={null}>
          <HeroAnimation />
          <ContactShadows opacity={0.4} scale={10} blur={2.4} far={10} color="#000000" />
        </React.Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.3} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
    </div>
  );
}

