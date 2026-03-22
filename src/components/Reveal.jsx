import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

/**
 * REVEAL COMPONENT - TITANIUM EDITION
 * Optimizado para Tailwind v4 y detección de scroll mejorada.
 */
export const Reveal = ({ 
  children, 
  width = "auto", 
  delay = 0, 
  duration = 0.5,
  direction = "up", 
  className = "",
  once = true // Permite re-animar si se desea
}) => {
  const ref = useRef(null);
  
  // Detección de vista: amount 0.2 significa que se activa cuando el 20% es visible
  const isInView = useInView(ref, { 
    once: once, 
    amount: 0.2 
  }); 
  
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  // Definición de movimientos según dirección
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      scale: direction === "zoom" ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier para suavidad premium
      },
    },
  };

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ 
        position: "relative", 
        width: width === "100%" ? "100%" : width,
        // Eliminamos overflow hidden para no cortar sombras y brillos
      }} 
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
        className="h-full w-full" // Asegura que el contenedor de la animación no colapse
      >
        {children}
      </motion.div>
    </div>
  );
};