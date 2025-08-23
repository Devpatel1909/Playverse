import React from 'react';

const StatsCard = ({ title, value, icon: IconComponent, color = '', bgColor = '', textColor = 'text-white', description }) => {
  return (
    <div className={`p-4 transition-colors border rounded-xl ${bgColor} ${color} hover:opacity-90`}>
      <div className="flex items-center gap-2 mb-2">
        {IconComponent && <IconComponent className={`w-4 h-4 ${textColor}`} />}
        <div className={`text-sm ${textColor}`}>{title}</div>
      </div>
      <div className={`text-2xl font-semibold ${textColor.replace('400', '300')}`}>{value}</div>
      {description && (
        <div className="text-xs text-slate-400 mt-1">{description}</div>
      )}
    </div>
  );
};

export default StatsCard;
