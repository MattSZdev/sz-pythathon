// src/components/terminal/OrderBook.jsx
import React, { useEffect, useRef } from 'react';
import useMarketStore from '../../store/marketStore';

export default function OrderBook({ symbol = 'BTCUSDT' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Ajuste para pantallas Retina/Alta Resolución (Evita que el texto se vea borroso)
        const setupCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            // Ajustamos al tamaño del contenedor padre
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };

        setupCanvas();
        window.addEventListener('resize', setupCanvas);

        // Función de dibujado (Render Loop)
        const render = () => {
            // 1. LEER DATOS DIRECTAMENTE DEL STORE (Sin pasar por React state)
            // Esto es crucial para el rendimiento. No causamos re-renders de React.
            const state = useMarketStore.getState();
            const orderBookData = state.orderBook[symbol] || { asks: [], bids: [] };
            const currentPrice = state.prices[symbol] || 0;

            // 2. LIMPIAR EL LIENZO
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            ctx.clearRect(0, 0, width, height);

            // Configuración general de fuentes
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.textBaseline = 'middle';

            // Cálculos de layout
            const rowHeight = 18;
            const midPoint = height / 2;
            const headerHeight = 20;

            // Encontrar el MaxTotal para las barras de profundidad
            let maxTotal = 1;
            if (orderBookData.asks.length) maxTotal = Math.max(maxTotal, orderBookData.asks[orderBookData.asks.length - 1].total);
            if (orderBookData.bids.length) maxTotal = Math.max(maxTotal, orderBookData.bids[orderBookData.bids.length - 1].total);

            // --- DIBUJAR ASKS (Ventas - Mitad Superior) ---
            const asksToDraw = orderBookData.asks.slice(-15);
            asksToDraw.forEach((ask, index) => {
                const y = midPoint - 25 - ((asksToDraw.length - 1 - index) * rowHeight);
                drawRow(ctx, ask, y, width, maxTotal, 'ask');
            });

            // --- DIBUJAR PRECIO CENTRAL (Spread) ---
            ctx.fillStyle = 'rgba(255,255,255,0.02)';
            ctx.fillRect(0, midPoint - 22, width, 44);
            
            ctx.font = 'bold 18px "JetBrains Mono", monospace';
            ctx.fillStyle = '#00ffaa'; // Aquí puedes agregar la lógica de comparar con el precio anterior
            ctx.textAlign = 'center';
            ctx.fillText(currentPrice > 0 ? currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '---.--', width / 2, midPoint);
            
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#5e6673';
            ctx.fillText('MARKET_INDEX_FED', width / 2, midPoint + 15);

            // --- DIBUJAR BIDS (Compras - Mitad Inferior) ---
            ctx.font = '11px "JetBrains Mono", monospace'; // Reset font
            const bidsToDraw = orderBookData.bids.slice(0, 15);
            bidsToDraw.forEach((bid, index) => {
                const y = midPoint + 25 + (index * rowHeight);
                drawRow(ctx, bid, y, width, maxTotal, 'bid');
            });

            // Solicitar el siguiente frame (Loop infinito a 60 FPS optimizado por el navegador)
            animationFrameId = requestAnimationFrame(render);
        };

        // Iniciar el ciclo de renderizado
        render();

        // Limpieza al desmontar el componente
        return () => {
            window.removeEventListener('resize', setupCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [symbol]);

    return (
        <div style={{ 
            height: '100%', 
            width: '100%',
            backgroundColor: '#050608',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* El Header lo mantenemos en DOM porque es estático y no cambia */}
            <div style={{ 
                display: 'flex', color: '#5e6673', padding: '6px 8px', 
                fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
                borderBottom: '1px solid #1e2329', backgroundColor: '#0a0c10' 
            }}>
                <span style={{ flex: 1 }}>Precio</span>
                <span style={{ flex: 1, textAlign: 'right' }}>Tamaño</span>
                <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
            </div>
            
            {/* Contenedor del Canvas */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <canvas 
                    ref={canvasRef} 
                    style={{ position: 'absolute', top: 0, left: 0, outline: 'none' }} 
                />
            </div>
        </div>
    );
}

// Función auxiliar separada para mantener el código limpio
function drawRow(ctx, data, y, width, maxTotal, side) {
    const { price, size, total } = data;
    const barWidth = Math.min((total / maxTotal) * width, width);

    // Dibujar barra de profundidad
    ctx.fillStyle = side === 'ask' ? 'rgba(255, 59, 92, 0.18)' : 'rgba(0, 255, 170, 0.18)';
    ctx.fillRect(width - barWidth, y, barWidth, 18); // Dibuja de derecha a izquierda

    // Dibujar textos
    const padding = 8;
    
    // Precio
    ctx.textAlign = 'left';
    ctx.fillStyle = side === 'ask' ? '#ff3b5c' : '#00ffaa';
    ctx.fillText(price, padding, y + 9); // +9 para centrar verticalmente en la fila de 18px

    // Tamaño
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e2e2e2';
    ctx.fillText(size, (width / 2) + 20, y + 9);

    // Total
    ctx.fillStyle = '#4a4d52';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(parseFloat(total).toFixed(2), width - padding, y + 9);
    ctx.font = '11px "JetBrains Mono", monospace'; // Reset font
}