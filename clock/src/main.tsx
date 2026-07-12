import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@app/composition/app';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/service-worker.js').then(() => {
      void navigator.serviceWorker.ready.then((readyRegistration) => {
        const cacheableUrls = performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((url) => url.startsWith(window.location.origin));

        readyRegistration.active?.postMessage({ type: 'CACHE_URLS', urls: cacheableUrls });
      });
    });
  });
}
