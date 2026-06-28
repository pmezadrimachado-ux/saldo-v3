export function renderChipSelector({
  name,
  label = '',
  items = [],
  selectedId = '',
  multi = false,
} = {}) {
  return `
    <fieldset class="chip-selector">
      ${label ? `<legend class="chip-selector__label">${label}</legend>` : ''}
      <div class="chip-selector__list" role="${multi ? 'group' : 'radiogroup'}">
        ${items.map((item) => {
          const selected = item.id === selectedId;

          return `
            <label class="chip ${selected ? 'chip--selected' : ''}">
              <input
                type="${multi ? 'checkbox' : 'radio'}"
                name="${name}"
                value="${item.id}"
                ${selected ? 'checked' : ''}
              />
              ${item.icon ? `<span class="chip__icon">${item.icon}</span>` : ''}
              <span>${item.name}</span>
            </label>
          `;
        }).join('')}
      </div>
    </fieldset>
  `;
}
