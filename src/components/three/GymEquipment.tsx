import React from "react";
import * as THREE from "three";

export const Bench = () => (
  <group position={[0, 0, 0]}>
    {/* Base frame */}
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[0.3, 0.5, 1.2]} />
      <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
    </mesh>
    {/* Pad */}
    <mesh position={[0, 0.55, 0]}>
      <boxGeometry args={[0.35, 0.1, 1.3]} />
      <meshStandardMaterial color="#222" roughness={0.8} />
    </mesh>
    {/* Legs */}
    <mesh position={[0, 0.2, 0.55]}>
      <boxGeometry args={[0.4, 0.4, 0.05]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    <mesh position={[0, 0.2, -0.55]}>
      <boxGeometry args={[0.4, 0.4, 0.05]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    {/* Barbell supports */}
    <mesh position={[0.2, 0.8, 0]}>
      <boxGeometry args={[0.05, 1, 0.05]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[-0.2, 0.8, 0]}>
      <boxGeometry args={[0.05, 1, 0.05]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  </group>
);

export const Barbell = ({ y = 1, showWeights = true }) => (
  <group position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[0.02, 0.02, 2.2, 32]} />
      <meshStandardMaterial color="#888" metalness={1} roughness={0.1} />
    </mesh>
    {showWeights && (
      <>
        <group position={[0, 1, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
            <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
        <group position={[0, -1, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
            <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      </>
    )}
  </group>
);

export const SquatRack = () => (
  <group position={[0, 0, 0]}>
    <mesh position={[0.6, 1.1, -0.5]}>
      <boxGeometry args={[0.1, 2.2, 0.1]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[-0.6, 1.1, -0.5]}>
      <boxGeometry args={[0.1, 2.2, 0.1]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[0.6, 1.1, 0.5]}>
      <boxGeometry args={[0.1, 2.2, 0.1]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[-0.6, 1.1, 0.5]}>
      <boxGeometry args={[0.1, 2.2, 0.1]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Bottom frame */}
    <mesh position={[0, 0.05, 0]}>
      <boxGeometry args={[1.3, 0.1, 1.1]} />
      <meshStandardMaterial color="#111" metalness={0.9} />
    </mesh>
  </group>
);

export const Dumbbell = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.02, 0.02, 0.4, 32]} />
      <meshStandardMaterial color="#888" metalness={1} />
    </mesh>
    <group position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 32]} />
        <meshStandardMaterial color="#39FF14" />
      </mesh>
    </group>
    <group position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 32]} />
        <meshStandardMaterial color="#39FF14" />
      </mesh>
    </group>
  </group>
);
