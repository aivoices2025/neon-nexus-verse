
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

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
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      try {
        const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        bodyRef.current.position.y = floatY;
      } catch (error) {
        console.log("Animation error:", error);
      }
    }
  });

  return (
    <group ref={groupRef} position={avatar.position}>
      {/* Avatar Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial 
          color={avatar.color} 
          emissive={avatar.isCurrentUser ? avatar.color : "#000000"}
          emissiveIntensity={avatar.isCurrentUser ? 0.2 : 0}
        />
      </mesh>
      
      {/* Avatar Head */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color={avatar.color} />
      </mesh>
      
      {/* Glow effect for current user */}
      {avatar.isCurrentUser && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.35]} />
          <meshBasicMaterial 
            color={avatar.color} 
            transparent 
            opacity={0.2}
          />
        </mesh>
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
  console.log("VRAvatarSystem: Rendering with currentUser:", currentUser, "eventId:", eventId, "isVRMode:", isVRMode);
  
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
    console.log("VRAvatarSystem: Rendering VRSpace component");
    
    return (
      <>
        {/* Virtual Floor */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[20, 0.1, 20]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        
        {/* Virtual Stage/Screen */}
        <mesh position={[0, 2, -8]}>
          <boxGeometry args={[12, 6, 0.2]} />
          <meshStandardMaterial color="#2a2a2a" emissive="#7c3aed" emissiveIntensity={0.1} />
        </mesh>
        
        {/* Ambient Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 10 + 1,
            (Math.random() - 0.5) * 30
          ]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </mesh>
        ))}
        
        {/* Render Avatars */}
        {avatars.map((avatar) => {
          console.log("VRAvatarSystem: Rendering avatar:", avatar.name);
          return <VRAvatar key={avatar.id} avatar={avatar} />;
        })}
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={1.2} color="#7c3aed" />
        <pointLight position={[-5, 4, 5]} intensity={0.8} color="#00ffff" />
        <pointLight position={[5, 4, 5]} intensity={0.8} color="#ff00ff" />
        <directionalLight position={[0, 10, -8]} intensity={1.5} color="#ffffff" />
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
        onCreated={() => {
          console.log("Canvas created successfully");
        }}
        onError={(error) => {
          console.error("Canvas error:", error);
        }}
      >
        <VRSpace />
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
