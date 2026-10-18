const initCompanionsCards = () => {
  const cards = document.querySelectorAll('[data-companion-card]');
  const breakpoint = window.matchMedia('(max-width: 1023px)');

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
    card.addEventListener('click', () => {
      if (breakpoint.matches) {
        toggleCard(card);
      }
    });

    card.addEventListener('keydown', (evt) => {
      if (!breakpoint.matches ||
          (evt.key !== 'Enter' && evt.key !== ' ')) {
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
