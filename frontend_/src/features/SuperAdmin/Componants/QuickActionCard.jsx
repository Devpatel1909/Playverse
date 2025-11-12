import React from 'react';

const QuickActionCard = ({ action, onClick, isSelected }) => {
  const IconComponent = action.icon;
  
  return (
    <button
      onClick={() => onClick(action.id)}
      className={`p-4 transition-all duration-300 border group rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 ${
        isSelected === action.id ? 'ring-2 ring-blue-500 bg-white/10' : ''
      }`}
    >
      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white">{action.title}</h3>
      <p className="text-xs text-slate-400">{action.description}</p>
    </button>
  );
};

export default QuickActionCard;
