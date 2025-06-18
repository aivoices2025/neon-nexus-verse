
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Plane } from "@react-three/drei";
import { useRef, useState } from "react";
import { Mesh } from "three";

const InteractiveRoom = () => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Room floor */}
      <Plane 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        args={[20, 20]}
      >
        <meshStandardMaterial color="#1a1a2e" />
      </Plane>

      {/* Virtual stage */}
      <Box 
        ref={meshRef}
        position={[0, -1, -5]} 
        args={[8, 0.5, 4]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? "#7c3aed" : "#4c1d95"} />
      </Box>

      {/* Floating orbs representing users */}
      <Sphere position={[-3, 1, 0]} args={[0.3]}>
        <meshBasicMaterial color="#00ffff" />
      </Sphere>
      <Sphere position={[3, 1, 0]} args={[0.3]}>
        <meshBasicMaterial color="#ff00ff" />
      </Sphere>
      <Sphere position={[0, 1, 2]} args={[0.3]}>
        <meshBasicMaterial color="#ffff00" />
      </Sphere>

      {/* Event title */}
      <Text
        position={[0, 2, -5]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Virtual Event Space
      </Text>

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
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border/30">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <InteractiveRoom />
        <OrbitControls enablePan={false} maxDistance={15} minDistance={3} />
      </Canvas>
    </div>
  );
};
