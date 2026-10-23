// Синхронизирует поля и ползунки диапазона уровня.
const initLevelFilter = () => {
  const filters = document.querySelectorAll('[data-level-filter]');

  filters.forEach((filter) => {
    const minField = filter.querySelector('[data-level-min]');
    const maxField = filter.querySelector('[data-level-max]');
    const minRange = filter.querySelector('[data-range-min]');
    const maxRange = filter.querySelector('[data-range-max]');
    const track = filter.querySelector('[data-level-range]');

    if (!minField || !maxField || !minRange || !maxRange || !track) {
      return;
    }

    const clamp = (value) => Math.min(100, Math.max(0, Math.round(value)));

    let min = clamp(Number(minField.value));
    let max = Math.max(min, clamp(Number(maxField.value)));
    let isSyncing = false;

    const render = (notify = true) => {
      const fields = [
        {element: minField, value: String(min)},
        {element: maxField, value: String(max)},
        {element: minRange, value: String(min)},
        {element: maxRange, value: String(max)}
      ];

      const changed = fields.filter(({element, value}) => {
        return element.value !== value;
      });

      fields.forEach(({element, value}) => {
        element.value = value;
      });

      track.style.setProperty('--min', `${min}%`);
      track.style.setProperty('--max', `${max}%`);

      // При совпадении на 100 оставляем доступ к левому ползунку.
      filter.classList.toggle('is-min-on-top', min === 100);

      if (!notify) {
        return;
      }

      isSyncing = true;

      try {
        changed.forEach(({element}) => {
          element.dispatchEvent(new Event('change', {bubbles: true}));
        });
      } finally {
        isSyncing = false;
      }
    };

    minRange.addEventListener('input', () => {
      min = Math.min(clamp(Number(minRange.value)), max);
      render();
    });

    maxRange.addEventListener('input', () => {
      max = Math.max(clamp(Number(maxRange.value)), min);
      render();
    });

    const commitField = (field, isMin) => {
      const value = field.valueAsNumber;

      if (Number.isFinite(value)) {
        if (isMin) {
          min = Math.min(clamp(value), max);
        } else {
          max = Math.max(clamp(value), min);
        }
      }

      render();
    };

    [
      {field: minField, isMin: true},
      {field: maxField, isMin: false}
    ].forEach(({field, isMin}) => {
      field.addEventListener('change', () => {
        if (isSyncing) {
          return;
        }

        commitField(field, isMin);
      });

      field.addEventListener('blur', () => {
        commitField(field, isMin);
      });

      field.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          commitField(field, isMin);
        }
      });
    });

    render(false);
  });
};

export {initLevelFilter};
