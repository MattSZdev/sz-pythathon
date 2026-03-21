import { useEffect, useRef } from 'react';
// 👇 NUEVO: Importamos Zustand
import useMarketStore from '../store/marketStore';

const ORIGINAL_FAVICON_PATH = '/img/logo.svg'; 

const updateFavicon = (imgBase, color) => {
    if (!imgBase) return;

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 32, 32);
    ctx.drawImage(imgBase, 0, 0, 32, 32);

    if (color) {
        const x = 24; 
        const y = 24; 
        const radius = 5;

        ctx.beginPath();
        ctx.arc(x, y, radius + 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#0b0e11'; 
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL("image/x-icon");
    
    const head = document.getElementsByTagName('head')[0];
    const oldLinks = document.querySelectorAll("link[rel*='icon']");
    oldLinks.forEach(el => el.remove());
    
    head.appendChild(link);
};

export const useTabTicker = (symbol) => {
    // 👇 MAGIA: Leemos el precio directamente desde Zustand a 60FPS. ¡Cero WebSockets locales!
    const price = useMarketStore(state => state.prices[symbol]);
    
    const lastPriceRef = useRef(0);
    const faviconImgRef = useRef(null);
    const lastColorRef = useRef(null);

    // 1. Cargar imagen base al montar
    useEffect(() => {
        const img = new Image();
        img.src = ORIGINAL_FAVICON_PATH;
        img.crossOrigin = "anonymous"; 
        img.onload = () => {
            faviconImgRef.current = img;
            updateFavicon(img, null);
        };
        img.onerror = () => {
            console.warn("⚠️ No se encontró el logo en:", ORIGINAL_FAVICON_PATH);
        };
    }, []);

    // 2. Efecto reactivo al cambio de precio de Zustand
    useEffect(() => {
        if (!symbol || !price) return;

        const prevPrice = lastPriceRef.current;
        const cleanSymbol = symbol.replace('BINANCE:', '').toLowerCase().replace('usdt', '');

        // Formateo del precio
        const formattedPrice = price < 1 
            ? price.toFixed(5) 
            : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        // Cambio de Título
        const arrow = prevPrice === 0 ? '•' : (price > prevPrice ? '▲' : price < prevPrice ? '▼' : '•');
        document.title = `${arrow} $${formattedPrice} | ${cleanSymbol.toUpperCase()}`;

        // Cambio de Favicon
        if (prevPrice !== 0 && price !== prevPrice && faviconImgRef.current) {
            const newColor = price > prevPrice ? '#00ff88' : '#ff4466';
            if (newColor !== lastColorRef.current) {
                updateFavicon(faviconImgRef.current, newColor);
                lastColorRef.current = newColor;
            }
        }

        // Actualizamos referencia
        lastPriceRef.current = price;

    }, [price, symbol]); // Se dispara CADA VEZ que Zustand recibe un precio nuevo

    // 3. Limpieza al desmontar el componente (ej. si cierran la Terminal)
    useEffect(() => {
        return () => {
            document.title = "SZ Terminal";
            if (faviconImgRef.current) updateFavicon(faviconImgRef.current, null);
        };
    }, []);
};