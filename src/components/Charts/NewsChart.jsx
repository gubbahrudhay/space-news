import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function NewsChart({ articles }) {
  const data = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    
    const categoryCounts = articles.reduce((acc, article) => {
      const cat = article.category || 'unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(categoryCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: categoryCounts[key]
    }));
  }, [articles]);

  if (data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-slate-500">No data to display</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
