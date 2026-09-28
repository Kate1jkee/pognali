const initWinnersLink = () => {
  const links = document.querySelectorAll('[data-winners-link]');
  const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
  );

  links.forEach((link) => {
    let isNavigating = false;

    link.addEventListener('click', (event) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
        || event.altKey
        || (link.target && link.target !== '_self')
        || link.hasAttribute('download')
      ) {
        return;
      }

      event.preventDefault();

      if (isNavigating) {
        return;
      }

      isNavigating = true;
      link.classList.add('is-pressed');

      window.setTimeout(() => {
        window.location.assign(link.href);
      }, reducedMotion.matches ? 0 : 500);
    });

    // Сбрасываем состояние при возврате браузером назад.
    window.addEventListener('pageshow', () => {
      isNavigating = false;
      link.classList.remove('is-pressed');
    });
  });
};

export {initWinnersLink};
