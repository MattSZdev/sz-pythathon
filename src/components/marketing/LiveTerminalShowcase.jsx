import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const LiveTerminalShowcase = () => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    // LÓGICA DE ESCALADO MÁGICO:
    // Mantiene la terminal en su resolución ideal (1280px) pero la encoge visualmente 
    // para que quepa en el contenedor actual (especialmente útil en móviles).
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Asumimos que 1280px es el ancho ideal de tu terminal web
                const targetWidth = 1280; 
                
                if (containerWidth < targetWidth) {
                    setScale(containerWidth / targetWidth);
                } else {
                    setScale(1);
                }
            }
        };

        handleResize(); // Calcular al inicio
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Altura base proporcional al ancho objetivo (16:9 ratio)
    const targetHeight = 720; 
    const scaledHeight = targetHeight * scale;

    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 text-center mb-12">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded uppercase animate-pulse">
                    Live Demo
                </span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-heading font-black text-white mb-4"
                >
                    Pruébalo <span className="text-sz-blue">Tú Mismo</span>
                </motion.h2>
                <p className="text-sz-muted max-w-2xl mx-auto">
                    Interactúa directamente con la terminal de SZ en tiempo real.
                </p>
            </div>

            <div className="max-w-[1280px] mx-auto relative px-2 md:px-6" ref={containerRef}>
                {/* Glow de fondo épico */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sz-blue/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

                {/* Contenedor Mac / Ventana */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="relative z-10 bg-[#0a0c0f] border border-white/10 rounded-xl md:rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5"
                >
                    {/* Barra superior de la ventana (Estilo macOS) */}
                    <div className="h-8 md:h-10 bg-[#121519] border-b border-white/5 flex items-center px-4 justify-between select-none">
                        <div className="flex gap-1.5 md:gap-2">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] md:text-[11px] font-mono text-sz-muted bg-black/40 px-6 py-1 md:py-1.5 rounded-md border border-white/5">
                            <span className="opacity-50">🔒</span> terminal.szoficial.com
                        </div>
                        <div className="w-10 md:w-16"></div> {/* Espaciador invisible para centrar la URL */}
                    </div>

                    {/* Contenedor del IFRAME con Escalado Dinámico */}
                    <div 
                        className="w-full bg-[#0b0e11] overflow-hidden relative"
                        style={{ height: `${scaledHeight}px` }} // Altura ajustada a la escala
                    >
                        <div 
                            className="absolute top-0 left-0 origin-top-left"
                            style={{ 
                                width: '1280px', 
                                height: '720px',
                                transform: `scale(${scale})` 
                            }}
                        >
                            <iframe 
                                src="https://terminal.szoficial.com" 
                                title="SZ Terminal Live Demo"
                                className="w-full h-full border-none"
                                loading="lazy"
                                // Permisos necesarios para que la terminal funcione bien embebida
                                allow="clipboard-read; clipboard-write;" 
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LiveTerminalShowcase;