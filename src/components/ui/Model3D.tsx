import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";

export default function Model3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        
        <Sphere args={[1, 100, 200]} scale={1.8}>
          <MeshDistortMaterial
            color="#ccff00"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
          />
        </Sphere>
        
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
