export function renderErrorState({ title = 'Erro', description = 'Não foi possível renderizar esta tela.' } = {}) {
  return `<section class="error-state"><p class="error-state__eyebrow">Erro controlado</p><h2>${title}</h2><p>${description}</p><a class="button button--secondary" href="#/quick-add" data-route="#/quick-add">Voltar para Lançar</a></section>`;
}
