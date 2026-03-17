import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

// Todos los modelos disponibles (en orden)
const MODEL_FILES = [
  '/models/Pastelito1.glb',
  '/models/Pastelito2.glb',
  '/models/Pastelito3.glb',
  '/models/Pastelito4.glb',
];

function AnimatedModel({ scene, phase }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    // Solo rotación sobre su propio eje Y — sin traslación ni balanceo
    ref.current.rotation.y = state.clock.elapsedTime * 0.9 + phase;
  });

  return <primitive ref={ref} object={scene} />;
}

// pickIndex: qué hijo del scene usar (fijo para todos los items)
// phase:     offset de animación (distinto por posición en la cola)
function ModelLoader({ pickIndex, phase }) {
  const [scene, setScene] = useState(null);

  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();

    loader.load(
      '/models/Pastelito1.glb',
      (gltf) => {
        if (!active) return;
        const root = gltf.scene;
        const children = root.children.filter((c) => c.visible !== false);

        let target;
        if (children.length > 1) {
          // Tomar solo el hijo en pickIndex (mismo para todos los items)
          const chosen = children[pickIndex % children.length];
          const group = new THREE.Group();
          group.add(chosen.clone(true));
          target = group;
        } else {
          target = root;
        }

        const box = new THREE.Box3().setFromObject(target);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) target.scale.setScalar(1.5 / maxDim);
        const center = box.getCenter(new THREE.Vector3());
        target.position.sub(center.multiplyScalar(target.scale.x));

        setScene(target);
      },
      undefined,
      (err) => console.warn('PastelCanvas: error al cargar modelo', err)
    );

    return () => { active = false; };
  }, [pickIndex]);

  if (!scene) return null;
  return <AnimatedModel scene={scene} phase={phase} />;
}

/**
 * Canvas 3D con UN pastelito rotando.
 * queuePosition: posición en la cola — solo afecta la fase de animación
 * pickIndex:     qué modelo usar (fijo para todos los items, default = 1)
 * size:          tamaño en px del canvas
 */
export default function PastelCanvas({ queuePosition = 0, pickIndex = 1, size = 80 }) {
  const phase = queuePosition * 1.2;

  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={2.4} />
        <directionalLight position={[2, 4, 3]} intensity={1.8} />
        <pointLight position={[-2, 1, 1]} intensity={0.7} color="#ddc8ff" />
        <ModelLoader pickIndex={pickIndex} phase={phase} />
      </Canvas>
    </div>
  );
}
