export const layoutsConfig = {
  // --- MODO ESCRITORIO (Base 12 columnas x 10 filas) ---
  desktop: [
    { i: 'chart',     x: 0, y: 0, w: 7, h: 4, minW: 1, minH: 1 },
    { i: 'minichart', x: 7, y: 0, w: 5, h: 2, minW: 1, minH: 1 },
    { i: 'orderbook', x: 7, y: 3, w: 5, h: 2, minW: 1, minH: 1 },
    { i: 'screener',  x: 0, y: 6, w: 12, h: 3, minW: 1, minH: 1 }
  ],

  // --- MODO MÓVIL (Base 1 columna) ---
  mobile: [
    { i: 'chart',     x: 0, y: 0, w: 8, h: 4, minW: 1, minH: 1 },
    { i: 'orderbook', x: 8, y: 0, w: 4, h: 4, minW: 1, minH: 1 },
    { i: 'screener',  x: 0, y: 4, w: 15, h: 4, minW: 1, minH: 1 },
    { i: 'minichart', x: 0, y: 3, w: 15, h: 3, minW: 1, minH: 1 }
  ]
};