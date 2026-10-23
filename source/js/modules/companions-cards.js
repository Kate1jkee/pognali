// Переключает активное состояние карточек на тач-устройствах.
const initCompanionsCards = () => {
  const cards = document.querySelectorAll('[data-companion-card]');
  const breakpoint = window.matchMedia('(pointer: coarse)');

  if (!cards.length) {
    return;
  }

  const toggleCard = (card) => {
    const isActive = card.classList.toggle('is-active');

    card.setAttribute('aria-pressed', String(isActive));
  };

  const updateMode = () => {
    cards.forEach((card) => {
      card.classList.remove('is-active');

      if (breakpoint.matches) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
      } else {
        card.removeAttribute('tabindex');
        card.removeAttribute('role');
        card.removeAttribute('aria-pressed');
      }
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', (evt) => {
      if (!breakpoint.matches) {
        return;
      }

      const control = evt.target.closest(
          'a, button, input, label, select, textarea, [tabindex]'
      );

      if (control && control !== card) {
        return;
      }

      toggleCard(card);
    });

    card.addEventListener('keydown', (evt) => {
      if (!breakpoint.matches || evt.target !== card) {
        return;
      }

      if (evt.key !== 'Enter' && evt.key !== ' ') {
        return;
      }

      evt.preventDefault();
      toggleCard(card);
    });
  });

  breakpoint.addEventListener('change', updateMode);
  updateMode();
};

export {initCompanionsCards};
