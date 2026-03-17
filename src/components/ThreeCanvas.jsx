import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function FallbackSphere() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.8;
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.45, 32, 32]} />
      <meshStandardMaterial color="#ffb662" roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

function ModelScene({ path, onLoaded }) {
  const [scene, setScene] = useState(null);
  const ref = useRef();

  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        if (!active) return;
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) root.scale.setScalar(1.5 / maxDim);
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center.multiplyScalar(root.scale.x));
        setScene(root);
        onLoaded?.();
      },
      undefined,
      (err) => console.warn('ThreeCanvas: error al cargar', path, err)
    );
    return () => { active = false; };
  }, [path]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.6;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
  });

  if (!scene) return null;
  return <primitive ref={ref} object={scene} />;
}

function HeaderScene({ modelPath }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <FallbackSphere />}
      <ModelScene path={modelPath} onLoaded={() => setLoaded(true)} />
    </>
  );
}

export default function ThreeCanvas({ modelPath }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={2} />
      <directionalLight position={[3, 5, 3]} intensity={1.6} />
      <pointLight position={[-2, 2, 2]} intensity={0.7} color="#ffe0b2" />
      <HeaderScene modelPath={modelPath} />
    </Canvas>
  );
}
