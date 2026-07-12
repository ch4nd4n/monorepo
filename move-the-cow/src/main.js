import '../styles/main.css';

const app = document.querySelector('#app');

if (app) {
  app.innerHTML = `
    <main class="min-h-screen bg-slate-50 text-slate-900">
      <section class="mx-auto max-w-3xl px-6 py-16">
        <p class="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Move the Cow
        </p>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Vite + Tailwind + Vanilla JS is ready</h1>
        <p class="mt-4 text-base text-slate-600">
          This page is wired with Tailwind CSS using Vite. Use this as the base for game UI implementation.
        </p>
      </section>
      <section id="board"></section>
    </main>
  `;
}

function createToken(emoji = '🐄') {
  const span = document.createElement('span');
  span.className =
    'bg-amber-300 p-2 rounded-xl border-2 inline-flex items-center justify-center';
  span.textContent = emoji;
  span.setAttribute('role', 'img');
  span.setAttribute('aria-label', 'Board token');
  return span;
}
