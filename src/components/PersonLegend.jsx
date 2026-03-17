import React from 'react';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function PersonLegend({ cortadoParticipants }) {
  return (
    <footer className="legend">
      <div className="legend__group">
        <span className="legend__title">CORTADO:</span>
        {cortadoParticipants.map((p) => (
          <span
            key={p.name}
            className="legend__pill"
            style={{ backgroundColor: hexToRgba(p.color, 0.55) }}
          >
            {p.name.toUpperCase()}
          </span>
        ))}
      </div>
    </footer>
  );
}
