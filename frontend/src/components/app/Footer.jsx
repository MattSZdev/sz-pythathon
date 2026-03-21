import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../../components/Reveal';
import { Twitter, Youtube, Send, Gamepad2, Mail } from 'lucide-react'; // Eliminado TrendingUp que ya no se usa

// --- COMPONENTES AUXILIARES ---

// Botón social híbrido: Acepta Icono Lucide o Path SVG manual
const SocialLink = ({ href, icon: Icon, path, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        title={label}
    >
        {path ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d={path} />
            </svg>
        ) : (
            <Icon size={18} />
        )}
    </a>
);

const FooterLink = ({ to, children }) => (
    <Link 
        to={to} 
        className="text-[11px] font-extrabold tracking-widest uppercase font-montserrat text-gray-400 hover:text-white transition-colors duration-500 relative group py-1"
    >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-px bg-sz-blue transition-all duration-700 ease-out group-hover:w-full opacity-0 group-hover:opacity-100"></span>
    </Link>
);

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/10 pt-12 pb-4 relative z-10 overflow-hidden w-full">
            
            {/* Decoración superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-37.5 bg-sz-blue/5 blur-[100px] pointer-events-none"></div>

            <div className="w-full px-8 md:px-16 lg:px-24">
                <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-8">
                    
                    {/* COLUMNA 1: MARCA, SOPORTE Y REDES */}
                    <div className="w-full md:w-5/12">
                        <Reveal direction="right" width="100%">
                            {/* LOGO */}
                            <Link to="/" className="flex items-center gap-5 group mb-8 w-fit">
                                <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                    <img 
                                        src="/img/logo.svg" 
                                        alt="SZ" 
                                        className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                        onError={(e) => { e.target.src = "/img/favicon.png" }}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-xl font-montserrat font-black tracking-tighter uppercase italic leading-none relative overflow-hidden">
                                        <span className="text-white/90">SZ TERMINAL</span>
                                        <span 
                                            className="absolute top-0 left-0 w-full h-full text-transparent bg-clip-text bg-linear-to-r from-transparent via-white to-transparent pointer-events-none"
                                            style={{ backgroundSize: '200% auto', animation: 'shine 20s linear infinite' }}
                                        >
                                            SZ TERMINAL
                                        </span>
                                    </span>
                                </div>
                            </Link>

                            {/* SOPORTE */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail size={14} className="text-sz-blue" />
                                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                                        {t('footer.support_label', 'Soporte & Ayuda')}
                                    </span>
                                </div>
                                <a href="mailto:support@szoficial.com" className="text-base font-bold text-white hover:text-sz-blue transition-colors font-montserrat tracking-wide">
                                    support@szoficial.com
                                </a>
                            </div>

                            {/* REDES SOCIALES */}
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">{t('footer.community', 'CONECTA CON NOSOTROS')}</span>
                                <div className="flex gap-4">
                                    {/* DISCORD OFICIAL */}
                                    <SocialLink 
                                        href="https://discord.gg/EJ9bUQw3MY" 
                                        path="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" 
                                            label="Discord" 
                                    />
                                    {/* OTROS: Usan iconos Lucide */}
                                    <SocialLink href="https://t.me/SzOficial" icon={Send} label="Telegram" />
                                    <SocialLink href="https://x.com/TraderMattSz" icon={Twitter} label="X (Twitter)" />
                                    <SocialLink href="https://www.youtube.com/@TraderMattSz" icon={Youtube} label="YouTube" />
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* COLUMNA 2: NAVEGACIÓN Y LEGAL */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end">
                        <Reveal direction="left" width="100%" delay={0.2}>
                            <div className="flex flex-col gap-5 items-start md:items-end mb-10">
                                <FooterLink to="/terminos">{t('footer.terms', 'TÉRMINOS DE USO')}</FooterLink>
                                <FooterLink to="/privacidad">{t('footer.privacy', 'POLÍTICA DE PRIVACIDAD')}</FooterLink>
                                <FooterLink to="/contacto">{t('footer.contact', 'CONTACTO')}</FooterLink>
                            </div>
                            
                            {/* TRADINGVIEW LINK ACTUALIZADO */}
                            <a 
                                href="https://www.tradingview.com/" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="group inline-flex items-center gap-3 transition-all opacity-60 hover:opacity-100"
                            >
                                {/* Logo de TradingView (Blanco) */}
                                <img 
                                    src="/img/exchanges/tradingview.svg" 
                                    alt="TradingView" 
                                    className="w-5 h-5 object-contain transition-transform group-hover:-translate-y-0.5" 
                                />
                                
                                <div className="flex flex-col items-start md:items-end leading-none">
                                    <span className="text-gray-400 text-[9px] uppercase tracking-widest group-hover:text-sz-blue transition-colors mb-1">
                                        {t('footer.charts_by', 'CHARTS BY')}
                                    </span>
                                    <span className="font-montserrat font-bold text-white text-xs">
                                        TradingView
                                    </span>
                                </div>
                            </a>
                        </Reveal>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="border-t border-white/5 pt-4 pb-12 flex justify-center items-center">
                    <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest text-center opacity-70 hover:opacity-100 transition-opacity">
                        {t('footer.copyright', `© ${currentYear} SZ OFICIAL. TODOS LOS DERECHOS RESERVADOS.`)}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;