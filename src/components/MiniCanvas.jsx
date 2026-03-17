import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

// Carga y anima UN solo modelo por canvas.
// No usa la caché de drei → cada contexto WebGL tiene sus propios recursos.
function ModelScene({ url, phase }) {
  const [scene, setScene] = useState(null);
  const ref = useRef();

  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (!active) return;
        const root = gltf.scene;
        // Auto-escalar al bounding box real del modelo
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) root.scale.setScalar(1.4 / maxDim);
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center.multiplyScalar(root.scale.x));
        setScene(root);
      },
      undefined,
      (err) => console.warn('MiniCanvas: error al cargar', url, err)
    );
    return () => { active = false; };
  }, [url]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.85 + phase;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45 + phase) * 0.12;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.3 + phase) * 0.09;
  });

  if (!scene) return null;
  return <primitive ref={ref} object={scene} />;
}

export default function MiniCanvas({ modelPath, phase = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <ambientLight intensity={2.2} />
      <directionalLight position={[2, 4, 3]} intensity={1.6} />
      <pointLight position={[-2, 1, 1]} intensity={0.7} color="#ddc8ff" />
      <ModelScene url={modelPath} phase={phase} />
    </Canvas>
  );
}
