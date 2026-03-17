import React, { useState, useRef, useEffect } from 'react';

const PASSWORD = 'Pastelito*';

export default function PasswordModal({ onSuccess, onCancel }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (value === PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 400);
      inputRef.current?.focus();
    }
  }

  return (
    <div
      className="settings-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={`password-modal${shake ? ' password-modal--shake' : ''}`}>
        <div className="password-modal__icon">🔒</div>
        <h2 className="password-modal__title">Configuración</h2>
        <p className="password-modal__subtitle">
          Ingresá la contraseña para editar las rotaciones
        </p>

        <form onSubmit={handleSubmit} className="password-modal__form">
          <input
            ref={inputRef}
            type="password"
            className={`password-modal__input${error ? ' password-modal__input--error' : ''}`}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Contraseña"
            autoComplete="off"
          />
          {error && (
            <p className="password-modal__error">Contraseña incorrecta</p>
          )}

          <div className="password-modal__actions">
            <button
              type="button"
              className="settings-panel__cancel-btn"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button type="submit" className="settings-panel__save-btn">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
