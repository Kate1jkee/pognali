// Исправляет высоту экрана на мобильных устройствах.
import {mobileVhFix} from './utils/mobile-vh-fix.js';

// Управляет раскрытием фильтра стран и фильтрацией карточек.
import {initCountryFilter} from './modules/country-filter.js';

// Инициализирует слайдер направлений и управляет автопрокруткой.
import {initDirectionsSlider} from './modules/directions-slider.js';

// Переключает активное состояние карточек на тач-устройствах.
import {initCompanionsCards} from './modules/companions-cards.js';

// Управляет открытием и закрытием модалки бизнес-тарифов.
import {initBusinessRatesModal} from './modules/business-rates-modal.js';

// Проверяет электронную почту и показывает ошибки формы.
import {initRegistrationForm} from './modules/registration-form.js';

// Загружает и инициализирует карту расположения офиса.
import {initOfficeMap} from './modules/office-map.js';

// Синхронизирует поля и ползунки диапазона уровня.
import {initLevelFilter} from './modules/level-filter.js';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {
  mobileVhFix();
  initCountryFilter();
  initDirectionsSlider();
  initCompanionsCards();
  initBusinessRatesModal();
  initRegistrationForm();
  initOfficeMap();
  initLevelFilter();

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
