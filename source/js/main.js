import {mobileVhFix} from './utils/mobile-vh-fix.js';
import {initWinnersList} from './modules/winners-list.js';
import {initParticipationForms} from './modules/participation-form.js';
import {initPrizesSliders} from './modules/prizes-slider.js';
import {initScrollReveal} from './modules/scroll-reveal.js';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  mobileVhFix();
  initWinnersList();
  initParticipationForms();
  initPrizesSliders();
  initScrollReveal();

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
