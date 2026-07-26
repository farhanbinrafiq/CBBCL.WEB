import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Swallow generic cross-origin "Script error." which can bubble up from third-party embed scripts/iframes or browser extensions
if (typeof window !== 'undefined') {
  // Safe storage mocking to prevent SecurityErrors in sandboxed iframes
  const storageTypes = ['localStorage', 'sessionStorage'] as const;
  for (let i = 0; i < storageTypes.length; i++) {
    const type = storageTypes[i];
    try {
      const test = window[type];
      if (test) {
        test.setItem('__storage_test__', '1');
        test.removeItem('__storage_test__');
      } else {
        throw new Error(`${type} is null or undefined`);
      }
    } catch (e) {
      console.warn(`[Storage polyfill] ${type} is blocked or unavailable. Falling back to in-memory mock.`, e);
      const createMockStorage = () => {
        let data: Record<string, string> = {};
        const mock = {
          setItem: (key: string, value: any) => {
            data[key] = String(value);
          },
          getItem: (key: string) => {
            return data.hasOwnProperty(key) ? data[key] : null;
          },
          removeItem: (key: string) => {
            delete data[key];
          },
          clear: () => {
            data = {};
          },
          key: (index: number) => {
            const keys = Object.keys(data);
            return keys[index] || null;
          }
        };
        Object.defineProperty(mock, 'length', {
          get: () => {
            return Object.keys(data).length;
          }
        });
        return mock;
      };
      try {
        const mockStore = createMockStorage();
        Object.defineProperty(Window.prototype, type, {
          get: () => mockStore,
          configurable: true,
          enumerable: true
        });
      } catch (err) {
        console.warn(`Failed to redefine ${type} on Window.prototype:`, err);
      }
    }
  }

  const isScriptError = (message: any, source?: string) => {
    // Suppress cross-origin generic script error noise from parent frame or browser extensions
    if (typeof message === 'string' && (message.includes('Script error') || message.includes('ResizeObserver'))) {
      return true;
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (isScriptError(event.message, event.filename)) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }
  }, true);

  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (isScriptError(message, source as string)) {
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

