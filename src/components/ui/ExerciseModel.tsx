import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Humanoid } from "../three/Humanoid";
import { Bench, Barbell, SquatRack, Dumbbell } from "../three/GymEquipment";

interface ModelProps {
  type: string;
}

function ExerciseAnimation({ type }: ModelProps) {
  const barRef = useRef<THREE.Group>(null);
  
  const muscleHighlights = useMemo(() => {
    const t = type.toLowerCase();
    if (t.includes("bench")) return ["chest", "arms"];
    if (t.includes("deadlift")) return ["back", "legs", "core"];
    if (t.includes("squat")) return ["legs", "core"];
    if (t.includes("press")) return ["shoulders", "arms"];
    if (t.includes("curls") || t.includes("bicep")) return ["arms"];
    if (t.includes("pushdowns") || t.includes("tricep")) return ["arms"];
    if (t.includes("pulldown") || t.includes("lat")) return ["back", "arms"];
    return [];
  }, [type]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = Math.sin(t * 2);
    const phase = (cycle + 1) / 2;

    if (barRef.current) {
      if (type === "Bench Press Elite" || type === "Bench Press") {
        barRef.current.position.y = 1.1 + (phase * 0.6);
        // Barbell is horizontal
        barRef.current.rotation.set(0, 0, 0); 
      } else if (type === "Deadlift Kinetic" || type === "Deadlift") {
        barRef.current.position.y = 0.2 + (phase * 0.8);
        barRef.current.position.z = 0.3;
      } else if (type === "Squat Depth" || type === "Squat") {
        barRef.current.position.y = 1.4 - ((1-phase) * 0.4);
        barRef.current.position.z = -0.15;
      } else if (type === "Shoulder Press Pro" || type === "Shoulder Press") {
        barRef.current.position.y = 1.6 + (phase * 0.5);
      }
    }
  });

  return (
    <group>
      <Humanoid animationType={type} muscleHighlights={muscleHighlights} />
      
      {(type === "Bench Press Elite" || type === "Bench Press") && (
        <>
          <Bench />
          <group ref={barRef}>
            <Barbell y={0} />
          </group>
        </>
      )}

      {(type === "Deadlift Kinetic" || type === "Deadlift") && (
        <group ref={barRef}>
           <Barbell y={0} />
        </group>
      )}

      {(type === "Squat Depth" || type === "Squat") && (
        <>
          <SquatRack />
          <group ref={barRef}>
            <Barbell y={0} />
          </group>
        </>
      )}

      {(type === "Shoulder Press Pro" || type === "Shoulder Press") && (
        <group ref={barRef}>
           <Barbell y={0} />
        </group>
      )}

      {(type === "Bicep Peak Protocol" || type === "Bicep Curls") && (
        <group>
          <Dumbbell position={[-0.4, 0.8, 0.2]} />
          <Dumbbell position={[0.4, 0.8, 0.2]} />
        </group>
      )}

      {/* Default placeholder for untracked exercises */}
      {!["Bench Press Elite", "Bench Press", "Deadlift Kinetic", "Deadlift", "Squat Depth", "Squat", "Shoulder Press Pro", "Shoulder Press", "Bicep Peak Protocol", "Bicep Curls"].includes(type) && (
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
    <div className="w-full h-full bg-deep-black/20 rounded-2xl overflow-hidden relative shadow-2xl">
      <Canvas shadows camera={{ position: [2, 2, 5], fov: 45 }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[3, 2, 5]} />
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 5, 15]} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} castShadow color="#39FF14" />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#39FF14" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />

        <group position={[0, -0.5, 0]}>
          <ExerciseAnimation type={type} />
          <ContactShadows opacity={0.4} scale={10} blur={24} far={10} resolution={256} color="#000000" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#050505" roughness={0.5} />
          </mesh>
          <gridHelper args={[20, 20, "#39FF14", "#111"]} position={[0, 0, 0]} />
        </group>
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
      
      {/* UI Overlay for Model */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="px-3 py-1 bg-neon-green/20 border border-neon-green/40 backdrop-blur-md rounded-full">
          <span className="text-[8px] font-black text-neon-green uppercase tracking-widest animate-pulse">Render: High Fidelity</span>
        </div>
      </div>
    </div>
  );
}

