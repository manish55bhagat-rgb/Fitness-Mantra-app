import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Stars } from "@react-three/drei";
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
    if (t.includes("deadlift") || t.includes("row")) return ["back", "legs"];
    if (t.includes("squat") || t.includes("lunge") || t.includes("calf")) return ["legs"];
    if (t.includes("press") || t.includes("raise") || t.includes("fly")) return ["shoulders", "arms"];
    if (t.includes("curl") || t.includes("bicep") || t.includes("pushdown") || t.includes("extension")) return ["arms"];
    if (t.includes("plank") || t.includes("crunch") || t.includes("sit") || t.includes("raise") || t.includes("twist")) return ["abs"];
    if (t.includes("climber") || t.includes("burpee") || t.includes("jack")) return ["abs", "legs"];
    return [];
  }, [type]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = Math.sin(t * 2.2);
    const phase = (cycle + 1) / 2;

    if (barRef.current) {
      if (type.toLowerCase().includes("bench press")) {
        barRef.current.position.y = 1.1 + (phase * 0.6);
        barRef.current.rotation.set(0, 0, 0); 
      } else if (type.toLowerCase().includes("deadlift")) {
        barRef.current.position.y = 0.2 + (phase * 0.8);
        barRef.current.position.z = 0.35;
      } else if (type.toLowerCase().includes("squat")) {
        barRef.current.position.y = 1.4 - ((1 - phase) * 0.4);
        barRef.current.position.z = -0.15;
      } else if (type.toLowerCase().includes("shoulder press")) {
        barRef.current.position.y = 1.6 + (phase * 0.5);
      }
    }
  });

  const isBench = type.toLowerCase().includes("bench press");
  const isDeadlift = type.toLowerCase().includes("deadlift");
  const isSquat = type.toLowerCase().includes("squat");
  const isShoulderPress = type.toLowerCase().includes("shoulder press");
  const isCurls = type.toLowerCase().includes("curl") || type.toLowerCase().includes("bicep");

  return (
    <group>
      <Humanoid animationType={type} muscleHighlights={muscleHighlights} />
      
      {isBench && (
        <>
          <Bench />
          <group ref={barRef}>
            <Barbell y={0} />
          </group>
        </>
      )}

      {isDeadlift && (
        <group ref={barRef}>
           <Barbell y={0} />
        </group>
      )}

      {isSquat && (
        <>
          <SquatRack />
          <group ref={barRef}>
            <Barbell y={0} />
          </group>
        </>
      )}

      {isShoulderPress && (
        <group ref={barRef}>
           <Barbell y={0} />
        </group>
      )}

      {isCurls && (
        <group>
          <Dumbbell position={[-0.4, 0.8, 0.2]} />
          <Dumbbell position={[0.4, 0.8, 0.2]} />
        </group>
      )}
    </group>
  );
}

// Interactive Camera controller that responds to viewAngle & zoom smoothly
function CameraConductor({ 
  viewAngle, 
  zoom 
}: { 
  viewAngle: "front" | "side" | "back"; 
  zoom: number; 
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.2, 4));

  useEffect(() => {
    const baseDistance = 3.6 / zoom;
    if (viewAngle === "front") {
      targetPos.current.set(0, 1.1, baseDistance);
    } else if (viewAngle === "side") {
      targetPos.current.set(baseDistance, 1.1, 0.2);
    } else if (viewAngle === "back") {
      targetPos.current.set(0, 1.1, -baseDistance);
    }
  }, [viewAngle, zoom]);

  useFrame(() => {
    // Smoothly interpolate the camera position to target position
    camera.position.lerp(targetPos.current, 0.08);
    // Force camera to look towards center humanoid spine height
    camera.lookAt(0, 0.9, 0);
  });

  return null;
}

interface ExerciseModelProps {
  type: string;
  viewAngle?: "front" | "side" | "back";
  zoom?: number;
  autoRotate?: boolean;
}

export default function ExerciseModel({ 
  type, 
  viewAngle = "front", 
  zoom = 1.0, 
  autoRotate = true 
}: ExerciseModelProps) {
  return (
    <div className="w-full h-full bg-deep-black/35 rounded-2xl overflow-hidden relative shadow-2xl">
      <Canvas shadows camera={{ position: [0, 1.2, 3.6], fov: 45 }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1.2, 3.6]} />
        <color attach="background" args={["#08080a"]} />
        <fog attach="fog" args={["#08080a", 5, 12]} />
        
        <ambientLight intensity={0.45} />
        <spotLight 
          position={[4, 5, 4]} 
          angle={0.25} 
          penumbra={1} 
          intensity={2.5} 
          castShadow 
          color="#FF3B30" 
        />
        <pointLight position={[-4, 4, -4]} intensity={1.5} color="#ef4444" />
        <pointLight position={[0, 3, 3]} intensity={1.0} color="#FF3B30" />
        
        <Stars radius={100} depth={40} count={2500} factor={3} saturation={0.5} fade speed={1.2} />
        <Environment preset="night" />

        <group position={[0, -0.4, 0]}>
          <ExerciseAnimation type={type} />
          <ContactShadows opacity={0.6} scale={8} blur={16} far={8} resolution={256} color="#000000" />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0b0b0e" roughness={0.7} />
          </mesh>
          <gridHelper args={[15, 15, "#FF3B30", "#14141a"]} position={[0, 0, 0]} />
        </group>
        
        <CameraConductor viewAngle={viewAngle} zoom={zoom} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate={autoRotate} 
          autoRotateSpeed={0.6} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
      
      {/* UI Overlay for Model */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded-full">
          <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">3D Kinetic Engine Enabled</span>
        </div>
      </div>
    </div>
  );
}
export { ExerciseModel };
