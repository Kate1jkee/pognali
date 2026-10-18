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

    const render = () => {
      minField.value = String(min);
      maxField.value = String(max);

      minRange.value = String(min);
      maxRange.value = String(max);

      track.style.setProperty('--min', `${min}%`);
      track.style.setProperty('--max', `${max}%`);

      // При совпадении на 100 даём доступ к левому ползунку.
      minRange.style.zIndex = min === 100 ? '2' : '1';
      maxRange.style.zIndex = min === 100 ? '1' : '2';
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

    render();
  });
};

export {initLevelFilter};
