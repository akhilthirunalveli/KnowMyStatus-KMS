import React from 'react';
import { TrendingUp } from 'lucide-react';


const AnalyticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="premium-card p-6 flex flex-col justify-between group">
          <div className="flex items-start justify-between mb-4">
            <span className={`p-2 rounded-lg bg-white/5 text-gray-400 transition-colors`}>
              {stat.icon}
            </span>
            {stat.change && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.changeType === 'positive' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                {stat.change}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-3xl font-bold font-cabinet-grotesk text-white transition-colors">{stat.value}</h3>
            <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wide">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
