import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Terminal as TerminalIcon, ArrowRight, Layers, Lock, Cpu, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GatewayHero = () => {
    const { t } = useTranslation();
    
    // Referencias de video
    const screenerVideoRef = useRef(null);
    const terminalVideoRef = useRef(null);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    const handleMouseEnter = (videoRef) => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = (videoRef) => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        // Contenedor Principal 100dvh
        <section className="relative w-full h-[100dvh] bg-[#020203] font-mono selection:bg-sz-blue selection:text-white overflow-hidden">
            
            {/* TEXTURAS GLOBALES CYBERPUNK */}
            <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay z-50"></div>
            
            {/* =========================================================
                EL TÍTULO FLOTANTE LIBRE (Sin caja, 100% horizontal)
                Posicionado en absoluto Z-40 por encima de los paneles
            ========================================================= */}
            <div className="absolute top-10 md:top-16 left-0 w-full z-40 pointer-events-none flex flex-col items-center justify-center px-4">
                
                {/* Luz de neón difuminada profunda para dar contraste al texto */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[150%] bg-sz-blue/15 blur-[120px] rounded-[100%] pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, y: -30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="relative w-full max-w-[1600px] flex flex-col items-center justify-center"
                >
                    {/* Indicadores Tácticos Libres */}
                    <div className="flex w-full max-w-4xl justify-center md:justify-between items-center mb-2 md:mb-4 opacity-50 text-[9px] md:text-[11px] tracking-[0.4em] text-sz-blue">
                        <div className="hidden md:flex items-center gap-2"><Cpu size={14} strokeWidth={1.5}/> CORE_V3</div>
                        <div className="border-b border-sz-blue/30 px-6 py-1 text-center uppercase">SYS.ONLINE // ROOT_ACCESS</div>
                        <div className="hidden md:flex items-center gap-2"><Wifi size={14} strokeWidth={1.5}/> PING: 8ms</div>
                    </div>

                    {/* Título Monumental Horizontal */}
                    <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem] font-montserrat font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] text-center leading-[0.9] w-full">
                        {t('hero.title', 'DOMINA LOS MERCADOS')}
                    </h1>

                    <div className="mt-4 md:mt-8 flex gap-4 items-center w-full max-w-2xl opacity-40">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/50"></div>
                        <span className="text-[8px] md:text-[10px] text-white tracking-[0.4em] uppercase">SELECT_WORKSPACE</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/50"></div>
                    </div>
                </motion.div>
            </div>

            {/* =========================================================
                LOS 3 PANELES MASIVOS (Ocupan el 100% de la pantalla Z-10)
            ========================================================= */}
            {/* En móvil agregamos pt-[25vh] para que las áreas clicables no queden debajo del título grande */}
            <div className="absolute inset-0 w-full h-full flex flex-col lg:flex-row z-10 pt-[25vh] md:pt-[30vh] lg:pt-0">
                
                {/* --- PUERTA 1: SCREENER (Izquierda) --- */}
                <a 
                    href="https://screener.szoficial.com/" 
                    target="_blank" rel="noreferrer"
                    onMouseEnter={() => handleMouseEnter(screenerVideoRef)}
                    onMouseLeave={() => handleMouseLeave(screenerVideoRef)}
                    className="group relative flex-1 hover:flex-[1.5] lg:hover:flex-[1.8] min-h-[25vh] lg:min-h-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-end p-6 md:p-12 cursor-pointer border-t lg:border-t-0 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#050505]"
                >
                    <div className="absolute inset-0 z-0">
                        <img src="/img/screener-preview.png" alt="Screener" className="absolute inset-0 w-full h-full object-cover object-center opacity-15 grayscale group-hover:grayscale-0 group-hover:opacity-0 transition-all duration-[900ms]"/>
                        <video ref={screenerVideoRef} src="/video/screener.mp4" muted playsInline loop className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-50 transition-opacity duration-700 scale-105 group-hover:scale-100"/>
                        
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-transparent to-[#020203]"></div>
                        <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 mix-blend-color transition-opacity duration-700"></div>
                    </div>

                    <div className="relative z-20 transform lg:translate-y-10 group-hover:translate-y-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/10 group-hover:shadow-[0_0_30px_rgba(250,204,21,0.2)] transition-all duration-500">
                            <Zap className="text-white/50 group-hover:text-yellow-400 w-5 h-5 md:w-8 md:h-8 transition-colors duration-500" strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-2xl md:text-5xl font-light text-white/60 group-hover:text-white uppercase tracking-tighter mb-2 md:mb-4 transition-colors">
                            Screener
                        </h3>
                        
                        <div className="opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden transition-all duration-700">
                            <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-r from-yellow-500/50 to-transparent mb-6 hidden md:block"></div>
                            <div className="text-[10px] md:text-xs text-white/40 space-y-2 mb-8 font-mono hidden md:block tracking-widest">
                                <p>01. ONCHAIN_FLOW</p>
                                <p>02. ALGO_DETECT</p>
                            </div>
                            <div className="hidden lg:inline-flex items-center gap-3 text-yellow-500 text-[10px] md:text-xs uppercase tracking-[0.2em] group/btn">
                                <span className="group-hover/btn:text-white transition-colors">LAUNCH_MODULE</span> 
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </a>

                {/* --- PUERTA 2: SZ APP (Centro) - PRÓXIMAMENTE --- */}
                <div 
                    onClick={scrollToContent}
                    className="group relative flex-[1] hover:flex-[1.2] lg:hover:flex-[1.4] min-h-[25vh] lg:min-h-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 cursor-default border-b lg:border-b-0 lg:border-r border-white/5 bg-[#030405] hover:bg-[#050608]"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sz-blue/5 via-transparent to-transparent pointer-events-none group-hover:from-sz-blue/15 transition-colors duration-1000"></div>

                    <div className="relative z-20 text-center flex flex-col items-center transform lg:translate-y-12">
                        <div className="w-14 h-14 md:w-24 md:h-24 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:border-sz-blue/40 group-hover:bg-sz-blue/5 group-hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] group-hover:scale-105 transition-all duration-700 relative">
                            <Layers className="text-white/30 group-hover:text-sz-blue w-6 h-6 md:w-10 md:h-10 transition-colors" strokeWidth={1} />
                        </div>
                        
                        <h3 className="text-xl md:text-4xl font-light text-white/40 group-hover:text-white tracking-tighter uppercase mb-2 md:mb-4 transition-colors">
                            SZ App
                        </h3>
                        
                        <p className="text-white/20 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-mono group-hover:opacity-0 transition-opacity absolute bottom-[-15px] md:bottom-[-30px]">
                            /// MAIN_CORE
                        </p>
                        
                        <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 absolute bottom-[-20px] md:bottom-[-40px]">
                            <Lock size={12} className="text-white/40 hidden md:block mb-2" strokeWidth={1.5} />
                            <span className="text-[8px] md:text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
                                PRÓXIMAMENTE
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- PUERTA 3: TERMINAL (Derecha) --- */}
                <a 
                    href="https://terminal.szoficial.com/" 
                    target="_blank" rel="noreferrer"
                    onMouseEnter={() => handleMouseEnter(terminalVideoRef)}
                    onMouseLeave={() => handleMouseLeave(terminalVideoRef)}
                    className="group relative flex-1 hover:flex-[1.5] lg:hover:flex-[1.8] min-h-[25vh] lg:min-h-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-end p-6 md:p-12 cursor-pointer bg-[#050505]"
                >
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img src="/img/terminal-preview.png" alt="Terminal" className="absolute inset-0 w-full h-full object-cover object-left-top opacity-15 grayscale group-hover:grayscale-0 group-hover:opacity-0 transition-all duration-[900ms]"/>
                        <video ref={terminalVideoRef} src="/video/terminal.mp4" muted playsInline loop className="absolute inset-0 w-full h-full object-cover object-left-top opacity-0 group-hover:opacity-50 transition-opacity duration-700 scale-105 group-hover:scale-100"/>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-transparent to-[#020203]"></div>
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 mix-blend-color transition-opacity duration-700"></div>
                    </div>

                    <div className="relative z-20 transform lg:translate-y-10 group-hover:translate-y-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col lg:items-end lg:text-right">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500">
                            <TerminalIcon className="text-white/50 group-hover:text-emerald-400 w-5 h-5 md:w-8 md:h-8 transition-colors duration-500" strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-2xl md:text-5xl font-light text-white/60 group-hover:text-white uppercase tracking-tighter mb-2 md:mb-4 transition-colors">
                            Terminal
                        </h3>
                        
                        <div className="opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden transition-all duration-700 flex flex-col lg:items-end">
                            <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-l from-emerald-500/50 to-transparent mb-6 hidden md:block"></div>
                            <div className="text-[10px] md:text-xs text-white/40 space-y-2 mb-8 font-mono hidden md:flex flex-col items-end tracking-widest">
                                <p>01. ORDER_BOOK_100MS</p>
                                <p>02. 1_CLICK_EXECUTION</p>
                            </div>
                            <div className="hidden lg:inline-flex items-center gap-3 text-emerald-500 text-[10px] md:text-xs uppercase tracking-[0.2em] group/btn">
                                <span className="group-hover/btn:text-white transition-colors">LAUNCH_MODULE</span> 
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </a>

            </div>
        </section>
    );
};

export default GatewayHero;