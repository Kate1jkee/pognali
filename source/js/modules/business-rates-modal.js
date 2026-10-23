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

  const isOutside = (evt) => {
    const rect = modal.getBoundingClientRect();

    return evt.clientX < rect.left ||
      evt.clientX > rect.right ||
      evt.clientY < rect.top ||
      evt.clientY > rect.bottom;
  };

  let pointerStartedOutside = false;

  openButton.addEventListener('click', () => {
    if (!modal.open) {
      modal.showModal();
      document.documentElement.classList.add('scroll-lock');
    }
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
    pointerStartedOutside = false;
    openButton.focus({preventScroll: true});
  });
};

export {initBusinessRatesModal};
