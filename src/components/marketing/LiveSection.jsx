import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Youtube, Radio, ExternalLink } from 'lucide-react';

const LiveSection = () => {
    const [isLive, setIsLive] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const checkYouTubeLive = async () => {
            // NOTA: Reemplaza esto con tu API Key real en producción (.env)
            const API_KEY = 'AIzaSyDzNDUxSIW2T0EzNnWGFpErakIiw6zZsiM'; 
            const CHANNEL_ID = 'UCPToYRhmmlj0xjvg_8sjwWg'; 
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    setVideoId(data.items[0].id.videoId);
                    setIsLive(true);
                }
            } catch (error) {
                console.warn("YouTube API check failed");
            }
        };
        checkYouTubeLive();
    }, []);

    return (
        <a 
            href={isLive ? `https://www.youtube.com/watch?v=${videoId}` : "https://www.youtube.com/@TraderMattSz"} 
            target="_blank" 
            rel="noreferrer" 
            className="block h-full group"
        >
            <div className={`glass-card h-full p-6 flex flex-col justify-between transition-all duration-300 ${isLive ? 'border-red-500/30 bg-red-500/5' : 'hover:border-sz-blue/30 hover:bg-sz-card/60'}`}>
                
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                            <Youtube className={isLive ? "text-red-500" : "text-sz-muted group-hover:text-red-500 transition-colors"} size={24} />
                            {t('live.title', 'SZ en Vivo')}
                        </h3>
                        
                        {/* BADGE ANIMADO */}
                        <motion.div 
                            className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${
                                isLive 
                                    ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                                    : 'bg-white/5 text-sz-muted border-white/10'
                            }`}
                            animate={isLive ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {isLive && (
                                <motion.span 
                                    className="w-2 h-2 bg-white rounded-full"
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}
                            {!isLive && <span className="w-2 h-2 bg-sz-muted rounded-full opacity-50" />}
                            
                            {isLive ? t('live.online', 'TRANSMITIENDO AHORA') : t('live.offline', 'OFFLINE')}
                        </motion.div>
                    </div>

                    {/* Icono de enlace externo sutil */}
                    <ExternalLink size={16} className="text-sz-muted opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                {/* CONTENIDO */}
                <div className="mt-2">
                    {isLive && videoId ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                            <iframe 
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&controls=0`} 
                                title="YouTube Live" 
                                className="absolute top-0 left-0 w-full h-full pointer-events-none" // pointer-events-none para que el click vaya al enlace padre
                                frameBorder="0" 
                                allowFullScreen 
                            />
                            <div className="absolute inset-0 bg-transparent z-10"></div> {/* Capa protectora para el click */}
                        </div>
                    ) : (
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                            <p className="text-sz-muted text-sm leading-relaxed mb-0">
                                {t('live.offline_msg', 'Análisis de mercado en tiempo real y sesiones educativas. Suscríbete para notificaciones.')}
                            </p>
                        </div>
                    )}
                </div>

                {isLive && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center mt-4 animate-pulse">
                        {t('live.expand', 'Click para ver en YouTube')}
                    </p>
                )}
            </div>
        </a>
    );
};

export default LiveSection;