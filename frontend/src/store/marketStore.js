// src/store/marketStore.js
import { create } from 'zustand';

// Variables globales FUERA de React
let wsInstance = null;
let reconnectTimeout = null;

// INICIALIZAMOS EL WORKER
const orderBookWorker = new Worker(
    new URL('../workers/orderBookWorker.js', import.meta.url), 
    { type: 'module' }
);

const useMarketStore = create((set, get) => {
    
    // ESCUCHAMOS LAS RESPUESTAS DEL WORKER
    orderBookWorker.onmessage = (event) => {
        if (event.data.type === 'ORDER_BOOK_PROCESSED') {
            const { symbol, payload } = event.data;
            set((state) => ({
                orderBook: {
                    ...state.orderBook,
                    [symbol]: payload
                }
            }));
        }
        
        // NUEVO: Escuchar el Footprint procesado
        if (event.data.type === 'FOOTPRINT_UPDATED') {
            const { symbol, payload } = event.data;
            set((state) => ({
                footprintData: {
                    ...state.footprintData,
                    [symbol]: payload 
                }
            }));
        }
    };

    return {
        prices: {},       
        orderBook: {},
        footprintData: {}, // Guardamos la data de la vela actual
        connectionStatus: 'disconnected',

        connectMarketData: () => {
            if (wsInstance && (wsInstance.readyState === WebSocket.OPEN || wsInstance.readyState === WebSocket.CONNECTING)) {
                return;
            }

            set({ connectionStatus: 'connecting' });
            
            // IMPORTANTE: Incluimos btcusdt@aggTrade para que el Footprint tenga datos
            const streams = '!ticker@arr/btcusdt@depth20@100ms/btcusdt@aggTrade/ethusdt@depth20@100ms';
            const wsUrl = `wss://fstream.binance.com/stream?streams=${streams}`;

            wsInstance = new WebSocket(wsUrl);

            wsInstance.onopen = () => {
                console.log('🟢 Market Data Conectado');
                set({ connectionStatus: 'connected' });
                if (reconnectTimeout) clearTimeout(reconnectTimeout);
            };

            wsInstance.onmessage = (event) => {
                const payload = JSON.parse(event.data);
                if (!payload || !payload.stream || !payload.data) return;

                const { stream, data } = payload;
                
                // Actualización de precios (Tickers)
                if (stream === '!ticker@arr') {
                    set((state) => {
                        const nextPrices = { ...state.prices };
                        let hasChanged = false;
                        for (let i = 0; i < data.length; i++) {
                            if (nextPrices[data[i].s] !== data[i].c) {
                                nextPrices[data[i].s] = data[i].c;
                                hasChanged = true;
                            }
                        }
                        return hasChanged ? { prices: nextPrices } : state;
                    });
                }

                // Order Book
                if (stream.includes('@depth')) {
                    const symbol = data.s || stream.split('@')[0].toUpperCase();
                    orderBookWorker.postMessage({
                        type: 'PROCESS_ORDER_BOOK',
                        symbol: symbol,
                        data: { bids: data.b, asks: data.a }
                    });
                }

                // Trades ejecutados (Footprint)
                if (stream.includes('@aggTrade')) {
                    const symbol = data.s || stream.split('@')[0].toUpperCase();
                    orderBookWorker.postMessage({
                        type: 'PROCESS_TRADE',
                        symbol: symbol,
                        data: data
                    });
                }
            };

            wsInstance.onclose = () => {
                set({ connectionStatus: 'disconnected' });
                wsInstance = null;
                reconnectTimeout = setTimeout(() => get().connectMarketData(), 3000);
            };
        },

        disconnectMarketData: () => {
            if (wsInstance) {
                const currentWs = wsInstance; // Referencia local para evitar error 'null'
                
                if (currentWs.readyState === WebSocket.CONNECTING) {
                    currentWs.onopen = () => {
                        currentWs.close();
                    };
                } else if (currentWs.readyState === WebSocket.OPEN) {
                    currentWs.close();
                }
                
                wsInstance = null;
            }
            
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
            
            set({ connectionStatus: 'disconnected' });
        }
    };
});

export default useMarketStore;