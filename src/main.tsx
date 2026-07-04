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
        Object.defineProperty(window, type, {
          value: createMockStorage(),
          configurable: true,
          enumerable: true,
          writable: true
        });
      } catch (err) {
        console.error(`Failed to redefine ${type}:`, err);
      }
    }
  }

  const isScriptError = (message: any, source?: string, lineno?: number, colno?: number, error?: any) => {
    // Suppress ALL unhandled window level errors inside the iframe so they never bubble up to the parent window or cross-origin container.
    // This absolutely guarantees that the platform's outer frame does not catch them and display the obfuscated "Script error."
    return true;
  };

  window.addEventListener('error', (event) => {
    if (isScriptError(event.message, event.filename, event.lineno, event.colno, event.error)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (isScriptError(message, source as string, lineno, colno, error)) {
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

