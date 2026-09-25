const initParticipationForms = () => {
  const forms = document.querySelectorAll('[data-participation-form]');

  forms.forEach((form) => {
    const checkbox = form.querySelector('[data-participation-checkbox]');
    const button = form.querySelector('[data-participation-button]');
    const link = form.querySelector('[data-participation-link]');

    if (!checkbox || !button) {
      return;
    }

    const updateButton = () => {
      button.disabled = !checkbox.checked;
      button.classList.remove('is-pressed');
    };

    updateButton();

    checkbox.addEventListener('change', updateButton);

    if (link) {
      link.addEventListener('click', (event) => {
        // Ссылка-пустышка: не переходим и не переключаем чекбокс.
        event.preventDefault();
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!checkbox.checked) {
        return;
      }

      button.classList.add('is-pressed');
    });
  });
};

export {initParticipationForms};
