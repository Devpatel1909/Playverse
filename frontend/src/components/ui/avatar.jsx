import React from 'react';
export const Avatar = ({ className='', children }) => <div className={`rounded-full bg-slate-200 overflow-hidden flex items-center justify-center ${className}`}>{children}</div>;
export default Avatar;