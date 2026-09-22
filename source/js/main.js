import {mobileVhFix} from './utils/mobile-vh-fix.js';
import {initWinnersList} from './modules/winners-list.js';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {
  // Utils
  // ---------------------------------

  mobileVhFix();
  initWinnersList();


  // Courses slider
  // ---------------------------------

  // eslint-disable-next-line no-unused-vars
  const coursesSlider = new window.Swiper('.courses__slider', {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 12,
    navigation: {
      prevEl: '.courses__control--prev',
      nextEl: '.courses__control--next',
    },
  });

  // Promo slider
  // ---------------------------------

  // eslint-disable-next-line no-unused-vars
  const promoSlider = new window.Swiper('.promo__slider', {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 12,
    navigation: {
      prevEl: '.promo__control--prev',
      nextEl: '.promo__control--next',
    },
  });
});
// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используейтся matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
