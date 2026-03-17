import React, { useState } from 'react';
import { formatDate, parseDate } from '../utils/dateUtils';
import { DEFAULT_CONFIG } from '../data/demoData';

// Editor de lista de participantes con orden + colores
function ParticipantEditor({ participants, onChange, title }) {
  function updateColor(index, color) {
    const updated = participants.map((p, i) => (i === index ? { ...p, color } : p));
    onChange(updated);
  }

  function updateName(index, name) {
    const updated = participants.map((p, i) => (i === index ? { ...p, name } : p));
    onChange(updated);
  }

  function moveUp(index) {
    if (index === 0) return;
    const updated = [...participants];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  }

  function moveDown(index) {
    if (index === participants.length - 1) return;
    const updated = [...participants];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  }

  function remove(index) {
    onChange(participants.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...participants, { name: 'Nuevo', color: '#cccccc' }]);
  }

  return (
    <div className="settings__section">
      <h3 className="settings__section-title">{title}</h3>
      {participants.map((p, i) => (
        <div key={i} className="settings__participant-row">
          <div className="settings__participant-order">
            <button onClick={() => moveUp(i)} disabled={i === 0} title="Subir">↑</button>
            <span className="settings__pos-num">{i + 1}</span>
            <button onClick={() => moveDown(i)} disabled={i === participants.length - 1} title="Bajar">↓</button>
          </div>

          <input
            type="text"
            className="settings__name-input"
            value={p.name}
            onChange={(e) => updateName(i, e.target.value)}
          />

          <input
            type="color"
            className="settings__color-picker"
            value={p.color.length === 7 ? p.color : '#cccccc'}
            onChange={(e) => updateColor(i, e.target.value)}
            title="Color del participante"
          />

          <button
            className="settings__remove-btn"
            onClick={() => remove(i)}
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      ))}
      <button className="settings__add-btn" onClick={add}>
        + Agregar participante
      </button>
    </div>
  );
}

export default function SettingsPanel({ config, onSave, onClose }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(config)));

  function updateVF(key, value) {
    setDraft((d) => ({ ...d, viernesFeliz: { ...d.viernesFeliz, [key]: value } }));
  }

  function updateCortado(key, value) {
    setDraft((d) => ({ ...d, cortado: { ...d.cortado, [key]: value } }));
  }

  function updateBruno(key, value) {
    setDraft((d) => ({ ...d, bruno: { ...d.bruno, [key]: value } }));
  }

  function handleSave() {
    onSave(draft);
    onClose();
  }

  function handleReset() {
    if (confirm('¿Resetear toda la configuración a los valores demo?')) {
      onSave(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
      onClose();
    }
  }

  return (
    <div className="settings-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="settings-panel">
        <div className="settings-panel__header">
          <h2 className="settings-panel__title">Configuración</h2>
          <button className="settings-panel__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="settings-panel__body">
          {/* VIERNES FELIZ */}
          <div className="settings__card">
            <h2 className="settings__card-title settings__card-title--viernes">Viernes Feliz</h2>
            <ParticipantEditor
              participants={draft.viernesFeliz.participants}
              onChange={(p) => updateVF('participants', p)}
              title="Orden de turno"
            />
            <div className="settings__section">
              <label className="settings__label">
                Fecha base (viernes cuando el primero tuvo su turno)
                <input
                  type="date"
                  className="settings__date-input"
                  value={draft.viernesFeliz.baseDate}
                  onChange={(e) => updateVF('baseDate', e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* CORTADO */}
          <div className="settings__card">
            <h2 className="settings__card-title settings__card-title--cortado">Cortado</h2>
            <ParticipantEditor
              participants={draft.cortado.participants}
              onChange={(p) => updateCortado('participants', p)}
              title="Orden de rotación (sin Bruno)"
            />
            <div className="settings__section">
              <label className="settings__label">
                Fecha base (lunes cuando el primero empezó cortado)
                <input
                  type="date"
                  className="settings__date-input"
                  value={draft.cortado.baseDate}
                  onChange={(e) => updateCortado('baseDate', e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* BRUNO */}
          <div className="settings__card">
            <h2 className="settings__card-title">Bruno (corrido fijo)</h2>
            <div className="settings__section">
              <div className="settings__participant-row">
                <input
                  type="text"
                  className="settings__name-input"
                  value={draft.bruno.name}
                  onChange={(e) => updateBruno('name', e.target.value)}
                />
                <input
                  type="color"
                  className="settings__color-picker"
                  value={draft.bruno.color.length === 7 ? draft.bruno.color : '#ff9f9f'}
                  onChange={(e) => updateBruno('color', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* MODELO 3D */}
          <div className="settings__card">
            <h2 className="settings__card-title">Modelo 3D</h2>
            <div className="settings__section">
              <label className="settings__label">
                Ruta del modelo (.glb desde /public)
                <input
                  type="text"
                  className="settings__name-input"
                  style={{ width: '100%' }}
                  value={draft.modelPath}
                  onChange={(e) => setDraft((d) => ({ ...d, modelPath: e.target.value }))}
                  placeholder="/models/Pastelito1.glb"
                />
              </label>
              <p className="settings__hint">
                Modelos disponibles: /models/Pastelito1.glb · /models/Pastelito2.glb · /models/Pastelito3.glb · /models/Pastelito4.glb
              </p>
            </div>
          </div>
        </div>

        <div className="settings-panel__footer">
          <button className="settings-panel__reset-btn" onClick={handleReset}>
            Resetear a demo
          </button>
          <div className="settings-panel__actions">
            <button className="settings-panel__cancel-btn" onClick={onClose}>Cancelar</button>
            <button className="settings-panel__save-btn" onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
