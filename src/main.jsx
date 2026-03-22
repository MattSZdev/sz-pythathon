import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './i18n'; 
import './index.css'; // Asegúrate de que el path sea correcto (usualmente ./index.css)

// --- 🔥 INTERCEPTOR DE RED (Anti-Crash Global) ---
(function() {
    const mockTimeResponse = JSON.stringify({
        utc_datetime: new Date().toISOString(),
        unixtime: Math.floor(Date.now() / 1000)
    });

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0] ? args[0].toString() : '';
        if (url.includes('worldtimeapi.org')) {
            return new Response(mockTimeResponse, { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return originalFetch(...args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes('worldtimeapi.org')) {
            this._isMocked = true;
        }
        return originalOpen.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.send = function() {
        if (this._isMocked) {
            Object.defineProperty(this, 'status', { value: 200 });
            Object.defineProperty(this, 'responseText', { value: mockTimeResponse });
            Object.defineProperty(this, 'readyState', { value: 4 });
            this.dispatchEvent(new Event('readystatechange'));
            if (this.onload) this.onload();
            return;
        }
        return originalSend.apply(this, arguments);
    };
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);