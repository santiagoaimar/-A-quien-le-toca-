import React, { useState } from 'react';
import { DEFAULT_CONFIG } from './data/demoData';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import CalendarMonth from './components/CalendarMonth';
import FridayQueue from './components/FridayQueue';
import PersonLegend from './components/PersonLegend';
import SettingsPanel from './components/SettingsPanel';
import PasswordModal from './components/PasswordModal';

export default function App() {
  const [config, setConfig] = useLocalStorage('quien-le-toca-v1', DEFAULT_CONFIG);

  // La sesión de configuración dura hasta que se cierra el panel (no persiste en localStorage)
  const [unlocked, setUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleSettingsClick() {
    if (unlocked) {
      setSettingsOpen(true);
    } else {
      setShowPassword(true);
    }
  }

  function handlePasswordSuccess() {
    setUnlocked(true);
    setShowPassword(false);
    setSettingsOpen(true);
  }

  function handleSettingsClose() {
    setSettingsOpen(false);
    // Vuelve a pedir contraseña la próxima vez
    setUnlocked(false);
  }

  return (
    <div className="app">
      <Header onSettingsOpen={handleSettingsClick} />

      <main className="app__main">
        {/* Panel CORTADO */}
        <section className="turn-card">
          <div className="turn-card__header turn-card__header--cortado">
            <h2 className="turn-card__title">CORTADO</h2>
            <p className="turn-card__subtitle">7:30–12:15 · 14:00–18:00</p>
          </div>
          <div className="turn-card__body">
            <CalendarMonth cortadoConfig={config.cortado} />
          </div>
        </section>

        {/* Panel VIERNES FELIZ */}
        <section className="turn-card">
          <div className="turn-card__header turn-card__header--viernes">
            <h2 className="turn-card__title">VIERNES FELIZ</h2>
            <p className="turn-card__subtitle">¿Quién trae la comida?</p>
          </div>
          <div className="turn-card__body">
            <FridayQueue viernesFelizConfig={config.viernesFeliz} />
          </div>
        </section>
      </main>

      <PersonLegend cortadoParticipants={config.cortado.participants} />

      {showPassword && (
        <PasswordModal
          onSuccess={handlePasswordSuccess}
          onCancel={() => setShowPassword(false)}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          config={config}
          onSave={setConfig}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
}
