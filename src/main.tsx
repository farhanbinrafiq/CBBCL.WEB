import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Swallow generic cross-origin "Script error." which can bubble up from third-party embed scripts/iframes or browser extensions
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || event.message?.includes('Script error')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = typeof message === 'string' ? message : message?.toString() || '';
    if (msgStr.includes('Script error')) {
      return true; // Stop propagation
    }
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

