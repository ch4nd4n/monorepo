import '../styles/main.css';

// Intentionally minimal.
// This file exists so Vite processes Tailwind for playground.html.
//

const board = document.querySelector('#board');
const cow = "🐄"
const cell = `<span class="bg-amber-300 p-5 rounded-xl border-2">🐄</span>`

function createToken(emoji = '🐄') {
  const span = document.createElement('span');
  span.className =
    'bg-amber-300 p-2 rounded-xl border-2 inline-flex items-center justify-center';
  span.textContent = emoji;
  span.setAttribute('role', 'img');
  span.setAttribute('aria-label', 'Board token');
  return span;
}
