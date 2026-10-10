const root = document.body;
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeLabel = document.querySelector('.theme-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const phoneInput = document.querySelector('#phone');
const form = document.querySelector('#contact-form');
const modal = document.querySelector('#notice-modal');
const modalClose = modal.querySelector('.modal-close');
const modalOk = modal.querySelector('.modal-ok');

// Mantém a preferência de tema ao visitar novamente ou navegar pelas seções.
const savedTheme = localStorage.getItem('lorenzo-portfolio-theme');
if (savedTheme === 'light') root.classList.add('light-mode');
syncThemeButton();

themeButton.addEventListener('click', () => {
  root.classList.toggle('light-mode');
  localStorage.setItem('lorenzo-portfolio-theme', root.classList.contains('light-mode') ? 'light' : 'dark');
  syncThemeButton();
});

function syncThemeButton() {
  const isLight = root.classList.contains('light-mode');
  themeButton.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
  themeIcon.textContent = isLight ? '☾' : '☼';
  themeLabel.textContent = isLight ? 'Escuro' : 'Claro';
  themeMeta.setAttribute('content', isLight ? '#fffefa' : '#171e20');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navLinks.classList.toggle('open', open);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navLinks.classList.remove('open');
}));

// Máscara brasileira para celular e telefone fixo.
phoneInput.addEventListener('input', event => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  let masked = digits;
  if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length > 7) {
    const split = digits.length === 11 ? 7 : 6;
    masked = `(${digits.slice(0, 2)}) ${digits.slice(2, split)}-${digits.slice(split)}`;
  }
  event.target.value = masked;
});
phoneInput.addEventListener('blur', () => {
  const count = phoneInput.value.replace(/\D/g, '').length;
  phoneInput.setCustomValidity(count === 10 || count === 11 ? '' : 'Digite um telefone com DDD, com 10 ou 11 números.');
});
phoneInput.addEventListener('input', () => phoneInput.setCustomValidity(''));

function closeModal() {
  if (modal.open) modal.close();
}
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = encodeURIComponent(`Contato pelo portfólio — ${data.get('name')}`);
  const body = encodeURIComponent(
    `Nome: ${data.get('name')}\nTelefone: ${data.get('phone')}\nE-mail: ${data.get('email')}\n\nMensagem:\n${data.get('message')}`
  );
  modal.showModal();
  window.setTimeout(() => {
    window.location.href = `mailto:lorenzomoreiraaugusto@gmail.com?subject=${subject}&body=${body}`;
  }, 700);
});

document.querySelector('#year').textContent = new Date().getFullYear();

