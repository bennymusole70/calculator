import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Sigma, 
  FunctionSquare, 
  Trash2,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

import { BennyMascot } from './components/BennyMascot';
import { GraphView } from './components/GraphView';
import { Keypad } from './components/Keypad';
import { solveMathQuery } from './services/gemini';
import { SolveResult, HistoryItem, AppMode } from './types';

// Utility for safe UUID
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<SolveResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.GENERAL);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest result or bottom of input
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentResult, history, input]);

  const handleSolve = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    // Keep the current input visible as "processing" until done, or clear it?
    // Calculator style: usually clears or moves up. Let's move up.
    
    // Context from last 2 items
    const context = history.slice(0, 2).map(h => `Q: ${h.query} A: ${h.result.finalAnswer}`).join('; ');

    const result = await solveMathQuery(input, context);
    
    const newItem: HistoryItem = {
      id: generateId(),
      query: input,
      result,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, newItem]);
    setCurrentResult(result);
    setInput(''); // Clear input line for next calculation
    setIsProcessing(false);
  };

  const handleKeyPress = (val: string) => {
    setInput(prev => prev + val);
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const restoreHistory = (item: HistoryItem) => {
    setInput(item.query);
    setSidebarOpen(false);
  };

  const renderNavButton = (m: AppMode, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => { setMode(m); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        mode === m 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-600 hover:bg-blue-50'
      }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-80 bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300 ease-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-blue-200 shadow-lg">
               <Calculator size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none">Benny Toon</h1>
              <span className="text-xs font-medium text-slate-400">Math Engine</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-1 hover:bg-slate-50 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {renderNavButton(AppMode.GENERAL, <Calculator size={20} />, "General Calculator")}
          {renderNavButton(AppMode.SOLVER, <FunctionSquare size={20} />, "AI Solver & Word Problems")}
          {renderNavButton(AppMode.GRAPHING, <TrendingUp size={20} />, "Graphing Tools")}
          {renderNavButton(AppMode.STATISTICS, <Sigma size={20} />, "Statistics & Probability")}
          
          <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            History
          </div>
          <div className="space-y-1">
            {history.slice().reverse().slice(0, 10).map(item => (
              <button
                key={item.id}
                onClick={() => restoreHistory(item)}
                className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg truncate border border-transparent hover:border-slate-100 transition-all"
              >
                {item.query}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content: Split Screen Layout */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        
        {/* TOP HALF: Display / Tape / Screen */}
        <section className="flex-[0.45] bg-white flex flex-col relative shadow-sm z-10">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between p-4 text-slate-500 absolute top-0 left-0 right-0 z-20">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-md">{mode}</span>
            </div>
            <button 
              onClick={() => { setHistory([]); setCurrentResult(null); setInput(''); }}
              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-16 flex flex-col items-end space-y-8 scrollbar-hide">
            
            {/* Welcome Placeholder if empty */}
            {history.length === 0 && !input && (
               <div className="w-full h-full flex flex-col items-center justify-center opacity-50 pointer-events-none mt-10">
                  <BennyMascot mood="idle" />
                  <p className="text-sm text-slate-400 mt-2">Start typing...</p>
               </div>
            )}

            {/* History Items */}
            {history.map((item) => (
              <div key={item.id} className="w-full flex flex-col items-end gap-2 opacity-70 hover:opacity-100 transition-opacity">
                 <div className="text-lg text-slate-500 font-medium math-mono">{item.query}</div>
                 
                 {/* Result Card for History */}
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 max-w-[90%] text-right">
                    <div className="text-xl font-bold text-slate-800 math-mono">{item.result.finalAnswer}</div>
                    {item.result.isGraphable && <span className="text-[10px] text-blue-500 font-bold uppercase mr-1">Graph Available</span>}
                    <button 
                      onClick={() => setCurrentResult(item.result)}
                      className="text-[10px] text-slate-400 font-bold uppercase hover:text-blue-500"
                    >
                      Show Details
                    </button>
                 </div>
              </div>
            ))}

            {/* Current Active Processing State */}
            {isProcessing && (
              <div className="w-full flex flex-col items-end gap-2 animate-pulse">
                <div className="text-2xl text-slate-800 font-medium math-mono">{input}</div>
                <div className="flex items-center gap-2">
                   <span className="text-sm text-blue-500 font-medium">Benny is thinking...</span>
                   <BennyMascot mood="thinking" />
                </div>
              </div>
            )}

            {/* Current Result Detail View (If selected or just finished) */}
            {!isProcessing && currentResult && (
               <div className="w-full bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-4 animate-fade-in-up">
                  <div className="bg-blue-50 p-3 flex items-center gap-3">
                     <BennyMascot mood="happy" />
                     <p className="text-xs text-blue-800 font-medium italic">"{currentResult.bennyComment}"</p>
                  </div>
                  {currentResult.isGraphable && currentResult.graphData && (
                    <div className="h-48 w-full p-2 border-b border-slate-50">
                      <GraphView data={currentResult.graphData} />
                    </div>
                  )}
                  <div className="p-4 max-h-40 overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed">
                      {currentResult.solutionMarkdown}
                    </div>
                  </div>
               </div>
            )}
            
            {/* Spacer for scrolling */}
            <div ref={scrollRef} className="h-2"></div>
          </div>

          {/* Current Input Display Line (Always at bottom of top section) */}
          <div className="min-h-[80px] w-full bg-white border-t border-slate-100 p-4 flex items-center justify-end overflow-hidden">
             <input 
               type="text" 
               value={input}
               readOnly
               className="w-full text-right text-4xl font-light text-slate-800 math-mono bg-transparent outline-none placeholder:text-slate-200"
               placeholder="0"
             />
          </div>
        </section>

        {/* BOTTOM HALF: Keypad */}
        <section className="flex-[0.55] bg-slate-50 border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20 relative">
          <Keypad 
            onKeyPress={handleKeyPress} 
            onClear={() => setInput('')} 
            onSolve={handleSolve}
            onBackspace={handleBackspace}
          />
        </section>

      </main>

      <style>{`
        .math-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
