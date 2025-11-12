import React from 'react';
export const Select = ({ children }) => <div data-select>{children}</div>;
export const SelectTrigger = ({ children, className='' }) => <div className={`border rounded-md px-3 py-2 text-sm bg-white ${className}`}>{children}</div>;
export const SelectValue = ({ placeholder }) => <span className='text-slate-500'>{placeholder}</span>;
export const SelectContent = ({ children, className='' }) => <div className={`mt-2 rounded-md border bg-white shadow p-2 grid gap-1 ${className}`}>{children}</div>;
export const SelectItem = ({ children, value, className='' }) => <div className={`px-2 py-1 rounded cursor-pointer hover:bg-slate-100 ${className}`} data-value={value}>{children}</div>;
export default Select;