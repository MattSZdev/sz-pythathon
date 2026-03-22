import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Quote, Star } from 'lucide-react';

// --- DATA SIMULADA (Reemplaza con la real) ---
const blogPosts = [
    { tag: 'Noticias', title: 'Nueva integración nativa con Bybit', author: 'SZ Team' },
    { tag: 'Estrategia', title: 'Fair Value Gap (FVG): Cómo operarlo', author: 'Matt SZ' },
    { tag: 'Educación', title: 'Soporte y Resistencia Institucional', author: 'SZ Team' },
];

const reviews = [
    {
        quote: "Lo usé durante una semana y fue como 'SANTA MIERDA, necesito involucrarme en esto'. Ha sido sin duda el mayor cambio en mi carrera de trading. Ya no podría volver a operar en un exchange normal.",
        name: "Follis",
        role: "Fundador de Chroma",
        avatar: "F"
    },
    {
        quote: "El equipo de SZ realmente se preocupa por la experiencia de sus usuarios. Son un equipo decente que construye herramientas que el mercado necesita con urgencia.",
        name: "Matt",
        role: "CEO en BloFin",
        avatar: "M"
    }
];

const CommunitySection = () => {
    return (
        <section className="py-24 relative z-10 bg-black/20 border-t border-white/5">
            <div className="container mx-auto px-4 max-w-7xl">
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
                        Construido por <span className="text-sz-blue">Traders</span>
                    </h2>
                    <p className="text-sz-muted">Únete a la comunidad y aprende nuestras estrategias.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* COLUMNA IZQUIERDA: Blog y Estrategias */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="text-sz-blue" size={24} />
                            <h3 className="text-xl font-bold text-white">Último del Blog & Estrategias</h3>
                        </div>
                        
                        {blogPosts.map((post, i) => (
                            <motion.a 
                                href="#" key={i}
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                                className="group block p-5 rounded-xl bg-[#0a0c0f] border border-white/5 hover:border-sz-blue/40 transition-colors"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider text-sz-blue mb-2 block">{post.tag}</span>
                                <h4 className="text-white font-bold text-lg mb-2 group-hover:text-sz-blue transition-colors">{post.title}</h4>
                                <span className="text-xs text-sz-muted">{post.author}</span>
                            </motion.a>
                        ))}

                        {/* Banner Discord */}
                        <a href="https://discord.gg/tu-enlace" target="_blank" rel="noreferrer" className="mt-4 p-6 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between hover:bg-indigo-600/20 transition-all group">
                            <div>
                                <h4 className="text-indigo-400 font-bold mb-1">Únete a la Sala de Trading</h4>
                                <p className="text-xs text-indigo-300/70">Discord Oficial de SZ Hub</p>
                            </div>
                            <MessageSquare className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>

                    {/* COLUMNA DERECHA: Reseñas / Twitter */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Quote className="text-emerald-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Lo que dice la Industria</h3>
                        </div>

                        {reviews.map((review, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                                className="p-8 rounded-xl bg-[#0a0c0f] border border-white/5 relative"
                            >
                                <Quote size={40} className="absolute top-4 right-4 text-white/5" />
                                <p className="text-sz-muted text-sm leading-relaxed mb-6 italic">"{review.quote}"</p>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/20">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold text-sm">{review.name}</h5>
                                        <p className="text-[10px] text-emerald-400 uppercase tracking-wide">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Placeholder Trustpilot (Futuro) */}
                        <div className="p-6 rounded-xl bg-[#0a0c0f] border border-white/5 border-dashed flex items-center justify-center gap-4 opacity-50">
                            <Star className="text-green-500 fill-green-500" />
                            <span className="text-white font-bold">Próximamente en Trustpilot</span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;