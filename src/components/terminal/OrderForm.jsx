import React, { useState } from 'react';

const InputField = ({ label, value, onChange, suffix }) => (
    <div className="mb-3">
        <label className="block text-[10px] text-gray-500 mb-1 font-bold">{label}</label>
        <div className="flex bg-[#161a1e] border border-[#2a2e39] rounded-sm focus-within:border-sz-blue overflow-hidden">
            <input 
                type="text" 
                value={value} 
                onChange={onChange}
                className="bg-transparent text-white text-xs p-2 w-full outline-none font-mono text-right"
            />
            {suffix && <div className="bg-[#1e2329] text-gray-400 text-[10px] flex items-center px-2 border-l border-[#2a2e39]">{suffix}</div>}
        </div>
    </div>
);

export default function OrderForm({ symbol }) {
    const [side, setSide] = useState('buy'); // buy | sell
    
    return (
        <div className="h-full bg-[#0b0e11] p-2 flex flex-col font-mono text-xs">
            {/* Tabs Compra/Venta */}
            <div className="flex bg-[#161a1e] p-1 rounded-sm mb-4 border border-[#2a2e39]">
                <button 
                    onClick={() => setSide('buy')}
                    className={`flex-1 py-1.5 text-center font-bold rounded-sm transition-all ${side === 'buy' ? 'bg-[#00b389] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    BUY
                </button>
                <button 
                    onClick={() => setSide('sell')}
                    className={`flex-1 py-1.5 text-center font-bold rounded-sm transition-all ${side === 'sell' ? 'bg-[#f6465d] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    SELL
                </button>
            </div>

            {/* Inputs */}
            <div className="flex-1">
                <div className="flex justify-between text-[10px] text-gray-500 mb-2">
                    <span>Avail:</span>
                    <span className="text-white font-bold">1,000.00 USDT</span>
                </div>

                <div className="flex gap-2 mb-2">
                    <button className="flex-1 bg-[#2a2e39] text-[#e1e1e1] py-1 rounded-sm border border-[#363c4a] text-[10px]">Limit</button>
                    <button className="flex-1 bg-transparent text-gray-500 py-1 rounded-sm hover:bg-[#1e2329] text-[10px]">Market</button>
                    <button className="flex-1 bg-transparent text-gray-500 py-1 rounded-sm hover:bg-[#1e2329] text-[10px]">Stop</button>
                </div>

                <InputField label="ORDER PRICE" value="65400.50" suffix="USDT" />
                <InputField label="ORDER QTY" value="0.05" suffix="BTC" />
                
                {/* Slider (Fake) */}
                <div className="h-1 bg-[#2a2e39] rounded-full mt-4 mb-6 relative">
                    <div className="absolute left-0 top-0 h-full bg-sz-blue w-1/3 rounded-full"></div>
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow cursor-pointer"></div>
                </div>

                <InputField label="ORDER VALUE" value="3270.00" suffix="USDT" />
            </div>

            {/* Botón Acción */}
            <button className={`w-full py-3 mt-2 font-bold text-white text-sm rounded-sm transition-transform active:scale-[0.98] ${side === 'buy' ? 'bg-[#00b389] hover:bg-[#00cba0]' : 'bg-[#f6465d] hover:bg-[#ff5d71]'}`}>
                {side === 'buy' ? 'BUY / LONG' : 'SELL / SHORT'}
            </button>
        </div>
    );
}