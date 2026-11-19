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

const noticeSearch = document.getElementById('notice-search');
const noticeList = document.getElementById('school-notices');
const noticeCount = document.getElementById('notice-count');
const noticeEmpty = document.getElementById('notice-empty');

if (noticeSearch && noticeList && noticeCount && noticeEmpty) {
  const notices = Array.from(noticeList.children);

  noticeSearch.addEventListener('input', () => {
    const query = noticeSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    notices.forEach(notice => {
      const matches = notice.textContent.toLowerCase().includes(query);
      notice.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    noticeCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'notice' : 'notices'}`;
    noticeEmpty.hidden = visibleCount > 0;
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