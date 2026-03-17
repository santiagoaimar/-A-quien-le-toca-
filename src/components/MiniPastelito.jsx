import React, { lazy, Suspense, Component } from 'react';

const MiniCanvas = lazy(() => import('./MiniCanvas'));

// Los 4 modelos disponibles, se ciclan por posición
const MODELS = [
  '/models/Pastelito1.glb',
  '/models/Pastelito2.glb',
  '/models/Pastelito3.glb',
  '/models/Pastelito4.glb',
];

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function MiniPastelito({ index = 0, size = 70 }) {
  const modelPath = MODELS[index % MODELS.length];
  const phase = index * 1.1; // fase distinta para que cada uno flote diferente

  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={null}>
          <MiniCanvas modelPath={modelPath} phase={phase} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
