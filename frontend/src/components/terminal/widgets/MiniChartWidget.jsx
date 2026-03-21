import React, { memo } from 'react';

const MiniChartWidget = ({ symbol = "SPX500", exchange = "FOREXCOM" }) => {
  const tvSymbol = `${exchange}:${symbol}`;

  const overrides = {
    "paneProperties.backgroundType": "solid",
    "paneProperties.background": "#0b0e11",
    "paneProperties.vertGridProperties.color": "rgba(0, 0, 0, 0)", // Grid invisible
    "paneProperties.horzGridProperties.color": "rgba(0, 0, 0, 0)",
    "scalesProperties.textColor": "#94a3b8",
    "mainSeriesProperties.candleStyle.upColor": "#00bcd4",
    "mainSeriesProperties.candleStyle.downColor": "#5d606b",
    "mainSeriesProperties.candleStyle.wickUpColor": "#5d606b",
    "mainSeriesProperties.candleStyle.wickDownColor": "#5d606b",
    "mainSeriesProperties.candleStyle.borderUpColor": "#5d606b",
    "mainSeriesProperties.candleStyle.borderDownColor": "#5d606b",
    "paneProperties.crossHairProperties.color": "#94a3b8"
  };

  const searchParams = new URLSearchParams({
    hideideas: "1",
    overrides: JSON.stringify(overrides),
    enabled_features: "[]",
    disabled_features: JSON.stringify([
      "create_volume_indicator_by_default",
      "show_logo_on_all_charts",
      "header_compare",
      "header_symbol_search",
      "control_bar", 
      "border_around_the_chart"
    ]),
    locale: "en",
    theme: "Dark"
  });

  const widgetOptions = {
    symbol: tvSymbol,
    interval: "60", 
    hidesidetoolbar: "1",
    symboledit: "0",      
    saveimage: "0",
    toolbarbg: "#0b0e11",
    studies: "[]",        
    style: "1",           
    timezone: "Etc/UTC"
  };

  const baseUrl = "https://s.tradingview.com/widgetembed/";
  const hashString = encodeURIComponent(JSON.stringify(widgetOptions));
  const src = `${baseUrl}?${searchParams.toString()}#${hashString}`;

  return (
    <div className="w-full h-full bg-[#0b0e11] overflow-hidden flex flex-col relative select-none">
        <div className="absolute inset-0 z-0">
            <iframe
                title={`Chart ${symbol}`}
                src={src}
                className="w-full h-full border-none"
                // 🔥 CORRECCIÓN AQUÍ: todo en minúsculas
                allowtransparency="true" 
                scrolling="no"
                allowFullScreen
            />
        </div>
        
        <div className="absolute top-0 left-0 w-full h-5 z-10 cursor-move" />
    </div>
  );
};

export default memo(MiniChartWidget);