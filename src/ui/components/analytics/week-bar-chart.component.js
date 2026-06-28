export function renderWeekBarChart({
  values = [0, 0, 0, 0, 0, 0, 0],
  labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
} = {}) {
  const max = Math.max(...values.map((value) => Number(value) || 0), 1);

  return `
    <div class="week-chart" aria-label="Gráfico semanal">
      ${values.map((value, index) => {
        const height = Math.max(8, Math.round(((Number(value) || 0) / max) * 100));

        return `
          <div class="week-chart__item">
            <span class="week-chart__bar" style="height:${height}%"></span>
            <small>${labels[index]}</small>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
