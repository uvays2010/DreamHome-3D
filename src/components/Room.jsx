import React from 'react';

function Room({ floor = 0, isActive = true }) {
  const y = floor * 5.8;
  const opacity = isActive ? 1 : 0.65;
  
  return (
    <group position={[0, y, 0]}>
      {/* Floor with better material */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial 
          color={floor === 0 ? "#c9b08a" : "#b89a72"} 
          roughness={0.6} 
          metalness={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.6, 0]}>
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial color="#f0ebe3" roughness={0.95} transparent opacity={0.5} />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 1.8, -7.5]} receiveShadow>
        <boxGeometry args={[18, 3.6, 0.35]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.75} transparent opacity={opacity} />
      </mesh>
      
      {/* Left wall (partial) */}
      <mesh position={[-9, 1.8, -2]} receiveShadow>
        <boxGeometry args={[0.35, 3.6, 11]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.75} transparent opacity={opacity} />
      </mesh>
      
      {/* Right wall (partial) */}
      <mesh position={[9, 1.8, -2]} receiveShadow>
        <boxGeometry args={[0.35, 3.6, 11]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.75} transparent opacity={opacity} />
      </mesh>
      
      {/* Realistic windows with frames */}
      {[-5.5, -1.8, 1.8, 5.5].map((x, i) => (
        <group key={i} position={[x, 2.0, -7.3]}>
          <mesh>
            <boxGeometry args={[1.9, 2.2, 0.06]} />
            <meshPhysicalMaterial 
              color="#c5e4f5" 
              transparent 
              opacity={0.25} 
              roughness={0.05}
              metalness={0.1}
              transmission={0.8}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[2.05, 2.35, 0.1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.06, 2.2, 0.04]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
        </group>
      ))}
      
      {/* Baseboard */}
      <mesh position={[0, 0.08, -7.3]}>
        <boxGeometry args={[17.5, 0.15, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" />
      </mesh>
      
      {/* Floor indicator */}
      <mesh position={[0, 0.02, 6.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 0.7]} />
        <meshBasicMaterial color={floor === 0 ? "#4a90e2" : "#e94560"} />
      </mesh>
    </group>
  );
}

export default Room;
