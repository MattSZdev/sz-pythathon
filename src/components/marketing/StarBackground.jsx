import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const StarBackground = ({ opacity = 0.3 }) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        // CONTENEDOR TAILWIND: Fijo, Fondo, Transparente a eventos
        <div className={`fixed inset-0 -z-10 pointer-events-none`} style={{ opacity }}>
            <Particles
                id="tsparticles-global"
                options={{
                    fullScreen: { enable: false }, // Importante: False para que respete el div contenedor
                    background: { color: { value: "transparent" } },
                    fpsLimit: 60,
                    interactivity: { events: { onClick: { enable: false }, onHover: { enable: false }, resize: true } },
                    particles: {
                        color: { value: "#ffffff" },
                        links: { enable: false },
                        move: { 
                            enable: true, 
                            speed: 0.2, // Movimiento muy lento y elegante
                            direction: "none", 
                            random: true, 
                            straight: false, 
                            outModes: { default: "out" } 
                        },
                        number: { density: { enable: true, area: 800 }, value: 40 }, // Densidad equilibrada
                        opacity: { 
                            value: { min: 0.1, max: 0.5 }, 
                            animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false } 
                        },
                        shape: { type: "circle" },
                        size: { value: { min: 1, max: 2 }, random: true },
                    },
                    detectRetina: true,
                }}
                className="w-full h-full"
            />
        </div>
    );
};

export default StarBackground;