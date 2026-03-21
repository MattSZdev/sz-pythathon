// frontend/src/workers/orderBookWorker.js

// Variable temporal en el Worker para guardar el volumen de la vela actual
let currentCandleVolume = {};

self.onmessage = function (event) {
    const { type, symbol, data } = event.data;

    // ... (Mantén aquí el código de 'PROCESS_ORDER_BOOK' que ya teníamos) ...

    if (type === 'PROCESS_TRADE') {
        // data viene del stream @aggTrade de Binance
        const price = parseFloat(data.p).toFixed(1); // Redondeamos a 1 decimal (ajustable por activo)
        const qty = parseFloat(data.q);
        
        // En Binance @aggTrade, 'm' (isBuyerMaker) indica quién inició la operación.
        // Si m: true -> El comprador era Maker (órden pasiva), por ende alguien le vendió a mercado (Agresión de Venta / Bid Volume).
        // Si m: false -> Agresión de Compra (Ask Volume).
        const isSell = data.m; 

        // Inicializamos el nivel de precio si no existe
        if (!currentCandleVolume[price]) {
            currentCandleVolume[price] = { bidVol: 0, askVol: 0 };
        }

        // Sumamos el volumen
        if (isSell) {
            currentCandleVolume[price].bidVol += qty;
        } else {
            currentCandleVolume[price].askVol += qty;
        }

        // Enviamos el "Perfil de Volumen" actualizado de esta vela al Frontend
        self.postMessage({
            type: 'FOOTPRINT_UPDATED',
            symbol,
            payload: { ...currentCandleVolume }
        });
    }
};