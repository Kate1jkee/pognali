const initPrizesSliders = () => {
  const sliders = document.querySelectorAll('[data-prizes-slider]');

  if (!sliders.length || !window.Swiper) {
    return;
  }

  const breakpoint = window.matchMedia('(max-width: 767px)');

  const instances = Array.from(sliders).map((element) => {
    return {
      element,
      swiper: null,
    };
  });

  const updateSliders = () => {
    instances.forEach((item) => {
      if (breakpoint.matches && !item.swiper) {
        const slides = item.element.querySelectorAll('.draw__item');

        if (!slides.length) {
          return;
        }

        item.swiper = new window.Swiper(item.element, {
          wrapperClass: 'draw__list',
          slideClass: 'draw__item',
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 0,
          loop: slides.length > 1,
          speed: 500,
          watchOverflow: true,
          grabCursor: slides.length > 1,
        });
      }

      if (!breakpoint.matches && item.swiper) {
        item.swiper.destroy(true, true);
        item.swiper = null;
      }
    });
  };

  updateSliders();
  breakpoint.addListener(updateSliders);
};

export {initPrizesSliders};
