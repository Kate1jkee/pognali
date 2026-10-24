// Управляет раскрытием фильтра стран, выбором букв и фильтрацией карточек.
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
  const groups = Array.from(
      filter.querySelectorAll('[data-country-group]')
  );

  const cards = document.querySelectorAll('[data-catalog-profile]');
  const empty = document.querySelector('[data-catalog-empty]');

  const tablet = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px)'
  );
  const lettersMedia = window.matchMedia('(max-width: 1023px)');

  if (!toggle || !show || !panel || !close) {
    return;
  }

  let activeGroupIndex = 0;

  const getTrigger = () => tablet.matches ? show : toggle;

  const setOpen = (isOpen) => {
    panel.hidden = !isOpen;
    filter.classList.toggle('is-open', isOpen);

    [toggle, show].forEach((button) => {
      button.setAttribute('aria-expanded', String(isOpen));
    });

    if (showText) {
      showText.textContent = isOpen
        ? showText.dataset.textOpen
        : showText.dataset.textClosed;
    }
  };

  const closePanel = () => {
    const trigger = getTrigger();

    trigger.focus({preventScroll: true});
    setOpen(false);
    trigger.scrollIntoView({block: 'nearest'});
  };

  const updateLetters = () => {
    groups.forEach((group, index) => {
      const button = group.querySelector('[data-country-letter]');

      if (!button) {
        return;
      }

      const isActive = index === activeGroupIndex;

      group.classList.toggle('is-active', isActive);
      button.disabled = !lettersMedia.matches;

      if (lettersMedia.matches) {
        button.setAttribute('aria-expanded', String(isActive));
      } else {
        button.removeAttribute('aria-expanded');
      }
    });
  };

  const filterCards = () => {
    const selected = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

    let visibleCount = 0;

    cards.forEach((card) => {
      const continents = (card.dataset.continents || '').split(' ');
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

  groups.forEach((group, index) => {
    const button = group.querySelector('[data-country-letter]');

    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      if (!lettersMedia.matches) {
        return;
      }

      activeGroupIndex = index;
      updateLetters();
    });
  });

  lettersMedia.addEventListener('change', updateLetters);

  updateLetters();
  setOpen(false);
  filterCards();
};

export {initCountryFilter};
