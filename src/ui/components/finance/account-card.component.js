export function renderAccountCard({
  name,
  type = 'Conta',
  balance = 'R$ 0,00',
  color = '#A3FF12',
  status = 'Ativa',
} = {}) {
  return `
    <article class="account-card">
      <span class="account-card__dot" style="background:${color}"></span>
      <div>
        <h3>${name}</h3>
        <p>${type} • ${status}</p>
      </div>
      <strong>${balance}</strong>
    </article>
  `;
}
