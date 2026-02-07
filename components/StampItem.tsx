
import React from 'react';
import { StampDenomination } from '../types';

interface StampItemProps {
  denomination: StampDenomination;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}

const StampItem: React.FC<StampItemProps> = ({ denomination, count, onAdd, onRemove }) => {
  return (
    <div className="flex flex-col items-center group">
      <div 
        onClick={onAdd}
        className={`relative w-20 h-24 sm:w-24 sm:h-28 cursor-pointer transform transition-transform hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-sm overflow-hidden ${denomination.color}`}
        style={{
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        {/* Perforation decorative holes */}
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-white shadow-inner"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white shadow-inner"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-white shadow-inner"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white shadow-inner"></div>
        
        <div className="text-center">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1 opacity-50">Postage</div>
          <div className="text-xl sm:text-2xl font-black text-gray-800 font-serif">{denomination.label}</div>
        </div>

        {count > 0 && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-2 -mr-2 shadow-lg">
            {count}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
          disabled={count === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
        </button>
        <span className="text-sm font-medium w-4 text-center">{count}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  );
};

export default StampItem;
