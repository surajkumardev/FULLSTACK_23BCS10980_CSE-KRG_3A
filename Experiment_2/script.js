const toggle = document.getElementById('theme-toggle');
const dashboard = document.querySelector('.dashboard');

toggle.addEventListener('click', () => {
  const newTheme = dashboard.dataset.theme === 'light' ? 'dark' : 'light';
  dashboard.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    dashboard.dataset.theme = savedTheme;
  }
});
