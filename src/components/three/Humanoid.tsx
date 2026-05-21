import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LimbProps {
  length: number;
  thickness: number;
  color?: string;
  emissive?: string;
}

const Limb = ({ 
  length, 
  thickness, 
  color = "#ffffff", 
  emissive = "#000000",
  highlight = false
}: LimbProps & { highlight?: boolean }) => (
  <mesh position={[0, -length / 2, 0]}>
    <capsuleGeometry args={[thickness, length, 4, 8]} />
    <meshStandardMaterial 
      color={highlight ? "#39FF14" : color} 
      emissive={highlight ? "#39FF14" : emissive} 
      emissiveIntensity={highlight ? 0.8 : 0.2}
      roughness={0.1}
      metalness={0.8}
      transparent
      opacity={0.9}
    />
  </mesh>
);

const Joint = ({ size = 0.08, color = "#39FF14" }) => (
  <mesh>
    <sphereGeometry args={[size, 16, 16]} />
    <meshStandardMaterial 
      color={color} 
      emissive={color} 
      emissiveIntensity={1}
      roughness={0}
      metalness={1}
    />
  </mesh>
);

interface HumanoidProps {
  animationType: string;
  muscleHighlights?: string[];
}

export const Humanoid = ({ animationType, muscleHighlights = [] }: HumanoidProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for specific joints to animate
  const headRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);
  const leftHipRef = useRef<THREE.Group>(null);
  const rightHipRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = Math.sin(t * 2); // 0 to 1 loop for exercise
    const phase = (cycle + 1) / 2; // 0 to 1

    if (groupRef.current) {
      // BASE POSITIONS & ANIMATIONS
      resetPoses();

      switch (animationType) {
        case "Bench Press Elite":
        case "Bench Press":
          animateBenchPress(phase);
          break;
        case "Deadlift Kinetic":
        case "Deadlift":
          animateDeadlift(phase);
          break;
        case "Squat Depth":
        case "Squat":
          animateSquat(phase);
          break;
        case "Shoulder Press Pro":
        case "Shoulder Press":
          animateShoulderPress(phase);
          break;
        case "Bicep Peak Protocol":
        case "Bicep Curls":
          animateBicepCurls(phase);
          break;
        case "Tricep Pushdowns":
          animateTricepPushdowns(phase);
          break;
        case "Lat Pulldown":
          animateLatPulldown(phase);
          break;
      }
    }
  });

  const resetPoses = () => {
    if (!groupRef.current) return;
    groupRef.current.position.set(0, 0, 0);
    groupRef.current.rotation.set(0, 0, 0);
    
    // Explicitly reset limb rotations if needed
    [leftShoulderRef, rightShoulderRef, leftElbowRef, rightElbowRef, leftHipRef, rightHipRef, leftKneeRef, rightKneeRef].forEach(ref => {
      if (ref.current) ref.current.rotation.set(0, 0, 0);
    });
  };

  const animateBenchPress = (p: number) => {
    if (!groupRef.current) return;
    // Lying down
    groupRef.current.rotation.x = -Math.PI / 2;
    groupRef.current.position.y = 0.5;

    // Head slightly back
    if (headRef.current) headRef.current.rotation.x = -0.2;

    // Movement: pushing up
    const push = p; // 0 at bottom, 1 at top
    
    if (leftShoulderRef.current && rightShoulderRef.current) {
      const angle = -0.5 - (push * 0.8);
      leftShoulderRef.current.rotation.z = -Math.PI / 2 + 0.3;
      rightShoulderRef.current.rotation.z = Math.PI / 2 - 0.3;
      
      leftShoulderRef.current.rotation.x = angle;
      rightShoulderRef.current.rotation.x = angle;
    }

    if (leftElbowRef.current && rightElbowRef.current) {
      const angle = 1.2 * (1 - push);
      leftElbowRef.current.rotation.x = angle;
      rightElbowRef.current.rotation.x = angle;
    }
  };

  const animateDeadlift = (p: number) => {
    if (!groupRef.current) return;
    const hinge = (1 - p) * 1.2; // 0 standing, 1.2 bent over
    
    if (spineRef.current) spineRef.current.rotation.x = hinge;
    if (leftHipRef.current) leftHipRef.current.rotation.x = -hinge * 0.5;
    if (rightHipRef.current) rightHipRef.current.rotation.x = -hinge * 0.5;
    if (leftKneeRef.current) leftKneeRef.current.rotation.x = hinge * 0.6;
    if (rightKneeRef.current) rightKneeRef.current.rotation.x = hinge * 0.6;

    // Arms hang straight down
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = -hinge;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = -hinge;
    
    groupRef.current.position.y = -p * 0.2;
  };

  const animateSquat = (p: number) => {
    if (!groupRef.current) return;
    const depth = (1 - p) * 1.5;
    
    if (leftHipRef.current) leftHipRef.current.rotation.x = -depth;
    if (rightHipRef.current) rightHipRef.current.rotation.x = -depth;
    if (leftKneeRef.current) leftKneeRef.current.rotation.x = depth * 1.8;
    if (rightKneeRef.current) rightKneeRef.current.rotation.x = depth * 1.8;
    if (spineRef.current) spineRef.current.rotation.x = depth * 0.2;
    
    groupRef.current.position.y = -depth * 0.4;
  };

  const animateShoulderPress = (p: number) => {
    if (!groupRef.current) return;
    const push = p;
    
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.z = -Math.PI + (push * 0.5);
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.z = Math.PI - (push * 0.5);
    
    if (leftElbowRef.current) leftElbowRef.current.rotation.z = -(1 - push) * 1.5;
    if (rightElbowRef.current) rightElbowRef.current.rotation.z = (1 - push) * 1.5;
  };

  const animateBicepCurls = (p: number) => {
    const curl = p * 2.2;
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = 0.2;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = 0.2;
    if (leftElbowRef.current) leftElbowRef.current.rotation.x = curl;
    if (rightElbowRef.current) rightElbowRef.current.rotation.x = curl;
  };

  const animateTricepPushdowns = (p: number) => {
    const extend = (1 - p) * 2;
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = 0.2;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = 0.2;
    if (leftElbowRef.current) leftElbowRef.current.rotation.x = extend;
    if (rightElbowRef.current) rightElbowRef.current.rotation.x = extend;
  };

  const animateLatPulldown = (p: number) => {
    const pull = (1 - p);
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.z = -Math.PI + (pull * 2);
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.z = Math.PI - (pull * 2);
    if (leftElbowRef.current) leftElbowRef.current.rotation.z = -pull * 1.5;
    if (rightElbowRef.current) rightElbowRef.current.rotation.z = pull * 1.5;
  };

  return (
    <group ref={groupRef}>
      {/* PELVIS / HIPS */}
      <group position={[0, 0.9, 0]}>
        <mesh>
          <boxGeometry args={[0.25, 0.15, 0.15]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* LEGS */}
        <group ref={leftHipRef} position={[-0.1, -0.05, 0]}>
          <Joint size={0.07} />
          <Limb length={0.4} thickness={0.06} color="#888" highlight={muscleHighlights.includes("legs")} />
          <group ref={leftKneeRef} position={[0, -0.4, 0]}>
            <Joint size={0.06} />
            <Limb length={0.45} thickness={0.05} color="#666" highlight={muscleHighlights.includes("legs")} />
            <mesh position={[0, -0.48, 0.05]}>
              <boxGeometry args={[0.08, 0.05, 0.15]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        </group>

        <group ref={rightHipRef} position={[0.1, -0.05, 0]}>
          <Joint size={0.07} />
          <Limb length={0.4} thickness={0.06} color="#888" highlight={muscleHighlights.includes("legs")} />
          <group ref={rightKneeRef} position={[0, -0.4, 0]}>
            <Joint size={0.06} />
            <Limb length={0.45} thickness={0.05} color="#666" highlight={muscleHighlights.includes("legs")} />
            <mesh position={[0, -0.48, 0.05]}>
              <boxGeometry args={[0.08, 0.05, 0.15]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        </group>

        {/* TORSO / SPINE */}
        <group ref={spineRef} position={[0, 0.08, 0]}>
          <Limb length={0.5} thickness={0.12} color="#aaa" highlight={muscleHighlights.includes("core")} />
          
          {/* SHOULDERS */}
          <group position={[0, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[0.4, 0.1, 0.15]} />
              <meshStandardMaterial color="#222" />
            </mesh>

            <group ref={leftShoulderRef} position={[-0.2, 0, 0]}>
              <Joint />
              <Limb length={0.35} thickness={0.05} color="#888" highlight={muscleHighlights.includes("arms")} />
              <group ref={leftElbowRef} position={[0, -0.35, 0]}>
                <Joint size={0.06} />
                <Limb length={0.35} thickness={0.04} color="#666" highlight={muscleHighlights.includes("arms")} />
                <Joint size={0.05} />
              </group>
            </group>

            <group ref={rightShoulderRef} position={[0.2, 0, 0]}>
              <Joint />
              <Limb length={0.35} thickness={0.05} color="#888" highlight={muscleHighlights.includes("arms")} />
              <group ref={rightElbowRef} position={[0, -0.35, 0]}>
                <Joint size={0.06} />
                <Limb length={0.35} thickness={0.04} color="#666" highlight={muscleHighlights.includes("arms")} />
                <Joint size={0.05} />
              </group>
            </group>

            {/* NECK & HEAD */}
            <group ref={neckRef} position={[0, 0.05, 0]}>
              <Joint size={0.04} color="#555" />
              <group ref={headRef} position={[0, 0.2, 0]}>
                <mesh>
                  <sphereGeometry args={[0.12, 32, 24]} />
                  <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.5} roughness={0} metalness={1} />
                </mesh>
                {/* Visualizer visor */}
                <mesh position={[0, 0.02, 0.08]}>
                  <boxGeometry args={[0.18, 0.04, 0.05]} />
                  <meshStandardMaterial color="#000" emissive="#39FF14" emissiveIntensity={2} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
