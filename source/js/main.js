import {mobileVhFix} from './utils/mobile-vh-fix.js';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {
  // Utils
  // ---------------------------------

  mobileVhFix();

  // Mobile menu
  // ---------------------------------

  const headers = document.querySelectorAll('[data-header]');

  headers.forEach((header) => {
    const toggle = header.querySelector('[data-menu-toggle]');

    if (!toggle) {
      return;
    }

    const closeMenu = () => {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
    };

    const openMenu = () => {
      header.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
    };

    toggle.addEventListener('click', () => {
      const isOpened = header.classList.contains('is-open');

      if (isOpened) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        header.classList.contains('is-open')
      ) {
        closeMenu();
        toggle.focus();
      }
    });
  });

  // Promo
  // ---------------------------------

  const promoBlocks = document.querySelectorAll('[data-promo]');
  const desktopBreakpoint = window.matchMedia('(min-width: 768px)');

  promoBlocks.forEach((promo) => {
    const cards = promo.querySelectorAll('[data-promo-card]');
    const items = promo.querySelectorAll('[data-promo-item]');
    const buttons = promo.querySelectorAll('[data-promo-button]');

    if (!cards.length || !buttons.length) {
      return;
    }

    let activeIndex = [...cards].findIndex((card) =>
      card.classList.contains('is-active')
    );

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const showCard = (index) => {
      activeIndex = (index + cards.length) % cards.length;

      cards.forEach((card, cardIndex) => {
        card.classList.toggle(
            'is-active',
            cardIndex === activeIndex
        );
      });

      items.forEach((item, itemIndex) => {
        item.classList.toggle(
            'is-active',
            itemIndex === activeIndex
        );
      });

      buttons.forEach((button, buttonIndex) => {
        button.setAttribute(
            'aria-pressed',
            buttonIndex === activeIndex ? 'true' : 'false'
        );
      });
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (!desktopBreakpoint.matches) {
          return;
        }

        showCard(index);
      });
    });

    showCard(activeIndex);
  });

  // Courses navigation
  // ---------------------------------

  const coursesNavBlocks =
    document.querySelectorAll('[data-courses-nav]');

  coursesNavBlocks.forEach((coursesNav) => {
    const buttons =
      coursesNav.querySelectorAll('[data-courses-nav-button]');

    const hoverBreakpoint = window.matchMedia(
        '(min-width: 768px) and (hover: hover)'
    );

    let pinnedButton = null;

    const closeDropdown = (button) => {
      const dropdownId = button.getAttribute('aria-controls');
      const dropdown = document.getElementById(dropdownId);
      const item = button.closest('.courses-nav__item');

      if (!dropdown) {
        return;
      }

      button.setAttribute('aria-expanded', 'false');
      dropdown.hidden = true;

      if (item) {
        item.classList.remove('is-open');
      }
    };

    const closeAllDropdowns = (exceptButton = null) => {
      buttons.forEach((button) => {
        if (button !== exceptButton) {
          closeDropdown(button);
        }
      });
    };

    const openDropdown = (button) => {
      const dropdownId = button.getAttribute('aria-controls');
      const dropdown = document.getElementById(dropdownId);
      const item = button.closest('.courses-nav__item');

      if (!dropdown) {
        return;
      }

      closeAllDropdowns(button);

      button.setAttribute('aria-expanded', 'true');
      dropdown.hidden = false;

      if (item) {
        item.classList.add('is-open');
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (pinnedButton === button) {
          closeDropdown(button);
          pinnedButton = null;

          return;
        }

        openDropdown(button);
        pinnedButton = button;
      });
    });

    buttons.forEach((button) => {
      const item = button.closest('.courses-nav__item');

      if (!item) {
        return;
      }

      let closeTimer = null;

      item.addEventListener('mouseenter', () => {
        if (!hoverBreakpoint.matches || pinnedButton) {
          return;
        }

        clearTimeout(closeTimer);
        openDropdown(button);
      });

      item.addEventListener('mouseleave', () => {
        if (!hoverBreakpoint.matches || pinnedButton) {
          return;
        }

        closeTimer = setTimeout(() => {
          closeDropdown(button);
        }, 150);
      });
    });

    document.addEventListener('click', (event) => {
      if (coursesNav.contains(event.target)) {
        return;
      }

      closeAllDropdowns();
      pinnedButton = null;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      let openedButton = null;

      buttons.forEach((button) => {
        if (button.getAttribute('aria-expanded') === 'true') {
          openedButton = button;
          closeDropdown(button);
        }
      });

      pinnedButton = null;

      if (openedButton) {
        openedButton.focus();
      }
    });
  });

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
