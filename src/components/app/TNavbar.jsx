import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutTemplate, 
  Settings, 
  Palette, 
  Globe, 
  ChevronDown,
  Menu,
  Home
} from 'lucide-react';

const NavTool = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="relative flex items-center gap-1.5 px-3 py-1.5 group outline-none transition-all duration-300"
    title={label}
  >
    {/* Ajuste de color a gray-400 para mejor contraste */}
    <Icon size={14} className="text-gray-400 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
    {label && (
        <span className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-white transition-colors uppercase font-montserrat hidden xl:block">
            {label}
        </span>
    )}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 opacity-50"></div>
  </button>
);

export default function TNavbar({ symbol }) {
  return (
    <nav className="h-12 bg-[#0a0a0a]/95 border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 z-50 select-none backdrop-blur-md relative">
      
      {/* 1. IZQUIERDA: LOGO IDENTITY */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 group outline-none">
            <div className="relative w-6 h-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shrink-0">
                <img 
                    src="/img/logo.svg" 
                    alt="SZ Trading Logo" 
                    width="24"      // Dimensiones explícitas para CLS
                    height="24"     // Dimensiones explícitas para CLS
                    fetchPriority="high" // Prioridad para el renderizado inicial (LCP)
                    loading="eager"      // AGREGAR ESTO: Fuerza carga inmediata
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                />
            </div>
            <span className="text-sm font-montserrat font-black tracking-tighter uppercase italic leading-none text-white/90 hidden md:block group-hover:text-white transition-colors">
                SZ TERMINAL
            </span>
        </Link>

        <div className="h-4 w-px bg-white/10 hidden md:block"></div>

        {/* SELECTOR TICKER */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
            <img 
              src="/img/exchanges/binance.svg" 
              width="16"
              height="16"
              className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300" 
              alt="Binance"
            />
            <span className="font-montserrat font-extrabold text-[11px] tracking-widest text-gray-400 group-hover:text-[#F3BA2F] transition-colors uppercase">
                {symbol}
            </span>
            <ChevronDown size={10} className="text-gray-500 group-hover:text-white transition-colors ml-1" />
            
            <span className="text-[#00b389] text-[10px] font-mono font-bold ml-1.5 hidden sm:block bg-[#00b389]/10 px-1.5 rounded-sm">
                +1.24%
            </span>
        </button>
      </div>

      {/* 2. DERECHA: HERRAMIENTAS */}
      <div className="flex items-center gap-1 md:gap-4">
         <Link to="/" className="hidden lg:flex text-gray-400 hover:text-white transition-colors p-2" title="Volver al Inicio">
             <Home size={16} />
         </Link>

         <div className="hidden md:block w-px h-4 bg-white/10 mx-1"></div>

         <div className="flex items-center">
            <NavTool icon={LayoutTemplate} label="DISEÑO" />
            <NavTool icon={Palette} label="TEMA" />
            <NavTool icon={Globe} label="IDIOMA" />
            <NavTool icon={Settings} label="CONFIG" />
         </div>

         {/* Menú Móvil con aria-label para accesibilidad */}
         <button 
           aria-label="Abrir Menú" 
           className="md:hidden text-gray-400 hover:text-white p-2 ml-2 outline-none"
         >
            <Menu size={20} />
         </button>
      </div>
    </nav>
  );
}