// src/store/layoutStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { layoutsConfig } from '../config/layouts';

const useLayoutStore = create(
    persist(
        (set) => ({
            // Estado inicial: combinamos tus layouts por defecto en un solo objeto
            layouts: { 
                lg: layoutsConfig.desktop, 
                md: layoutsConfig.desktop, 
                sm: layoutsConfig.mobile, 
                xs: layoutsConfig.mobile, 
                xxs: layoutsConfig.mobile 
            },
            // Acción para actualizar y guardar automáticamente
            setLayouts: (newLayouts) => set({ layouts: newLayouts })
        }),
        {
            name: 'sz-terminal-layouts', // Nombre de la "caja" en el localStorage
        }
    )
);

export default useLayoutStore;