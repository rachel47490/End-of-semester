const menuToggle = document.querySelector('.menu-toggle');
const homeNavigation = document.getElementById('home-navigation');

if (menuToggle && homeNavigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    homeNavigation.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close navigation menu');
      homeNavigation.classList.add('is-open');
    }
  });

  homeNavigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

document.querySelectorAll('form[data-demo]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const feedback = document.createElement('p');
    feedback.textContent = 'Demo only: your information has not been sent.';
    form.insertAdjacentElement('afterend', feedback);
    form.reset();
  });
});