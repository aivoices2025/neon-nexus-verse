
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Box } from "@react-three/drei";
import { Mesh, Object3D } from "three";

interface Avatar {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  isCurrentUser?: boolean;
}

interface VRAvatarProps {
  avatar: Avatar;
}

const VRAvatar = ({ avatar }: VRAvatarProps) => {
  const meshRef = useRef<Mesh>(null);
  const textRef = useRef<Object3D>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = avatar.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    if (textRef.current) {
      // Make text always face camera
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={avatar.position}>
      {/* Avatar Body */}
      <Sphere ref={meshRef} args={[0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={avatar.color} 
          emissive={avatar.isCurrentUser ? avatar.color : "#000000"}
          emissiveIntensity={avatar.isCurrentUser ? 0.2 : 0}
        />
      </Sphere>
      
      {/* Avatar Head */}
      <Sphere args={[0.15]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={avatar.color} />
      </Sphere>
      
      {/* Name Tag */}
      <Text
        ref={textRef}
        position={[0, 0.8, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {avatar.name}
        {avatar.isCurrentUser && " (You)"}
      </Text>
      
      {/* Glow effect for current user */}
      {avatar.isCurrentUser && (
        <Sphere args={[0.35]} position={[0, 0, 0]}>
          <meshBasicMaterial 
            color={avatar.color} 
            transparent 
            opacity={0.2}
          />
        </Sphere>
      )}
    </group>
  );
};

interface VRAvatarSystemProps {
  currentUser: any;
  eventId: string;
  isVRMode: boolean;
}

export const VRAvatarSystem = ({ currentUser, eventId, isVRMode }: VRAvatarSystemProps) => {
  // Mock avatar data - in real app this would come from backend
  const avatars: Avatar[] = [
    {
      id: currentUser?.id || "user1",
      name: currentUser?.username || "You",
      position: [0, 1, 0],
      color: "#7c3aed",
      isCurrentUser: true
    },
    {
      id: "user2",
      name: "CyberExplorer",
      position: [-2, 1, -1],
      color: "#00ffff"
    },
    {
      id: "user3",
      name: "VRPioneer",
      position: [2, 1, -1],
      color: "#ff00ff"
    },
    {
      id: "user4",
      name: "MetaverseFan",
      position: [0, 1, -3],
      color: "#ffff00"
    }
  ];

  const VRSpace = () => {
    return (
      <>
        {/* Virtual Floor */}
        <Box position={[0, -0.5, 0]} args={[20, 0.1, 20]}>
          <meshStandardMaterial color="#1a1a2e" />
        </Box>
        
        {/* Virtual Stage/Screen */}
        <Box position={[0, 2, -8]} args={[12, 6, 0.2]}>
          <meshStandardMaterial color="#2a2a2a" emissive="#7c3aed" emissiveIntensity={0.1} />
        </Box>
        
        {/* Ambient Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Sphere key={i} args={[0.02]} position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 10 + 1,
            (Math.random() - 0.5) * 30
          ]}>
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </Sphere>
        ))}
        
        {/* Render Avatars */}
        {avatars.map((avatar) => (
          <VRAvatar key={avatar.id} avatar={avatar} />
        ))}
        
        {/* Event Title */}
        <Text
          position={[0, 4, -8]}
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#7c3aed"
        >
          Virtual Event Space
        </Text>
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={1.2} color="#7c3aed" />
        <pointLight position={[-5, 4, 5]} intensity={0.8} color="#00ffff" />
        <pointLight position={[5, 4, 5]} intensity={0.8} color="#ff00ff" />
        {/* Simple spotlight without problematic target manipulation */}
        <spotLight 
          position={[0, 10, -8]} 
          intensity={1.5}
          color="#ffffff"
          angle={Math.PI / 6}
          penumbra={0.5}
          castShadow
        />
      </>
    );
  };

  return (
    <div className={`${isVRMode ? 'w-full h-screen' : 'w-full h-96'} rounded-lg overflow-hidden border border-border/30`}>
      <Canvas 
        camera={{ 
          position: isVRMode ? [0, 1.6, 3] : [0, 3, 8], 
          fov: 60 
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <VRSpace />
        <OrbitControls 
          enablePan={!isVRMode} 
          maxDistance={isVRMode ? 5 : 15} 
          minDistance={isVRMode ? 1 : 3}
          target={[0, 1, 0]}
        />
      </Canvas>
      
      {!isVRMode && (
        <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-2 backdrop-blur-md">
          <p className="text-white text-xs">
            {avatars.length} users in this space • Click and drag to explore
          </p>
        </div>
      )}
    </div>
  );
};
