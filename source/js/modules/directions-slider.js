// Инициализирует слайдер направлений и управляет автопрокруткой.
const initDirectionsSlider = () => {
  const viewport = document.querySelector('[data-directions-slider]');

  if (!viewport) {
    return;
  }

  const list = viewport.querySelector('.directions__list');

  if (!list || typeof window.Swiper !== 'function') {
    return;
  }

  const slides = Array.from(list.children);
  const desktop = window.matchMedia('(min-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let slider = null;
  let copies = [];

  const updateHeight = () => {
    if (!slider) {
      return;
    }

    const height = slides.slice(0, 3).reduce((sum, slide) => {
      return sum + slide.getBoundingClientRect().height;
    }, 0);

    const gaps = Math.max(0, Math.min(slides.length, 3) - 1) * 10;

    viewport.style.height = `${Math.ceil(height + gaps)}px`;
    slider.update();
  };

  const createSlider = () => {
    if (slider || slides.length < 2) {
      return;
    }

    // Дополняем короткую ленту минимум до шести карточек.
    let index = 0;

    while (list.children.length < 6) {
      const copy = slides[index % slides.length].cloneNode(true);

      copy.setAttribute('aria-hidden', 'true');
      list.append(copy);
      copies.push(copy);
      index += 1;
    }

    viewport.classList.add('swiper', 'is-active');
    list.classList.add('swiper-wrapper');

    Array.from(list.children).forEach((slide) => {
      slide.classList.add('swiper-slide');
    });

    // Высота нужна Swiper до инициализации.
    const height = slides.slice(0, 3).reduce((sum, slide) => {
      return sum + slide.getBoundingClientRect().height;
    }, 0);

    viewport.style.height = `${Math.ceil(
        height + Math.max(0, Math.min(slides.length, 3) - 1) * 10
    )}px`;

    slider = new window.Swiper(viewport, {
      direction: 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 10,
      loop: true,
      loopedSlides: list.children.length,
      speed: reducedMotion.matches ? 0 : 600,
      grabCursor: true,
      autoplay: reducedMotion.matches ? false : {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  };

  const destroySlider = () => {
    if (!slider) {
      return;
    }

    slider.destroy(true, true);
    slider = null;

    copies.forEach((copy) => copy.remove());
    copies = [];

    viewport.classList.remove('swiper', 'is-active');
    viewport.style.removeProperty('height');
    list.classList.remove('swiper-wrapper');

    slides.forEach((slide) => {
      slide.classList.remove('swiper-slide');
    });
  };

  const checkBreakpoint = () => {
    if (desktop.matches) {
      createSlider();
    } else {
      destroySlider();
    }
  };

  viewport.addEventListener('focusin', () => {
    if (slider && slider.autoplay) {
      slider.autoplay.stop();
    }
  });

  viewport.addEventListener('focusout', (evt) => {
    // При переходе между элементами внутри слайдера не запускаем его.
    if (evt.relatedTarget && viewport.contains(evt.relatedTarget)) {
      return;
    }

    if (slider && slider.autoplay && !reducedMotion.matches) {
      slider.autoplay.start();
    }
  });
  desktop.addEventListener('change', checkBreakpoint);

  reducedMotion.addEventListener('change', () => {
    destroySlider();
    checkBreakpoint();
  });

  const resizeObserver = new ResizeObserver(updateHeight);

  slides.forEach((slide) => resizeObserver.observe(slide));

  checkBreakpoint();
};

export {initDirectionsSlider};
