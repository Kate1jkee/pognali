const initScrollReveal = () => {
  const blocks = document.querySelectorAll('[data-reveal]');
  const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
  );

  if (
    !blocks.length
    || reducedMotion.matches
    || !('IntersectionObserver' in window)
  ) {
    return;
  }

  const thresholds = Array.from({length: 101}, (_, index) => {
    return index / 100;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const viewportHeight = entry.rootBounds
        ? entry.rootBounds.height
        : document.documentElement.clientHeight;

      const customThreshold = Number(
          entry.target.dataset.revealThreshold
      );

      const revealThreshold = customThreshold > 0 && customThreshold <= 1
        ? customThreshold
        : 0.45;

      const requiredHeight = Math.min(
          entry.boundingClientRect.height,
          viewportHeight
      ) * revealThreshold;

      if (entry.intersectionRect.height < requiredHeight) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: thresholds,
  });

  blocks.forEach((block) => {
    block.classList.add('is-reveal-ready');
  });

  // Даём браузеру отрисовать его, затем запускаем наблюдение.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      blocks.forEach((block) => {
        observer.observe(block);
      });
    });
  });
};
export {initScrollReveal};
