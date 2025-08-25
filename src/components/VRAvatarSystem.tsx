
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { VRCanvas } from "./VRCanvas";



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

// VR Controller Component for Meta Quest 3S
const VRController = ({ position, isLeft }: { position: [number, number, number], isLeft: boolean }) => {
  const controllerRef = useRef<Group>(null);
  const [isPointing, setIsPointing] = useState(false);
  
  useFrame((state) => {
    if (controllerRef.current) {
      // Simulate controller movement
      const time = state.clock.elapsedTime;
      controllerRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      controllerRef.current.rotation.z = isLeft ? -0.2 : 0.2;
    }
  });
  
  return (
    <group ref={controllerRef} position={position}>
      {/* Controller Body */}
      <mesh>
        <boxGeometry args={[0.05, 0.15, 0.03]} />
        <meshStandardMaterial color={isLeft ? "#667eea" : "#764ba2"} />
      </mesh>
      
      {/* Trigger */}
      <mesh position={[0, -0.05, 0.02]}>
        <boxGeometry args={[0.02, 0.03, 0.02]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Pointer Ray */}
      {isPointing && (
        <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.001, 0.001, 2]} />
          <meshBasicMaterial color={isLeft ? "#00ffff" : "#ff00ff"} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};

// Hand Tracking Component
const HandTracking = ({ position, isLeft }: { position: [number, number, number], isLeft: boolean }) => {
  const handRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (handRef.current) {
      const time = state.clock.elapsedTime;
      handRef.current.rotation.y = Math.sin(time * 1.5) * 0.2;
    }
  });
  
  return (
    <group ref={handRef} position={position}>
      {/* Palm */}
      <mesh>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Fingers */}
      {[0, 1, 2, 3, 4].map((finger) => (
        <mesh key={finger} position={[
          (finger - 2) * 0.015,
          0.03,
          0
        ]}>
          <cylinderGeometry args={[0.005, 0.005, 0.04]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
      ))}
    </group>
  );
};

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
    const [handTrackingEnabled, setHandTrackingEnabled] = useState(false);
    
    // Check for Meta Quest 3S features
    useEffect(() => {
      if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
          if (supported) {
            console.log('✅ Meta Quest 3S VR features detected!');
            setHandTrackingEnabled(true);
          }
        });
      }
    }, []);
    
    return (
      <>
        {/* Enhanced VR Floor with Grid */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[30, 0.1, 30]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            transparent 
            opacity={0.8}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        
        {/* Grid Lines for VR Spatial Reference */}
        {Array.from({ length: 11 }).map((_, i) => (
          <group key={`grid-${i}`}>
            <mesh position={[-15 + i * 3, -0.49, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 30]} />
              <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, -0.49, -15 + i * 3]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 30]} />
              <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
        
        {/* Enhanced Virtual Stage with Meta Quest Branding */}
        <mesh position={[0, 2, -8]}>
          <boxGeometry args={[14, 7, 0.3]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            emissive="#7c3aed" 
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        {/* Meta Quest 3S Welcome Text */}
        <mesh position={[0, 3, -7.8]}>
          <planeGeometry args={[4, 0.5]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
        </mesh>
        
        <mesh position={[0, 2.2, -7.8]}>
          <planeGeometry args={[6, 0.3]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        
        {/* Interactive Learning Zones */}
        {[
          { pos: [-6, 1, -4] as [number, number, number], color: "#00ff00" },
          { pos: [6, 1, -4] as [number, number, number], color: "#ff6600" },
          { pos: [0, 1, 2] as [number, number, number], color: "#ff00ff" },
          { pos: [-4, 1, 6] as [number, number, number], color: "#ffff00" },
          { pos: [4, 1, 6] as [number, number, number], color: "#ff0066" }
        ].map((zone, i) => (
          <group key={`zone-${i}`}>
            <mesh position={zone.pos}>
              <cylinderGeometry args={[1, 1, 0.2]} />
              <meshStandardMaterial 
                color={zone.color} 
                emissive={zone.color} 
                emissiveIntensity={0.2}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[zone.pos[0], zone.pos[1] + 1, zone.pos[2]]}>
              <planeGeometry args={[1.5, 0.3]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
          </group>
        ))}
        
        {/* VR Controllers for Meta Quest 3S */}
        {isVRMode && (
          <>
            <VRController position={[-0.3, 1.2, 0.5]} isLeft={true} />
            <VRController position={[0.3, 1.2, 0.5]} isLeft={false} />
            
            {/* Hand Tracking when enabled */}
            {handTrackingEnabled && (
              <>
                <HandTracking position={[-0.3, 1.1, 0.6]} isLeft={true} />
                <HandTracking position={[0.3, 1.1, 0.6]} isLeft={false} />
              </>
            )}
          </>
        )}
        
        {/* Enhanced Particles for VR Immersion */}
        {Array.from({ length: isVRMode ? 50 : 20 }).map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 15 + 1,
            (Math.random() - 0.5) * 40
          ]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial 
              color={[
                "#ffffff", "#7c3aed", "#00ffff", "#ff00ff", "#ffff00"
              ][Math.floor(Math.random() * 5)]} 
              opacity={0.6} 
              transparent 
            />
          </mesh>
        ))}
        
        {/* Render Avatars */}
        {avatars.map((avatar) => {
          console.log("VRAvatarSystem: Rendering avatar:", avatar.name);
          return <VRAvatar key={avatar.id} avatar={avatar} />;
        })}
        
        {/* Enhanced Lighting for VR */}
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={1.5} color="#7c3aed" castShadow />
        <pointLight position={[-8, 6, 8]} intensity={1.0} color="#00ffff" />
        <pointLight position={[8, 6, 8]} intensity={1.0} color="#ff00ff" />
        <directionalLight 
          position={[0, 15, -10]} 
          intensity={2.0} 
          color="#ffffff" 
          castShadow
        />
      </>
    );
  };

  return (
    <VRCanvas 
      className={`${isVRMode ? 'w-full h-screen' : 'w-full h-96'} rounded-lg overflow-hidden border border-border/30`}
      onVRStateChange={(vrActive) => {
        console.log('✅ VR State changed in VRAvatarSystem:', vrActive);
      }}
    >
      <VRSpace />
    </VRCanvas>
  );
};
