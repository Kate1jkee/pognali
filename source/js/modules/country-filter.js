const initCountryFilter = () => {
  const filters = document.querySelectorAll('[data-country-filter]');

  filters.forEach((filter) => {
    const toggle = filter.querySelector('[data-country-filter-toggle]');
    const panel = filter.querySelector('[data-country-filter-panel]');
    const close = filter.querySelector('[data-country-filter-close]');

    if (!toggle || !panel || !close) {
      return;
    }

    const setOpen = (isOpen) => {
      panel.hidden = !isOpen;
      toggle.setAttribute('aria-expanded', String(isOpen));
      filter.classList.toggle('is-open', isOpen);
    };

    const closePanel = () => {
      toggle.focus({preventScroll: true});
      setOpen(false);
      toggle.scrollIntoView({block: 'nearest'});
    };

    setOpen(false);

    toggle.addEventListener('click', () => {
      setOpen(panel.hidden);
    });

    close.addEventListener('click', closePanel);

    filter.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && !panel.hidden) {
        evt.preventDefault();
        closePanel();
      }
    });
  });
};

export {initCountryFilter};
