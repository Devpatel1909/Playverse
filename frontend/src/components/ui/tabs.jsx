import React from 'react';
export const Tabs = ({ children, className='' }) => <div className={className}>{children}</div>;
export const TabsList = ({ children, className='' }) => <div className={`flex gap-2 ${className}`}>{children}</div>;
export const TabsTrigger = ({ children, className='' }) => <button className={`px-3 py-1 rounded-md text-sm bg-slate-100 ${className}`}>{children}</button>;
export const TabsContent = ({ children, className='' }) => <div className={className}>{children}</div>;
export default Tabs;