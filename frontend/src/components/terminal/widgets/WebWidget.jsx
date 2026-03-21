import React, { useState } from 'react';
import { Globe, RefreshCw } from 'lucide-react';

export default function WebWidget({ initialUrl = "https://www.google.com" }) {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [key, setKey] = useState(0); // Para forzar recarga del iframe

  const handleGo = (e) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
  };

  const reload = () => setKey(prev => prev + 1);

  return (
    <div className="flex flex-col h-full bg-[#0b0e11] text-xs">
      {/* Barra de Navegación Mini */}
      <div className="flex items-center gap-2 p-1 bg-[#161a1e] border-b border-[#2a2e39]">
        <Globe size={12} className="text-sz-blue" />
        <form onSubmit={handleGo} className="flex-1">
            <input 
                className="w-full bg-[#0b0e11] border border-[#2a2e39] px-2 py-0.5 text-gray-300 focus:border-sz-blue outline-none rounded-sm"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
            />
        </form>
        <button onClick={reload} className="p-1 hover:text-white text-gray-500">
            <RefreshCw size={12} />
        </button>
      </div>

      {/* Contenido Web */}
      <div className="flex-1 relative">
         {/* El iframe ocupa todo el espacio */}
         <iframe 
            key={key}
            src={url} 
            className="w-full h-full border-none bg-white"
            title="External Web"
            sandbox="allow-scripts allow-same-origin allow-forms"
         />
         
         {/* IMPORTANTE: Esta capa invisible debe activarse desde el CSS global
            cuando se arrastra (.layout-active), pero aquí la dejamos preparada.
         */}
         <div className="pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}