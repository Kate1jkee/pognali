const initWinnersList = () => {
  const toggle = document.querySelector('[data-winners-toggle]');

  if (!toggle) {
    return;
  }

  const options = document.querySelector('[data-winners-options]');
  const selected = toggle.querySelector('[data-winners-selected]');
  const buttons = options.querySelectorAll('[data-winners-date]');
  const results = document.querySelectorAll('[data-winners-result]');

  const form = document.querySelector('[data-winners-search]');
  const input = form.querySelector('[data-winners-input]');
  const error = form.querySelector('[data-winners-error]');
  const hint = form.querySelector('#winner-phone-hint');

  let searchValue = '';

  // Показываем собственные сообщения вместо браузерной валидации.
  form.noValidate = true;

  const setError = (message = '') => {
    const isInvalid = Boolean(message);

    form.classList.toggle('is-invalid', isInvalid);
    input.setAttribute('aria-invalid', String(isInvalid));

    error.textContent = message;
    error.hidden = !isInvalid;
    hint.hidden = isInvalid;
  };

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

    form.classList.toggle(
        'is-found',
        Boolean(searchValue) && matches > 0
    );

    setError(searchValue && matches === 0 ? 'Номер не найден' : '');

    const scroll = activeResult.querySelector('.winners-list__scroll');

    if (scroll) {
      scroll.scrollTop = 0;
    }
  };

  const closeOptions = () => {
    options.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };

  // Открытие и закрытие списка дат.
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    options.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Выбор розыгрыша.
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const drawId = button.dataset.winnersDate;

      selected.textContent = button.textContent;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });

      results.forEach((result) => {
        result.hidden = result.dataset.winnersResult !== drawId;
      });

      filterWinners();
      closeOptions();
      toggle.focus();
    });
  });

  // Оставляем только четыре цифры.
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);

    // При редактировании возвращаем список и убираем ошибку.
    searchValue = '';
    filterWinners();
  });

  // Поиск по нажатию на лупу или Enter.
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!/^\d{4}$/.test(input.value)) {
      setError('Введите последние 4 цифры номера телефона');
      return;
    }

    searchValue = input.value;
    filterWinners();
  });

  // Закрытие списка дат при клике снаружи.
  document.addEventListener('click', (event) => {
    if (
      !toggle.contains(event.target)
      && !options.contains(event.target)
    ) {
      closeOptions();
    }
  });

  // Закрытие списка дат клавишей Escape.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !options.hidden) {
      closeOptions();
      toggle.focus();
    }
  });
};

export {initWinnersList};
