import React, { useState } from 'react';
import {
  MONTHS_ES,
  DAY_HEADERS,
  getCalendarCells,
  isToday,
  isWeekday,
  getMondayOfWeek,
} from '../utils/dateUtils';
import { getCortadoPersonForDate, getCurrentCortadoPerson } from '../utils/rotationUtils';

// Convierte hex a rgb para poder usar rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function CalendarMonth({ cortadoConfig }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = getCalendarCells(viewYear, viewMonth);
  const currentPerson = getCurrentCortadoPerson(cortadoConfig);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  // Calcula si esta celda está en la semana actual
  function isCurrentWeek(date) {
    const todayMonday = getMondayOfWeek(today);
    const cellMonday = getMondayOfWeek(date);
    return todayMonday.getTime() === cellMonday.getTime();
  }

  // Obtiene el color de fondo para una celda del calendario
  function getCellStyle(cell) {
    const { date, inMonth } = cell;
    if (!inMonth || !isWeekday(date)) return {};

    const person = getCortadoPersonForDate(cortadoConfig, date);
    if (!person) return {};

    const alpha = inMonth ? 0.55 : 0.25;
    return { backgroundColor: hexToRgba(person.color, alpha) };
  }

  const monthLabel = `${MONTHS_ES[viewMonth]} ${viewYear}`;

  return (
    <div className="calendar">
      {/* Persona actual */}
      <div className="calendar__current">
        <span className="calendar__current-label">Esta semana</span>
        {currentPerson ? (
          <span
            className="calendar__current-name"
            style={{ backgroundColor: hexToRgba(currentPerson.color, 0.7) }}
          >
            {currentPerson.name.toUpperCase()}
          </span>
        ) : (
          <span className="calendar__current-name">—</span>
        )}
      </div>

      {/* Navegación de mes */}
      <div className="calendar__nav">
        <button className="calendar__nav-btn" onClick={prevMonth} aria-label="Mes anterior">
          ‹
        </button>
        <span className="calendar__month-label">{monthLabel}</span>
        <button className="calendar__nav-btn" onClick={nextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      {/* Grilla */}
      <div className="calendar__grid">
        {/* Encabezados de días */}
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="calendar__day-header">
            {d}
          </div>
        ))}

        {/* Celdas */}
        {cells.map((cell, i) => {
          const { date, inMonth } = cell;
          const todayClass = isToday(date) ? ' calendar__cell--today' : '';
          const outClass = !inMonth ? ' calendar__cell--out' : '';
          const weekdayClass = isWeekday(date) ? ' calendar__cell--weekday' : ' calendar__cell--weekend';
          const currentWeekClass = inMonth && isCurrentWeek(date) ? ' calendar__cell--current-week' : '';
          const cellStyle = getCellStyle(cell);

          return (
            <div
              key={i}
              className={`calendar__cell${todayClass}${outClass}${weekdayClass}${currentWeekClass}`}
              style={cellStyle}
            >
              <span className="calendar__cell-number">{date.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
