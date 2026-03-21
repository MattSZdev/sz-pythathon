// frontend/src/utils/orderBookWorker.js

// Este es un Web Worker que corre en un hilo separado.
// Su finalidad es procesar los datos intensivos sin bloquear la UI de React.

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === 'PROCESS_ORDER_BOOK') {
    // Aquí simulamos el agrupamiento y ordenamiento de miles de órdenes
    const { bids, asks } = payload;
    
    // Ordenamos Bids (compras) de mayor a menor precio
    const sortedBids = bids.sort((a, b) => b.price - a.price).slice(0, 50);
    // Ordenamos Asks (ventas) de menor a mayor precio
    const sortedAsks = asks.sort((a, b) => a.price - b.price).slice(0, 50);

    // Calculamos la profundidad acumulada (para dibujar barras de volumen en el Order Book)
    let accBidVol = 0;
    const processedBids = sortedBids.map(bid => {
      accBidVol += bid.qty;
      return { ...bid, total: accBidVol };
    });

    // Enviamos los datos procesados de vuelta al hilo principal de React
    self.postMessage({
      type: 'ORDER_BOOK_READY',
      payload: { bids: processedBids, asks: sortedAsks }
    });
  }
};