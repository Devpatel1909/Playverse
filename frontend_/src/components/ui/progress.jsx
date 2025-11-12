import React from 'react';
export const Progress = ({ value=0, className='' }) => <div className={`h-2 w-full rounded bg-slate-200 ${className}`}><div className='h-full rounded bg-slate-900 transition-all' style={{ width: `${value}%` }} /></div>;
export default Progress;