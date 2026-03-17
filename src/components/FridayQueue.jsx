import React from 'react';
import { getViernesFelizQueue } from '../utils/rotationUtils';
import { getUpcomingFriday } from '../utils/dateUtils';
import PastelCanvas from './PastelCanvas';

// Gradiente de violetas exacto del mockup Figma, de más intenso a más clarito
const PURPLE_GRADIENT = [
  { bg: '#9c4ffa', text: '#fff' },   // 0 — le toca este viernes
  { bg: '#b070ff', text: '#fff' },   // 1
  { bg: '#ca9fff', text: '#fff' },   // 2
  { bg: '#e3ccff', text: '#5a3a8a' }, // 3
  { bg: '#ebdbff', text: '#7a5aaa' }, // 4
  { bg: '#f3edff', text: '#9070bb' }, // 5+ por si hay más personas
];

function formatFriday(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}`;
}

export default function FridayQueue({ viernesFelizConfig }) {
  const queue = getViernesFelizQueue(viernesFelizConfig);
  const upcomingFriday = getUpcomingFriday();

  function getFridayDate(positionIndex) {
    const d = new Date(upcomingFriday);
    d.setDate(d.getDate() + positionIndex * 7);
    return d;
  }

  if (!queue.length) {
    return <div className="friday-queue friday-queue--empty">Sin participantes</div>;
  }

  return (
    <div className="friday-queue">
      <div className="friday-queue__header-note">
        <span className="friday-queue__badge">PRÓXIMOS TURNOS</span>
      </div>

      <div className="friday-queue__list">
        {queue.map((person, i) => {
          const style = PURPLE_GRADIENT[Math.min(i, PURPLE_GRADIENT.length - 1)];
          const fridayDate = getFridayDate(i);
          const isFirst = i === 0;

          return (
            <div
              key={person.name + i}
              className={`friday-queue__item${isFirst ? ' friday-queue__item--current' : ''}`}
              style={{ backgroundColor: style.bg }}
            >
              {/* Indicador posición */}
              <div className="friday-queue__indicator">
                {isFirst ? (
                  <span className="friday-queue__star" style={{ color: 'rgba(255,255,255,0.9)' }}>★</span>
                ) : (
                  <span className="friday-queue__pos" style={{ color: style.text, opacity: 0.6 }}>{i + 1}</span>
                )}
              </div>

              {/* Nombre */}
              <span className="friday-queue__name" style={{ color: style.text }}>
                {person.name.toUpperCase()}
              </span>

              {/* Fecha */}
              <span
                className="friday-queue__date"
                style={{ color: i <= 2 ? 'rgba(255,255,255,0.72)' : style.text, opacity: i <= 2 ? 1 : 0.65 }}
              >
                Vie {formatFriday(fridayDate)}
              </span>

              {/* Pastelito 3D decorativo — mismo modelo para todos, fase distinta */}
              <div className="friday-queue__pastelito">
                <PastelCanvas queuePosition={i} pickIndex={1} size={isFirst ? 90 : 75} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="friday-queue__footer">
        ★ Le toca <strong>este viernes {formatFriday(upcomingFriday)}</strong>
      </p>
    </div>
  );
}
