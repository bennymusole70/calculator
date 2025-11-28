import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { GraphPoint } from '../types';

interface GraphViewProps {
  data: GraphPoint[];
  title?: string;
}

export const GraphView: React.FC<GraphViewProps> = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow-inner border border-slate-100 p-4 flex flex-col">
      {title && <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{title}</h3>}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              allowDataOverflow={false}
            />
            <YAxis 
              dataKey="y" 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              labelStyle={{ color: '#64748b' }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <ReferenceLine x={0} stroke="#94a3b8" />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 2, fill: '#3b82f6' }} 
              activeDot={{ r: 6 }} 
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
