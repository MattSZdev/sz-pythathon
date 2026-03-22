import React, { useEffect, useRef } from 'react';
import { createDatafeed } from '../../api/tvDatafeed'; 

export default function TVChartContainer({ activeSymbol, onSymbolChange }) {
  const chartContainerRef = useRef();
  const tvWidgetRef = useRef(null);
  const datafeedRef = useRef(null);

  const currentSymbol = activeSymbol || 'BTCUSDT'; 

  useEffect(() => {
    if (!chartContainerRef.current || !window.TradingView || tvWidgetRef.current) return;

    if (!datafeedRef.current) {
        datafeedRef.current = createDatafeed(); 
    }

    const colors = {
      bg: "#000000",
      grid: "rgba(0, 0, 0, 0)", // 🔥 Grid Invisible
      text: "#94a3b8", 
      green: "#00bcd4", // 🔥 Cyan
      red: "#5d606b",   // 🔥 Gris
      blue: "#2563eb"
    };

    const widgetOptions = {
      symbol: currentSymbol, 
      interval: '5', // 🔥 Inicia en 5 minutos
      container: chartContainerRef.current,
      library_path: '/charting_library/', 
      locale: 'es',
      datafeed: datafeedRef.current,
      autosize: true,
      fullscreen: false,
      theme: 'Dark',
      timezone: 'Etc/UTC',
      toolbar_bg: colors.bg, 
      loading_screen: { backgroundColor: colors.bg, foregroundColor: colors.blue },
      
      // 🔥 Favoritos en la parte superior
      favorites: {
        intervals: ["1S", "1", "3", "5", "15", "60", "240", "1D"],
        chartTypes: ["Candles"]
      },

      disabled_features: [
        "header_symbol_search", 
        "header_compare", 
        "use_localstorage_for_settings", 
      ],
      // 🔥 "left_toolbar" habilitado para que esté a la vista el kit de herramientas
      enabled_features: ["left_toolbar", "header_widget_dom_node"], 
      
      overrides: {
        "paneProperties.background": colors.bg, 
        "paneProperties.vertGridProperties.color": colors.grid, 
        "paneProperties.horzGridProperties.color": colors.grid,
        "scalesProperties.textColor": colors.text,
        // Velas Cuerpo
        "mainSeriesProperties.candleStyle.upColor": colors.green,
        "mainSeriesProperties.candleStyle.downColor": colors.red,
        // Velas Bordes
        "mainSeriesProperties.candleStyle.borderUpColor": colors.red,
        "mainSeriesProperties.candleStyle.borderDownColor": colors.red,
        // Velas Mechas
        "mainSeriesProperties.candleStyle.wickUpColor": colors.red,
        "mainSeriesProperties.candleStyle.wickDownColor": colors.red,
      },
    };

    const tvWidget = new window.TradingView.widget(widgetOptions);
    tvWidgetRef.current = tvWidget;

    tvWidget.onChartReady(() => {
        console.log("✅ Chart Ready");
        tvWidgetRef.current._ready = true; // Marcamos como listo para cambios de símbolo
        tvWidget.applyOverrides({
            "gui.fontFamily": "Inter, sans-serif"
        });
    });

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
    };
  }, []); 

  useEffect(() => {
    // Protección para que no falle si el widget aún carga
    if (tvWidgetRef.current && tvWidgetRef.current._ready && activeSymbol) {
        try {
            tvWidgetRef.current.activeChart().setSymbol(activeSymbol);
        } catch (e) {
            console.warn("Symbol change failed: Chart busy");
        }
    }
  }, [activeSymbol]); 

  return (
    <div className="h-full w-full flex flex-col bg-black overflow-hidden relative">
      <div ref={chartContainerRef} className="grow w-full h-full bg-black" />
    </div>
  );
};