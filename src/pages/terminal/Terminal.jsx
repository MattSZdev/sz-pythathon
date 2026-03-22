import React, { useState, useEffect } from 'react';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import RGL from "react-grid-layout";

// Configuración de Layouts
import { layoutsConfig } from '../../config/layouts';

// Hooks
import { useTabTicker } from '../../hooks/useTabTicker'; // <--- [NUEVO] Importar Hook

// Componentes Estructurales
import TNavbar from '../../components/app/TNavbar';
import TFooter from '../../components/app/TFooter'; 
import TerminalWidget from '../../components/terminal/TerminalWidget';

// Widgets Funcionales
import TVChartContainer from '../../components/terminal/TVChartContainer'; 
import ScreenerWidget from '../../components/terminal/widgets/ScreenerWidget'; 
import OrderBook from '../../components/terminal/OrderBook'; 
import MiniChartWidget from '../../components/terminal/widgets/MiniChartWidget'; 

const Responsive = RGL.Responsive || RGL;

export default function Terminal() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  
  // 🔥 [NUEVO] Activar el Ticker en la Pestaña
  // Esto actualizará el título y el favicon automáticamente
  useTabTicker(symbol);

  // 1. MEDIR PANTALLA
  const [width, setWidth] = useState(window.innerWidth);
  
  // 2. DETECCIÓN MÓVIL MANUAL
  const isMobile = width < 768;

  // 3. SELECCIÓN DE LAYOUT MANUAL
  const activeLayoutConfig = isMobile ? layoutsConfig.mobile : layoutsConfig.desktop;

  // Helper de inyección de layout (Tu lógica intacta)
  const getLayoutFor = (id) => {
      return activeLayoutConfig.find(item => item.i === id) || { i: id, x: 0, y: 0, w: 1, h: 1 };
  };

  // 4. ALTURA DE FILAS (Ajustada para 10 filas totales)
  const rowHeight = (window.innerHeight - 48 - 28 - 10) / 10;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0b0e11] text-[#d4d4d4] flex flex-col font-mono overflow-hidden">
      <TNavbar symbol={symbol} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0b0e11] scrollbar-thin scrollbar-thumb-[#2a2e39] scrollbar-track-transparent">
        
        <Responsive
          className="layout"
          width={width}
          rowHeight={rowHeight}
          
          // MANUAL: 100 cols en PC, 1 en Móvil
          cols={{ lg: 12, md: 12, sm: 1, xs: 1, xxs: 1 }} 
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}

          draggableHandle=".widget-drag-handle"
          margin={[4, 4]} 
          containerPadding={[0, 0]}
          resizeHandles={['s', 'e', 'se']}
          compactType="vertical"
          useCSSTransforms={true}
          measureBeforeMount={false}
        >
          
          {/* --- 1. CHART PRINCIPAL (BTC/Crypto) --- */}
          <div key="chart" data-grid={getLayoutFor('chart')}>
             <div className="resize-overlay" /> 
             <TerminalWidget title={`CHART · ${symbol}`}>
                <TVChartContainer activeSymbol={symbol} onSymbolChange={setSymbol} />
             </TerminalWidget>
          </div>
          
          {/* --- 2. ORDERBOOK --- */}
          <div key="orderbook" data-grid={getLayoutFor('orderbook')}>
             <TerminalWidget title="ORDER BOOK">
                <OrderBook symbol={symbol} />
             </TerminalWidget>
          </div>

          {/* --- 3. SCREENER --- */}
          <div key="screener" data-grid={getLayoutFor('screener')}>
             <TerminalWidget title="MARKET LIST">
                <ScreenerWidget />
             </TerminalWidget>
          </div>

          {/* --- 4. MINI CHART (S&P 500 Fijo) --- */}
          <div key="minichart" data-grid={getLayoutFor('minichart')}>
             <div className="resize-overlay" />
             <TerminalWidget title="GLOBAL · S&P 500">
                <MiniChartWidget symbol="SPX500" exchange="FOREXCOM" />
             </TerminalWidget>
          </div>

        </Responsive>
      </div>

      <TFooter />
    </div>
  );
}