import React from 'react';
export const ScrollArea = ({ className='', children }) => <div className={`overflow-y-auto ${className}`}>{children}</div>;
export default ScrollArea;