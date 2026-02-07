
import React, { useState, useMemo, useEffect } from 'react';
import { DENOMINATIONS } from './constants';
import { SelectedStamp, PostageSuggestion } from './types';
import { geminiService } from './services/geminiService';
import StampItem from './components/StampItem';

const App: React.FC = () => {
  const [selectedStamps, setSelectedStamps] = useState<Record<string, number>>({});
  const [targetPostage, setTargetPostage] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<PostageSuggestion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalValue = useMemo(() => {
    return Object.entries(selectedStamps).reduce((sum, [id, count]) => {
      const denom = DENOMINATIONS.find(d => d.id === id);
      return sum + (denom ? denom.value * count : 0);
    }, 0);
  }, [selectedStamps]);

  const handleAddStamp = (id: string) => {
    setSelectedStamps(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemoveStamp = (id: string) => {
    setSelectedStamps(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const clearStamps = () => {
    setSelectedStamps({});
    setTargetPostage('');
    setAiSuggestion(null);
  };

  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const result = await geminiService.getPostageSuggestion(searchQuery);
      if (result) {
        setAiSuggestion(result);
        setTargetPostage(result.price.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const remaining = useMemo(() => {
    const target = parseFloat(targetPostage) || 0;
    return Math.max(0, target - totalValue);
  }, [targetPostage, totalValue]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">郵票計數機 <span className="text-blue-600 font-medium text-sm hidden sm:inline ml-1">Smart Stamp Calc</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Total Value</div>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                ${totalValue.toFixed(1)}
              </div>
            </div>
            <button 
              onClick={clearStamps}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              title="Reset All"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Search & Suggestion Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3"/><circle cx="10" cy="10" r="7"/><path d="M10 7v6"/><path d="M7 10h6"/></svg>
              AI 郵費助理 (Postage Assistant)
            </h2>
            <form onSubmit={askAI} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="例如: 寄 50g 本地信件, 或者寄往英國..."
                  className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={aiLoading}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {aiLoading ? '正在查詢...' : '查詢'}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                提示: AI 會根據最新的香港郵政費率（或全球通用費率）為您提供建議。
              </p>
            </form>

            {aiSuggestion && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900">{aiSuggestion.category}</h3>
                    <p className="text-sm text-blue-700 mt-1">{aiSuggestion.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">${aiSuggestion.price.toFixed(1)}</div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase">{aiSuggestion.weight}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {aiSuggestion.tips.map((tip, idx) => (
                    <span key={idx} className="bg-white/50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-medium border border-blue-200">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              目標郵費 (Target)
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">請輸入目標金額 (HKD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    step="0.1"
                    value={targetPostage}
                    onChange={(e) => setTargetPostage(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {parseFloat(targetPostage) > 0 && (
                <div className={`p-4 rounded-xl border transition-all ${remaining === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      {remaining === 0 ? '郵費已達成！' : '尚欠郵費'}
                    </span>
                    <span className={`text-xl font-black ${remaining === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      ${remaining.toFixed(1)}
                    </span>
                  </div>
                  {remaining > 0 && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (totalValue / parseFloat(targetPostage)) * 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stamps Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">常用面額 (Denominations)</h2>
            <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              點擊郵票添加
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
            {DENOMINATIONS.map((denom) => (
              <StampItem 
                key={denom.id}
                denomination={denom}
                count={selectedStamps[denom.id] || 0}
                onAdd={() => handleAddStamp(denom.id)}
                onRemove={() => handleRemoveStamp(denom.id)}
              />
            ))}
          </div>
        </section>

        {/* Selected List Summary */}
        {totalValue > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-700">清單 (Inventory)</h2>
              <span className="text-xs font-bold text-slate-400 uppercase">{Object.keys(selectedStamps).length} 項面額</span>
            </div>
            <div className="divide-y">
              {Object.entries(selectedStamps).map(([id, count]) => {
                const denom = DENOMINATIONS.find(d => d.id === id);
                if (!denom) return null;
                return (
                  <div key={id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded flex items-center justify-center text-xs font-bold ${denom.color} border border-slate-200 shadow-sm`}>
                        {denom.label}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">${denom.value.toFixed(1)}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Per Stamp</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">x{count}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Qty</div>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <div className="text-sm font-black text-blue-600">${(denom.value * count).toFixed(1)}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Subtotal</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto py-8 text-center bg-white border-t">
        <p className="text-slate-400 text-sm">© 2024 Smart Stamp Calculator. Made for Philatelists.</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <a href="#" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">Hong Kong Post Rates</a>
          <a href="#" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">Privacy</a>
          <a href="#" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">Help</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
