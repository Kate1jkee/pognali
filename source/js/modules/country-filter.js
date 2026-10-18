const initCountryFilter = () => {
  const filter = document.querySelector('[data-country-filter]');

  if (!filter) {
    return;
  }

  const toggle = filter.querySelector('[data-country-filter-toggle]');
  const show = filter.querySelector('[data-country-filter-show]');
  const showText = filter.querySelector('[data-country-filter-show-text]');
  const panel = filter.querySelector('[data-country-filter-panel]');
  const close = filter.querySelector('[data-country-filter-close]');
  const checkboxes = filter.querySelectorAll('[data-continent-checkbox]');

  const cards = document.querySelectorAll('[data-catalog-profile]');
  const empty = document.querySelector('[data-catalog-empty]');
  const tablet = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px)'
  );

  if (!toggle || !show || !panel || !close) {
    return;
  }

  const getTrigger = () => tablet.matches ? show : toggle;

  const setOpen = (isOpen) => {
    panel.hidden = !isOpen;
    filter.classList.toggle('is-open', isOpen);

    [toggle, show].forEach((button) => {
      button.setAttribute('aria-expanded', String(isOpen));
    });

    if (showText) {
      showText.textContent = isOpen ? 'Свернуть' : 'Показать все';
    }
  };

  const closePanel = () => {
    const trigger = getTrigger();

    trigger.focus({preventScroll: true});
    setOpen(false);
    trigger.scrollIntoView({block: 'nearest'});
  };

  const filterCards = () => {
    const selected = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

    let visibleCount = 0;

    cards.forEach((card) => {
      const continents = card.dataset.continents.split(' ');
      const matches = selected.length === 0 ||
        selected.some((continent) => continents.includes(continent));

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.hidden = visibleCount > 0;
    }
  };

  [toggle, show].forEach((button) => {
    button.addEventListener('click', () => {
      setOpen(panel.hidden);
    });
  });

  close.addEventListener('click', closePanel);

  filter.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && !panel.hidden) {
      evt.preventDefault();
      closePanel();
    }
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', filterCards);
  });

  setOpen(false);
  filterCards();
};

export {initCountryFilter};
