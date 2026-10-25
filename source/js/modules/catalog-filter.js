// Раскрывает группы фильтра на небольших экранах.
const initCatalogFilter = () => {
  const form = document.querySelector('[data-catalog-filter-form]');

  if (!form) {
    return;
  }

  const groups = Array.from(
      form.querySelectorAll('[data-catalog-filter-group]')
  );
  const breakpoint = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px)'
  );
  const savedStates = new Map();

  const updateGroups = () => {
    groups.forEach((group) => {
      const heading = group.querySelector('summary');

      if (!heading) {
        return;
      }

      if (breakpoint.matches) {
        if (!savedStates.has(group)) {
          savedStates.set(group, group.open);
        }

        group.open = true;
        heading.setAttribute('tabindex', '-1');
        heading.setAttribute('aria-disabled', 'true');
      } else {
        if (savedStates.has(group)) {
          group.open = savedStates.get(group);
          savedStates.delete(group);
        }

        heading.removeAttribute('tabindex');
        heading.removeAttribute('aria-disabled');
      }
    });
  };

  groups.forEach((group) => {
    const heading = group.querySelector('summary');

    if (!heading) {
      return;
    }

    heading.addEventListener('click', (evt) => {
      if (breakpoint.matches) {
        evt.preventDefault();
      }
    });
  });

  breakpoint.addEventListener('change', updateGroups);
  updateGroups();
};

export {initCatalogFilter};
