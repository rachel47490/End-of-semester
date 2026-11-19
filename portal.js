const R = sessionStorage.getItem('role'), U = sessionStorage.getItem('user');

const f = document.getElementById('login');
if (f) f.addEventListener('submit', e => {
  e.preventDefault();
  const r = f.role.value, u = f.user.value.trim();
  if (!u || !f.pass.value) return;
  sessionStorage.setItem('role', r);
  sessionStorage.setItem('user', u);
  location.href = r + '-dashboard.html';
});

const d = document.body.dataset.role;
if (d) {
  if (R !== d) location.replace('login.html');
  document.querySelectorAll('.uname').forEach(e => e.textContent = U);
  document.getElementById('out').onclick = () => { sessionStorage.clear(); location.href = 'login.html'; };
}

const nf = document.getElementById('nform');
if (nf) nf.addEventListener('submit', e => {
  e.preventDefault();
  const li = document.createElement('li');
  li.textContent = nf.t.value;
  document.getElementById('nlist').prepend(li);
  nf.reset();
});