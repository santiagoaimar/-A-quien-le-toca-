import React, { lazy, Suspense, Component } from 'react';

const ThreeCanvas = lazy(() => import('./ThreeCanvas'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function ThreeHero({ modelPath = '/models/Pastelito1.glb' }) {
  return (
    <div className="three-hero">
      <ErrorBoundary>
        <Suspense fallback={null}>
          <ThreeCanvas modelPath={modelPath} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
