// src/components/terminal/widgets/ScreenerWidget.jsx

import React, { useState, useMemo } from 'react';
import { Search, ArrowUp, ArrowDown, Activity, Zap, Layers } from 'lucide-react';
// IMPORTANTE: Reutilizamos tu hook maestro
import { useScreenerData } from '../../../hooks/useScreenerData'; 

// --- FORMATTERS (Mismos que el screener principal) ---
const formatNumber = (num, decimals = 2) => {
    if (!num && num !== 0) return '-';
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
};

const formatPrice = (price) => {
    if (!price) return '-';
    return price < 1 
        ? price.toFixed(6) 
        : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatFunding = (rate) => {
    if (rate === undefined || rate === null) return '-';
    return (rate * 100).toFixed(4) + '%';
};

const ScreenerWidget = () => {
    // Estado local para manejar las pestañas del widget
    const [activeSector, setActiveSector] = useState('crypto');
    const [activeExchange, setActiveExchange] = useState('binance');
    const [searchQuery, setSearchQuery] = useState('');

    // --- MOTOR DE DATOS (El hook hace todo el trabajo: WS, OI, Funding) ---
    const { data, isLoading, requestSort, sortConfig } = useScreenerData(activeSector, activeExchange);

    // --- FILTRADO LOCAL ---
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter(item => 
            item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    // --- CAMBIO DE MERCADO ---
    const handleExchangeSwitch = (exch) => {
        setActiveExchange(exch);
        // Si es forex, cambiamos el sector a 'traditional', si no, 'crypto'
        setActiveSector(exch === 'forex' ? 'traditional' : 'crypto');
    };

    // Helper para íconos de ordenamiento
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ArrowUp size={8} /> : <ArrowDown size={8} />;
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#050505] font-mono select-none overflow-hidden text-[#d4d4d4]">
            
            {/* --- HEADER: CONTROLES --- */}
            <div className="flex flex-col gap-2 px-2 py-2 border-b border-[#1a1a1a] bg-[#0a0a0a] shrink-0">
                
                {/* Pestañas de Exchange */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 bg-[#121212] p-0.5 rounded border border-[#222]">
                        <button 
                            onClick={() => handleExchangeSwitch('binance')}
                            className={`text-[8px] font-bold px-2 py-1 rounded transition-all uppercase ${activeExchange === 'binance' ? 'bg-[#F3BA2F] text-black' : 'text-[#555] hover:text-[#999]'}`}
                        >
                            Binance
                        </button>
                        <button 
                            onClick={() => handleExchangeSwitch('hyperliquid')}
                            className={`text-[8px] font-bold px-2 py-1 rounded transition-all uppercase ${activeExchange === 'hyperliquid' ? 'bg-[#02E2AC] text-black' : 'text-[#555] hover:text-[#999]'}`}
                        >
                            Hyper
                        </button>
                        <button 
                            onClick={() => handleExchangeSwitch('forex')}
                            className={`text-[8px] font-bold px-2 py-1 rounded transition-all uppercase ${activeExchange === 'forex' ? 'bg-sz-blue text-white' : 'text-[#555] hover:text-[#999]'}`}
                        >
                            Forex
                        </button>
                    </div>
                    
                    {/* Contador en vivo */}
                    <div className="flex items-center gap-1 text-[9px] text-[#444]">
                        <Activity size={10} className={isLoading ? "animate-spin" : "text-emerald-500"} />
                        <span>{filteredData.length}</span>
                    </div>
                </div>

                {/* Barra de Búsqueda */}
                <div className="relative group w-full">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0f0f0f] border border-[#1a1a1a] rounded py-1 pl-6 pr-2 text-[10px] text-white focus:outline-none focus:border-[#333] transition-colors uppercase placeholder:text-[#333]"
                    />
                </div>
            </div>

            {/* --- TABLA DE DATOS --- */}
            <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
                {isLoading && data.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#333] gap-2">
                        <Zap size={16} className="animate-bounce" />
                        <span className="text-[10px] animate-pulse">SYNCING FEED...</span>
                    </div>
                ) : (
                    <table className="w-full text-left text-[10px] border-collapse relative table-fixed">
                        <thead className="sticky top-0 bg-[#0a0a0a] text-[#555] font-semibold z-10 text-[9px] uppercase tracking-wider">
                            <tr>
                                {/* TICKER */}
                                <th 
                                    className="w-[25%] py-2 pl-2 border-b border-[#1a1a1a] cursor-pointer hover:text-[#888]"
                                    onClick={() => requestSort('symbol')}
                                >
                                    <div className="flex items-center gap-1">Tick {getSortIcon('symbol')}</div>
                                </th>
                                
                                {/* PRICE */}
                                <th 
                                    className="w-[20%] py-2 text-right border-b border-[#1a1a1a] cursor-pointer hover:text-[#888]"
                                    onClick={() => requestSort('price')}
                                >
                                    <div className="flex items-center justify-end gap-1">Price {getSortIcon('price')}</div>
                                </th>

                                {/* CHANGE % */}
                                <th 
                                    className="w-[15%] py-2 text-right border-b border-[#1a1a1a] cursor-pointer hover:text-[#888]"
                                    onClick={() => requestSort('change')}
                                >
                                    <div className="flex items-center justify-end gap-1">24h% {getSortIcon('change')}</div>
                                </th>

                                {/* COLUMNA DINÁMICA 1: OI (Solo Crypto) */}
                                {activeSector === 'crypto' && (
                                    <th 
                                        className="w-[20%] py-2 text-right border-b border-[#1a1a1a] cursor-pointer hover:text-[#888]"
                                        onClick={() => requestSort('oi')}
                                    >
                                        <div className="flex items-center justify-end gap-1">OI {getSortIcon('oi')}</div>
                                    </th>
                                )}

                                {/* COLUMNA DINÁMICA 2: FUNDING o VOLUMEN */}
                                <th 
                                    className="w-[20%] py-2 text-right pr-2 border-b border-[#1a1a1a] cursor-pointer hover:text-[#888]"
                                    onClick={() => requestSort(activeSector === 'crypto' ? 'funding' : 'volume')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        {activeSector === 'crypto' ? 'Fund' : 'Vol'} {getSortIcon(activeSector === 'crypto' ? 'funding' : 'volume')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-[#121212]">
                            {filteredData.slice(0, 100).map((item) => (
                                <tr 
                                    key={item.symbol} 
                                    className="group hover:bg-[#121212] transition-colors cursor-pointer"
                                    onClick={() => console.log("Set Active Symbol:", item.symbol)}
                                >
                                    {/* 1. TICKER */}
                                    <td className="py-1.5 pl-2 truncate">
                                        <span className="font-bold text-[#e0e0e0] group-hover:text-white">{item.symbol.replace('USDT', '')}</span>
                                        {activeSector === 'crypto' && <span className="text-[#444] text-[8px] ml-0.5">.P</span>}
                                    </td>
                                    
                                    {/* 2. PRICE */}
                                    <td className="py-1.5 text-right font-mono text-[#ccc] truncate">
                                        {formatPrice(item.price)}
                                    </td>
                                    
                                    {/* 3. CHANGE */}
                                    <td className={`py-1.5 text-right font-bold ${item.change >= 0 ? 'text-[#00ff88]' : 'text-[#ff4466]'}`}>
                                        {Math.abs(item.change).toFixed(2)}%
                                    </td>
                                    
                                    {/* 4. OI (Solo Crypto) */}
                                    {activeSector === 'crypto' && (
                                        <td className="py-1.5 text-right font-mono text-[#888] group-hover:text-[#aaa] truncate">
                                            {item.oi ? formatNumber(item.oi) : '-'}
                                        </td>
                                    )}
                                    
                                    {/* 5. FUNDING / VOLUMEN */}
                                    <td className={`py-1.5 text-right pr-2 font-mono truncate ${
                                        activeSector === 'crypto' 
                                            ? (item.funding > 0 ? 'text-[#F3BA2F]' : item.funding < 0 ? 'text-[#ff4466]' : 'text-[#555]')
                                            : 'text-[#555]'
                                    }`}>
                                        {activeSector === 'crypto' 
                                            ? formatFunding(item.funding) 
                                            : formatNumber(item.volume)
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* --- MINI FOOTER --- */}
            <div className="h-5 border-t border-[#1a1a1a] bg-[#080808] flex items-center justify-between px-2 text-[8px] text-[#444]">
                <div className="flex items-center gap-2">
                    <span className="uppercase">{activeExchange}</span>
                    <span className="w-px h-2 bg-[#222]"></span>
                    <span>{filteredData.length} ASSETS</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00b389]">
                    <div className="w-1 h-1 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_5px_#00ff88]"></div>
                    STREAMING
                </div>
            </div>
        </div>
    );
};

export default ScreenerWidget;