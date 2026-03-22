import React, { useEffect, useRef, memo } from 'react';

const TickerTape = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // 1. Limpieza preventiva
    currentContainer.innerHTML = '';

    // 2. Crear la estructura DOM exacta que espera el script
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';
    
    const widgetBody = document.createElement('div');
    widgetBody.className = 'tradingview-widget-container__widget';
    widgetContainer.appendChild(widgetBody);

    // Agregamos la estructura al ref de React
    currentContainer.appendChild(widgetContainer);

    // 3. Crear el script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    
    // 4. Configuración
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "description": "DXY",    "proName": "CAPITALCOM:DXY" },
        { "description": "GOLD",   "proName": "CAPITALCOM:GOLD" },
        { "description": "SILVER", "proName": "CAPITALCOM:SILVER" },
        { "description": "SPY",    "proName": "CAPITALCOM:US500" },
        { "description": "NQ",     "proName": "CAPITALCOM:US100" },
        { "description": "DOW",    "proName": "CAPITALCOM:US30" },
        { "description": "BTC",    "proName": "BINANCE:BTCUSDT" },
        { "description": "ETH",    "proName": "BINANCE:ETHUSDT" },
        { "description": "INTC",   "proName": "NASDAQ:INTC" },
        { "description": "AMD",    "proName": "NASDAQ:AMD" },
        { "description": "NVDA",   "proName": "NASDAQ:NVDA" },
        { "description": "TSLA",   "proName": "NASDAQ:TSLA" }
      ],
      "showSymbolLogo": true,
      "isTransparent": false, // Fondo negro sólido para mejor lectura
      "displayMode": "regular", // 🔥 CRÍTICO: "regular" evita que se apile en móvil
      "colorTheme": "dark",
      "locale": "es"
    });

    // 5. Insertar script dentro del contenedor creado
    widgetContainer.appendChild(script);

    // Cleanup
    return () => {
      if (currentContainer) currentContainer.innerHTML = '';
    };
  }, []);

  return (
    // Contenedor Fijo Abajo (Tailwind)
    // h-[46px] es la altura estándar del ticker para evitar saltos de layout
    <div className="fixed bottom-0 left-0 w-full h-11.5 bg-black z-50 border-t border-white/10" id="ticker-tape-wrapper">
      <div ref={containerRef} className="w-full h-full relative"></div>
    </div>
  );
};

export default memo(TickerTape);