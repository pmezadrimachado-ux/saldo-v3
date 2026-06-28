export function renderInsightCard({ title, text, tone = 'neutral' } = {}) {
  return `
    <article class="insight-card insight-card--${tone}">
      <p>${title}</p>
      <strong>${text}</strong>
    </article>
  `;
}

export function renderInsightList(insights = []) {
  if (!insights.length) {
    return `
      <div class="insight-list">
        ${renderInsightCard({
          title: 'Comece lançando',
          text: 'Registre seus primeiros gastos para gerar insights.',
          tone: 'neutral',
        })}
      </div>
    `;
  }

  return `
    <div class="insight-list">
      ${insights.map(renderInsightCard).join('')}
    </div>
  `;
}
