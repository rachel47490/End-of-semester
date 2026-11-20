const loginLayout = document.querySelector('.login-layout');
const loginForm = document.getElementById('login');

document.querySelector('.password-toggle')?.addEventListener('click', event => {
  const input = event.currentTarget.parentElement.querySelector('input');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  event.currentTarget.textContent = show ? 'Hide' : 'Show';
  event.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

const workspaceTemplates = {
  student: () => `
    <div class="workspace-grid">
      <div class="card stat"><b>72%</b>Average</div><div class="card stat"><b>94%</b>Attendance</div>
      <div class="card stat"><b>UGX 150,000</b>Fee balance</div><div class="card stat"><b>Term 3</b>Current term</div>
    </div>
    <section class="card workspace-panel"><h3>Term 3 exam timetable</h3><div class="tw"><table><thead><tr><th>Date</th><th>Subject</th><th>Time</th></tr></thead><tbody><tr><td>23 Nov</td><td>Mathematics</td><td>8:00 am</td></tr><tr><td>24 Nov</td><td>English</td><td>8:00 am</td></tr></tbody></table></div></section>
    <section class="card workspace-panel"><h3>Sample subject results</h3><div class="tw"><table><thead><tr><th>Subject</th><th>Mark</th><th>Grade</th></tr></thead><tbody><tr><td>Mathematics</td><td>78</td><td>A</td></tr><tr><td>English</td><td>69</td><td>B</td></tr><tr><td>Biology</td><td>70</td><td>B</td></tr></tbody></table></div></section>
    <section class="card workspace-panel"><h3>Term 3 fees</h3><p><span class="status">Balance UGX 150,000</span></p></section>`,
  parent: () => `
    <div class="workspace-grid">
      <div class="card stat"><b>Okello James</b>Child</div><div class="card stat"><b>94%</b>Attendance</div>
      <div class="card stat"><b>UGX 150,000</b>Fee balance</div><div class="card stat"><b>Term 3</b>Current term</div>
    </div>
    <section class="card workspace-panel"><h3>Term 3 exam timetable</h3><div class="tw"><table><thead><tr><th>Date</th><th>Subject</th><th>Time</th></tr></thead><tbody><tr><td>23 Nov</td><td>Mathematics</td><td>8:00 am</td></tr><tr><td>24 Nov</td><td>English</td><td>8:00 am</td></tr></tbody></table></div></section>
    <section class="card workspace-panel"><h3>Child subject results</h3><div class="tw"><table><thead><tr><th>Subject</th><th>Mark</th><th>Grade</th></tr></thead><tbody><tr><td>Mathematics</td><td>78</td><td>A</td></tr><tr><td>English</td><td>69</td><td>B</td></tr></tbody></table></div></section>
    <section class="card workspace-panel"><h3>Fees status</h3><p><span class="status">Outstanding balance UGX 150,000</span></p></section>`,
  teacher: () => `
    <div class="workspace-grid"><div class="card stat"><b>4</b>Classes</div><div class="card stat"><b>160</b>Students</div><div class="card stat"><b>2</b>Marks pending</div><div class="card stat"><b>Monday</b>Next supervision</div></div>
    <section class="card workspace-panel"><h3>Class list — S.3A</h3><div class="tw"><table><thead><tr><th>Student</th><th>Attendance</th></tr></thead><tbody><tr><td>Okello James</td><td>Present</td></tr><tr><td>Aber Sarah</td><td>Present</td></tr><tr><td>Acen Moses</td><td>Absent</td></tr></tbody></table></div></section>
    <section class="card workspace-panel"><h3>Marks entry preview — Mathematics</h3><form><label>Okello James<input type="number" min="0" max="100" placeholder="78"></label><label>Aber Sarah<input type="number" min="0" max="100" placeholder="69"></label><button class="btn" type="button">Save preview marks</button></form></section>
    <section class="card workspace-panel"><h3>Upcoming exam supervision</h3><p>Monday 23 Nov, 8:00 am — S.3 Hall</p></section>`,
  admin: () => `
    <div class="workspace-grid"><div class="card stat"><b>842</b>Total Students</div><div class="card stat"><b>36</b>Pending Admissions</div><div class="card stat"><b>72%</b>Term 3 Fee Clearance</div><div class="card stat"><b>4</b>Active Notices</div></div>
    <section class="card workspace-panel"><h3>Publish New Update / Notice</h3><form id="quick-notice">
      <label>Title<input name="title" required maxlength="120"></label>
      <label>Category<select name="category" required><option value="academics">Academics</option><option value="parents">Parents &amp; Guardians</option><option value="fees">Fees</option><option value="admissions">Admissions</option></select></label>
      <label>Date<input name="date" type="date" required></label>
      <label>Message<textarea name="message" rows="3" maxlength="600" required></textarea></label>
      <div class="admin-actions"><button class="btn" type="submit">Publish update</button><button class="btn btn-secondary" id="clear-custom-updates" type="button">Clear Custom Updates</button></div>
      <p class="form-feedback" id="update-feedback" role="status" aria-live="polite"></p>
    </form><div id="published-notices" class="published-notices"></div></section>
    <section class="card workspace-panel"><h3>Recent records</h3><div class="tw"><table><thead><tr><th>Class</th><th>Students</th><th>Status</th></tr></thead><tbody><tr><td>S.1</td><td>210</td><td><span class="status">Active</span></td></tr><tr><td>S.5</td><td>86</td><td><span class="status">Active</span></td></tr></tbody></table></div></section>`
};

function showWorkspace(role, username) {
  if (!loginLayout) return;
  let workspace = document.querySelector('.login-workspace');
  if (!workspace) {
    workspace = document.createElement('div');
    workspace.className = 'login-workspace';
    document.body.appendChild(workspace);
  }
  workspace.innerHTML = `<div class="workspace-shell"><aside class="workspace-sidebar"><h2>APESCO Portal</h2><a href="index.html">Public website</a><button type="button" id="workspace-logout">Log out</button></aside><main class="workspace-main"><div class="workspace-top"><div><p class="eyebrow">${role} workspace</p><h1 style="font-size:2rem">Welcome, ${username}</h1></div><button class="btn" type="button" id="refresh-portal">Refresh Portal Data</button></div>${workspaceTemplates[role]?.() || ''}<section class="card workspace-panel"><h3>Portal feed</h3><div id="portal-feed-status" aria-live="polite">Loading portal data…</div><div id="portal-feed"></div></section></main></div>`;
  loginLayout.style.display = 'none';
  workspace.classList.add('active');
  document.querySelector('#workspace-logout')?.addEventListener('click', () => {
    sessionStorage.clear();
    workspace.classList.remove('active');
    workspace.remove();
    loginLayout.style.display = '';
  });
  const refreshPortal = async () => {
    const button = document.getElementById('refresh-portal');
    const status = document.getElementById('portal-feed-status');
    const feed = document.getElementById('portal-feed');
    if (!button || !status || !feed) return;
    button.disabled = true;
    button.textContent = 'Refreshing…';
    status.textContent = 'Loading live portal records…';
    feed.innerHTML = '<span class="portal-spinner" aria-hidden="true">◌</span>';
    const result = window.ApescoAPI ? await window.ApescoAPI.getPortalFeed() : { posts: [], source: 'fallback', isFallback: true };
    status.textContent = result.isFallback ? 'Using APESCO fallback portal notices.' : 'Live portal sample records loaded.';
    feed.innerHTML = `<ul>${result.posts.map(post => `<li><b>${post.title}</b><br><small>${post.body}</small></li>`).join('')}</ul>`;
    button.disabled = false;
    button.textContent = 'Refresh Portal Data';
  };
  document.getElementById('refresh-portal')?.addEventListener('click', refreshPortal);
  refreshPortal();
  const renderCustomUpdates = () => {
    const container = document.getElementById('published-notices');
    if (!container) return;
    container.replaceChildren();
    const heading = document.createElement('h4');
    heading.textContent = 'Current custom updates';
    container.appendChild(heading);
    const updates = window.ApescoAPI?.getCustomUpdates() || [];
    if (!updates.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No custom updates have been published.';
      container.appendChild(empty);
      return;
    }
    const list = document.createElement('ul');
    updates.forEach(update => {
      const item = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = `${update.title} — ${update.category} — ${update.date}`;
      const message = document.createElement('p');
      message.textContent = update.message;
      item.append(title, message);
      list.appendChild(item);
    });
    container.appendChild(list);
  };
  renderCustomUpdates();

  document.querySelector('#quick-notice')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const feedback = document.getElementById('update-feedback');
    try {
      if (!window.ApescoAPI) throw new Error('The update service is unavailable. Reload the page and try again.');
      window.ApescoAPI.publishCustomUpdate({
        title: data.get('title'),
        category: data.get('category'),
        date: data.get('date'),
        message: data.get('message')
      });
      if (feedback) feedback.textContent = 'Update published. It is now visible on the Home and News pages.';
      renderCustomUpdates();
    } catch (error) {
      if (feedback) feedback.textContent = error.message || 'Could not save this update. Check browser storage and try again.';
    }
    form.reset();
  });
  document.getElementById('clear-custom-updates')?.addEventListener('click', () => {
    const feedback = document.getElementById('update-feedback');
    try {
      window.ApescoAPI?.clearCustomUpdates();
      if (feedback) feedback.textContent = 'Custom updates cleared. Only the original notices remain.';
      renderCustomUpdates();
    } catch (error) {
      if (feedback) feedback.textContent = error.message || 'Could not clear custom updates.';
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const role = data.get('role');
    const username = String(data.get('user')).trim();
    const password = String(data.get('pass'));
    if (!username || !password) return;
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('user', username);
    showWorkspace(role, username);
  });
}

const role = document.body.dataset.role;
const storedRole = sessionStorage.getItem('role');
const storedUser = sessionStorage.getItem('user');
if (role) {
  if (storedRole !== role) location.replace('login.html');
  document.querySelectorAll('.uname').forEach(el => el.textContent = storedUser || '');
  document.getElementById('out')?.addEventListener('click', () => {
    sessionStorage.clear();
    location.href = 'login.html';
  });
}
