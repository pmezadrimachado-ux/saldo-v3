export function renderTextInput({
  name,
  label,
  placeholder = '',
  value = '',
  required = false,
  type = 'text',
} = {}) {
  return `
    <label class="field">
      <span class="field__label">${label}</span>
      <input
        class="input"
        type="${type}"
        name="${name}"
        placeholder="${placeholder}"
        value="${value}"
        ${required ? 'required' : ''}
      />
    </label>
  `;
}
