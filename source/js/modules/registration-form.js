// Проверяет электронную почту и показывает ошибки формы.
const initRegistrationForm = () => {
  const form = document.querySelector('[data-registration-form]');

  if (!form) {
    return;
  }

  const email = form.querySelector('[data-registration-email]');
  const error = form.querySelector('[data-registration-error]');

  if (!email || !error) {
    return;
  }

  const clearError = () => {
    email.removeAttribute('aria-invalid');
    error.textContent = '';
  };

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    email.value = email.value.trim();

    if (!email.validity.valid) {
      email.setAttribute('aria-invalid', 'true');

      error.textContent = email.validity.valueMissing
        ? error.dataset.errorRequired
        : error.dataset.errorInvalid;

      email.focus();
      return;
    }

    clearError();

    // Отправку подключим, когда будет готов обработчик на сервере.
  });

  email.addEventListener('input', clearError);
};

export {initRegistrationForm};
