const config = {
    supported_resolutions: ["1", "5", "15", "60", "240", "1D", "1W"],
    exchanges: [{ value: "Binance", name: "Binance", desc: "Binance Futures API" }],
    symbols_types: [{ name: "crypto", value: "crypto" }]
};

const intervalMap = { 
    '1': '1m', '3': '3m', '5': '5m', '15': '15m', '30': '30m', 
    '60': '1h', '120': '2h', '240': '4h', '1D': '1d', '1W': '1w' 
};

const activeSubscriptions = new Map();

// --- 🌐 DETECCIÓN DE ENTORNO ---
// En desarrollo usa el proxy de Vite, en producción va directo a Binance
const BINANCE_API_ENDPOINT = '/api/binance'; 

export const createDatafeed = () => ({
    onReady: (cb) => setTimeout(() => cb(config), 0),
    
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        const ticker = symbolName.replace('BINANCE:', '').toUpperCase();
        
        const symbolInfo = {
            name: ticker,
            description: ticker + ' Perpetual Futures',
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            ticker: ticker,
            exchange: 'Binance', 
            listed_exchange: 'Binance', 
            minmov: 1,
            pricescale: 100, // Por defecto 2 decimales
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            supported_resolutions: config.supported_resolutions,
            volume_precision: 2,
            data_status: 'streaming',
        };

        // 🎯 AJUSTE DE PRECISIÓN (Crucial para que el precio se vea bien)
        if (ticker.match(/1000|PEPE|SHIB|BONK|FLOKI|WIF|LUNC/)) {
             symbolInfo.pricescale = 100000;
        } else if (ticker.includes('ADA') || ticker.includes('XRP') || ticker.includes('DOGE')) {
             symbolInfo.pricescale = 10000; // 4 decimales
        }

        setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
    },

    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        const { from, to, firstDataRequest } = periodParams;
        const symbol = symbolInfo.name.toUpperCase();
        const interval = intervalMap[resolution] || '1h';
        
        // Construcción de URL dinámica
        const url = `${BINANCE_API_ENDPOINT}?symbol=${symbol}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}&limit=1000`;

        try {
            const res = await fetch(url);
            
            if (!res.ok) throw new Error(`Binance API Error: ${res.status}`);
            
            const data = await res.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                onHistoryCallback([], { noData: true });
                return;
            }

            const bars = data.map(bar => ({
                time: bar[0],
                open: parseFloat(bar[1]),
                high: parseFloat(bar[2]),
                low: parseFloat(bar[3]),
                close: parseFloat(bar[4]),
                volume: parseFloat(bar[5]),
            }));

            // Ordenamos por tiempo para evitar errores en TradingView
            bars.sort((a, b) => a.time - b.time);

            onHistoryCallback(bars, { noData: false });
        } catch (err) {
            console.error("[TV] Error historial:", err);
            onHistoryCallback([], { noData: true });
        }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        const symbol = symbolInfo.name.toLowerCase();
        const interval = intervalMap[resolution] || '1m';
        
        // Limpiar suscripción previa si existe con el mismo ID
        if (activeSubscriptions.has(subscribeUID)) {
            activeSubscriptions.get(subscribeUID).close();
        }

        const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol}@kline_${interval}`);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.k) {
                onRealtimeCallback({
                    time: msg.k.t,
                    open: parseFloat(msg.k.o),
                    high: parseFloat(msg.k.h),
                    low: parseFloat(msg.k.l),
                    close: parseFloat(msg.k.c),
                    volume: parseFloat(msg.k.v)
                });
            }
        };

        ws.onerror = (err) => console.error("[WS] Error en stream:", err);

        activeSubscriptions.set(subscribeUID, ws);
    },

    unsubscribeBars: (subscriberUID) => {
        if (activeSubscriptions.has(subscriberUID)) {
            const ws = activeSubscriptions.get(subscriberUID);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            activeSubscriptions.delete(subscriberUID);
        }
    }
});