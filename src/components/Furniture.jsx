import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';

function Furniture({ id, type, position, rotation, scale, color, wireframe, selected, onClick, onTransform, mode = 'translate' }) {
  const groupRef = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const [spawnScale, setSpawnScale] = useState(0);

  // Entrance animation
  useEffect(() => {
    let frame = 0;
    const animateIn = () => {
      frame++;
      const progress = Math.min(frame / 30, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setSpawnScale(eased);
      if (progress < 1) requestAnimationFrame(animateIn);
    };
    animateIn();
  }, []);

  useFrame((state) => {
    if (!groupRef.current || selected) return;
    const t = state.clock.elapsedTime + floatOffset.current;
    
    if (['plant', 'lamp', 'floorlamp', 'vase', 'painting'].includes(type)) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.6) * 0.06;
      if (type !== 'painting') {
        groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.7) * 0.07;
      }
    }
    
    const breathe = 1 + Math.sin(t * 1.1) * 0.008;
    groupRef.current.scale.set(
      scale[0] * breathe * spawnScale, 
      scale[1] * breathe * spawnScale, 
      scale[2] * breathe * spawnScale
    );
  });

  const renderGeometry = () => {
    switch (type) {
      case 'sofa':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.5, 0.9]} />
              <meshStandardMaterial 
                color={color} 
                wireframe={wireframe} 
                roughness={0.5} 
                metalness={0.08}
                envMapIntensity={0.8}
              />
            </mesh>
            <mesh position={[0, 0.7, -0.35]} castShadow>
              <boxGeometry args={[2.2, 0.5, 0.2]} />
              <meshStandardMaterial 
                color={color} 
                wireframe={wireframe} 
                roughness={0.5} 
                metalness={0.08}
                envMapIntensity={0.8}
              />
            </mesh>
            <mesh position={[-1.05, 0.4, 0]} castShadow>
              <boxGeometry args={[0.2, 0.6, 0.9]} />
              <meshStandardMaterial 
                color={color} 
                wireframe={wireframe} 
                roughness={0.5} 
                metalness={0.08}
                envMapIntensity={0.8}
              />
            </mesh>
            <mesh position={[1.05, 0.4, 0]} castShadow>
              <boxGeometry args={[0.2, 0.6, 0.9]} />
              <meshStandardMaterial 
                color={color} 
                wireframe={wireframe} 
                roughness={0.5} 
                metalness={0.08}
                envMapIntensity={0.8}
              />
            </mesh>
            <mesh position={[-0.5, 0.55, 0.1]} castShadow>
              <boxGeometry args={[0.4, 0.3, 0.4]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} roughness={0.9} />
            </mesh>
            <mesh position={[0.5, 0.55, 0.1]} castShadow>
              <boxGeometry args={[0.4, 0.3, 0.4]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} roughness={0.9} />
            </mesh>
          </group>
        );
      case 'armchair':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.4, 0.8]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.65, -0.3]} castShadow>
              <boxGeometry args={[0.8, 0.5, 0.2]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
            </mesh>
            <mesh position={[-0.35, 0.4, 0]} castShadow>
              <boxGeometry args={[0.15, 0.5, 0.8]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
            </mesh>
            <mesh position={[0.35, 0.4, 0]} castShadow>
              <boxGeometry args={[0.15, 0.5, 0.8]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
            </mesh>
          </group>
        );
      case 'table':
        return (
          <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.05, 0.8]} />
            <meshStandardMaterial color={color} wireframe={wireframe} metalness={0.2} roughness={0.2} />
          </mesh>
        );
      case 'tvstand':
        return (
          <group>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 0.4, 0.5]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[1.4, 0.8, 0.04]} />
              <meshStandardMaterial color="#111" wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'plant':
        return (
          <group>
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.3, 16]} />
              <meshStandardMaterial color="#6b4226" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.75, 0]} castShadow>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial color={color} wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'lamp':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, 0.35, 16]} />
              <meshStandardMaterial color={color} wireframe={wireframe} emissive="#fff8e1" emissiveIntensity={0.6} />
            </mesh>
          </group>
        );
      case 'rug':
        return (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[3.5, 2.5]} />
            <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.9} />
          </mesh>
        );
      case 'bed':
        return (
          <group>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.3, 1.6]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.55, -0.7]} castShadow>
              <boxGeometry args={[2.2, 0.5, 0.15]} />
              <meshStandardMaterial color="#ffffff" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.42, 0]} castShadow>
              <boxGeometry args={[2.0, 0.12, 1.4]} />
              <meshStandardMaterial color="#f5f5f5" wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'bookshelf':
        return (
          <group>
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 1.8, 0.35]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.7} />
            </mesh>
            {[0.4, 0.9, 1.4].map((y, i) => (
              <mesh key={i} position={[0, y, 0.05]} castShadow>
                <boxGeometry args={[1.1, 0.04, 0.3]} />
                <meshStandardMaterial color="#8d6e63" wireframe={wireframe} />
              </mesh>
            ))}
          </group>
        );
      case 'diningtable':
        return (
          <group>
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 0.08, 1.0]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.5} />
            </mesh>
            {[[-0.7, -0.35], [-0.7, 0.35], [0.7, -0.35], [0.7, 0.35]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.37, z]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.75, 8]} />
                <meshStandardMaterial color="#5d4037" wireframe={wireframe} />
              </mesh>
            ))}
          </group>
        );
      case 'chair':
        return (
          <group>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.45, 0.06, 0.45]} />
              <meshStandardMaterial color={color} wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.75, -0.18]} castShadow>
              <boxGeometry args={[0.45, 0.5, 0.06]} />
              <meshStandardMaterial color={color} wireframe={wireframe} />
            </mesh>
            {[[-0.16, -0.16], [-0.16, 0.16], [0.16, -0.16], [0.16, 0.16]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.22, z]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
                <meshStandardMaterial color="#4e342e" wireframe={wireframe} />
              </mesh>
            ))}
          </group>
        );
      case 'sidetable':
        return (
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.8, 16]} />
            <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.6} />
          </mesh>
        );
      case 'cabinet':
        return (
          <group>
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.0, 1.8, 0.5]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.65} />
            </mesh>
            <mesh position={[0, 0.9, 0.26]}>
              <boxGeometry args={[0.9, 1.6, 0.02]} />
              <meshStandardMaterial color="#3e2723" wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'mirror':
        return (
          <group>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[0.8, 1.4, 0.05]} />
              <meshStandardMaterial color="#b0bec5" wireframe={wireframe} metalness={0.7} roughness={0.15} />
            </mesh>
            <mesh position={[0, 1.2, -0.03]}>
              <boxGeometry args={[0.85, 1.45, 0.04]} />
              <meshStandardMaterial color="#5d4037" wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'floorlamp':
        return (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 0.1, 16]} />
              <meshStandardMaterial color="#424242" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
              <meshStandardMaterial color="#616161" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 1.7, 0]} castShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={color} wireframe={wireframe} emissive="#fff8e1" emissiveIntensity={0.7} />
            </mesh>
          </group>
        );
      case 'painting':
        return (
          <mesh position={[0, 1.3, 0]} castShadow>
            <boxGeometry args={[1.0, 0.7, 0.04]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
      case 'vase':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, 0.6, 16]} />
              <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.3} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.65, 0]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#4caf50" wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'desk':
        return (
          <group>
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.06, 0.8]} />
              <meshStandardMaterial color={color} wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1.5, 0.6, 0.7]} />
              <meshStandardMaterial color="#5d4037" wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'nightstand':
        return (
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.7, 0.45]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
      case 'tv':
        return (
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[1.6, 0.9, 0.06]} />
            <meshStandardMaterial color="#111" wireframe={wireframe} />
          </mesh>
        );
      case 'wardrobe':
        return (
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 2.2, 0.6]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
      case 'sofa2':
        return (
          <group>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.5, 1.0]} />
              <meshStandardMaterial color={color} wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.8, -0.4]} castShadow>
              <boxGeometry args={[3.2, 0.5, 0.2]} />
              <meshStandardMaterial color={color} wireframe={wireframe} />
            </mesh>
          </group>
        );
      case 'beanbag':
        return (
          <mesh position={[0, 0.3, 0]} castShadow>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
      case 'clock':
        return (
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
      case 'speaker':
        return (
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.3, 0.8, 0.25]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );
    }
  };

  return (
    <>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {renderGeometry()}
        {selected && (
          <>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2.8, 1.4, 1.4]} />
              <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.4} />
            </mesh>
            <pointLight position={[0, 1, 0]} intensity={0.6} color="#00d4ff" distance={3} />
          </>
        )}
      </group>
      {selected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={mode}
          onObjectChange={() => {
            try {
              if (groupRef.current && onTransform) {
                const obj = groupRef.current;
                onTransform({
                  position: [obj.position.x, obj.position.y, obj.position.z],
                  rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                  scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                });
              }
            } catch (e) {
              // ignore transform errors
            }
          }}
        />
      )}
    </>
  );
}

export default Furniture;
