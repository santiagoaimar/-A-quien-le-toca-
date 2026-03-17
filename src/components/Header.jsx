import React from 'react';

export default function Header({ onSettingsOpen }) {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <div className="app-header__title-wrap">
          <h1 className="app-header__title">¿A QUIÉN LE TOCA?</h1>
          <p className="app-header__subtitle">Rotaciones del equipo IT</p>
        </div>
      </div>

      <button
        className="settings-btn"
        onClick={onSettingsOpen}
        title="Configuración"
        aria-label="Abrir configuración"
      >
        ⚙
      </button>
    </header>
  );
}
