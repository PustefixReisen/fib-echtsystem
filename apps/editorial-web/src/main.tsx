import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { RisMinutesPreview, RisMinutesReviewPreview } from './RisMinutesPreview.js';

const root = document.getElementById('root');

if (!root) throw new Error('Root-Element fehlt.');

createRoot(root).render(
  <StrictMode>
    {window.location.pathname.startsWith('/redaktion-preview/') &&
      new URLSearchParams(window.location.search).get('ris-minutes-test') === '2'
        ? <RisMinutesReviewPreview />
        : window.location.pathname.startsWith('/redaktion-preview/') &&
          new URLSearchParams(window.location.search).get('ris-minutes-test') === '1'
          ? <RisMinutesPreview />
          : <App />}
  </StrictMode>,
);
