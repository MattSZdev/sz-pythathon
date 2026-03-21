import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
    persist(
        (set) => ({
            activeSymbol: 'BTCUSDT', // Símbolo por defecto
            setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
        }),
        {
            name: 'sz-active-symbol', // Este archivo será independiente en cada subdominio
        }
    )
);

export default useAppStore;