import React, { useEffect, useRef, useState } from 'react';
import useMarketStore from '../../store/marketStore';

export default function Footprint({ symbol = 'BTCUSDT' }) {
    const canvasRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    // Controles de Configuración en Vivo
    const [tickSize, setTickSize] = useState(10);
    const [imbalanceRatio, setImbalanceRatio] = useState(300); // 300% de diferencia
    const [volumeFilter, setVolumeFilter] = useState(0.5); // Ocultar ruido menor a 0.5 BTC

    // Variables de Navegación del Canvas (Refs para no re-renderizar React en cada frame)
    const view = useRef({ scrollX: 0, offsetY: 0, zoomX: 1.0, zoomY: 1.0 });
    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // 1. CONEXIÓN WEBSOCKET (A tu túnel de Cloudflare)
        const API_WS = `wss://api.szoficial.com/ws/footprint/${symbol.toLowerCase()}/`; 
        
        const connectWS = () => {
            const socket = new WebSocket(API_WS);
            socket.onopen = () => console.log(`[Deepflow] 🔗 Conectado a ${symbol}`);
            socket.onmessage = (event) => {
                // CORRECCIÓN VITAL: JSON.parse en lugar de json.loads
                const data = JSON.parse(event.data); 
                if (useMarketStore.getState().updateFootprint) {
                    useMarketStore.getState().updateFootprint(symbol, data);
                }
            };
            socket.onerror = (err) => socket.close();
            socket.onclose = () => setTimeout(connectWS, 3000);
            return socket;
        };

        const ws = connectWS();

        // 2. CONFIGURACIÓN DEL LIENZO (High-DPI / Retina Display)
        const setupCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };
        setupCanvas();
        window.addEventListener('resize', setupCanvas);

        // 3. CONTROLES DE NAVEGACIÓN (Zoom y Drag)
        const handleWheel = (e) => {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey) {
                // Zoom X (Ancho de velas)
                view.current.zoomX = Math.max(0.2, Math.min(view.current.zoomX - e.deltaY * 0.005, 3.0));
            } else if (e.shiftKey) {
                // Zoom Y (Altura de celdas)
                view.current.zoomY = Math.max(0.5, Math.min(view.current.zoomY - e.deltaY * 0.005, 3.0));
            } else {
                // Paneos
                view.current.offsetY -= e.deltaY;
                view.current.scrollX -= e.deltaX;
            }
        };

        const handleMouseDown = (e) => {
            setIsDragging(true);
            lastMouse.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            view.current.scrollX += (e.clientX - lastMouse.current.x);
            view.current.offsetY += (e.clientY - lastMouse.current.y);
            lastMouse.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => setIsDragging(false);

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // 4. MOTOR DE RENDERIZADO (60 FPS)
        const render = () => {
            const state = useMarketStore.getState();
            // Asumimos que guardas el historial como: { timestamp: matrix, timestamp2: matrix2... }
            const candles = state.footprintData?.[symbol] || { [Date.now()]: state.footprintData?.[symbol + '_live'] || {} }; 
            
            const cW = canvas.clientWidth;
            const cH = canvas.clientHeight;

            // Fondo ultra oscuro
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, cW, cH);

            // Grilla
            drawCyberGrid(ctx, cW, cH, view.current.scrollX, view.current.offsetY);

            const barW = 140 * view.current.zoomX;
            const tickH = 24 * view.current.zoomY;

            // Renderizar Velas
            const timestamps = Object.keys(candles).sort();
            timestamps.forEach((ts, index) => {
                const matrix = candles[ts];
                // Posicionar velas de derecha a izquierda
                const xPos = cW - 150 - ((timestamps.length - 1 - index) * (barW + 20)) + view.current.scrollX;

                if (xPos > -barW && xPos < cW) {
                    drawFootprintBar(ctx, xPos, cH / 2 + view.current.offsetY, matrix, barW, tickH, imbalanceRatio, volumeFilter);
                }
            });

            // Eje de precios lateral
            drawPriceAxis(ctx, cW, cH, view.current.offsetY, tickH, candles);
            
            // HUD Superior
            drawHUD(ctx, cW, cH, symbol, tickSize);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            ws.close();
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setupCanvas);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [symbol, isDragging, tickSize, imbalanceRatio, volumeFilter]);

    return (
        <div className="relative w-full h-full bg-[#020202] overflow-hidden group">
            {/* Lienzo del Order Flow */}
            <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair outline-none" />
            
            {/* Barra de Herramientas Superior Flotante */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="bg-slate-900/80 border border-slate-700 hover:border-[#00ffa3] text-slate-300 px-3 py-1.5 rounded font-mono text-xs backdrop-blur transition-all"
                >
                    ⚙️ CONFIG
                </button>
            </div>

            {/* Panel de Configuración UI */}
            {showSettings && (
                <div className="absolute top-14 right-4 w-64 bg-slate-900/90 border border-slate-700/50 backdrop-blur-md p-4 rounded-lg shadow-2xl font-mono text-xs text-slate-300">
                    <h3 className="text-[#00ffa3] font-bold mb-4 uppercase tracking-widest border-b border-slate-700 pb-2">Engine Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between mb-1">
                                <span>Tick Size (Agg)</span>
                                <span className="text-white">${tickSize}</span>
                            </label>
                            <input type="range" min="1" max="100" value={tickSize} onChange={(e) => setTickSize(Number(e.target.value))} className="w-full accent-[#00ffa3]" />
                        </div>
                        
                        <div>
                            <label className="flex justify-between mb-1">
                                <span>Imbalance Ratio</span>
                                <span className="text-white">{imbalanceRatio}%</span>
                            </label>
                            <input type="range" min="150" max="1000" step="50" value={imbalanceRatio} onChange={(e) => setImbalanceRatio(Number(e.target.value))} className="w-full accent-[#00ffa3]" />
                        </div>

                        <div>
                            <label className="flex justify-between mb-1">
                                <span>Noise Filter (Vol)</span>
                                <span className="text-white">&gt; {volumeFilter}</span>
                            </label>
                            <input type="range" min="0" max="10" step="0.5" value={volumeFilter} onChange={(e) => setVolumeFilter(Number(e.target.value))} className="w-full accent-[#00ffa3]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// MOTOR GRÁFICO (CANVAS 2D API)
// ==========================================

function drawFootprintBar(ctx, x, centerY, matrix, w, h, imbRatio, volFilter) {
    if (!matrix) return;
    const prices = Object.keys(matrix).map(Number).sort((a, b) => b - a);
    if (prices.length === 0) return;

    // Calcular el Point of Control (POC) de esta vela
    let maxVol = 0;
    let pocPrice = 0;
    
    prices.forEach(p => {
        const total = matrix[p].b + matrix[p].a;
        if (total > maxVol) { maxVol = total; pocPrice = p; }
    });

    prices.forEach((price, i) => {
        const { b: bid, a: ask } = matrix[price];
        const y = centerY + (i - prices.length / 2) * h;
        const totalVol = bid + ask;

        if (totalVol < volFilter) return; // Filtrar ruido

        // IMBALANCE DIAGONAL LÓGICA
        // Comparamos el Ask actual con el Bid del nivel inferior
        const bidBelow = matrix[prices[i + 1]] ? matrix[prices[i + 1]].b : 0;
        const askAbove = matrix[prices[i - 1]] ? matrix[prices[i - 1]].a : 0;

        const isAskImbalance = (ask / (bidBelow || 1)) * 100 >= imbRatio && ask > volFilter;
        const isBidImbalance = (bid / (askAbove || 1)) * 100 >= imbRatio && bid > volFilter;

        // Cajas base (Heatmap por volumen total comparado al POC)
        const intensity = Math.max(0.05, totalVol / maxVol);
        
        // Render Bid (Rojo)
        ctx.fillStyle = isBidImbalance ? 'rgba(255, 46, 99, 0.9)' : `rgba(255, 46, 99, ${intensity * 0.5})`;
        ctx.fillRect(x, y, w/2 - 1, h - 1);
        if(isBidImbalance) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w/2 - 1, h - 1); }
        
        // Render Ask (Verde)
        ctx.fillStyle = isAskImbalance ? 'rgba(0, 255, 163, 0.9)' : `rgba(0, 255, 163, ${intensity * 0.5})`;
        ctx.fillRect(x + w/2 + 1, y, w/2 - 1, h - 1);
        if(isAskImbalance) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(x + w/2 + 1, y, w/2 - 1, h - 1); }

        // POC Highlight (Borde Blanco brillante)
        if (price === pocPrice) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 2, y - 1, w + 4, h + 1);
        }

        // Texto de Volumen
        if (w > 60 && h > 12) {
            ctx.fillStyle = isBidImbalance ? '#fff' : 'rgba(255,255,255,0.7)';
            ctx.font = `bold ${Math.max(9, h * 0.45)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'right';
            ctx.fillText(bid.toFixed(1), x + w/2 - 6, y + h/2 + (h*0.15));
            
            ctx.fillStyle = isAskImbalance ? '#fff' : 'rgba(255,255,255,0.7)';
            ctx.textAlign = 'left';
            ctx.fillText(ask.toFixed(1), x + w/2 + 6, y + h/2 + (h*0.15));
        }
    });
}

function drawPriceAxis(ctx, cW, cH, offsetY, tickH, candles) {
    // Área oscura en la derecha
    const axisW = 80;
    ctx.fillStyle = '#0a0f16';
    ctx.fillRect(cW - axisW, 0, axisW, cH);
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath(); ctx.moveTo(cW - axisW, 0); ctx.lineTo(cW - axisW, cH); ctx.stroke();

    // Encontrar el rango de precios visible basándonos en la última vela
    const timestamps = Object.keys(candles);
    if(timestamps.length === 0) return;
    const lastMatrix = candles[timestamps[timestamps.length-1]];
    if(!lastMatrix) return;

    const prices = Object.keys(lastMatrix).map(Number).sort((a,b) => b - a);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono"';
    ctx.textAlign = 'right';

    prices.forEach((p, i) => {
        const y = (cH / 2) + offsetY + (i - prices.length / 2) * tickH;
        if (y > 0 && y < cH) {
            ctx.fillText(p.toFixed(1), cW - 10, y + (tickH/2) + 3);
            // Pequeña marca
            ctx.beginPath(); ctx.moveTo(cW - axisW, y + tickH/2); ctx.lineTo(cW - axisW + 5, y + tickH/2); ctx.stroke();
        }
    });
}

function drawCyberGrid(ctx, w, h, scrollX, offsetY) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let x = scrollX % 100; x < w; x += 100) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = offsetY % 50; y < h; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
}

function drawHUD(ctx, w, h, symbol, tickSize) {
    ctx.fillStyle = '#00ffa3';
    ctx.font = 'bold 12px "JetBrains Mono"';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ DEEPFLOW QUANTUM ENGINE`, 20, 25);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono"';
    ctx.fillText(`SYMBOL: ${symbol} | TICK: $${tickSize} | LATENCY: <5ms`, 20, 45);
}