import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const BinanceContext = createContext();

export const BinanceProvider = ({ children }) => {
    const [allTickers, setAllTickers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    const connect = () => {
        // Endpoint de Futuros para todos los tickers
        ws.current = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

        ws.current.onopen = () => setIsConnected(true);
        ws.current.onclose = () => {
            setIsConnected(false);
            setTimeout(connect, 3000); // Reconexión automática
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Optimizamos: solo guardamos lo que necesitamos para el screener
            const formatted = data.map(item => ({
                s: item.s, // Symbol
                p: item.c, // Price
                P: item.P, // % Change
                v: item.q, // Volume USDT
            }));
            setAllTickers(formatted);
        };
    };

    useEffect(() => {
        connect();
        return () => ws.current?.close();
    }, []);

    return (
        <BinanceContext.Provider value={{ allTickers, isConnected }}>
            {children}
        </BinanceContext.Provider>
    );
};

export const useBinance = () => useContext(BinanceContext);