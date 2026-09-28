const initWinnersList = () => {
  const toggle = document.querySelector('[data-winners-toggle]');
  const options = document.querySelector('[data-winners-options]');
  const form = document.querySelector('[data-winners-search]');

  if (!toggle || !options || !form) {
    return;
  }

  const dialog = document.querySelector('[data-winners-dialog]');
  const optionsParent = options.parentElement;
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  if (!dialog || !optionsParent) {
    return;
  }

  const searchWrapper = form.closest('[data-winners-search-wrapper]');
  const selected = toggle.querySelector('[data-winners-selected]');
  const buttons = options.querySelectorAll('[data-winners-date]');
  const results = document.querySelectorAll('[data-winners-result]');
  const typeButtons = document.querySelectorAll('[data-winners-type]');
  const weeklyButton = document.querySelector(
      '[data-winners-type="weekly"]'
  );
  const filter = toggle.closest('.winners-list__filter');

  const input = form.querySelector('[data-winners-input]');
  const error = form.querySelector('[data-winners-error]');
  const hint = form.querySelector('#winner-phone-hint');
  const submitButton = form.querySelector('[data-winners-submit]');
  const clearButton = form.querySelector('[data-winners-clear]');

  if (
    !searchWrapper
    || !selected
    || !filter
    || !weeklyButton
    || !input
    || !error
    || !hint
    || !buttons.length
    || !results.length
  ) {
    return;
  }

  const selectedWeek = Array.from(buttons).find((button) => {
    return button.getAttribute('aria-pressed') === 'true';
  }) || buttons[0];

  let searchValue = '';
  let activeType = 'weekly';
  let activeWeekId = selectedWeek.dataset.winnersDate;

  form.noValidate = true;

  // Показываем или скрываем сообщение об ошибке.
  const setError = (message = '') => {
    const isInvalid = Boolean(message);

    searchWrapper.classList.toggle('is-invalid', isInvalid);
    input.setAttribute('aria-invalid', String(isInvalid));

    error.textContent = message;
    error.hidden = !isInvalid;
    hint.hidden = isInvalid;
  };

  const updateTableHeight = () => {
    const activeResult = Array.from(results).find((result) => {
      return !result.hidden;
    });

    if (!activeResult) {
      return;
    }

    const scroll = activeResult.querySelector('.winners-list__scroll');
    const table = activeResult.querySelector('.winners-list__table');

    if (!scroll || !table) {
      return;
    }

    const visibleRows = Array.from(
        table.querySelectorAll('[data-winner-phone]')
    ).filter((row) => {
      return !row.hidden;
    });

    // При небольшом количестве результатов высота определяется контентом.
    if (visibleRows.length <= 13) {
      scroll.style.removeProperty('--winners-scroll-height');
      return;
    }

    const tableRect = table.getBoundingClientRect();
    const lastVisibleRowRect = visibleRows[12].getBoundingClientRect();

    // Учитываем горизонтальную полосу прокрутки, если она появилась.
    const scrollbarHeight = scroll.offsetHeight - scroll.clientHeight;

    const height = lastVisibleRowRect.bottom
      - tableRect.top
      + scrollbarHeight;

    scroll.style.setProperty(
        '--winners-scroll-height',
        `${height}px`
    );
  };

  // Фильтруем победителей выбранного розыгрыша.
  const filterWinners = () => {
    const activeResult = Array.from(results).find((result) => {
      return !result.hidden;
    });

    if (!activeResult) {
      return;
    }

    const rows = activeResult.querySelectorAll('[data-winner-phone]');
    let matches = 0;

    rows.forEach((row) => {
      const isMatch = !searchValue
        || row.dataset.winnerPhone.endsWith(searchValue);

      row.hidden = !isMatch;

      if (isMatch) {
        matches += 1;
      }
    });

    searchWrapper.classList.toggle(
        'is-found',
        Boolean(searchValue) && matches > 0
    );

    setError(searchValue && matches === 0 ? 'Номер не найден' : '');

    const scroll = activeResult.querySelector('.winners-list__scroll');

    if (scroll) {
      scroll.scrollTop = 0;
    }

    updateTableHeight();
  };

  // Показываем крестик только после выполненного поиска.
  const updateSearchControls = () => {
    const isSearched = Boolean(searchValue);

    if (submitButton) {
      submitButton.hidden = isSearched;
    }

    if (clearButton) {
      clearButton.hidden = !isSearched;
    }
  };

  // При редактировании снимаем фильтр и возвращаем лупу.
  const updateSearch = () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);

    searchValue = '';

    updateSearchControls();
    filterWinners();
  };

  // Размещаем мобильный список над кнопкой «Еженедельные».
  const positionDialog = () => {
    if (!dialog.open) {
      return;
    }

    const buttonRect = weeklyButton.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight;
    const viewportWidth = document.documentElement.clientWidth;

    const gap = 24;
    const edge = 16;

    const availableAbove = Math.min(
        buttonRect.top - gap,
        viewportHeight - edge
    ) - edge;

    // Если сверху мало места, показываем окно по центру.
    const fitsAbove = availableAbove >= 80;
    const maxHeight = fitsAbove
      ? availableAbove
      : Math.max(0, viewportHeight - edge * 2);

    dialog.style.setProperty('--dialog-max-height', `${maxHeight}px`);

    const dialogRect = dialog.getBoundingClientRect();

    const top = fitsAbove
      ? Math.min(buttonRect.top - gap, viewportHeight - edge)
        - dialogRect.height
      : Math.max(edge, (viewportHeight - dialogRect.height) / 2);

    const halfWidth = dialogRect.width / 2;
    const center = buttonRect.left + buttonRect.width / 2;

    const left = Math.max(
        edge + halfWidth,
        Math.min(center, viewportWidth - edge - halfWidth)
    );

    dialog.style.setProperty('--dialog-top', `${top}px`);
    dialog.style.setProperty('--dialog-left', `${left}px`);
  };

  const closeOptions = () => {
    options.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');

    if (dialog.open) {
      dialog.close();
    }

    // Возвращаем список в исходную обёртку.
    if (options.parentElement !== optionsParent) {
      optionsParent.append(options);
    }
  };

  // Показываем выбранный вид розыгрыша и нужную неделю.
  const showResults = () => {
    results.forEach((result) => {
      const isCurrentGroup = result.dataset.winnersGroup === activeType;
      const isCurrentDraw = activeType === 'monthly'
        || result.dataset.winnersResult === activeWeekId;

      result.hidden = !(isCurrentGroup && isCurrentDraw);
    });

    filter.hidden = activeType === 'monthly';

    typeButtons.forEach((button) => {
      const isActive = button.dataset.winnersType === activeType;

      button.setAttribute('aria-pressed', String(isActive));
      button.classList.toggle('is-active', isActive);
    });

    closeOptions();
    filterWinners();
  };

  // При смене вида розыгрыша сбрасываем выбранную неделю.
  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextType = button.dataset.winnersType;

      if (nextType === activeType) {
        return;
      }

      activeType = nextType;

      const firstDraw = buttons[0];

      activeWeekId = firstDraw.dataset.winnersDate;
      selected.textContent = firstDraw.textContent;

      buttons.forEach((item) => {
        item.setAttribute(
            'aria-pressed',
            String(item === firstDraw)
        );
      });

      showResults();
    });
  });

  // Открытие и закрытие списка дат.
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeOptions();
      return;
    }

    options.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');

    if (mobileBreakpoint.matches) {
      dialog.append(options);
      dialog.showModal();
      positionDialog();

      const currentButton = options.querySelector(
          '[aria-pressed="true"]'
      );

      if (currentButton) {
        currentButton.focus({preventScroll: true});
      }
    }
  });

  // Escape в мобильном диалоге.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeOptions();
    toggle.focus({preventScroll: true});
  });

  // Закрываем список при смене мобильной и десктопной версии.
  mobileBreakpoint.addListener(() => {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';

    closeOptions();

    if (wasOpen) {
      toggle.focus({preventScroll: true});
    }
  });

  window.addEventListener('resize', positionDialog);

  // Выбор недели.
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeWeekId = button.dataset.winnersDate;
      selected.textContent = button.textContent;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });

      showResults();
      toggle.focus({preventScroll: true});
    });
  });

  // При вводе сбрасываем прежний поиск, но не прокручиваем страницу.
  input.addEventListener('input', updateSearch);

  // Поиск по нажатию на лупу или Enter.
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!/^\d{4}$/.test(input.value)) {
      setError('Введите последние 4 цифры номера телефона');
      return;
    }

    searchValue = input.value;

    filterWinners();
    updateSearchControls();

    const activeResult = Array.from(results).find((result) => {
      return !result.hidden;
    });

    if (!activeResult) {
      return;
    }

    const foundWinner = activeResult.querySelector(
        '[data-winner-phone]:not([hidden])'
    );

    // Если номер не найден, остаёмся у поля поиска.
    if (!foundWinner) {
      return;
    }

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const top = activeResult.getBoundingClientRect().top
      + window.scrollY
      - 24;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  });

  // Очистка поля и сброс фильтрации.
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      input.value = '';

      updateSearch();
      input.focus({preventScroll: true});
    });
  }

  // Закрытие по клику снаружи, включая затемнение.
  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    if (
      !toggle.contains(event.target)
      && !options.contains(event.target)
    ) {
      const wasModal = dialog.open;

      closeOptions();

      if (wasModal) {
        toggle.focus({preventScroll: true});
      }
    }
  });

  // Escape для десктопной выпадашки.
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape'
      && !dialog.open
      && !options.hidden
    ) {
      closeOptions();
      toggle.focus({preventScroll: true});
    }
  });

  // Начальное состояние списка и поискового поля.
  showResults();
  updateSearch();

  window.addEventListener('resize', updateTableHeight);

  // После загрузки шрифта высота строк тоже может измениться.
  if (document.fonts) {
    document.fonts.ready.then(() => {
      updateTableHeight();
    });
  }
};

export {initWinnersList};
