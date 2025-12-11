import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-800">Consulting Our AI Experts...</h3>
        <p className="text-slate-500">Analyzing market trends in your city.</p>
        <p className="text-slate-500">Calculating startup costs.</p>
        <p className="text-slate-500">Preparing your legal roadmap.</p>
      </div>
    </div>
  );
};