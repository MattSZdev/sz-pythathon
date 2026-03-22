import React, { useEffect, useState, useRef, useMemo } from 'react';

const styles = {
    container: { 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#050608', // Negro más profundo para que resalte el neón
        fontSize: '11px', 
        fontFamily: '"JetBrains Mono", monospace', 
        overflow: 'hidden', 
        userSelect: 'none',
        border: '1px solid rgba(255,255,255,0.05)'
    },
    header: { 
        display: 'flex', 
        color: '#5e6673', 
        padding: '6px 8px', 
        fontSize: '9px', 
        fontWeight: 800, 
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        borderBottom: '1px solid #1e2329', 
        backgroundColor: '#0a0c10' 
    },
    row: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '0 8px', 
        height: '18px', 
        alignItems: 'center', 
        position: 'relative', 
        cursor: 'crosshair',
        transition: 'background-color 0.2s ease'
    },
    depthBar: { 
        position: 'absolute', 
        top: '1px', 
        right: 0, 
        bottom: '1px', 
        zIndex: 0, 
        transition: 'width 0.4s cubic-bezier(0.1, 0.7, 1.0, 0.1)' // Movimiento orgánico
    },
    cell: { 
        zIndex: 1, 
        position: 'relative', 
        flex: 1, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden' 
    },
    priceUp: { color: '#00ffaa', textShadow: '0 0 8px rgba(0,255,170,0.3)' }, 
    priceDown: { color: '#ff3b5c', textShadow: '0 0 8px rgba(255,59,92,0.3)' }, 
    text: { color: '#e2e2e2' },
    spread: { 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '8px', 
        minHeight: '45px', 
        backgroundColor: 'rgba(255,255,255,0.02)', 
        borderY: '1px solid rgba(255,255,255,0.05)',
        gap: '2px'
    }
};

const Row = React.memo(({ price, size, total, maxTotal, side }) => {
    const width = `${Math.min((total / maxTotal) * 100, 100)}%`;
    
    // Degradados épicos estilo "pared de liquidez"
    const bgColor = side === 'ask' 
        ? 'linear-gradient(to left, rgba(255, 59, 92, 0.18), transparent)' 
        : 'linear-gradient(to left, rgba(0, 255, 170, 0.18), transparent)';
    
    const textColor = side === 'ask' ? styles.priceDown : styles.priceUp;

    return (
        <div style={styles.row} className="orderbook-row-hover">
            <div style={{ ...styles.depthBar, width, background: bgColor }} />
            <span style={{ ...styles.cell, ...textColor, textAlign: 'left', fontWeight: 'bold' }}>{price}</span>
            <span style={{ ...styles.cell, ...styles.text, textAlign: 'right' }}>{size}</span>
            <span style={{ ...styles.cell, color: '#4a4d52', textAlign: 'right', fontSize: '9px' }}>{total}</span>
            
            <style>{`
                .orderbook-row-hover:hover { background-color: rgba(255,255,255,0.05); }
                @keyframes pulse-update {
                    0% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                .pulse-anim { animation: pulse-update 0.3s ease-out; }
            `}</style>
        </div>
    );
});

export default function OrderBook({ symbol = 'BTCUSDT' }) {
    const [snapshot, setSnapshot] = useState({ asks: [], bids: [], lastPrice: 0, prevPrice: 0 });
    const buffer = useRef({ asks: [], bids: [], lastPrice: 0 });
    const wsRef = useRef(null);
    const frameId = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const pair = symbol.replace('BINANCE:', '').toLowerCase().replace('/', '');
        
        // CORRECCIÓN WS: Usamos fstream para futuros y manejamos el ciclo de vida
        const ws = new WebSocket(`wss://fstream.binance.com/ws/${pair}@depth20@100ms`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                const rawAsks = msg.asks || msg.a;
                const rawBids = msg.bids || msg.b;

                if (!rawAsks || !rawBids) return;

                let askTotal = 0;
                const asks = rawAsks.map(x => {
                    const size = parseFloat(x[1]);
                    askTotal += size;
                    return { price: parseFloat(x[0]).toFixed(2), size: size.toFixed(3), total: askTotal };
                }).reverse();

                let bidTotal = 0;
                const bids = rawBids.map(x => {
                    const size = parseFloat(x[1]);
                    bidTotal += size;
                    return { price: parseFloat(x[0]).toFixed(2), size: size.toFixed(3), total: bidTotal };
                });

                buffer.current = { asks, bids, lastPrice: parseFloat(rawBids[0][0]) };
            } catch (e) {}
        };

        const loop = () => {
            if (buffer.current.asks.length > 0 && isMounted) {
                setSnapshot(prev => ({
                    ...buffer.current,
                    prevPrice: prev.lastPrice
                }));
            }
            frameId.current = requestAnimationFrame(loop);
        };
        
        loop();

        return () => {
            isMounted = false;
            cancelAnimationFrame(frameId.current);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            } else if (ws.readyState === WebSocket.CONNECTING) {
                ws.onopen = () => ws.close();
            }
        };
    }, [symbol]);

    const maxTotal = useMemo(() => {
        const maxAsk = snapshot.asks.length ? snapshot.asks[0].total : 1;
        const maxBid = snapshot.bids.length ? snapshot.bids[snapshot.bids.length-1].total : 1;
        return Math.max(maxAsk, maxBid);
    }, [snapshot]);

    // Lógica para el color del precio central
    const priceColor = snapshot.lastPrice >= snapshot.prevPrice ? '#00ffaa' : '#ff3b5c';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={{ flex: 1 }}>Precio</span>
                <span style={{ flex: 1, textAlign: 'right' }}>Tamaño</span>
                <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
            </div>
            
            {/* ASKS (Vendedores) - Se visualizan de abajo hacia arriba */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
                {snapshot.asks.slice(-15).map((row, i) => (
                    <Row key={`ask-${row.price}`} {...row} total={row.total.toFixed(2)} side="ask" maxTotal={maxTotal} />
                ))}
            </div>

            {/* PRECIO CENTRAL ÉPICO */}
            <div style={styles.spread}>
                <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '900', 
                    color: priceColor,
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    {snapshot.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <span style={{ fontSize: '12px' }}>
                        {snapshot.lastPrice >= snapshot.prevPrice ? '▲' : '▼'}
                    </span>
                </div>
                <div style={{ fontSize: '9px', color: '#5e6673', fontWeight: 'bold' }}>
                    MARKET_INDEX_FED
                </div>
            </div>

            {/* BIDS (Compradores) */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {snapshot.bids.slice(0, 15).map((row, i) => (
                    <Row key={`bid-${row.price}`} {...row} total={row.total.toFixed(2)} side="bid" maxTotal={maxTotal} />
                ))}
            </div>

            {/* EFECTO SCANNER (Opcional, muy pro) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(to right, transparent, rgba(0, 255, 170, 0.2), transparent)',
                animation: 'scan 4s linear infinite',
                zIndex: 10,
                pointerEvents: 'none'
            }} />
            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
}