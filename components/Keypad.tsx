import React, { useState } from 'react';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSolve: () => void;
  onBackspace: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onClear, onSolve, onBackspace }) => {
  const [showAlt, setShowAlt] = useState(false);

  // Common styles
  const btnBase = "h-full w-full rounded-2xl text-xl font-medium transition-all duration-100 active:scale-95 flex items-center justify-center select-none shadow-[0_2px_0_#cbd5e1] active:shadow-none active:translate-y-[2px]";
  const btnNum = `${btnBase} bg-white text-slate-700 hover:bg-slate-50`;
  const btnOp = `${btnBase} bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 shadow-[0_2px_0_#bfdbfe]`;
  const btnFunc = `${btnBase} bg-slate-100 text-slate-600 text-lg hover:bg-slate-200`;
  const btnAction = `${btnBase} bg-red-100 text-red-600 hover:bg-red-200 shadow-[0_2px_0_#fecaca]`;
  const btnSolve = `${btnBase} bg-blue-600 text-white text-2xl hover:bg-blue-700 shadow-[0_2px_0_#1e40af]`;

  return (
    <div className="h-full w-full p-4 flex flex-col gap-3">
      
      {/* Function Row */}
      <div className="h-[15%] flex gap-3">
        <button onClick={() => setShowAlt(!showAlt)} className={`${btnFunc} text-sm font-bold tracking-wider uppercase text-indigo-600`}>
          {showAlt ? '123' : 'Func'}
        </button>
        {showAlt ? (
          <>
            <button onClick={() => onKeyPress('d/dx ')} className={btnFunc}>d/dx</button>
            <button onClick={() => onKeyPress('∫ ')} className={btnFunc}>∫</button>
            <button onClick={() => onKeyPress('sum(')} className={btnFunc}>∑</button>
            <button onClick={() => onKeyPress('lim ')} className={btnFunc}>lim</button>
          </>
        ) : (
          <>
            <button onClick={() => onKeyPress('sin(')} className={btnFunc}>sin</button>
            <button onClick={() => onKeyPress('cos(')} className={btnFunc}>cos</button>
            <button onClick={() => onKeyPress('tan(')} className={btnFunc}>tan</button>
            <button onClick={() => onKeyPress('sqrt(')} className={btnFunc}>√</button>
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button onClick={onClear} className={btnAction}>AC</button>
        <button onClick={() => onKeyPress('(')} className={btnOp}>(</button>
        <button onClick={() => onKeyPress(')')} className={btnOp}>)</button>
        <button onClick={() => onKeyPress('/')} className={btnOp}>÷</button>

        {/* Row 2 */}
        <button onClick={() => onKeyPress('7')} className={btnNum}>7</button>
        <button onClick={() => onKeyPress('8')} className={btnNum}>8</button>
        <button onClick={() => onKeyPress('9')} className={btnNum}>9</button>
        <button onClick={() => onKeyPress('*')} className={btnOp}>×</button>

        {/* Row 3 */}
        <button onClick={() => onKeyPress('4')} className={btnNum}>4</button>
        <button onClick={() => onKeyPress('5')} className={btnNum}>5</button>
        <button onClick={() => onKeyPress('6')} className={btnNum}>6</button>
        <button onClick={() => onKeyPress('-')} className={btnOp}>-</button>

        {/* Row 4 */}
        <button onClick={() => onKeyPress('1')} className={btnNum}>1</button>
        <button onClick={() => onKeyPress('2')} className={btnNum}>2</button>
        <button onClick={() => onKeyPress('3')} className={btnNum}>3</button>
        <button onClick={() => onKeyPress('+')} className={btnOp}>+</button>

        {/* Row 5 */}
        <button onClick={() => onKeyPress('0')} className={btnNum}>0</button>
        <button onClick={() => onKeyPress('.')} className={btnNum}>.</button>
        <button onClick={onBackspace} className={btnFunc}>
           <Delete size={24} />
        </button>
        <button onClick={onSolve} className={btnSolve}>=</button>
      </div>

      {/* Variables Row (Small) */}
      <div className="h-[10%] flex gap-3 overflow-x-auto no-scrollbar">
         {['x', 'y', '^', 'pi', 'e', '!', 'log', 'ln', 'abs'].map(v => (
           <button 
            key={v} 
            onClick={() => onKeyPress(v === 'pi' ? 'pi' : v === '^' ? '^' : v)} 
            className="h-full min-w-[3.5rem] rounded-xl bg-white border border-slate-200 text-slate-500 font-bold active:bg-slate-100"
          >
             {v}
           </button>
         ))}
      </div>
    </div>
  );
};
