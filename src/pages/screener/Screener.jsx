import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// Hooks
import { useScreenerData } from '../../hooks/useScreenerData';

// Components
import AppNavbar from '../../components/app/AppNavbar';
import AppFooter from '../../components/app/AppFooter';
import Toolbar from '../../components/screener/Toolbar';
import ScreenerTable from '../../components/screener/ScreenerTable';

// --- MEMOIZACIÓN ESTRUCTURAL ---
// Evita que el Navbar y Footer se re-rendericen cuando cambian los precios (data)
const MemoNavbar = React.memo(AppNavbar);
const MemoFooter = React.memo(AppFooter);
const MemoToolbar = React.memo(Toolbar);

const Screener = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- ESTADO LOCAL ---
  const [activeExchange, setActiveExchange] = useState('binance');
  const [activeSector, setActiveSector] = useState('crypto');
  const [searchQuery, setSearchQuery] = useState('');

  // --- SINCRONIZACIÓN URL (Al Montar) ---
  useEffect(() => {
      const urlEx = searchParams.get('exchange');
      if (urlEx === 'forex') {
          setActiveExchange('forex');
          setActiveSector('traditional');
      } else if (urlEx === 'hl') {
          setActiveExchange('hyperliquid');
      }
      // Si no hay param, usamos el default (Binance) sin forzar URL
  }, []); 

  // --- HANDLERS (Estables) ---
  const handleExchangeChange = useCallback((sector, exchange) => {
      setActiveSector(sector);
      setActiveExchange(exchange);
      
      // Mapeo limpio para la URL
      const urlMap = {
          'hyperliquid': 'hl',
          'forex': 'forex',
          'binance': 'binance'
      };
      
      setSearchParams({ exchange: urlMap[exchange] || 'binance' }, { replace: true });
  }, [setSearchParams]);

  const handleSearchChange = useCallback((val) => {
      setSearchQuery(val);
  }, []);

  // --- MOTOR DE DATOS (Hook Dual 5s/60s) ---
  const { data, isLoading, requestSort, sortConfig } = useScreenerData(activeSector, activeExchange);

  // --- FILTRADO (Memoizado) ---
  // Se ejecuta solo si cambia la data o la búsqueda, no en cada tick de render visual
  const filteredData = React.useMemo(() => {
      if (!searchQuery) return data;
      const lowerQuery = searchQuery.toLowerCase();
      return data.filter(item => item.symbol.toLowerCase().includes(lowerQuery));
  }, [data, searchQuery]);

  // Lógica para permitir gráficos (Solo Binance Crypto por ahora)
  const isChartAllowed = activeSector === 'crypto' && activeExchange === 'binance';

  return (
    // LAYOUT PRINCIPAL: Flex Column + Altura fija de pantalla (Sin scroll en body)
    <div className="h-screen w-screen bg-[#050505] text-[#d4d4d4] flex flex-col overflow-hidden font-sans selection:bg-sz-blue selection:text-white">
      
      {/* 1. NAVBAR (Fijo arriba) */}
      <MemoNavbar 
          activeSector={activeSector}
          activeExchange={activeExchange}
          onSelectExchange={handleExchangeChange}
      />

      {/* 2. ÁREA DE CONTENIDO (Se expande) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* Barra de Herramientas (Fija bajo el Navbar) */}
          <MemoToolbar 
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            isChartAllowed={isChartAllowed}
            totalAssets={data.length}
          />

          {/* Tabla (Scroll interno) */}
          {/* ScreenerTable ya tiene 'flex-1 overflow-auto' dentro, así que llenará este espacio */}
          <ScreenerTable 
              data={filteredData} 
              isLoading={isLoading}
              sortConfig={sortConfig}
              requestSort={requestSort}
              isChartAllowed={isChartAllowed}
              activeSector={activeSector}
          />
      </main>

      {/* 3. FOOTER (Fijo abajo) */}
      <MemoFooter 
          exchange={activeExchange}
          count={data.length} 
          isLoading={isLoading}
      />
    </div>
  );
};

export default Screener;