import React from 'react';
export const Dialog = ({ open, children }) => open? <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>{children}</div>: null;
export const DialogContent = ({ className='', children }) => <div className={`w-full max-w-sm rounded-lg bg-white p-4 shadow ${className}`}>{children}</div>;
export const DialogHeader = ({ children, className='' }) => <div className={`mb-3 ${className}`}>{children}</div>;
export const DialogTitle = ({ children, className='' }) => <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
export const DialogDescription = ({ children, className='' }) => <p className={`text-xs text-slate-500 ${className}`}>{children}</p>;
export const DialogFooter = ({ children, className='' }) => <div className={`mt-4 flex justify-end gap-2 ${className}`}>{children}</div>;
export default Dialog;