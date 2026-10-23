// Управляет открытием и закрытием модалки бизнес-тарифов.
const initBusinessRatesModal = () => {
  const modal = document.querySelector('[data-business-rates-modal]');
  const openButton = document.querySelector('[data-business-rates-open]');

  if (!modal || !openButton) {
    return;
  }

  const closeButton = modal.querySelector('[data-business-rates-close]');

  if (!closeButton) {
    return;
  }

  let pointerStartedOutside = false;

  const updatePosition = () => {
    if (!modal.open) {
      return;
    }

    const section = openButton.closest('.rates');
    const title = section && section.querySelector('.rates__title');

    const desiredTop = title
      ? title.getBoundingClientRect().top
      : (window.innerHeight - modal.offsetHeight) / 2;

    const maxTop = Math.max(
        16,
        window.innerHeight - modal.offsetHeight - 16
    );

    const top = Math.max(16, Math.min(desiredTop, maxTop));

    modal.style.setProperty('--modal-top', `${top}px`);
  };

  const isOutside = (evt) => {
    const rect = modal.getBoundingClientRect();

    return evt.clientX < rect.left ||
      evt.clientX > rect.right ||
      evt.clientY < rect.top ||
      evt.clientY > rect.bottom;
  };

  openButton.addEventListener('click', () => {
    if (modal.open) {
      return;
    }

    document.documentElement.classList.add('scroll-lock');
    modal.showModal();
    updatePosition();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('pointerdown', (evt) => {
    pointerStartedOutside = evt.target === modal && isOutside(evt);
  });

  modal.addEventListener('click', (evt) => {
    if (pointerStartedOutside &&
        evt.target === modal &&
        isOutside(evt)) {
      modal.close();
    }

    pointerStartedOutside = false;
  });

  modal.addEventListener('pointercancel', () => {
    pointerStartedOutside = false;
  });

  modal.addEventListener('close', () => {
    document.documentElement.classList.remove('scroll-lock');
    modal.style.removeProperty('--modal-top');
    pointerStartedOutside = false;
    openButton.focus({preventScroll: true});
  });

  window.addEventListener('resize', updatePosition);
};

export {initBusinessRatesModal};
