import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';

// Carga perezosa para optimizar el bundle
const ScreenerTool = lazy(() => import('./pages/screener/Screener')); 

function App() {
  const [activeModule, setActiveModule] = useState('loading');

  useEffect(() => {
    const hostname = window.location.hostname;
    const path = window.location.pathname;
    
    // 1. Lógica para Producción (Subdominios)
    if (hostname.includes('lemonpyth') || hostname.startsWith('terminal.')) {
      setActiveModule('terminal');
      return;
    }
    if (hostname.startsWith('screener.')) {
      setActiveModule('screener');
      return;
    }

    // 2. Lógica para Desarrollo (localhost)
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      if (path.startsWith('/terminal')) {
        setActiveModule('terminal');
      } else {
        setActiveModule('screener');
      }
      return;
    }

    // Por defecto: Screener (Landing del Arbitraje)
    setActiveModule('screener');
  }, []);

  if (activeModule === 'loading') return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz dinámica */}
          <Route path="/" element={
            activeModule === 'terminal' ? <Terminal /> : <ScreenerTool />
          } />

          {/* Paths fijos para navegación manual */}
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/screener" element={<ScreenerTool />} />

          {/* Catch-all: Redirige a la raíz para no romper la app */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;