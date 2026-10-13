import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows, Sky, SoftShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Room from './components/Room';
import Furniture from './components/Furniture';
import Toolbar from './components/UI/Toolbar';
import PropertiesPanel from './components/UI/PropertiesPanel';
import FurnitureLibrary from './components/UI/FurnitureLibrary';
import './App.css';

function FollowSelected({ selectedObject }) {
  const { camera } = useThree();
  const currentLook = useRef(new THREE.Vector3(0, 0.8, 0));

  useFrame(() => {
    if (!selectedObject) return;
    const target = new THREE.Vector3(
      selectedObject.position[0],
      selectedObject.position[1] + 0.5,
      selectedObject.position[2]
    );
    currentLook.current.lerp(target, 0.12);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function FloorCamera({ currentFloor }) {
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useEffect(() => {
    const y = currentFloor * 5.8;
    targetPos.current.set(11, y + 4.5, 13);
    targetLook.current.set(0, y + 1.2, -1);
    isAnimating.current = true;
  }, [currentFloor]);

  useFrame(() => {
    if (!isAnimating.current) return;
    
    camera.position.lerp(targetPos.current, 0.08);
    const lookDir = new THREE.Vector3();
    camera.getWorldDirection(lookDir);
    const currentLook = camera.position.clone().add(lookDir.multiplyScalar(8));
    currentLook.lerp(targetLook.current, 0.08);
    camera.lookAt(currentLook);
    
    // Stop animating when close enough
    if (camera.position.distanceTo(targetPos.current) < 0.3) {
      isAnimating.current = false;
    }
  });

  return null;
}

function ClickToLook({ enabled, selectedObject }) {
  const { camera, gl, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const targetLook = useRef(new THREE.Vector3(0, 0.8, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0.8, 0));

  useEffect(() => {
    if (!enabled) return;
    const handleClick = (e) => {
      try {
        const rect = gl.domElement.getBoundingClientRect();
        mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.current.setFromCamera(mouse.current, camera);
        const intersects = raycaster.current.intersectObjects(scene.children, true);
        if (intersects.length > 0 && intersects[0].point) {
          targetLook.current.copy(intersects[0].point);
        }
      } catch (err) {
        console.warn('Click raycast error:', err);
      }
    };
    gl.domElement.addEventListener('pointerdown', handleClick);
    return () => gl.domElement.removeEventListener('pointerdown', handleClick);
  }, [enabled, camera, gl, scene]);

  useFrame(() => {
    if (!enabled) return;
    try {
      // Only look at click target, not selected object (prevents camera jumping when dragging)
      currentLook.current.lerp(targetLook.current, 0.05);
      camera.lookAt(currentLook.current);
    } catch (err) {
      // ignore
    }
  });

  return null;
}

const furnitureCatalog = [
  { id: 'sofa', name: 'Divan', type: 'sofa', color: '#4a90e2' },
  { id: 'armchair', name: 'Kreslo', type: 'armchair', color: '#c4a484' },
  { id: 'table', name: 'Stol', type: 'table', color: '#e0e0e0' },
  { id: 'tvstand', name: 'TV stol', type: 'tvstand', color: '#8b6914' },
  { id: 'plant', name: 'Gul', type: 'plant', color: '#2d5a27' },
  { id: 'lamp', name: 'Lampa', type: 'lamp', color: '#ffffff' },
  { id: 'rug', name: 'Gilam', type: 'rug', color: '#d4c4a8' },
  { id: 'bed', name: 'Yotoq', type: 'bed', color: '#6b8e9f' },
  { id: 'bookshelf', name: 'Kitob javoni', type: 'bookshelf', color: '#5d4037' },
  { id: 'diningtable', name: 'Ovqat stoli', type: 'diningtable', color: '#a1887f' },
  { id: 'chair', name: 'Stul', type: 'chair', color: '#8d6e63' },
  { id: 'sidetable', name: 'Yon stol', type: 'sidetable', color: '#bcaaa4' },
  { id: 'cabinet', name: 'Shkaf', type: 'cabinet', color: '#6d4c41' },
  { id: 'mirror', name: 'Ko\'zgu', type: 'mirror', color: '#e0e0e0' },
  { id: 'floorlamp', name: 'Pol lampasi', type: 'floorlamp', color: '#ffecb3' },
  { id: 'painting', name: 'Rasm', type: 'painting', color: '#ffab91' },
  { id: 'vase', name: 'Vaza', type: 'vase', color: '#80cbc4' },
  { id: 'desk', name: 'Ish stoli', type: 'desk', color: '#8d6e63' },
  { id: 'officechair', name: 'Ofis stuli', type: 'officechair', color: '#455a64' },
  { id: 'wardrobe', name: 'Garderob', type: 'wardrobe', color: '#5d4037' },
  { id: 'nightstand', name: 'Tungi stol', type: 'nightstand', color: '#a1887f' },
  { id: 'tv', name: 'Televizor', type: 'tv', color: '#212121' },
  { id: 'sofa2', name: 'Katta divan', type: 'sofa2', color: '#5c6bc0' },
  { id: 'beanbag', name: 'Bean bag', type: 'beanbag', color: '#ff7043' },
  { id: 'curtain', name: 'Parda', type: 'curtain', color: '#e0e0e0' },
  { id: 'clock', name: 'Soat', type: 'clock', color: '#bdbdbd' },
  { id: 'speaker', name: 'Kolonka', type: 'speaker', color: '#424242' },
];

function App() {
  const [rooms, setRooms] = useState([
    { id: 'floor1', name: '1-qavat', floor: 0, objects: [
      { id: '1', type: 'sofa', position: [0, 0.4, -1.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#4a90e2' },
      { id: '2', type: 'armchair', position: [-1.8, 0.4, 0.3], rotation: [0, 0.6, 0], scale: [1, 1, 1], color: '#c4a484' },
      { id: '3', type: 'table', position: [0, 0.2, 0.2], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#e0e0e0' },
      { id: '4', type: 'plant', position: [2.2, 0.4, -1.2], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#2d5a27' },
      { id: '5', type: 'rug', position: [0, 0.01, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#d4c4a8' },
    ]},
    { id: 'floor2', name: '2-qavat', floor: 1, objects: [
      { id: 'b1', type: 'bed', position: [0, 0.3, -1], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#6b8e9f' },
      { id: 'b2', type: 'nightstand', position: [-1.5, 0.3, -0.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#a1887f' },
      { id: 'b3', type: 'wardrobe', position: [2, 0.3, -1.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#5d4037' },
    ]},
  ]);
  const [currentRoomId, setCurrentRoomId] = useState('floor1');
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('translate');
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const currentRoom = rooms.find(r => r.id === currentRoomId) || rooms[0];
  const objects = currentRoom.objects;
  const selectedObject = objects.find(o => o.id === selectedId);

  const setObjects = (newObjects) => {
    setRooms(rooms.map(r => r.id === currentRoomId ? { ...r, objects: newObjects } : r));
  };

  const addRoom = () => {
    const newRoom = {
      id: 'room' + Date.now(),
      name: 'Xona ' + (rooms.length + 1),
      objects: []
    };
    setRooms([...rooms, newRoom]);
    setCurrentRoomId(newRoom.id);
    setSelectedId(null);
  };

  const addFurniture = (type) => {
    const catalogItem = furnitureCatalog.find(f => f.type === type);
    const newObj = {
      id: Date.now().toString(),
      type,
      position: [Math.random() * 3 - 1.5, 0.4, Math.random() * 3 - 1.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: catalogItem?.color || '#cccccc',
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  const updateObject = (id, updates) => {
    setObjects(objects.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteObject = (id) => {
    setObjects(objects.filter(o => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const saveScene = () => {
    localStorage.setItem('dreamhome-rooms', JSON.stringify(rooms));
    alert('Barcha xonalar saqlandi!');
  };

  const loadScene = () => {
    const saved = localStorage.getItem('dreamhome-rooms');
    if (saved) {
      setRooms(JSON.parse(saved));
      alert('Xonalar yuklandi!');
    }
  };

  return (
    <div className="app">
      <Toolbar 
        mode={mode} 
        setMode={setMode} 
        wireframe={wireframe} 
        setWireframe={setWireframe}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        onSave={saveScene}
        onLoad={loadScene}
        rooms={rooms}
        currentRoomId={currentRoomId}
        setCurrentRoomId={setCurrentRoomId}
        onAddRoom={addRoom}
      />
      <div className="main-content">
        <FurnitureLibrary catalog={furnitureCatalog} onAdd={addFurniture} />
        <div className="canvas-container">
          <Canvas 
            shadows 
            camera={{ position: [14, 9, 16], fov: 40 }}
            gl={{ 
              antialias: true, 
              toneMapping: 3,
              toneMappingExposure: 1.2,
              powerPreference: "high-performance"
            }}
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              gl.setClearColor('#0a0a14');
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = 2;
            }}
          >
            <FloorCamera currentFloor={currentRoom?.floor || 0} />
            <ClickToLook enabled={true} selectedObject={selectedObject} />
            
            <color attach="background" args={['#0a0a14']} />
            
            <ambientLight intensity={0.3} />
            <directionalLight 
              position={[18, 24, 14]} 
              intensity={2.4} 
              color="#fffaf0"
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={60}
              shadow-camera-left={-18}
              shadow-camera-right={18}
              shadow-camera-top={18}
              shadow-camera-bottom={-18}
              shadow-bias={-0.0002}
            />
            <hemisphereLight intensity={0.5} color="#fff8f0" groundColor="#5d4a35" />
            <pointLight position={[0, 4, 0]} intensity={0.6} color="#ffe8c0" distance={14} decay={2} />
            <pointLight position={[-4, 3.5, 2]} intensity={0.3} color="#a8d0f0" distance={8} />
            
            <Environment preset="sunset" background={false} />
            
            {showGrid && (
              <Grid 
                args={[80, 30]} 
                cellSize={0.5} 
                cellThickness={0.5} 
                cellColor="#4a4a4a" 
                sectionSize={4} 
                sectionThickness={1} 
                sectionColor="#6b4423" 
                fadeDistance={50} 
                infiniteGrid 
              />
            )}
            
            {rooms.map((room) => {
              const yOffset = room.floor * 5.8;
              const isActive = room.id === currentRoomId;
              return (
                <group key={room.id}>
                  <Room floor={room.floor} isActive={isActive} />
                  {room.objects.map(obj => (
                    <Furniture
                      key={obj.id}
                      {...obj}
                      position={[obj.position[0], obj.position[1] + yOffset, obj.position[2]]}
                      wireframe={wireframe}
                      selected={selectedId === obj.id && isActive}
                      onClick={() => {
                        setCurrentRoomId(room.id);
                        setSelectedId(obj.id);
                      }}
                      onTransform={(updates) => {
                        if (isActive) {
                          updateObject(obj.id, {
                            ...updates,
                            position: [updates.position[0], updates.position[1] - yOffset, updates.position[2]]
                          });
                        }
                      }}
                      mode={mode}
                    />
                  ))}
                </group>
              );
            })}
            
            <OrbitControls 
              makeDefault 
              enableDamping 
              dampingFactor={0.05} 
              minDistance={2} 
              maxDistance={40}
              maxPolarAngle={Math.PI / 2.05}
              enableZoom={true}
              enablePan={true}
              zoomSpeed={1.2}
            />
            
            <ContactShadows 
              position={[0, 0.01, 0]} 
              opacity={0.5} 
              scale={25} 
              blur={2.5} 
              far={15} 
            />
          </Canvas>
        </div>
        <PropertiesPanel 
          object={selectedObject} 
          onUpdate={(updates) => selectedId && updateObject(selectedId, updates)}
          onDelete={() => selectedId && deleteObject(selectedId)}
        />
      </div>
    </div>
  );
}

export default App;
