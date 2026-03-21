import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Terminal, Home } from 'lucide-react';

// --- CONFIGURACIÓN DE COLORES POR EXCHANGE ---
const getBrandStyles = (id) => {
    switch (id) {
        case 'binance':
            return {
                text: 'text-[#F3BA2F]', 
                glow: 'drop-shadow-[0_0_8px_rgba(243,186,47,0.6)]'
            };
        case 'hyperliquid':
            return {
                text: 'text-[#02E2AC]', 
                glow: 'drop-shadow-[0_0_8px_rgba(2,226,172,0.6)]' 
            };
        case 'forex':
            return {
                text: 'text-blue-400', 
                glow: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' 
            };
        default:
            return { text: 'text-white', glow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' };
    }
};

// --- BOTÓN CENTRAL (Adaptado para Móvil Compacto y Desktop) ---
const ExchangeButton = ({ id, label, icon: Icon, imgSrc, sector, activeSector, activeExchange, onSelect, compact = false }) => {
    const isActive = activeExchange === id && activeSector === sector;
    const styles = getBrandStyles(id);

    return (
        <button 
            onClick={() => onSelect(sector, id)}
            className={`
                relative flex items-center justify-center transition-all duration-300 group outline-none
                ${compact ? 'px-2 py-1.5' : 'px-4 py-2'}
            `}
        >
            <span className={`
                flex items-center gap-2 font-extrabold tracking-widest uppercase font-montserrat transition-all duration-300
                ${compact ? 'text-[9px]' : 'text-[10px] lg:text-[11px]'}
                ${isActive ? `${styles.text} ${styles.glow}` : 'text-gray-600 opacity-60 group-hover:opacity-100 group-hover:text-gray-300'}
            `}>
                {imgSrc ? (
                    <img 
                        src={imgSrc} 
                        alt={label} 
                        className={`
                            object-contain transition-all duration-300 
                            ${compact ? 'w-3 h-3' : 'w-4 h-4'}
                            ${isActive ? `opacity-100 grayscale-0 ${styles.glow}` : 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'}
                        `} 
                    />
                ) : (
                    <Icon size={compact ? 12 : 14} className={`transition-all duration-300 ${isActive ? styles.glow : ''}`} />
                )}
                
                {/* Texto visible también en móvil, abreviado si es necesario */}
                {compact ? (
                    <span className="inline">{label === 'HYPERLIQUID' ? 'HYPER' : label}</span>
                ) : (
                    label
                )}
            </span>
            
            {/* Indicador activo: Punto brillante abajo, igual en PC y Celular */}
            {isActive && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${styles.text} bg-current opacity-60`}></div>
            )}
        </button>
    );
};

// --- NAVBAR ---
const AppNavbar = ({ activeSector, activeExchange, onSelectExchange }) => {
    
    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 h-14 bg-[#0a0a0a]/90 border-b border-white/5 backdrop-blur-md">
                <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>

                <div className="w-full h-full px-4 md:px-10 flex items-center justify-between relative z-10">
                    
                    {/* 1. IZQUIERDA: LOGO */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link to="/" className="flex items-center gap-3 group outline-none">
                            <div className="relative w-7 h-7 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shrink-0">
                                <img 
                                    src="/img/logo.svg" 
                                    alt="SZ" 
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    onError={(e) => { e.target.style.display = 'none'; }} 
                                />
                            </div>
                            {/* Texto oculto en móvil muy pequeño, visible en sm */}
                            <span className="text-sm font-montserrat font-black tracking-tighter uppercase italic leading-none text-white/90 hidden sm:block">
                                SZ SCREENER
                            </span>
                        </Link>
                    </div>

                    {/* 2. CENTRO: SELECTORES */}
                    
                    {/* VERSIÓN MÓVIL: Sin "burbuja" de fondo, limpio como en PC */}
                    <div className="flex lg:hidden items-center gap-1 mx-2 overflow-x-auto no-scrollbar" aria-label="Abrir menú de navegación">
                        <ExchangeButton 
                            id="binance" label="BINANCE" imgSrc="/img/exchanges/binance.svg" sector="crypto" 
                            activeSector={activeSector} activeExchange={activeExchange} onSelect={onSelectExchange} 
                            compact={true} 
                        />
                        <div className="w-px h-3 bg-white/10 mx-0.5 shrink-0"></div>
                        <ExchangeButton 
                            id="hyperliquid" label="HYPERLIQUID" imgSrc="/img/exchanges/hyperliquid.svg" sector="crypto" 
                            activeSector={activeSector} activeExchange={activeExchange} onSelect={onSelectExchange} 
                            compact={true} 
                        />
                        <div className="w-px h-3 bg-white/10 mx-0.5 shrink-0"></div>
                        <ExchangeButton 
                            id="forex" label="FOREX" icon={Globe} sector="traditional" 
                            activeSector={activeSector} activeExchange={activeExchange} onSelect={onSelectExchange} 
                            compact={true} 
                        />
                    </div>

                    {/* VERSIÓN DESKTOP (Intacta) */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full items-center">
                        <div className="flex items-center gap-2">
                            <ExchangeButton 
                                id="binance" label="BINANCE" imgSrc="/img/exchanges/binance.svg" sector="crypto" 
                                activeSector={activeSector} activeExchange={activeExchange} onSelect={onSelectExchange} 
                            />
                            <div className="w-px h-3 bg-white/10 rounded-full mx-1"></div>
                            <ExchangeButton 
                                id="hyperliquid" label="HYPERLIQUID" imgSrc="/img/exchanges/hyperliquid.svg" sector="crypto" 
                                activeSector={activeSector} activeExchange={activeExchange} onSelect={onSelectExchange} 
                            />
                            <div className="w-px h-3 bg-white/10 rounded-full mx-1"></div>
                            <ExchangeButton 
                                id="forex" label="FOREX" icon={Globe} sector="traditional" 
                                activeSector={activeSector} activeExchange={activeExchange} onSelect={onSelectExchange} 
                            />
                        </div>
                    </div>

                    {/* 3. DERECHA: TERMINAL + HOME */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        {/* Icono Home: Visible en móvil y desktop */}
                        <Link to="/" className="text-gray-500 hover:text-white transition-all duration-300" title="Inicio">
                            <Home size={18} />
                        </Link>

                        {/* Botón Terminal */}
                        <Link to="/terminal" className="flex items-center justify-center w-8 h-8 lg:w-auto lg:h-auto lg:px-6 lg:py-1.5 bg-white text-black font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all group overflow-hidden relative">
                            <Terminal size={14} strokeWidth={3} className="text-black lg:mr-2" />
                            <span className="hidden lg:inline relative z-10">TERMINAL</span>
                            <div className="hidden lg:block absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-sz-blue/30 to-transparent group-hover:left-full transition-all duration-700 ease-in-out"></div>
                        </Link>
                    </div>
                </div>
            </nav>
            {/* Espaciador fijo */}
            <div className="h-14 bg-[#0a0a0a]"></div>
        </>
    );
};

export default AppNavbar;