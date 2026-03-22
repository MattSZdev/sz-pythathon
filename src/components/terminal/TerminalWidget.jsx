import React, { memo } from 'react';
import { Maximize2, MoreHorizontal, GripHorizontal } from 'lucide-react';
import AggrWidget from './widgets/AggrWidget';

const TerminalWidget = memo(({ title, children, type, symbol, aggrType }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#0b0e11] border border-[#2a2e39] rounded-xs overflow-hidden relative">
      
      {/* CAPA DE CONGELAMIENTO */}
      <div className="widget-freeze-layer">
          <div className="flex flex-col items-center justify-center animate-pulse">
             <GripHorizontal className="text-[#00FFC3]" size={32} />
          </div>
      </div>

      {/* HEADER - Optimización de accesibilidad con aria-labels */}
      <div className="widget-drag-handle flex items-center justify-between h-7 px-2 bg-[#161a1e] border-b border-[#2a2e39] select-none cursor-grab active:cursor-grabbing group">
        <div className="flex items-center gap-2 h-full border-b-2 border-[#2563eb] px-1 relative top-px">
            <span className="text-[10px] font-bold text-[#e1e1e1] uppercase tracking-wide font-mono">
              {title}
            </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button aria-label="Maximizar" className="outline-none">
             <Maximize2 size={12} className="text-gray-500 hover:text-white cursor-pointer" />
           </button>
           <button aria-label="Más opciones" className="outline-none">
             <MoreHorizontal size={12} className="text-gray-500 hover:text-white cursor-pointer" />
           </button>
        </div>
      </div>

      {/* CONTENIDO - Lógica Híbrida (Aggr o Hijos) */}
      <div className="widget-content flex-1 relative overflow-hidden bg-[#0b0e11] min-h-[50px]">
        {type === 'aggr' ? (
          // Si es tipo 'aggr', renderizamos el widget automáticamente
          <AggrWidget symbol={symbol} type={aggrType || 'dynamic'} />
        ) : (
          // Si no, renderizamos los hijos normales (Chart, OrderBook, etc.)
          children
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
    // OPTIMIZACIÓN CRÍTICA:
    // 1. Si el título cambia, re-renderizamos (lógica original).
    // 2. Si es un widget 'aggr' y cambia el símbolo (BTC->ETH), FORZAMOS re-render.
    // 3. Si es otro widget (chart), mantenemos la optimización agresiva original.
    
    const titleMatch = prevProps.title === nextProps.title;
    
    if (prevProps.type === 'aggr' || nextProps.type === 'aggr') {
        return titleMatch && prevProps.symbol === nextProps.symbol;
    }
    
    return titleMatch;
});

export default TerminalWidget;