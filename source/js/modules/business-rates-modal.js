const initBusinessRatesModal = () => {
  const modal = document.querySelector('[data-business-rates-modal]');
  const openButton = document.querySelector('[data-business-rates-open]');

  if (!modal || !openButton) {
    return;
  }

  const closeButton = modal.querySelector('[data-business-rates-close]');

  let previousOverflow = '';

  openButton.addEventListener('click', () => {
    if (modal.open) {
      return;
    }

    previousOverflow = document.documentElement.style.overflow;
    modal.showModal();
    document.documentElement.style.overflow = 'hidden';
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    openButton.focus({preventScroll: true});
  });
};

export {initBusinessRatesModal};
