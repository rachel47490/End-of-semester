(() => {
  const header = document.querySelector('body > header');
  if (header) {
    header.classList.add('site-header');
    const nav = header.querySelector('nav');
    if (nav) {
      nav.classList.add('site-nav');
      nav.id = nav.id || 'site-navigation';
      let button = header.querySelector('.menu-toggle');
      if (!button) {
        button = document.createElement('button');
        button.className = 'menu-toggle';
        button.type = 'button';
        button.setAttribute('aria-controls', nav.id);
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open navigation menu');
        button.innerHTML = '<span></span><span></span><span></span>';
        header.querySelector('.wrap').appendChild(button);
      }
      let backdrop = document.querySelector('.menu-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);
      }
      const close = () => {
        nav.classList.remove('is-open');
        backdrop.classList.remove('visible');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open navigation menu');
      };
      button.setAttribute('aria-controls', nav.id);
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        nav.classList.toggle('is-open', open);
        backdrop.classList.toggle('visible', open);
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      });
      backdrop.addEventListener('click', close);
      nav.addEventListener('click', event => {
        if (event.target.closest('a')) close();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') close();
      });
    }
  }

  const footer = document.querySelector('footer');
  if (footer && footer.querySelectorAll('.footer-links').length === 0) {
    const existing = footer.querySelector('.wrap');
    if (existing) {
      existing.innerHTML = `
        <div class="footer-links" aria-label="Quick links">
          <a href="index.html">Home</a><a href="about.html">About</a>
          <a href="academics.html">Academics</a><a href="admissions.html">Admissions</a>
          <a href="contact.html">Contact</a>
        </div>
        <div>
          <div>&copy; 2026 Arua Public Secondary School (APESCO), Arua, Uganda.</div>
          <div class="footer-credit">Built with ♥ Ayuen Rachel Lueth</div>
        </div>`;
      footer.querySelectorAll('.wrap').forEach((wrap, index) => {
        if (index > 0) wrap.remove();
      });
    }
  }

  document.querySelectorAll('main section, .card, .application-step').forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  const backTop = document.createElement('button');
  backTop.className = 'back-to-top';
  backTop.type = 'button';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.textContent = '↑';
  document.body.appendChild(backTop);
  window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 500), { passive:true });
  backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  const noticeSearch = document.getElementById('notice-search');
  const noticeCategory = document.getElementById('notice-category');
  const noticeList = document.getElementById('school-notices');
  const noticeCount = document.getElementById('notice-count');
  const noticeEmpty = document.getElementById('notice-empty');
  let customUpdates = window.ApescoAPI ? window.ApescoAPI.getCustomUpdates() : [];
  const formatNoticeDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value || '';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  };
  const newsGrid = document.querySelector('.news-grid');
  const renderCustomUpdates = () => {
    if (noticeList) noticeList.querySelectorAll('[data-custom-update]').forEach(item => item.remove());
    if (newsGrid) newsGrid.querySelectorAll('[data-custom-update]').forEach(item => item.remove());
    customUpdates.forEach(update => {
      if (noticeList) {
        const item = document.createElement('li');
        item.dataset.customUpdate = 'true';
        item.dataset.category = update.category;
        const date = document.createElement('b');
        date.textContent = formatNoticeDate(update.date);
        const title = document.createElement('strong');
        title.textContent = update.title;
        const message = document.createElement('p');
        message.textContent = update.message;
        item.append(date, title, message);
        noticeList.appendChild(item);
      }
      if (newsGrid) {
        const card = document.createElement('article');
        card.className = 'card news-card';
        card.dataset.customUpdate = 'true';
        card.dataset.category = update.category;
        const category = document.createElement('p');
        category.className = 'news-category';
        category.textContent = update.category === 'parents' ? 'Parents & guardians' : update.category;
        const title = document.createElement('h3');
        title.textContent = update.title;
        const date = document.createElement('p');
        date.className = 'news-date';
        date.textContent = formatNoticeDate(update.date);
        const message = document.createElement('p');
        message.textContent = update.message;
        card.append(category, title, date, message);
        newsGrid.appendChild(card);
      }
    });
  };
  renderCustomUpdates();
  if (noticeSearch && noticeList) {
    const filterNotices = () => {
      const query = noticeSearch.value.trim().toLowerCase();
      const category = noticeCategory ? noticeCategory.value : 'all';
      let count = 0;
      [...noticeList.children].forEach(notice => {
        const matchesText = notice.textContent.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || notice.dataset.category === category;
        const matches = matchesText && matchesCategory;
        notice.hidden = !matches;
        if (matches) count++;
      });
      if (noticeCount) noticeCount.textContent = `Showing ${count} ${count === 1 ? 'notice' : 'notices'}`;
      if (noticeEmpty) noticeEmpty.hidden = count > 0;
    };
    noticeSearch.addEventListener('input', filterNotices);
    if (noticeCategory) noticeCategory.addEventListener('change', filterNotices);
    document.querySelector('.clear-search')?.addEventListener('click', () => {
      noticeSearch.value = '';
      if (noticeCategory) noticeCategory.value = 'all';
      filterNotices();
      noticeSearch.focus();
    });
  }

  const applyNewsFilter = filter => {
    document.querySelectorAll('.news-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  };
  document.querySelectorAll('.filter-pills').forEach(pills => {
    pills.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      pills.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
      button.classList.add('active');
      applyNewsFilter(button.dataset.filter);
    });
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'apesco.custom.updates') return;
    try {
      const parsed = JSON.parse(event.newValue || '[]');
      customUpdates = Array.isArray(parsed) ? parsed : [];
      renderCustomUpdates();
      if (noticeSearch && noticeList) noticeSearch.dispatchEvent(new Event('input'));
      const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
      applyNewsFilter(activeFilter);
    } catch (error) {
      console.warn('Could not refresh published notices from browser storage.', error);
    }
  });

  document.querySelectorAll('.programme-card').forEach(card => {
    const button = card.querySelector('.programme-toggle');
    button?.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  const weatherHost = document.querySelector('.home-hero .wrap, .news-hero .wrap');
  if (weatherHost && window.ApescoAPI) {
    const badge = document.createElement('p');
    badge.className = 'weather-badge';
    badge.setAttribute('role', 'status');
    badge.textContent = 'Arua Campus Weather · Loading…';
    weatherHost.appendChild(badge);
    window.ApescoAPI.getAruaWeather().then(weather => {
      badge.textContent = `Arua Campus Weather · ${weather.temperature} · ${weather.conditions} · ${weather.location}`;
      badge.title = weather.isFallback ? 'Offline fallback weather value' : 'Live weather from Open-Meteo';
    });
  }

  const renderAdmissions = () => {
    const container = document.querySelector('.application-demo-card');
    if (!container || !window.ApescoAPI) return;
    let tableWrap = container.querySelector('.admission-demos');
    if (!tableWrap) {
      tableWrap = document.createElement('div');
      tableWrap.className = 'admission-demos';
      container.appendChild(tableWrap);
    }
    const items = window.ApescoAPI.getAdmissionDemos();
    tableWrap.innerHTML = `<h4 style="margin-top:1rem">Saved demo applications</h4>${items.length ? `<div class="tw"><table><thead><tr><th>Reference</th><th>Student</th><th>Class</th><th>Phone</th></tr></thead><tbody>${items.map(item => `<tr><td>${item.id}</td><td>${item.student}</td><td>${item.class}</td><td>${item.phone}</td></tr>`).join('')}</tbody></table></div>` : '<p><small>No demo applications saved yet.</small></p>'}`;
  };
  renderAdmissions();

  document.querySelectorAll('form.application-demo').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const payload = {
        student: data.get('student'),
        class: data.get('class'),
        phone: data.get('phone')
      };
      let application;
      try {
        if (window.ApescoAPI) {
          application = await window.ApescoAPI.submitAdmissionDemo(payload);
        } else {
          application = { ...payload, id: `APESCO-2026-${Math.floor(1000 + Math.random() * 9000)}` };
        }
      } catch (error) {
        let feedback = form.nextElementSibling;
        if (!feedback || !feedback.classList.contains('preview-summary')) {
          feedback = document.createElement('div');
          feedback.className = 'preview-summary';
          feedback.setAttribute('role', 'alert');
          form.insertAdjacentElement('afterend', feedback);
        }
        feedback.textContent = error.message || 'Could not save this demo application in this browser.';
        return;
      }
      let summary = form.nextElementSibling;
      if (!summary || !summary.classList.contains('preview-summary')) {
        summary = document.createElement('div');
        summary.className = 'preview-summary';
        summary.setAttribute('role', 'status');
        form.insertAdjacentElement('afterend', summary);
      }
      summary.innerHTML = `<strong>Demo application preview</strong><br><b>Reference:</b> ${application.id}<br><b>Student:</b> ${application.student}<br><b>Class:</b> ${application.class}<br><b>Parent phone:</b> ${application.phone}`;
      form.reset();
      renderAdmissions();
    });
  });

  const message = document.querySelector('textarea[name="message"]');
  const counter = document.querySelector('.character-count');
  if (message && counter) {
    message.addEventListener('input', () => counter.textContent = `${message.value.length} / ${message.maxLength}`);
  }
  const contactForm = document.querySelector('.contact-layout form');
  if (document.querySelector('.contact-layout') && window.ApescoAPI) {
    const locationPanel = document.createElement('div');
    locationPanel.className = 'location-helper';
    locationPanel.innerHTML = `<button class="btn" type="button" id="use-location">Use current location</button> <a class="news-link" href="https://www.openstreetmap.org/search?query=Arua%20Uganda" target="_blank" rel="noopener">Open campus directions</a><p id="location-status" aria-live="polite"></p>`;
    const leftColumn = document.querySelector('.contact-layout > div');
    leftColumn?.appendChild(locationPanel);
    document.getElementById('use-location')?.addEventListener('click', () => {
      const status = document.getElementById('location-status');
      if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not available in this browser.';
        return;
      }
      status.textContent = 'Getting your location…';
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          status.innerHTML = `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${latitude}%2C${longitude}%3B3.0201%2C35.9114" target="_blank" rel="noopener">Get directions to APESCO</a>`;
        },
        () => status.textContent = 'Location permission was unavailable. Use the OpenStreetMap directions link instead.'
      );
    });

    const renderMessages = () => {
      let list = document.getElementById('recent-contact-messages');
      if (!list) {
        list = document.createElement('div');
        list.id = 'recent-contact-messages';
        contactForm?.insertAdjacentElement('afterend', list);
      }
      const messages = window.ApescoAPI.getContactInquiries();
      list.innerHTML = `<h3 style="margin-top:1.5rem">Recent Sent Messages (Demo)</h3>${messages.length ? `<ul class="recent-message-list">${messages.map(item => `<li><b>${item.name}</b><br><small>${item.email}</small><br>${item.message}</li>`).join('')}</ul>` : '<p><small>No sent demo messages yet.</small></p>'}`;
    };
    renderMessages();
  }
  if (contactForm) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const data = new FormData(contactForm);
      let submittedMessage;
      if (window.ApescoAPI) {
        try {
          submittedMessage = await window.ApescoAPI.submitContactInquiry({
            name: data.get('name'),
            email: data.get('email'),
            message: data.get('message')
          });
        } catch (error) {
          let banner = contactForm.querySelector('.confirmation-banner');
          if (!banner) {
            banner = document.createElement('p');
            banner.className = 'confirmation-banner';
            banner.setAttribute('role', 'alert');
            contactForm.appendChild(banner);
          }
          banner.textContent = error.message || 'Could not save your demo message in this browser.';
          return;
        }
        const list = document.getElementById('recent-contact-messages');
        if (list) {
          const messages = window.ApescoAPI.getContactInquiries();
          list.innerHTML = `<h3 style="margin-top:1.5rem">Recent Sent Messages (Demo)</h3>${messages.length ? `<ul class="recent-message-list">${messages.map(item => `<li><b>${item.name}</b><br><small>${item.email}</small><br>${item.message}</li>`).join('')}</ul>` : ''}`;
        }
      }
      let banner = contactForm.querySelector('.confirmation-banner');
      if (!banner) {
        banner = document.createElement('p');
        banner.className = 'confirmation-banner';
        banner.setAttribute('role', 'status');
        contactForm.appendChild(banner);
      }
      banner.textContent = `Thank you. Your demo message reference is ${submittedMessage?.id || 'saved locally'}.`;
      contactForm.reset();
      if (counter) counter.textContent = `0 / ${message.maxLength}`;
    });
  }
})();
