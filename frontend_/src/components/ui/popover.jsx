import React from 'react';
export const Popover = ({ children }) => <div className='relative'>{children}</div>;
export const PopoverTrigger = ({ children }) => children;
export const PopoverContent = ({ children, className='' }) => <div className={`absolute z-30 mt-2 rounded-md border bg-white shadow p-3 ${className}`}>{children}</div>;
export default Popover;