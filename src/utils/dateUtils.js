// Nombres en español
export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Encabezados del calendario (Domingo primero, como en Argentina)
export const DAY_HEADERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

/**
 * Devuelve el viernes de la semana actual.
 * Si hoy ES viernes, devuelve hoy.
 * Si ya pasó el viernes esta semana, devuelve el próximo viernes.
 */
export function getUpcomingFriday(from = new Date()) {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Dom, 5=Vie
  // Si hoy es sábado (6) o domingo (0), buscar el próximo viernes
  const daysAhead = day === 0 ? 5 : day <= 5 ? 5 - day : 7 - day + 5;
  d.setDate(d.getDate() + daysAhead);
  return d;
}

/**
 * Devuelve el lunes de la semana que contiene la fecha dada.
 */
export function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Domingo → lunes anterior
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Cuenta cuántas semanas completas (bloques de 7 días) hay entre dateA y dateB.
 * Puede ser negativo si dateB es anterior a dateA.
 */
export function weeksBetween(dateA, dateB) {
  const ms = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((dateB.getTime() - dateA.getTime()) / ms);
}

/**
 * Parsea "YYYY-MM-DD" como fecha local (evita problemas de timezone UTC).
 */
export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Formatea una fecha como "YYYY-MM-DD".
 */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Verifica si una fecha es hoy.
 */
export function isToday(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Verifica si una fecha es día hábil (lunes a viernes).
 */
export function isWeekday(date) {
  const d = date.getDay();
  return d >= 1 && d <= 5;
}

/**
 * Genera las celdas del calendario para un mes dado.
 * Empieza desde el domingo anterior (o igual) al día 1 del mes.
 * Retorna arreglo de objetos { date, inMonth }.
 */
export function getCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = new Date(firstDay);
  // Retroceder hasta el domingo
  startDay.setDate(startDay.getDate() - startDay.getDay());

  const cells = [];
  const d = new Date(startDay);

  // Generar hasta 6 semanas (42 días) y cortar si la última fila está fuera del mes
  for (let i = 0; i < 42; i++) {
    cells.push({ date: new Date(d), inMonth: d.getMonth() === month });
    d.setDate(d.getDate() + 1);
  }

  // Si la última semana entera está fuera del mes, quitarla
  const last7 = cells.slice(-7);
  if (last7.every((c) => !c.inMonth)) {
    cells.splice(-7);
  }

  return cells;
}
