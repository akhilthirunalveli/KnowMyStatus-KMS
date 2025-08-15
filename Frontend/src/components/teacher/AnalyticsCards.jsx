import React from 'react';
import { TrendingUp } from 'lucide-react';

const AnalyticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <span className={`text-xs sm:text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</h3>
          <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
