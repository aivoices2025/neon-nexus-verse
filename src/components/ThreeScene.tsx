
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

const InteractiveRoom = () => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Virtual stage */}
      <mesh 
        ref={meshRef}
        position={[0, -1, -5]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[8, 0.5, 4]} />
        <meshStandardMaterial color={hovered ? "#7c3aed" : "#4c1d95"} />
      </mesh>

      {/* Floating orbs representing users */}
      <mesh position={[-3, 1, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[3, 1, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>
      <mesh position={[0, 1, 2]}>
        <sphereGeometry args={[0.3]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#7c3aed" />
      <pointLight position={[-5, 3, 5]} intensity={0.8} color="#00ffff" />
      <pointLight position={[5, 3, 5]} intensity={0.8} color="#ff00ff" />
    </>
  );
};

export const ThreeScene = () => {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border/30 relative">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <InteractiveRoom />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <h3 className="text-xl font-bold text-white text-center bg-black/50 px-4 py-2 rounded">
          Virtual Event Space
        </h3>
      </div>
    </div>
  );
};
