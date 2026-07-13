import React, { useRef } from "react";
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
  color = "#242429", 
  emissive = "#08080a",
  highlight = false
}: LimbProps & { highlight?: boolean }) => (
  <mesh position={[0, -length / 2, 0]}>
    <capsuleGeometry args={[thickness, length, 8, 16]} />
    <meshStandardMaterial 
      color={highlight ? "#FF3B30" : color} 
      emissive={highlight ? "#FF3B30" : emissive} 
      emissiveIntensity={highlight ? 1.5 : 0.15}
      roughness={highlight ? 0.05 : 0.45}
      metalness={highlight ? 0.9 : 0.25}
      transparent
      opacity={0.95}
    />
  </mesh>
);

const Joint = ({ size = 0.07, color = "#FF3B30", glow = false }) => (
  <mesh>
    <sphereGeometry args={[size, 24, 24]} />
    <meshStandardMaterial 
      color={glow ? "#FF3B30" : "#1e1e24"} 
      emissive={glow ? "#FF3B30" : "#0d0d12"} 
      emissiveIntensity={glow ? 1.8 : 0.2}
      roughness={0.2}
      metalness={0.8}
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

  const normalizedType = animationType.toLowerCase();

  const isChestHighlighted = muscleHighlights.includes("chest") || muscleHighlights.includes("upper chest") || normalizedType.includes("push") || normalizedType.includes("bench") || normalizedType.includes("fly");
  const isBackHighlighted = muscleHighlights.includes("back") || muscleHighlights.includes("lats") || muscleHighlights.includes("rhomboids") || normalizedType.includes("pull") || normalizedType.includes("row") || normalizedType.includes("deadlift");
  const isLegsHighlighted = muscleHighlights.includes("legs") || muscleHighlights.includes("quads") || muscleHighlights.includes("hamstrings") || muscleHighlights.includes("glutes") || normalizedType.includes("squat") || normalizedType.includes("lunge") || normalizedType.includes("calf") || normalizedType.includes("press");
  const isShouldersHighlighted = muscleHighlights.includes("shoulders") || muscleHighlights.includes("side delts") || muscleHighlights.includes("front delts") || muscleHighlights.includes("rear delts") || normalizedType.includes("shoulder") || normalizedType.includes("raise") || normalizedType.includes("press") || normalizedType.includes("arnold");
  const isArmsHighlighted = muscleHighlights.includes("arms") || muscleHighlights.includes("biceps") || muscleHighlights.includes("triceps") || muscleHighlights.includes("brachialis") || normalizedType.includes("curl") || normalizedType.includes("extension") || normalizedType.includes("pushdown");
  const isAbsHighlighted = muscleHighlights.includes("abs") || muscleHighlights.includes("obliques") || normalizedType.includes("plank") || normalizedType.includes("crunch") || normalizedType.includes("sit") || normalizedType.includes("raise") || normalizedType.includes("twist") || normalizedType.includes("climber") || normalizedType.includes("burpee");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = Math.sin(t * 2.2); // workout speed multiplier
    const phase = (cycle + 1) / 2; // 0 to 1 loop

    if (groupRef.current) {
      resetPoses();

      // Kinetic state dispatcher
      if (normalizedType.includes("push up") || normalizedType.includes("pushup")) {
        animatePushup(phase);
      } else if (normalizedType.includes("bench press")) {
        animateBenchPress(phase);
      } else if (normalizedType.includes("squat")) {
        animateSquat(phase);
      } else if (normalizedType.includes("shoulder press") || normalizedType.includes("arnold press")) {
        animateShoulderPress(phase);
      } else if (normalizedType.includes("curl")) {
        animateBicepCurls(phase);
      } else if (normalizedType.includes("pushdown") || normalizedType.includes("extension")) {
        animateTricepPushdown(phase);
      } else if (normalizedType.includes("pulldown") || normalizedType.includes("pull up")) {
        animatePullDown(phase);
      } else if (normalizedType.includes("plank")) {
        animatePlankHold(t);
      } else if (normalizedType.includes("crunch") || normalizedType.includes("sit up")) {
        animateCrunch(phase);
      } else if (normalizedType.includes("deadlift") || normalizedType.includes("row")) {
        animateDeadlift(phase);
      } else {
        // Idle dynamic breathing simulation for non-animated types
        animateIdle(t);
      }
    }
  });

  const resetPoses = () => {
    if (!groupRef.current) return;
    groupRef.current.position.set(0, 0, 0);
    groupRef.current.rotation.set(0, 0, 0);
    
    // Reset all joint angles to default neutral stand
    [leftShoulderRef, rightShoulderRef, leftElbowRef, rightElbowRef, leftHipRef, rightHipRef, leftKneeRef, rightKneeRef, spineRef, neckRef, headRef].forEach(ref => {
      if (ref.current) ref.current.rotation.set(0, 0, 0);
    });
  };

  const animateIdle = (t: number) => {
    const breath = Math.sin(t * 1.5) * 0.05;
    if (spineRef.current) spineRef.current.rotation.x = breath;
    if (headRef.current) headRef.current.rotation.x = -breath * 0.5;
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.z = -0.1 + Math.sin(t) * 0.02;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.z = 0.1 - Math.sin(t) * 0.02;
  };

  const animatePushup = (p: number) => {
    if (!groupRef.current) return;
    // Position body horizontally in space
    groupRef.current.rotation.x = -Math.PI / 2 + 0.05;
    groupRef.current.position.y = 0.35 + (p * 0.45); // move up and down

    // Head slightly extended upwards to look forward
    if (headRef.current) headRef.current.rotation.x = -0.25;

    // Shoulder flexion and abduction
    if (leftShoulderRef.current && rightShoulderRef.current) {
      leftShoulderRef.current.rotation.y = -0.3;
      rightShoulderRef.current.rotation.y = 0.3;
      leftShoulderRef.current.rotation.z = -Math.PI / 2 + 0.35 * (1 - p);
      rightShoulderRef.current.rotation.z = Math.PI / 2 - 0.35 * (1 - p);
    }

    // Elbow flexion
    if (leftElbowRef.current && rightElbowRef.current) {
      leftElbowRef.current.rotation.x = 1.3 * (1 - p);
      rightElbowRef.current.rotation.x = 1.3 * (1 - p);
    }
  };

  const animateBenchPress = (p: number) => {
    if (!groupRef.current) return;
    // Lie supine on flat plane
    groupRef.current.rotation.x = -Math.PI / 2;
    groupRef.current.position.y = 0.45;

    // Press up and down
    if (leftShoulderRef.current && rightShoulderRef.current) {
      leftShoulderRef.current.rotation.z = -Math.PI / 2 + 0.2;
      rightShoulderRef.current.rotation.z = Math.PI / 2 - 0.2;
      leftShoulderRef.current.rotation.x = -0.4 - (p * 0.75);
      rightShoulderRef.current.rotation.x = -0.4 - (p * 0.75);
    }

    if (leftElbowRef.current && rightElbowRef.current) {
      leftElbowRef.current.rotation.x = 1.25 * (1 - p);
      rightElbowRef.current.rotation.x = 1.25 * (1 - p);
    }
  };

  const animateSquat = (p: number) => {
    if (!groupRef.current) return;
    const depth = (1 - p) * 1.45; // descent amount
    
    // Hip and Knee joint synchronization
    if (leftHipRef.current) leftHipRef.current.rotation.x = -depth;
    if (rightHipRef.current) rightHipRef.current.rotation.x = -depth;
    if (leftKneeRef.current) leftKneeRef.current.rotation.x = depth * 1.85;
    if (rightKneeRef.current) rightKneeRef.current.rotation.x = depth * 1.85;
    
    // Torso leans slightly forward to balance mass center
    if (spineRef.current) spineRef.current.rotation.x = depth * 0.25;

    // Position height follows depth sink
    groupRef.current.position.y = -depth * 0.45;
  };

  const animateShoulderPress = (p: number) => {
    if (!groupRef.current) return;
    const push = p;
    
    if (leftShoulderRef.current) {
      leftShoulderRef.current.rotation.z = -Math.PI + 0.25 + (push * 0.45);
      leftShoulderRef.current.rotation.y = -0.2;
    }
    if (rightShoulderRef.current) {
      rightShoulderRef.current.rotation.z = Math.PI - 0.25 - (push * 0.45);
      rightShoulderRef.current.rotation.y = 0.2;
    }
    
    if (leftElbowRef.current) leftElbowRef.current.rotation.z = -(1 - push) * 1.6;
    if (rightElbowRef.current) rightElbowRef.current.rotation.z = (1 - push) * 1.6;
  };

  const animateBicepCurls = (p: number) => {
    const angle = p * 2.3;
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = 0.15;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = 0.15;
    
    if (leftElbowRef.current) leftElbowRef.current.rotation.x = angle;
    if (rightElbowRef.current) rightElbowRef.current.rotation.x = angle;
  };

  const animateTricepPushdown = (p: number) => {
    const extend = (1 - p) * 2.1;
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = 0.2;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = 0.2;
    
    if (leftElbowRef.current) leftElbowRef.current.rotation.x = extend;
    if (rightElbowRef.current) rightElbowRef.current.rotation.x = extend;
  };

  const animatePullDown = (p: number) => {
    const pull = (1 - p);
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.z = -Math.PI + 0.35 + (pull * 1.8);
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.z = Math.PI - 0.35 - (pull * 1.8);
    if (leftElbowRef.current) leftElbowRef.current.rotation.z = -pull * 1.4;
    if (rightElbowRef.current) rightElbowRef.current.rotation.z = pull * 1.4;
  };

  const animateDeadlift = (p: number) => {
    if (!groupRef.current) return;
    const hinge = (1 - p) * 1.25; // 0 standing tall, 1.25 bent
    
    if (spineRef.current) spineRef.current.rotation.x = hinge;
    if (leftHipRef.current) leftHipRef.current.rotation.x = -hinge * 0.45;
    if (rightHipRef.current) rightHipRef.current.rotation.x = -hinge * 0.45;
    if (leftKneeRef.current) leftKneeRef.current.rotation.x = hinge * 0.55;
    if (rightKneeRef.current) rightKneeRef.current.rotation.x = hinge * 0.55;

    // Arms hang vertically down
    if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = -hinge;
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = -hinge;
    
    groupRef.current.position.y = -hinge * 0.2;
  };

  const animateCrunch = (p: number) => {
    if (!groupRef.current) return;
    // Lay supine
    groupRef.current.rotation.x = -Math.PI / 2;
    groupRef.current.position.y = 0.15;

    // Bend spine upward
    const flexion = p * 0.55;
    if (spineRef.current) spineRef.current.rotation.x = flexion;
    if (neckRef.current) neckRef.current.rotation.x = flexion * 0.2;

    // Hands placed behind ears
    if (leftShoulderRef.current) {
      leftShoulderRef.current.rotation.z = -2.2;
      leftShoulderRef.current.rotation.y = -1.1;
    }
    if (rightShoulderRef.current) {
      rightShoulderRef.current.rotation.z = 2.2;
      rightShoulderRef.current.rotation.y = 1.1;
    }
  };

  const animatePlankHold = (t: number) => {
    if (!groupRef.current) return;
    // Plank horizontal alignment
    groupRef.current.rotation.x = -Math.PI / 2 + 0.05;
    groupRef.current.position.y = 0.35;

    // Subtle isometric tremor/breathing
    const tremble = Math.sin(t * 15) * 0.005;
    groupRef.current.position.y += tremble;

    if (leftShoulderRef.current && rightShoulderRef.current) {
      leftShoulderRef.current.rotation.z = -Math.PI / 2 + 0.15;
      rightShoulderRef.current.rotation.z = Math.PI / 2 - 0.15;
    }
    if (leftElbowRef.current && rightElbowRef.current) {
      leftElbowRef.current.rotation.x = 1.4;
      rightElbowRef.current.rotation.x = 1.4;
    }
  };

  return (
    <group ref={groupRef}>
      {/* PELVIS / HIPS */}
      <group position={[0, 0.9, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.15, 0.15]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* LEGS */}
        <group ref={leftHipRef} position={[-0.1, -0.05, 0]}>
          <Joint size={0.07} color="#FF3B30" glow={isLegsHighlighted} />
          <Limb length={0.4} thickness={0.065} highlight={isLegsHighlighted} />
          <group ref={leftKneeRef} position={[0, -0.4, 0]}>
            <Joint size={0.06} color="#FF3B30" glow={isLegsHighlighted} />
            <Limb length={0.45} thickness={0.055} highlight={isLegsHighlighted} />
            <mesh position={[0, -0.48, 0.05]}>
              <boxGeometry args={[0.08, 0.05, 0.16]} />
              <meshStandardMaterial color="#0b0b0e" roughness={0.8} />
            </mesh>
          </group>
        </group>

        <group ref={rightHipRef} position={[0.1, -0.05, 0]}>
          <Joint size={0.07} color="#FF3B30" glow={isLegsHighlighted} />
          <Limb length={0.4} thickness={0.065} highlight={isLegsHighlighted} />
          <group ref={rightKneeRef} position={[0, -0.4, 0]}>
            <Joint size={0.06} color="#FF3B30" glow={isLegsHighlighted} />
            <Limb length={0.45} thickness={0.055} highlight={isLegsHighlighted} />
            <mesh position={[0, -0.48, 0.05]}>
              <boxGeometry args={[0.08, 0.05, 0.16]} />
              <meshStandardMaterial color="#0b0b0e" roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* TORSO / SPINE */}
        <group ref={spineRef} position={[0, 0.08, 0]}>
          <Limb length={0.5} thickness={0.125} color="#242429" highlight={isAbsHighlighted || isChestHighlighted || isBackHighlighted} />
          
          {/* SHOULDERS */}
          <group position={[0, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[0.42, 0.1, 0.16]} />
              <meshStandardMaterial color="#1a1a22" roughness={0.4} />
            </mesh>

            <group ref={leftShoulderRef} position={[-0.21, 0, 0]}>
              <Joint color="#FF3B30" glow={isShouldersHighlighted} />
              <Limb length={0.35} thickness={0.052} highlight={isArmsHighlighted || isShouldersHighlighted} />
              <group ref={leftElbowRef} position={[0, -0.35, 0]}>
                <Joint size={0.06} color="#FF3B30" glow={isArmsHighlighted} />
                <Limb length={0.35} thickness={0.042} highlight={isArmsHighlighted} />
                <Joint size={0.05} color="#FF3B30" glow={isArmsHighlighted} />
              </group>
            </group>

            <group ref={rightShoulderRef} position={[0.21, 0, 0]}>
              <Joint color="#FF3B30" glow={isShouldersHighlighted} />
              <Limb length={0.35} thickness={0.052} highlight={isArmsHighlighted || isShouldersHighlighted} />
              <group ref={rightElbowRef} position={[0, -0.35, 0]}>
                <Joint size={0.06} color="#FF3B30" glow={isArmsHighlighted} />
                <Limb length={0.35} thickness={0.042} highlight={isArmsHighlighted} />
                <Joint size={0.05} color="#FF3B30" glow={isArmsHighlighted} />
              </group>
            </group>

            {/* NECK & HEAD */}
            <group ref={neckRef} position={[0, 0.05, 0]}>
              <Joint size={0.04} color="#333" />
              <group ref={headRef} position={[0, 0.19, 0]}>
                <mesh>
                  <sphereGeometry args={[0.125, 32, 32]} />
                  <meshStandardMaterial color="#2e2e38" roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Glowing neon visors for the futuristic high-end humanoid trainer */}
                <mesh position={[0, 0.02, 0.082]}>
                  <boxGeometry args={[0.17, 0.035, 0.05]} />
                  <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={2.5} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
