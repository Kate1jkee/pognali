const initPrizesSliders = () => {
  const sliders = document.querySelectorAll('[data-prizes-slider]');

  if (!sliders.length || !window.Swiper) {
    return;
  }

  const breakpoint = window.matchMedia('(max-width: 767px)');
  const spaceBetween = 16;

  sliders.forEach((element) => {
    const list = element.querySelector('.prize-group__list');

    if (!list) {
      return;
    }

    let swiper = null;
    let frameId = null;
    let previousSlides = [];

    // Технические копии Swiper в расчёте не участвуют.
    const getOriginalSlides = () => {
      return Array.from(list.children).filter((slide) => {
        return slide.classList.contains('prize-group__item')
          && !slide.classList.contains('swiper-slide-duplicate');
      });
    };

    const destroySlider = () => {
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }

      element.classList.remove('is-slider-active');
    };

    const updateSlider = () => {
      const slides = getOriginalSlides();

      const slidesChanged = slides.length !== previousSlides.length
        || slides.some((slide, index) => {
          return slide !== previousSlides[index];
        });

      previousSlides = slides;

      if (!breakpoint.matches) {
        destroySlider();
        return;
      }

      // offsetWidth не зависит от анимации scale у группы.
      const cardsWidth = slides.reduce((total, slide) => {
        return total + slide.offsetWidth;
      }, 0);

      const gapsWidth = Math.max(0, slides.length - 1) * spaceBetween;
      const requiredWidth = cardsWidth + gapsWidth;
      const availableWidth = element.clientWidth;

      const needsSlider = slides.length > 1
        && availableWidth > 0
        && requiredWidth > availableWidth;

      if (!needsSlider) {
        destroySlider();
        return;
      }

      // При изменении состава карточек пересоздаём технические копии.
      if (swiper && slidesChanged) {
        destroySlider();
      }

      if (swiper) {
        swiper.update();
        return;
      }

      element.classList.add('is-slider-active');

      swiper = new window.Swiper(element, {
        wrapperClass: 'prize-group__list',
        slideClass: 'prize-group__item',
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween,
        loop: true,
        loopedSlides: slides.length,
        speed: 500,
        watchOverflow: false,
        grabCursor: true,
      });
    };

    // Следим за добавлением и удалением li внутри списка.
    const mutationObserver = new MutationObserver(() => {
      scheduleUpdate();
    });

    const runUpdate = () => {
      // Не реагируем на копии, которые создаёт сам Swiper.
      mutationObserver.disconnect();

      try {
        updateSlider();
      } finally {
        mutationObserver.observe(list, {
          childList: true,
        });
      }
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        runUpdate();
      });
    };

    runUpdate();

    breakpoint.addListener(scheduleUpdate);
    window.addEventListener('resize', scheduleUpdate);

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(element);
    }
  });
};

export {initPrizesSliders};
