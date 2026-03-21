// src/components/screener/ScreenerTable.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import ChartRow from './ChartRow';
import { LOGO_OVERRIDES } from '../../config/marketRules';
import useMarketStore from '../../store/marketStore';

// 👇 NUEVO: Importar el Símbolo Global
import useAppStore from '../../store/appStore'; 

// --- HELPERS E IDENTITY QUEDAN INTACTOS ---
const getChangeColor = (val) => {
    if (!val && val !== 0) return 'text-[#606060]';
    return val > 0 ? 'text-[#00ff88]' : val < 0 ? 'text-[#ff4466]' : 'text-[#606060]';
};

const formatMetric = (n) => {
    if (!n) return "-";
    if (n >= 1e9) return +(n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return +(n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return +(n / 1e3).toFixed(0) + "K";
    return n.toFixed(0);
};

const AssetIdentity = React.memo(({ symbol }) => {
    const getLogoUrl = (sym) => {
        let clean = sym.replace('USDT', '').replace('PERP', '').replace('1000', '').replace('10000', '');
        if (LOGO_OVERRIDES[sym] || LOGO_OVERRIDES[clean]) {
            const mapped = LOGO_OVERRIDES[sym] || LOGO_OVERRIDES[clean];
            return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${mapped.toLowerCase()}.png`;
        }
        return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${clean.toLowerCase()}.png`;
    };

    const handleImgError = (e) => {
        const img = e.currentTarget;
        img.style.display = 'none';
        const fallback = img.nextElementSibling;
        if (fallback) fallback.style.display = 'flex';
    };

    return (
        <div className="flex items-center gap-2 h-full min-w-30">
            <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                <img 
                    src={getLogoUrl(symbol)} 
                    className="w-full h-full rounded-full object-cover" 
                    onError={handleImgError} 
                    loading="lazy" 
                    alt="" 
                />
                <div className="w-full h-full rounded-full bg-[#1a1a1a] hidden items-center justify-center text-[8px] text-[#606060] border border-[#2a2a2a] absolute top-0 left-0 font-bold">
                    {symbol.substring(0,1)}
                </div>
            </div>
            <span className="text-[#d4d4d4] font-medium text-[13px] font-sans">{symbol.replace('USDT','')}</span>
        </div>
    );
}, (prev, next) => prev.symbol === next.symbol); 

// --- CELDAS DINÁMICAS QUEDAN INTACTAS ---
const PriceCell = React.memo(({ symbol, initialPrice }) => {
    const livePrice = useMarketStore(state => state.prices[symbol]) || initialPrice;
    
    const prevPriceRef = useRef(livePrice);
    const [colorClass, setColorClass] = useState('text-[#d4d4d4]');

    useEffect(() => {
        if (livePrice > prevPriceRef.current) {
            setColorClass('text-[#00ff88] transition-none'); // Sube
        } else if (livePrice < prevPriceRef.current) {
            setColorClass('text-[#ff4466] transition-none'); // Baja
        }
        
        const timeout = setTimeout(() => setColorClass('text-[#d4d4d4] transition-colors duration-500'), 150);
        prevPriceRef.current = livePrice;
        
        return () => clearTimeout(timeout);
    }, [livePrice]);

    return (
        <span className={`${colorClass} font-bold tabular-nums`}>
            ${livePrice.toLocaleString('en-US', { minimumFractionDigits: livePrice < 1 ? 5 : 2 })}
        </span>
    );
});

const VolCell = React.memo(({ volume }) => (
    <span className="text-[#d4d4d4] tabular-nums">${formatMetric(volume)}</span>
));

// --- ROW ---
const ScreenerRow = React.memo(({ item, isExpanded, onToggle, isChartAllowed, activeSector, isActiveSymbol }) => {
    const cellClass = "px-2 py-1.5 h-[37px] border-b border-[#1a1a1a] whitespace-nowrap text-right text-[12px] font-mono tabular-nums";
    
    // 👇 NUEVO: Añadimos un pequeño highlight visual si es la moneda actualmente seleccionada
    const baseBg = isActiveSymbol ? 'bg-[#151515] border-l-2 border-l-[#00ff88]' : 'bg-[#0a0a0a] hover:bg-[#121212] border-l-2 border-l-transparent';
    const stickyBg = isExpanded || isActiveSymbol ? 'bg-[#151515]' : 'bg-[#0a0a0a] group-hover:bg-[#121212]';

    return (
        <>
            <tr onClick={() => onToggle(item.symbol)} className={`group transition-all cursor-pointer select-none ${baseBg}`}>
                
                <td className={`w-6 px-1 py-1.5 sticky left-0 z-10 border-b border-[#1a1a1a] text-center ${stickyBg}`}>
                    <span className="text-[#555] text-[10px] font-bold opacity-0 group-hover:opacity-100">⋮⋮</span>
                </td>
                
                <td className={`w-14 px-1 py-1.5 sticky left-6 z-10 border-b border-[#1a1a1a] border-r text-center ${stickyBg}`}>
                   <div className="flex items-center justify-center gap-2 h-full">
                       <img 
                            src="/img/candlestick.svg" 
                            alt="Chart" 
                            className="w-5 h-5 grayscale opacity-30 group-hover:opacity-60 transition-opacity" 
                       />
                       <Star size={12} className={`transition-colors cursor-pointer ${isActiveSymbol ? 'text-[#00ff88]' : 'text-[#404040] hover:text-[#d4d4d4]'}`} />
                   </div>
                </td>

                <td className={`px-2 py-1.5 sticky left-20 z-10 border-b border-r border-[#1a1a1a] ${stickyBg}`}>
                    <AssetIdentity symbol={item.symbol} />
                </td>

                <td className={`${cellClass} min-w-22.5`}>
                    <PriceCell symbol={item.symbol} initialPrice={item.price} />
                </td>
                <td className={`${cellClass} min-w-22.5`}>
                    <VolCell volume={item.volume} />
                </td>
                
                <td className={`${cellClass} min-w-20 hidden md:table-cell`}>
                    <span className="text-[#d4d4d4] font-medium">${formatMetric(item.oi)}</span>
                </td>

                <td className={`${cellClass} min-w-17.5 hidden lg:table-cell`}>
                    <span className={item.vlt > 5 ? 'text-orange-400 font-bold' : 'text-[#808080]'}>
                        {item.vlt ? `${item.vlt.toFixed(2)}%` : '-'}
                    </span>
                </td>

                <td className={`${cellClass} min-w-20 hidden lg:table-cell`}>
                     <span className={item.change > 0 ? 'text-blue-400' : 'text-purple-400'}>
                        {item.change ? `${(Math.abs(item.change) * 0.5).toFixed(2)}%` : '-'}
                     </span>
                </td>

                <td className={`${cellClass} min-w-20`}>
                    <span className={`${getChangeColor(item.change)} font-bold`}>{item.change > 0 ? '+' : ''}{item.change?.toFixed(2)}%</span>
                </td>

                <td className={`${cellClass} min-w-22.5 hidden xl:table-cell`}>
                   <span className={item.funding > 0.01 ? 'text-orange-400' : 'text-[#808080]'}>{item.funding ? `${item.funding.toFixed(4)}%` : '-'}</span>
                </td>

                <td className={`px-1 py-1.5 h-9.25 border-b border-[#1a1a1a] text-center w-6 sticky right-0 z-10 ${stickyBg}`}>
                     <div className="flex justify-end pr-2">
                        <ChevronDown size={14} className={`text-[#404040] transition-transform ${isExpanded ? 'rotate-180 text-[#00ff88]' : ''}`} />
                     </div>
                </td>
            </tr>
            {isExpanded && isChartAllowed && <ChartRow symbol={item.symbol} />}
        </>
    );
}, (prev, next) => {
    return prev.item === next.item && 
           prev.isExpanded === next.isExpanded && 
           prev.isActiveSymbol === next.isActiveSymbol;
});

const ScreenerTable = ({ data, isLoading, sortConfig, requestSort, activeSector, isChartAllowed }) => {
    // 👇 NUEVO: Inyectamos el Símbolo Global para leerlo y actualizarlo
    const activeSymbol = useAppStore(state => state.activeSymbol);
    const setActiveSymbol = useAppStore(state => state.setActiveSymbol);
    
    const [expandedSymbol, setExpandedSymbol] = useState(null);

    const toggleRow = useCallback((symbol) => {
        if (!isChartAllowed) return;
        
        // Mantiene la lógica original de expandir/colapsar
        setExpandedSymbol(prev => prev === symbol ? null : symbol);
        
        // 👇 MAGIA: Cambia el símbolo global. Esto disparará la actualización en el Chart, Orderbook y TNavbar.
        setActiveSymbol(symbol);
    }, [isChartAllowed, setActiveSymbol]);

    const Header = ({ label, colKey, minWidth, align = 'left', className = '' }) => (
        <th 
            className={`px-2 py-1.5 text-[10px] font-medium text-[#808080] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-[#121212] bg-[#0a0a0a] border-b border-[#1a1a1a] sticky top-0 z-20 select-none ${className}`}
            style={{ minWidth }}
            onClick={() => requestSort(colKey)}
        >
            <div className={`flex items-center gap-1 justify-${align}`}>
                <span>{label}</span>
                <div className="flex flex-col text-[8px] leading-2 opacity-50">
                    <span className={sortConfig.key === colKey && sortConfig.direction === 'asc' ? 'text-[#d4d4d4]' : 'text-[#606060]'}>▲</span>
                    <span className={sortConfig.key === colKey && sortConfig.direction === 'desc' ? 'text-[#d4d4d4]' : 'text-[#606060]'}>▼</span>
                </div>
            </div>
        </th>
    );

    return (
        <div className="flex-1 overflow-auto bg-[#0a0a0a] custom-scrollbar relative">
            <table className="w-full border-collapse" style={{ minWidth: '100%' }}>
                <thead>
                    <tr>
                        <th className="w-6 px-1 py-1.5 bg-[#0a0a0a] sticky left-0 z-30 border-b border-[#1a1a1a]"></th>
                        <th className="w-14 px-1 py-1.5 bg-[#0a0a0a] sticky left-6 z-30 border-b border-[#1a1a1a] border-r">
                             <div className="flex justify-center gap-2 items-center h-full">
                                <img src="/img/candlestick.svg" alt="" className="w-5 h-5 grayscale opacity-30"/>
                                <Star size={12} className="text-[#404040] opacity-50"/>
                             </div>
                        </th>
                        <Header label="Symbol" colKey="symbol" minWidth="120px" className="sticky left-20 z-30 border-r border-[#1a1a1a]" align="start" />
                        <Header label="Price" colKey="price" minWidth="90px" align="end" />
                        <Header label="Vol (24h)" colKey="volume" minWidth="80px" align="end" />
                        
                        <Header label="OI ($)" colKey="oi" minWidth="80px" align="end" className="hidden md:table-cell" />
                        <Header label="VLT" colKey="vlt" minWidth="70px" align="end" className="hidden lg:table-cell" />
                        <Header label="OI % (1D)" colKey="change" minWidth="80px" align="end" className="hidden lg:table-cell" />
                        
                        <Header label="24h %" colKey="change" minWidth="80px" align="end" />
                        {activeSector === 'crypto' && <Header label="Fund" colKey="funding" minWidth="90px" align="end" className="hidden xl:table-cell"/>}
                        <th className="px-1 py-1.5 w-6 bg-[#0a0a0a] border-b border-[#1a1a1a] sticky right-0 top-0 z-20"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                    {data.map(item => (
                        <ScreenerRow 
                            key={item.symbol} 
                            item={item} 
                            isExpanded={expandedSymbol === item.symbol} 
                            onToggle={toggleRow} 
                            isChartAllowed={isChartAllowed} 
                            activeSector={activeSector}
                            isActiveSymbol={activeSymbol === item.symbol} // Le decimos a la fila si está seleccionada
                        />
                    ))}
                </tbody>
            </table>
            {!isLoading && data.length === 0 && <div className="p-20 text-center text-[#404040] text-xs uppercase">No active markets found</div>}
        </div>
    );
};

export default React.memo(ScreenerTable);