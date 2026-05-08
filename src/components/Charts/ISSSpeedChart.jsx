import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ISSSpeedChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-slate-500">Waiting for speed data...</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            tickMargin={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => `${Math.round(value)}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
            formatter={(value) => [`${value.toFixed(2)} km/h`, 'Speed']}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ r: 3, fill: '#ef4444' }}
            activeDot={{ r: 5 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
