import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTES AUXILIARES ---
const SocialLink = ({ href, path, viewBox = "0 0 24 24" }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        className="text-gray-500 hover:text-white transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
    >
        <svg viewBox={viewBox} width="16" height="16" fill="currentColor">
            <path d={path} />
        </svg>
    </a>
);

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link 
            to={to} 
            className={`text-[11px] font-extrabold tracking-widest transition-all uppercase font-montserrat px-4 py-2 rounded-full ${
                isActive ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {children}
        </Link>
    );
};

const MobileLink = ({ to, children, onClick, isActive }) => (
    <Link to={to} onClick={onClick} className={`group flex items-center justify-between py-3 transition-all duration-300 hover:pl-2 ${isActive ? 'text-white font-black' : 'text-gray-400 hover:text-white'}`}>
        <span className="font-mono tracking-widest text-sm uppercase">{children}</span>
        {isActive && <span className="w-1.5 h-1.5 bg-sz-blue rounded-full shadow-[0_0_6px_#2563eb]"></span>}
    </Link>
);

// --- NAVBAR PRINCIPAL ---

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    
    // Estados
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const location = useLocation();

    // LÓGICA DE SCROLL (GHOST)
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 1. Activar Blur (Fondo) al bajar 10px
            setIsScrolled(currentScrollY > 10);

            // 2. Lógica Ghost (Ocultar/Mostrar)
            if (!isOpen) { 
                // Si bajamos más de 100px -> Ocultar
                if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                    setIsVisible(false);
                } 
                // Si subimos -> Mostrar
                else if (currentScrollY < lastScrollY.current) {
                    setIsVisible(true);
                }
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen]);

    const changeLanguage = (lng) => i18n.changeLanguage(lng);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
    }, [isOpen]);

    return (
        <>
            {/* BACKDROP MÓVIL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* NAVBAR */}
            <nav 
                className={`fixed top-0 left-0 w-full z-100 transition-transform duration-2000 ease-in-out ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                {/* FONDO DINÁMICO: Sin Borde, Solo Blur y Oscuridad */}
                <div 
                    className={`absolute inset-0 transition-all duration-1000 ${
                        (isScrolled || isOpen)
                        // Fondo negro 70% + Blur Medio + Sombra suave (Sin borde blanco)
                        ? 'bg-sz-bg/70 backdrop-blur-md shadow-2xl' 
                        : 'bg-transparent'
                    }`}
                ></div>

                <div className="w-full px-6 md:px-10 relative z-10">
                    <div className="flex justify-between items-center h-24"> {/* Altura un poco mayor para elegancia */}
                        
                        {/* 1. LOGO */}
                        <Link to="/" className="flex items-center gap-5 group" onClick={() => setIsOpen(false)}>
                            {/* Icono más grande y separado */}
                            <div className="relative w-11 h-11 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                <img 
                                    src="/img/logo.svg" 
                                    alt="SZ" 
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    onError={(e) => { e.target.src = "/img/favicon.png" }}
                                />
                            </div>
                            
                            {/* Texto SZ TERMINAL: 20s Reflejo */}
                            <div className="flex flex-col justify-center">
                                <span className="text-lg font-montserrat font-black tracking-tighter uppercase italic leading-none relative overflow-hidden">
                                    <span className="text-white/90">SZ TERMINAL</span>
                                    {/* Capa de brillo animada inline para los 20s */}
                                    <span 
                                        className="absolute top-0 left-0 w-full h-full text-transparent bg-clip-text bg-linear-to-r from-transparent via-white to-transparent pointer-events-none"
                                        style={{ 
                                            backgroundSize: '200% auto',
                                            animation: 'shine 20s linear infinite' 
                                        }}
                                    >
                                        SZ TERMINAL
                                    </span>
                                </span>
                            </div>
                        </Link>

                        {/* 2. MENÚ ESCRITORIO (CENTRADO ABSOLUTO) */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {/* Cápsula central sutil */}
                            <div className="flex items-center gap-2">
                                <NavLink to="/">{t('nav.home', 'INICIO')}</NavLink>
                                <NavLink to="/toolkit">{t('nav.calendar', 'CALENDARIO')}</NavLink>
                                <NavLink to="https://screener.szoficial.com/">{t('nav.screener', 'SCREENER')}</NavLink>
                                <NavLink to="/indicadores">{t('nav.indicadores', 'INDICADORES')}</NavLink>
                            </div>
                        </div>

                        {/* 3. DERECHA (REDES + IDIOMA + CTA) - INTACTO */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="flex items-center gap-4 pr-6 border-r border-white/5">
                                <SocialLink href="https://discord.gg/EJ9bUQw3MY" path="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                                <SocialLink href="https://x.com/@TraderMattSz" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                <SocialLink href="https://t.me/SzOficial" path="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.463 4.049-1.72 4.476-1.72z" />
                             </div>
                             
                             <div className="flex gap-2">
                                {['es', 'en', 'ru'].map((lng) => (
                                    <button key={lng} onClick={() => changeLanguage(lng)} 
                                        className={`text-[10px] font-bold px-1 py-1 uppercase font-mono transition-colors ${i18n.language === lng ? 'text-white border-b-2 border-sz-blue' : 'text-gray-500 hover:text-white'}`}>
                                        {lng}
                                    </button>
                                ))}
                            </div>

                            <Link to="https://terminal.szoficial.com/" className="group relative overflow-hidden px-8 py-2.5 bg-white text-black font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all">
                                <Terminal size={12} strokeWidth={3} className="text-black" />
                                <span className="relative z-10">ACCEDER</span>
                                <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-sz-blue/30 to-transparent group-hover:left-full transition-all duration-700 ease-in-out"></div>
                            </Link>
                        </div>

                        {/* 4. BOTÓN MÓVIL */}
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors relative z-120"
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* MENÚ MÓVIL (TOP DRAWER) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:hidden absolute top-full left-0 w-full bg-[#050505]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/5 z-100 overflow-hidden"
                            style={{ maxHeight: "45vh" }} 
                        >
                            <div className="flex flex-col p-6 pt-4 gap-6 h-full">
                                <div className="flex flex-col gap-1">
                                    <MobileLink to="/" onClick={() => setIsOpen(false)} isActive={location.pathname === "/"}>{t('nav.home', 'INICIO')}</MobileLink>
                                    <MobileLink to="/toolkit" onClick={() => setIsOpen(false)} isActive={location.pathname === "/toolkit"}>{t('nav.calendar', 'CALENDARIO')}</MobileLink>
                                    <MobileLink to="https://screener.szoficial.com/" onClick={() => setIsOpen(false)} isActive={location.pathname === "/screener"}>{t('nav.screener', 'SCREENER')}</MobileLink>
                                </div>

                                <div className="mt-auto flex flex-col gap-5">
                                    <div className="flex justify-between items-center bg-white/5 rounded-lg p-2 px-4">
                                        <div className="flex gap-3">
                                            {['es', 'en', 'ru'].map((lng) => (
                                                <button key={lng} onClick={() => changeLanguage(lng)} 
                                                    className={`text-[10px] font-mono font-bold uppercase ${i18n.language === lng ? 'text-white' : 'text-gray-500'}`}>
                                                    {lng}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            <SocialLink href="https://discord.gg/EJ9bUQw3MY" path="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                                            <SocialLink href="https://x.com/@TraderMattSz" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            <SocialLink href="https://t.me/SzOficial" path="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.463 4.049-1.72 4.476-1.72z" />
                                        </div>
                                    </div>
                                    <Link to="/app" onClick={() => setIsOpen(false)} className="w-full bg-white text-black font-extrabold text-xs text-center py-3 rounded tracking-widest uppercase hover:bg-sz-blue hover:text-white transition-colors shadow-lg">
                                        ACCEDER
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;