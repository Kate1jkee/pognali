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
    };

    updateButton();

    checkbox.addEventListener('change', updateButton);

    if (link) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
      });
    }
  });
};

export {initParticipationForms};
