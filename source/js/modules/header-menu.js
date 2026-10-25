// Управляет адаптивным меню и блокирует взаимодействие с фоном.
const initHeaderMenu = () => {
  const header = document.querySelector('[data-header]');

  if (!header) {
    return;
  }

  const wrapper = header.querySelector('[data-header-wrapper]');
  const toggle = header.querySelector('[data-header-toggle]');
  const menu = header.querySelector('[data-header-menu]');
  const logo = header.querySelector('[data-header-logo]');
  const breakpoint = window.matchMedia('(max-width: 1023px)');
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  if (!wrapper || !toggle || !menu || !logo) {
    return;
  }

  const background = Array.from(document.querySelectorAll('main, footer'));
  let previousInert = [];

  const updateLogo = () => {
    if (header.classList.contains('is-open')) {
      logo.src = logo.dataset.logoOpen;
      return;
    }

    logo.src = mobileBreakpoint.matches
      ? logo.dataset.logoMobile || logo.dataset.logoDefault
      : logo.dataset.logoDefault;
  };

  const setOpen = (isOpen, restoreFocus = true) => {
    if (isOpen === header.classList.contains('is-open')) {
      return;
    }

    header.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute(
        'aria-label',
        isOpen ? toggle.dataset.labelClose : toggle.dataset.labelOpen
    );

    updateLogo();

    if (isOpen) {
      previousInert = background.map((element) => element.inert);

      background.forEach((element) => {
        element.inert = true;
      });

      document.documentElement.setAttribute('data-header-menu-open', '');
      wrapper.setAttribute('role', 'dialog');
      wrapper.setAttribute('aria-modal', 'true');
      wrapper.setAttribute('aria-label', 'Меню');

      toggle.focus({preventScroll: true});
    } else {
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });

      document.documentElement.removeAttribute('data-header-menu-open');
      wrapper.removeAttribute('role');
      wrapper.removeAttribute('aria-modal');
      wrapper.removeAttribute('aria-label');

      if (restoreFocus) {
        toggle.focus({preventScroll: true});
      }
    }
  };

  toggle.addEventListener('click', () => {
    if (breakpoint.matches) {
      setOpen(!header.classList.contains('is-open'));
    }
  });

  header.addEventListener('keydown', (evt) => {
    if (!header.classList.contains('is-open')) {
      return;
    }

    if (evt.key === 'Escape') {
      evt.preventDefault();
      setOpen(false);
      return;
    }

    if (evt.key !== 'Tab') {
      return;
    }

    const controls = Array.from(wrapper.querySelectorAll(
        'a[href], button:not(:disabled), [tabindex="0"]'
    )).filter((element) => element.getClientRects().length);

    if (!controls.length) {
      return;
    }

    const first = controls[0];
    const last = controls[controls.length - 1];

    if (evt.shiftKey && document.activeElement === first) {
      evt.preventDefault();
      last.focus();
    } else if (!evt.shiftKey && document.activeElement === last) {
      evt.preventDefault();
      first.focus();
    }
  });

  menu.addEventListener('click', (evt) => {
    if (evt.target.closest('a')) {
      setOpen(false);
    }
  });

  document.addEventListener('click', (evt) => {
    if (!header.classList.contains('is-open')) {
      return;
    }

    if (!wrapper.contains(evt.target)) {
      setOpen(false);
    }
  });

  breakpoint.addEventListener('change', () => {
    if (!breakpoint.matches) {
      setOpen(false, false);
    }

    updateLogo();
  });

  mobileBreakpoint.addEventListener('change', updateLogo);

  updateLogo();
};

export {initHeaderMenu};
