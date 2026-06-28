export function renderCurrencyInput({
  name = 'amount',
  label = 'Valor',
  placeholder = '0,00',
  value = '',
  required = true,
  autofocus = false,
} = {}) {
  return `
    <label class="currency-input">
      <span class="currency-input__label">${label}</span>
      <span class="currency-input__control">
        <span class="currency-input__prefix">R$</span>
        <input
          name="${name}"
          inputmode="decimal"
          autocomplete="off"
          placeholder="${placeholder}"
          value="${value}"
          ${required ? 'required' : ''}
          ${autofocus ? 'autofocus' : ''}
        />
      </span>
    </label>
  `;
}
