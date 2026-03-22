import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ShieldCheck } from 'lucide-react'; // Añadimos ShieldCheck para el icono de confianza

// ============================================================================
// DATOS DE PARTNERS (Agregamos featured: true a los favoritos)
// ============================================================================
const ALL_PARTNERS = [
    // 🟢 TOP PARTNERS (Destacados)
    { id: 'hyperliquid', name: 'Hyperliquid', featured: true, color: '#00FFC3', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/67ebf3f045f9fc6f35c92e0f_FR1og_mfYeugYdTL9sRZ9DBe-NphOKOOgSBiAV4yzss.png', link: 'https://teal.link/hyperliquid' },
    { id: 'binance', name: 'Binance', featured: true, color: '#F3BA2F', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/67ebf3ed627b3838b45bef84_X23ptgBGqeJUvDNSmny0TFOS4CSHLdJQPDaUsPEz5rI.png', link: 'https://teal.link/Binance1' },
    
    // ⚪ PARTNERS NORMALES
    { id: 'okx', name: 'OKX', featured: false, color: '#ffffff', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/67ebf3f0cc9a03a650b98045_lAgOM2-ojrWXPNtr3OOFDnGCIwMUGgD3c44-7duM6Eg.png', link: 'https://teal.link/OKX' },
    { id: 'bingx', name: 'BingX', featured: false, color: '#0055ff', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/67ebf3ed349ec2a086b985f9_xvTNtDokpqflifduW0u1NU7Y9tENbrfpkcqeDTwPxBs.png', link: 'https://teal.link/bingx20' },
    { id: 'bitget', name: 'Bitget', featured: false, color: '#00d2da', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/67ebf3edcc9a03a650b97b17_AZf0A1go87U5O1NkaUAzHDJTaF4Sagtc5y3cPYgxchw.png', link: 'https://teal.link/Bitget' },
    { id: 'kraken', name: 'Kraken', featured: false, color: '#5856d6', logo: 'https://cdn.prod.website-files.com/68f3aa66dc7f8e5ec7ac2caa_Logo%3DKraken_white.png', link: 'https://www.kraken.com/en-es' },
    { id: 'blofin', name: 'Blofin', featured: false, color: '#f59e0b', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/6925f08ccf14c824ae60d643_Logo%3DBloFin_white.png', link: 'https://teal.link/blofin' },
    { id: 'coincatch', name: 'CoinCatch', featured: false, color: '#0055ff', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/67ebf3ef45f9fc6f35c92db1_SwhQZn6RES02zK0FfnTN2kiJkot2qtLDBRQFWzCxry8.png', link: 'https://teal.link/coincatch' },
    { id: 'grvt', name: 'GRVT', featured: false, color: '#6366f1', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/6925f85d8a470dcd4410024a_Logo%3DGrvt_white.png', link: 'https://teal.link/grvt' },
    { id: 'paradex', name: 'Paradex', featured: false, color: '#10b981', logo: 'https://cdn.prod.website-files.com/67a26c264cb554c19897c5c4/6925f66fa2567ccb5e4cb6b3_Logo%3DParadex.png', link: 'https://teal.link/paradex' },
];

const EcosystemGrid = () => {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <section className="relative w-full bg-[#020203] font-mono selection:bg-sz-blue selection:text-white pt-24 pb-16 md:pt-32 md:pb-24 border-y border-white/5">
            
            <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0"></div>
            
            <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
                
                {/* --- HEADER CENTRAL --- */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center text-center w-full max-w-4xl mb-16 md:mb-24"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-black uppercase tracking-tighter text-white mb-6 leading-none">
                        Conecta con <span className="text-transparent bg-clip-text bg-gradient-to-r from-sz-blue via-[#00FFC3] to-emerald-400">Todo</span>
                    </h2>

                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-sz-blue/30 blur-[40px] scale-150 rounded-full animate-pulse"></div>
                        <img 
                            src="/img/favicon.png" 
                            alt="SZ Core" 
                            className="relative w-12 md:w-16 h-auto object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                        />
                    </div>
                </motion.div>

                {/* --- GRID DE SPONSORS --- */}
                <div 
                    className="flex flex-wrap justify-center items-center gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-16 w-full max-w-6xl"
                    onMouseLeave={() => setHoveredId(null)} 
                >
                    {ALL_PARTNERS.map((partner) => {
                        const isHovered = hoveredId === partner.id;
                        const isDimmed = hoveredId !== null && !isHovered;
                        
                        // LÓGICA DE DESTACADOS:
                        // Si está "featured", tiene color y opacidad 100% por defecto. 
                        // Solo se oscurece si el usuario hace hover en OTRO partner.
                        const isActive = isHovered || (partner.featured && hoveredId === null);

                        return (
                            <a
                                key={partner.id}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoveredId(partner.id)}
                                // Si es destacado, es ligeramente más grande por defecto (scale-110). En hover crece un poco más (scale-125)
                                className={`relative flex flex-col items-center justify-center h-12 md:h-16 w-28 md:w-40 transition-all duration-500 ease-in-out cursor-pointer 
                                    ${isDimmed ? 'opacity-20 scale-95' : 'opacity-100'} 
                                    ${partner.featured && !isDimmed ? 'scale-110' : ''} 
                                    ${isHovered ? '!scale-125 z-20' : 'z-10'}
                                `}
                            >
                                {/* ETIQUETA TOP PARTNER (Solo para destacados) */}
                                {partner.featured && (
                                    <div 
                                        className={`absolute -top-8 flex items-center gap-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border transition-all duration-500 ${isDimmed ? 'opacity-0' : 'opacity-100'}`}
                                        style={{ color: partner.color, borderColor: `${partner.color}40`, backgroundColor: `${partner.color}10` }}
                                    >
                                        <ShieldCheck size={10} /> SZ_VERIFIED
                                    </div>
                                )}

                                {/* Reflejo (Blur) */}
                                <div 
                                    className={`absolute inset-0 transition-opacity duration-500 pointer-events-none scale-150 rounded-full ${
                                        isActive ? 'opacity-40' : 'opacity-0'
                                    }`}
                                    style={{ 
                                        backgroundColor: partner.color, 
                                        filter: 'blur(25px)' 
                                    }}
                                />

                                {/* Logo */}
                                <img 
                                    src={partner.logo} 
                                    alt={partner.name} 
                                    className={`relative z-10 max-w-full max-h-full object-contain transition-all duration-500 ${
                                        isActive ? 'grayscale-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'grayscale opacity-50'
                                    }`}
                                />
                            </a>
                        );
                    })}
                </div>

                {/* --- ÁREA DE INFORMACIÓN DINÁMICA --- */}
                <div className="h-24 md:h-16 mt-16 md:mt-24 w-full max-w-2xl flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {hoveredId && (
                            <motion.div
                                key={hoveredId}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center text-center w-full"
                            >
                                <span 
                                    className="text-sm md:text-base font-bold font-sans tracking-wide"
                                    style={{ color: ALL_PARTNERS.find(p => p.id === hoveredId)?.color || 'white' }}
                                >
                                    {/* Puedes personalizar este texto según si es Featured o no */}
                                    {ALL_PARTNERS.find(p => p.id === hoveredId)?.featured 
                                        ? "Beneficios VIP: 20% descuento + Bonos Exclusivos SZ" 
                                        : "Hasta 20% de descuento en comisiones"}
                                </span>
                                <span className="text-xs md:text-sm text-white/50 font-sans mt-1">
                                    Conectando nodo con {ALL_PARTNERS.find(p => p.id === hoveredId)?.name}...
                                </span>
                                
                                <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase tracking-[0.2em] mt-3">
                                    <ExternalLink size={10} /> Clic para autorizar
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};

export default EcosystemGrid;