import { useEffect } from 'react';
import useMarketStore from './store/marketStore';
import Screener from './pages/screener/Screener';
import './App.css';

function App() {
  const connectMarketData = useMarketStore(state => state.connectMarketData);

  useEffect(() => {
    // Conecta a Binance automáticamente al entrar
    connectMarketData();
  }, [connectMarketData]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header Minimalista */}
      <nav className="border-b border-gray-800 p-4 bg-[#0a0a0a]">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          SZ PYTH-SCANNER <span className="text-xs text-gray-500 ml-2">v1.0-beta</span>
        </h1>
      </nav>

      <main className="p-4">
        {/* Cargamos directamente la herramienta de Screener */}
        <Screener />
      </main>
    </div>
  );
}

export default App;