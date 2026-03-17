import {
  getUpcomingFriday,
  getMondayOfWeek,
  weeksBetween,
  parseDate,
} from './dateUtils';

/**
 * Calcula el índice de la persona que le toca en la rotación,
 * dado un arreglo de participantes, una fecha base y una fecha objetivo.
 *
 * La fecha base es cuándo la persona en índice 0 tuvo su turno.
 * Avanza una posición por semana.
 */
function getRotationIndex(participants, baseDateStr, targetDate) {
  if (!participants.length) return 0;
  const base = parseDate(baseDateStr);
  const weeks = weeksBetween(base, targetDate);
  // Modulo siempre positivo aunque weeks sea negativo
  return ((weeks % participants.length) + participants.length) % participants.length;
}

/**
 * Devuelve la lista de participantes de Viernes Feliz reordenada
 * para que el primero sea quien le toca este viernes.
 */
export function getViernesFelizQueue(config, referenceDate = new Date()) {
  const { participants, baseDate } = config;
  if (!participants.length) return [];
  const friday = getUpcomingFriday(referenceDate);
  const idx = getRotationIndex(participants, baseDate, friday);
  return [...participants.slice(idx), ...participants.slice(0, idx)];
}

/**
 * Devuelve el participante de Cortado para la semana actual.
 */
export function getCurrentCortadoPerson(config, referenceDate = new Date()) {
  const { participants, baseDate } = config;
  if (!participants.length) return null;
  const monday = getMondayOfWeek(referenceDate);
  const idx = getRotationIndex(participants, baseDate, monday);
  return participants[idx];
}

/**
 * Devuelve el participante de Cortado para la semana que contiene `date`.
 * Útil para pintar el calendario.
 */
export function getCortadoPersonForDate(config, date) {
  const { participants, baseDate } = config;
  if (!participants.length) return null;
  const monday = getMondayOfWeek(date);
  const idx = getRotationIndex(participants, baseDate, monday);
  return participants[idx];
}
