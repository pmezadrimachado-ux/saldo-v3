export function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function getMonthKey(dateValue) {
  return String(dateValue).slice(0, 7);
}

export function getWeekKey(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = temp.getUTCDay() || 7;

  temp.setUTCDate(temp.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);

  return `${temp.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export function formatDateBR(dateValue) {
  if (!dateValue) return '';

  const [year, month, day] = dateValue.split('-');

  return `${day}/${month}/${year}`;
}

export function addMonthsToDate(dateValue, monthsToAdd) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1 + Number(monthsToAdd), day);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}
