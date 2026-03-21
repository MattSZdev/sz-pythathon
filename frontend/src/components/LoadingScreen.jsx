// src/components/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    // Animación visual de progreso (simulada)
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                // Se detiene en 99% esperando a que React desmonte el componente al terminar la carga
                if (prev >= 99) return 99; 
                return prev + Math.random() * 20; 
            });
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                className="fixed inset-0 z-[9999] bg-[#020203] flex flex-col items-center justify-center overflow-hidden font-mono"
            >
                {/* Ruido súper sutil (opcional, pero ayuda a que el negro no se vea tan "plano" en monitores modernos).
                    Si lo quieres 100% negro liso, puedes borrar este div. 
                */}
                <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>

                {/* CONTENIDO CENTRAL */}
                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* EL LOGO (Favicon) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-10 relative"
                    >
                        {/* Pequeño resplandor detrás del logo para darle profundidad */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/5 blur-[30px] rounded-full pointer-events-none"></div>
                        
                        <img 
                            src="/img/favicon.png" 
                            alt="SZ Logo" 
                            className="relative w-20 md:w-24 h-auto object-contain animate-pulse" 
                        />
                    </motion.div>

                    {/* ÁREA DE CARGA MINIMALISTA */}
                    <div className="flex flex-col items-center w-56 md:w-64">
                        
                        {/* Barra de Progreso Minimalista */}
                        <div className="relative w-full h-[1px] bg-white/10 mb-6 overflow-hidden">
                            <motion.div 
                                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_#ffffff]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.15 }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white blur-[3px]"></div>
                            </motion.div>
                        </div>

                        {/* Texto limpio */}
                        <p className="text-[#606060] text-[10px] md:text-xs uppercase tracking-[0.4em] animate-pulse">
                            Cargando Módulos...
                        </p>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingScreen;