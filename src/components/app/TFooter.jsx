import React from 'react';
import { Activity } from 'lucide-react';

// Componente para iconos sociales (Minimalista B&W)
const SocialLink = ({ href, path, title }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        title={title}
        className="text-[#444] hover:text-white transition-colors duration-200 p-1 flex items-center justify-center"
    >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
            <path d={path} />
        </svg>
    </a>
);

export default function TFooter() {
    return (
        <footer className="h-7 w-full bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-between px-3 md:px-4 select-none z-50 shrink-0 font-mono text-[9px] tracking-wider uppercase text-[#555]">
            
            {/* --- 1. IZQUIERDA: VERSIÓN + REDES --- */}
            <div className="flex items-center gap-4 w-1/3 md:w-auto">
                {/* Versión (Visible siempre) */}
                <span className="text-gray-500 font-bold hover:text-[#666] transition-colors cursor-default">
                    v0.1.0
                </span>

                <div className="w-px h-3 bg-[#1a1a1a]"></div>

                {/* Redes Sociales */}
                <div className="flex items-center gap-2">
                    <SocialLink title="Discord" href="https://discord.gg/EJ9bUQw3MY" path="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2996 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                    <SocialLink title="Telegram" href="https://t.me/SzOficial" path="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.463 4.049-1.72 4.476-1.72z" />
                    <SocialLink title="X" href="https://x.com/@TraderMattSz" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </div>
            </div>

            {/* --- 2. CENTRO: TRADINGVIEW (Visible solo en móvil) --- */}
            <a 
                href="https://www.tradingview.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="md:hidden opacity-40 hover:opacity-100 transition-opacity"
            >
                <img src="/img/exchanges/tradingview.svg" alt="TV" className="h-3 w-auto grayscale opacity-50" />
            </a>

            {/* --- 3. DERECHA: STATUS Y DATOS --- */}
            <div className="flex items-center justify-end gap-3 md:gap-5 w-1/3 md:w-auto">
                {/* Datos (Solo Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                        <Activity size={10} />
                        <span>VOL 24H: <span className="text-gray-400">$42B</span></span>
                    </div>

                    <div className="w-px h-3 bg-[#1a1a1a]"></div>

                    {/* Attribution TradingView Modificada */}
                    <a 
                        href="https://www.tradingview.com/" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-[9px] uppercase tracking-widest text-[#666]">Charts by</span>
                        <img 
                            src="/img/exchanges/tradingview.svg" 
                            alt="Logo" 
                            className="h-2.5 w-auto" // Logo pequeño
                        />
                        <span className="font-bold text-[#d4d4d4] tracking-wide">TradingView</span>
                    </a>
                </div>

                {/* Status Operativo Modificado */}
                <div className="flex items-center gap-1.5 pl-2 md:border-l md:border-[#1a1a1a] h-4" title="System Status">
                    <div className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                    </div>
                    <span className="text-emerald-600 font-bold hidden md:inline tracking-widest">CONEXIÓN</span>
                </div>
            </div>
        </footer>
    );
}