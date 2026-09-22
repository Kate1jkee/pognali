const initWinnersList = () => {
  const toggle = document.querySelector('[data-winners-toggle]');

  if (!toggle) {
    return;
  }

  const options = document.querySelector('[data-winners-options]');
  const selected = toggle.querySelector('[data-winners-selected]');
  const buttons = options.querySelectorAll('[data-winners-date]');
  const results = document.querySelectorAll('[data-winners-result]');

  const closeOptions = () => {
    options.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    options.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const drawId = button.dataset.winnersDate;

      selected.textContent = button.textContent;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });

      results.forEach((result) => {
        result.hidden = result.dataset.winnersResult !== drawId;
      });

      closeOptions();
      toggle.focus();
    });
  });

  document.addEventListener('click', (event) => {
    if (
      !toggle.contains(event.target) &&
      !options.contains(event.target)
    ) {
      closeOptions();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !options.hidden) {
      closeOptions();
      toggle.focus();
    }
  });
};

export {initWinnersList};
