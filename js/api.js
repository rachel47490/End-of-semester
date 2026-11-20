(function () {
  const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=3.0201&longitude=35.9114&current_weather=true';
  const PORTAL_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=6';
  const ADMISSIONS_KEY = 'apesco.admissions.demo';
  const CONTACT_KEY = 'apesco.contact.demo';
  const CUSTOM_UPDATES_KEY = 'apesco.custom.updates';

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeList(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function fetchWithTimeout(url, options = {}, timeout = 7000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function getAruaWeather() {
    try {
      const data = await fetchWithTimeout(WEATHER_URL);
      const temperature = data.current_weather?.temperature;
      if (typeof temperature !== 'number') throw new Error('Weather data unavailable');
      const code = data.current_weather.weathercode;
      const conditions = code === 0 ? 'Clear' : code <= 3 ? 'Partly cloudy' : code <= 48 ? 'Foggy' : code <= 67 ? 'Rain' : code <= 77 ? 'Snow' : code <= 82 ? 'Showers' : 'Thunderstorm';
      return {
        temperature: `${Math.round(temperature)}°C`,
        conditions,
        location: 'Arua, Uganda',
        source: 'live',
        isFallback: false
      };
    } catch (error) {
      console.warn('Arua weather unavailable; using fallback.', error);
      return {
        temperature: '26°C',
        conditions: 'Conditions unavailable',
        location: 'Arua, Uganda',
        source: 'fallback',
        isFallback: true
      };
    }
  }

  async function getPortalFeed() {
    try {
      const posts = await fetchWithTimeout(PORTAL_URL);
      return {
        posts: posts.map(post => ({
          id: post.id,
          title: post.title,
          body: post.body
        })),
        source: 'live',
        isFallback: false
      };
    } catch (error) {
      console.warn('Portal feed unavailable; using APESCO fallback data.', error);
      return {
        posts: [
          { id: 'term3-exams', title: 'Term 3 examinations', body: 'Examinations begin on 23 November.' },
          { id: 'term3-fees', title: 'Term 3 fees', body: 'Please clear fees by 30 November.' },
          { id: 'parents-meeting', title: 'Parents meeting', body: 'Meet in the school hall on 29 November.' }
        ],
        source: 'fallback',
        isFallback: true
      };
    }
  }

  async function submitAdmissionDemo(payload) {
    const application = {
      ...payload,
      id: payload.id || `APESCO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString()
    };
    const applications = readList(ADMISSIONS_KEY);
    applications.unshift(application);
    writeList(ADMISSIONS_KEY, applications);

    if (window.APESCO_API_ENDPOINTS?.admissions) {
      try {
        await fetchWithTimeout(window.APESCO_API_ENDPOINTS.admissions, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(application)
        });
      } catch (error) {
        console.warn('Admissions REST sync unavailable; demo remains stored locally.', error);
      }
    }
    return application;
  }

  function getAdmissionDemos() {
    return readList(ADMISSIONS_KEY);
  }

  async function submitContactInquiry(payload) {
    const message = {
      ...payload,
      id: `MSG-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    const messages = readList(CONTACT_KEY);
    messages.unshift(message);
    writeList(CONTACT_KEY, messages);

    if (window.APESCO_API_ENDPOINTS?.contact) {
      try {
        await fetchWithTimeout(window.APESCO_API_ENDPOINTS.contact, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
      } catch (error) {
        console.warn('Contact REST sync unavailable; message remains stored locally.', error);
      }
    }
    return message;
  }

  function getContactInquiries() {
    return readList(CONTACT_KEY);
  }

  function getCustomUpdates() {
    return readList(CUSTOM_UPDATES_KEY);
  }

  function publishCustomUpdate(payload) {
    const update = {
      id: `UPDATE-${Date.now()}`,
      title: String(payload.title).trim(),
      category: String(payload.category).trim().toLowerCase(),
      date: String(payload.date),
      message: String(payload.message).trim(),
      submittedAt: new Date().toISOString()
    };
    if (!update.title || !update.category || !update.date || !update.message) {
      throw new Error('Complete every update field before publishing.');
    }
    const updates = getCustomUpdates();
    updates.unshift(update);
    writeList(CUSTOM_UPDATES_KEY, updates);
    return update;
  }

  function clearCustomUpdates() {
    localStorage.removeItem(CUSTOM_UPDATES_KEY);
  }

  window.ApescoAPI = {
    getAruaWeather,
    getPortalFeed,
    submitAdmissionDemo,
    getAdmissionDemos,
    submitContactInquiry,
    getContactInquiries,
    getCustomUpdates,
    publishCustomUpdate,
    clearCustomUpdates
  };
})();
